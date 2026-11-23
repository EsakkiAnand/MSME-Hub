/**
 * State Machine Engine Core Evaluation & Enforcement
 */

import {
  StateMachineDefinition,
  TransitionEvaluationResult,
  AvailableAction,
  AgentMachineDescriptor,
  StateTransitionError,
  TransitionGuardContext,
} from "./types";
import { UserRole } from "@prisma/client";

/**
 * Pure evaluator for a state transition request.
 * Checks whether the transition is topologically valid, role-authorized,
 * and passes any defined dynamic guards.
 */
export function evaluateTransition<
  TState extends string,
  TRole extends string = UserRole | string,
  TContext extends TransitionGuardContext = TransitionGuardContext
>(
  machine: StateMachineDefinition<TState, TRole, TContext>,
  currentState: TState,
  targetState: TState,
  role?: TRole,
  context: TContext = {} as TContext
): TransitionEvaluationResult<TState> {
  const stateConfig = machine.states[currentState];

  // 1. Validate existence of current state
  if (!stateConfig) {
    return {
      allowed: false,
      currentState,
      targetState,
      code: "INVALID_TARGET_STATE",
      error: `Unknown current state: "${currentState}" in ${machine.name}.`,
      allowedNextStates: [],
      remediation: `Verify entity lifecycle status against valid states: ${Object.keys(
        machine.states
      ).join(", ")}.`,
    };
  }

  const allowedNextStates = stateConfig.transitions.map((t) => t.targetState);

  // 2. Check if current state is terminal
  if (stateConfig.isTerminal || machine.terminalStates.includes(currentState)) {
    return {
      allowed: false,
      currentState,
      targetState,
      code: "TERMINAL_STATE_LOCKED",
      error: `Entity is in a terminal state ("${stateConfig.label}") and cannot transition further.`,
      allowedNextStates: [],
      remediation: `Entities in terminal state (${stateConfig.label}) are immutable. Create a new entity if workflow re-scoping is necessary.`,
    };
  }

  // 3. Check if target transition exists in current state's transitions
  const transition = stateConfig.transitions.find((t) => t.targetState === targetState);

  if (!transition) {
    return {
      allowed: false,
      currentState,
      targetState,
      code: "INVALID_TARGET_STATE",
      error: `Cannot transition ${machine.entityName} from "${stateConfig.label}" to "${
        machine.states[targetState]?.label || targetState
      }".`,
      allowedNextStates,
      remediation: `Legal next states from "${stateConfig.label}" are: ${
        allowedNextStates.map((s) => machine.states[s]?.label || s).join(", ") || "None (Terminal)"
      }.`,
    };
  }

  // 4. Role Authorization check
  if (role) {
    const isRoleAuthorized =
      transition.allowedRoles.includes(role) ||
      (role === UserRole.MSME_ADMIN && transition.allowedRoles.length > 0); // MSME_ADMIN has governance override where permitted

    if (!isRoleAuthorized) {
      return {
        allowed: false,
        currentState,
        targetState,
        code: "ROLE_UNAUTHORIZED",
        error: `Role "${role}" is not authorized to execute transition "${transition.label}".`,
        allowedNextStates,
        remediation: `Required persona role: ${transition.allowedRoles.join(" or ")}.`,
      };
    }
  }

  // 5. Dynamic Guard check
  if (transition.guard) {
    const guardContext = {
      ...context,
      userRole: role || context.userRole,
    };
    const guardResult = transition.guard(guardContext);
    if (!guardResult.allowed) {
      return {
        allowed: false,
        currentState,
        targetState,
        code: "GUARD_FAILED",
        error:
          guardResult.reason ||
          transition.guardFailureReason ||
          `Precondition failed for transition "${transition.label}".`,
        allowedNextStates,
        remediation:
          guardResult.reason ||
          transition.guardFailureReason ||
          "Ensure all prerequisite deliverables and criteria are met before progressing.",
      };
    }
  }

  return {
    allowed: true,
    currentState,
    targetState,
    code: "VALID",
    allowedNextStates,
  };
}

/**
 * Boolean helper to quickly test if a transition is legal.
 */
export function canTransition<
  TState extends string,
  TRole extends string = UserRole | string,
  TContext extends TransitionGuardContext = TransitionGuardContext
