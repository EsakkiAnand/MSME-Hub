"use client";

import React from "react";
import { StateMachineDefinition } from "@/lib/state-machines/types";
import { getStateMachine } from "@/lib/state-machines/registry";
import { StateBadge } from "./state-badge";
import { Info, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export interface StateExplanationCardProps<TState extends string = string> {
  machine?: StateMachineDefinition<TState, any, any>;
  machineId?: string;
  currentState: TState;
  additionalNotes?: string | null;
  adminNotes?: string | null;
  className?: string;
}

export function StateExplanationCard<TState extends string = string>({
  machine,
  machineId,
  currentState,
  additionalNotes,
  adminNotes,
  className = "",
}: StateExplanationCardProps<TState>) {
  const resolvedMachine = machine || (machineId ? getStateMachine(machineId) : null);
  if (!resolvedMachine) return null;

  const stateConfig = resolvedMachine.states[currentState];
  if (!stateConfig) return null;

  const notes = adminNotes || additionalNotes;
  const isRejected = stateConfig.category === "REJECTED";
  const isCompleted = stateConfig.category === "COMPLETED";

  return (
    <div
      className={`rounded-[16px] border p-5 transition-all ${
        isRejected
          ? "bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40"
          : isCompleted
          ? "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40"
          : "bg-blue-50/40 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 pb-2 border-b border-black/[0.04] dark:border-white/[0.05]">
        <div className="flex items-center gap-2">
          {isRejected ? (
            <XCircle className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : isCompleted ? (
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Info className="size-4 text-[#007AFF] shrink-0" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Current Lifecycle Stage: {stateConfig.label}
          </span>
        </div>

        <StateBadge machine={resolvedMachine} state={currentState} size="sm" />
      </div>

      <p className="text-xs text-foreground/90 leading-relaxed mt-1">
        {stateConfig.description}
      </p>

      {notes && (
        <div className="mt-3 p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] text-xs">
          <p className="font-semibold text-foreground text-[11px] mb-0.5">
            Official Review Remarks / Reason:
          </p>
          <p className="text-muted-foreground leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  );
}
