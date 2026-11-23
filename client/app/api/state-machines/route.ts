import { NextRequest, NextResponse } from "next/server";
import {
  listAllStateMachines,
  getStateMachine,
  introspectForAgent,
  evaluateTransition,
} from "@/lib/state-machines";

/**
 * GET /api/state-machines
 *
 * Query Params:
 * - (none) or ?list=true: Returns list of all registered state machines with metadata.
 * - ?machine=<id>&state=<state>&role=<role>: Returns full AgentMachineDescriptor (AX).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const machineId = searchParams.get("machine");
    const state = searchParams.get("state");
    const role = searchParams.get("role") || undefined;

    if (!machineId) {
      const machines = listAllStateMachines();
      return NextResponse.json({
        success: true,
        count: machines.length,
        machines,
      });
    }

    const machine = getStateMachine(machineId);

    if (!state) {
      return NextResponse.json({
        success: true,
        machine: {
          id: machine.id,
          name: machine.name,
          description: machine.description,
          entityName: machine.entityName,
          initialState: machine.initialState,
          terminalStates: machine.terminalStates,
          orderedSteps: machine.orderedSteps,
          states: machine.states,
        },
      });
    }

    // Introspect current state for agent or UI
    const descriptor = introspectForAgent(machineId, state, role as any);

    return NextResponse.json({
      success: true,
      descriptor,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 400 }
    );
  }
}

/**
 * POST /api/state-machines
 *
 * Validates a proposed state transition without mutating database state.
 * Body: { machineId: string, currentState: string, targetState: string, role?: string, context?: any }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { machineId, currentState, targetState, role, context } = body;

    if (!machineId || !currentState || !targetState) {
      return NextResponse.json(
        {
          success: false,
          error: "machineId, currentState, and targetState are required fields.",
        },
        { status: 400 }
      );
    }

    const machine = getStateMachine(machineId);
    const result = evaluateTransition(
      machine,
      currentState,
      targetState,
      role,
      context || {}
    );

    return NextResponse.json({
      success: true,
      allowed: result.allowed,
      error: result.error,
      targetState,
      currentState,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 400 }
    );
  }
}