>(
  machine: StateMachineDefinition<TState, TRole, TContext>,
  currentState: TState,
  targetState: TState,
  role?: TRole,
  context?: TContext
): boolean {
  return evaluateTransition(machine, currentState, targetState, role, context).allowed;
}

/**
 * Server Action / API assertion guard.
 * Throws StateTransitionError if the requested transition is illegal.
 */
export function assertTransition<
  TState extends string,
  TRole extends string = UserRole | string,
  TContext extends TransitionGuardContext = TransitionGuardContext
>(
  machine: StateMachineDefinition<TState, TRole, TContext>,
  currentState: TState,
  targetState: TState,
  role?: TRole,
  context?: TContext
): void {
  const result = evaluateTransition(machine, currentState, targetState, role, context);
  if (!result.allowed) {
    throw new StateTransitionError(result);
  }
}

/**
 * Returns all actions available to a user from the current state.
 * Marks whether each action is allowed or disabled with an actionable reason.
 */
export function getAvailableActions<
  TState extends string,
  TRole extends string = UserRole | string,
  TContext extends TransitionGuardContext = TransitionGuardContext
>(
  machine: StateMachineDefinition<TState, TRole, TContext>,
  currentState: TState,
  role?: TRole,
  context: TContext = {} as TContext
): AvailableAction<TState>[] {
  const stateConfig = machine.states[currentState];
  if (!stateConfig || stateConfig.isTerminal) return [];

  return stateConfig.transitions.map((transition) => {
    const evalResult = evaluateTransition(
      machine,
      currentState,
      transition.targetState,
      role,
      context
    );

    return {
      targetState: transition.targetState,
      event: transition.event,
      label: transition.label,
      actionDescription: transition.actionDescription,
      isAllowed: evalResult.allowed,
      disabledReason: evalResult.error,
      isDestructive: Boolean(transition.isDestructive),
      requiresReason: Boolean(transition.requiresReason),
      reasonPrompt: transition.reasonPrompt,
    };
  });
}

/**
 * Calculates current progress step for linear lifecycle steppers.
 */
export function getLifecycleProgress<TState extends string>(
  machine: StateMachineDefinition<TState, any, any>,
  currentState: TState
): { currentStep: number; totalSteps: number; percentage: number; isCompleted: boolean } {
  const totalSteps = machine.orderedSteps.length;
  const currentIndex = machine.orderedSteps.indexOf(currentState);

  const currentStep = currentIndex === -1 ? 1 : currentIndex + 1;
  const isCompleted = machine.terminalStates.includes(currentState);
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return {
    currentStep,
    totalSteps,
    percentage,
    isCompleted,
  };
}

/**
 * Generates an agent-introspectable JSON descriptor (AX).
 */
export function generateAgentDescriptor<
  TState extends string,
  TRole extends string = UserRole | string,
  TContext extends TransitionGuardContext = TransitionGuardContext
>(
  machine: StateMachineDefinition<TState, TRole, TContext>,
  currentState: TState,
  role?: TRole,
  context: TContext = {} as TContext
): AgentMachineDescriptor<TState> {
  const stateConfig = machine.states[currentState];
  const progress = getLifecycleProgress(machine, currentState);

  const actions = (stateConfig?.transitions || []).map((t) => {
    const evalResult = evaluateTransition(machine, currentState, t.targetState, role, context);
    return {
      targetState: t.targetState,
      event: t.event,
      label: t.label,
      description: t.actionDescription,
      requiredRole: t.allowedRoles as string[],
      canExecuteNow: evalResult.allowed,
      blockerReason: evalResult.error,
    };
  });

  return {
    machineId: machine.id,
    machineName: machine.name,
    entityName: machine.entityName,
    currentState,
    stateLabel: stateConfig?.label || currentState,
    stateDescription: stateConfig?.description || "",
    category: stateConfig?.category || "IN_PROGRESS_LIVE",
    isTerminal: Boolean(stateConfig?.isTerminal),
    progressStep: {
      current: progress.currentStep,
      total: progress.totalSteps,
      percentage: progress.percentage,
    },
    allowedNextActions: actions,
  };
}
