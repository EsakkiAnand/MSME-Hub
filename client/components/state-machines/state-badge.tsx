"use client";

import React from "react";
import { StateMachineDefinition } from "@/lib/state-machines/types";
import { getStateMachine } from "@/lib/state-machines/registry";
import { CheckCircle2, XCircle } from "lucide-react";

export interface StateBadgeProps<TState extends string = string> {
  machine?: StateMachineDefinition<TState, any, any>;
  machineId?: string;
  state: TState;
  showCategory?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StateBadge<TState extends string = string>({
  machine,
  machineId,
  state,
  showCategory = true,
  size = "sm",
  className = "",
}: StateBadgeProps<TState>) {
  const resolvedMachine = machine || (machineId ? getStateMachine(machineId) : null);
  const stateConfig = resolvedMachine?.states[state];

  if (!stateConfig) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700">
        {state}
      </span>
    );
  }

  const category = stateConfig.category;
  const isRejected = category === "REJECTED";
  const isCompleted = category === "COMPLETED";

  const categoryPillClass =
    category === "IN_PROGRESS_LIVE"
      ? "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50"
      : category === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50";

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* Category Pill */}
      {showCategory && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${categoryPillClass} ${
            size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
          ) : isRejected ? (
            <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
          ) : (
            <span className="size-2 rounded-full bg-[#007AFF] animate-pulse" />
          )}
          <span>{stateConfig.categoryLabel}</span>
        </span>
      )}

      {/* Lifecycle Sub-status Badge */}
      <span
        className={`inline-flex items-center gap-1 rounded-md font-medium border ${stateConfig.badge.badgeClass} ${
          size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
        }`}
      >
        <span>{stateConfig.label}</span>
      </span>
    </div>
  );
}
