/**
 * Central State Machine Registry & Agent Introspection API (AX)
 * Provides runtime queryability, introspection, and deterministic verification.
 */

import { StateMachineDefinition, AgentMachineDescriptor, TransitionGuardContext } from "./types";
import { generateAgentDescriptor, evaluateTransition } from "./core";
import { projectStateMachine } from "./machines/project-machine";
import { ideaStateMachine } from "./machines/idea-machine";
import { problemStateMachine } from "./machines/problem-machine";
import { guidanceStateMachine } from "./machines/guidance-machine";
import { extensionStateMachine } from "./machines/extension-machine";
import { ratingModerationStateMachine } from "./machines/rating-machine";
import {
  industryVerificationStateMachine,
  studentTrackStateMachine,
} from "./machines/verification-machine";
import { UserRole } from "@prisma/client";

export const STATE_MACHINE_REGISTRY: Record<string, StateMachineDefinition<any, any, any>> = {
  project: projectStateMachine,
  "project-lifecycle": projectStateMachine,

  idea: ideaStateMachine,
  "student-idea-lifecycle": ideaStateMachine,

  problem: problemStateMachine,
  "industry-problem-lifecycle": problemStateMachine,

  guidance: guidanceStateMachine,
  "alumni-guidance-lifecycle": guidanceStateMachine,

  extension: extensionStateMachine,
  "deadline-extension-lifecycle": extensionStateMachine,

  rating: ratingModerationStateMachine,
  "industry-rating-moderation": ratingModerationStateMachine,

  "industry-verification": industryVerificationStateMachine,
  "industry-verification-lifecycle": industryVerificationStateMachine,

  "student-track": studentTrackStateMachine,
  "student-track-lifecycle": studentTrackStateMachine,
};

/**
 * Retrieve a state machine definition by ID or alias.
 */
export function getStateMachine(machineId: string): StateMachineDefinition<any, any, any> {
  const machine = STATE_MACHINE_REGISTRY[machineId.toLowerCase()];
  if (!machine) {
    throw new Error(
      `Unknown state machine "${machineId}". Available machines: ${Object.keys(
        STATE_MACHINE_REGISTRY
      ).join(", ")}.`
    );
  }
  return machine;
}

/**
 * List metadata for all registered state machines.
 */
export function listAllStateMachines(): {
  id: string;
  name: string;
  description: string;
  entityName: string;
  initialState: string;
  terminalStates: string[];
  totalStates: number;
}[] {
  const seen = new Set<string>();
  const list: any[] = [];

  for (const machine of Object.values(STATE_MACHINE_REGISTRY)) {
    if (seen.has(machine.id)) continue;
    seen.add(machine.id);

    list.push({
      id: machine.id,
      name: machine.name,
      description: machine.description,
      entityName: machine.entityName,
      initialState: machine.initialState,
      terminalStates: machine.terminalStates,
      totalStates: Object.keys(machine.states).length,
    });
  }

  return list;
}

/**
 * Introspect state machine capabilities for an autonomous agent (AX).
 * Returns exact JSON descriptor of the entity's current position, category,
 * and which actions are legal right now.
 */
export function introspectForAgent(
  machineId: string,
  currentState: string,
  role?: UserRole | string,
  context: TransitionGuardContext = {}
): AgentMachineDescriptor {
  const machine = getStateMachine(machineId);
  return generateAgentDescriptor(machine, currentState, role, context);
}

/**
 * Validates an agent tool call attempting a state change before executing database mutations.
 */
export function validateAgentTransition(
  machineId: string,
  currentState: string,
  targetState: string,
  role?: UserRole | string,
  context: TransitionGuardContext = {}
) {
  const machine = getStateMachine(machineId);
  return evaluateTransition(machine, currentState, targetState, role, context);
}
