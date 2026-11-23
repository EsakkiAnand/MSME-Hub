/**
 * State Machine Engine Core Types
 * Designed to elevate UX, DX, and AX across all MSME-Hub workflows.
 */

import { UserRole } from "@prisma/client";

export type StatusCategory = "IN_PROGRESS_LIVE" | "COMPLETED" | "REJECTED";

export interface StateBadgeStyle {
  label: string;
  badgeClass: string;
  dotClass?: string;
  iconName?: string;
}

export interface TransitionGuardContext {
  userId?: string;
  userRole?: UserRole | string;
  isLead?: boolean;
  isVerified?: boolean;
  activeProjectsCount?: number;
  hasGithubUrl?: boolean;
  hasMitLicense?: boolean;
  hasReadme?: boolean;
  ratingStars?: number;
  feedbackText?: string;
  [key: string]: any;
}

export type TransitionGuard<TContext = TransitionGuardContext> = (
  context: TContext
) => { allowed: boolean; reason?: string };

export interface TransitionConfig<
  TState extends string = string,
  TRole extends string = UserRole | string,
  TContext = TransitionGuardContext
> {
  targetState: TState;
  event: string;
  label: string;
  actionDescription: string;
  allowedRoles: TRole[];
  guard?: TransitionGuard<TContext>;
  guardFailureReason?: string;
  isDestructive?: boolean;
  requiresReason?: boolean;
  reasonPrompt?: string;
}

export interface StateConfig<
  TState extends string = string,
  TRole extends string = UserRole | string,
  TContext = TransitionGuardContext
> {
  id: TState;
  label: string;
  category: StatusCategory;
  categoryLabel: string;
  description: string;
  badge: StateBadgeStyle;
  stepNumber: number;
  isInitial?: boolean;
  isTerminal?: boolean;
  transitions: TransitionConfig<TState, TRole, TContext>[];
}

export interface StateMachineDefinition<
  TState extends string = string,
  TRole extends string = UserRole | string,
  TContext = TransitionGuardContext
> {
  id: string;
  name: string;
  description: string;
  entityName: string;
  initialState: TState;
  terminalStates: TState[];
  orderedSteps: TState[];
  states: Record<TState, StateConfig<TState, TRole, TContext>>;
}

export interface TransitionEvaluationResult<TState extends string = string> {
  allowed: boolean;
  currentState: TState;
  targetState: TState;
  error?: string;
  code?:
    | "VALID"
    | "INVALID_TARGET_STATE"
    | "ROLE_UNAUTHORIZED"
    | "GUARD_FAILED"
    | "TERMINAL_STATE_LOCKED";
  allowedNextStates: TState[];
  remediation?: string;
}

export interface AvailableAction<TState extends string = string> {
  targetState: TState;
  event: string;
  label: string;
  actionDescription: string;
  isAllowed: boolean;
  disabledReason?: string;
  isDestructive: boolean;
  requiresReason: boolean;
  reasonPrompt?: string;
}

/**
 * Agent-facing introspection descriptor (AX)
 * Enables autonomous agents to understand current entity capabilities,
 * required parameters, and legal actions without guesswork.
 */
export interface AgentMachineDescriptor<TState extends string = string> {
  machineId: string;
  machineName: string;
  entityName: string;
  currentState: TState;
  stateLabel: string;
  stateDescription: string;
  category: StatusCategory;
  isTerminal: boolean;
  progressStep: {
    current: number;
    total: number;
    percentage: number;
  };
  allowedNextActions: {
    targetState: TState;
    event: string;
    label: string;
    description: string;
    requiredRole: string[];
    canExecuteNow: boolean;
    blockerReason?: string;
  }[];
}

export class StateTransitionError extends Error {
  public readonly code: string;
  public readonly currentState: string;
  public readonly targetState: string;
  public readonly allowedNextStates: string[];
  public readonly remediation?: string;

  constructor(evaluation: TransitionEvaluationResult) {
    super(
      evaluation.error ||
        `Illegal state transition from "${evaluation.currentState}" to "${evaluation.targetState}".`
    );
    this.name = "StateTransitionError";
    this.code = evaluation.code || "INVALID_STATE_TRANSITION";
    this.currentState = evaluation.currentState;
    this.targetState = evaluation.targetState;
    this.allowedNextStates = evaluation.allowedNextStates;
    this.remediation = evaluation.remediation;
  }

  public toJSON() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      currentState: this.currentState,
      attemptedState: this.targetState,
      allowedNextStates: this.allowedNextStates,
      remediation: this.remediation,
    };
  }
}
