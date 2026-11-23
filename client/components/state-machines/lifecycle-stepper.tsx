"use client";

import React from "react";
import { StateMachineDefinition } from "@/lib/state-machines/types";
import { getStateMachine } from "@/lib/state-machines/registry";
import { Check, Clock, AlertCircle, XCircle } from "lucide-react";

export interface LifecycleStepperProps<TState extends string = string> {
  machine?: StateMachineDefinition<TState, any, any>;
  machineId?: string;
  currentState: TState;
  className?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function LifecycleStepper<TState extends string = string>({
  machine,
  machineId,
  currentState,
  className = "",
  orientation = "horizontal",
  size = "md",
}: LifecycleStepperProps<TState>) {
  const resolvedMachine = machine || (machineId ? getStateMachine(machineId) : null);
  if (!resolvedMachine) return null;

  const steps = resolvedMachine.orderedSteps;
  const currentIndex = steps.indexOf(currentState);
  const isRejected =
    currentState.includes("REJECTED") ||
    currentState.includes("DECLINED") ||
    currentState.includes("SUPPRESSED");
  const stateConfig = resolvedMachine.states[currentState];

  if (orientation === "vertical") {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((stepKey, idx) => {
          const stepConfig = resolvedMachine.states[stepKey];
          const isPassed = currentIndex !== -1 && idx < currentIndex;
          const isCurrent = stepKey === currentState;
          const isUpcoming = currentIndex === -1 || idx > currentIndex;

          return (
            <div key={stepKey} className="flex items-start gap-3 relative">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-3.5 top-7 bottom-0 w-[2px] -mb-4 ${
                    isPassed ? "bg-emerald-500" : "bg-slate-200 dark:bg-zinc-800"
                  }`}
                />
              )}

              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-all ${
                  isCurrent
                    ? isRejected
                      ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                      : "border-[#007AFF] bg-blue-50 text-[#007AFF] shadow-sm shadow-blue-500/20"
                    : isPassed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-muted-foreground"
                }`}
              >
                {isPassed ? (
                  <Check className="size-3.5" />
                ) : isCurrent && isRejected ? (
                  <XCircle className="size-3.5" />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-[#007AFF] animate-ping" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-foreground font-bold"
                      : isPassed
                      ? "text-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepConfig?.label || stepKey}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {stepConfig?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Stepper
  return (
    <div className={`w-full overflow-x-auto scrollbar-none py-2 ${className}`}>
      <div className="flex items-center min-w-[500px] justify-between relative">
        {/* Connector line behind steps */}
        <div className="absolute left-6 right-6 top-3.5 h-[2px] bg-slate-200 dark:bg-zinc-800 -z-0" />

        {steps.map((stepKey, idx) => {
          const stepConfig = resolvedMachine.states[stepKey];
          const isPassed = currentIndex !== -1 && idx < currentIndex;
          const isCurrent = stepKey === currentState;
          const isUpcoming = currentIndex === -1 || idx > currentIndex;

          return (
            <div
              key={stepKey}
              className="flex flex-col items-center text-center relative z-10 px-2 flex-1"
            >
              {/* Step Circle Node */}
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 ${
                  isCurrent
                    ? isRejected
                      ? "border-rose-500 bg-rose-50 text-rose-700 ring-4 ring-rose-500/10"
                      : "border-[#007AFF] bg-white dark:bg-[#1C1C1E] text-[#007AFF] ring-4 ring-blue-500/15"
                    : isPassed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-muted-foreground"
                }`}
              >
                {isPassed ? (
                  <Check className="size-3.5" />
                ) : isCurrent && isRejected ? (
                  <XCircle className="size-3.5" />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-[#007AFF] animate-pulse" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-[11px] mt-1.5 font-medium max-w-[100px] leading-tight truncate ${
                  isCurrent
                    ? "text-foreground font-bold"
                    : isPassed
                    ? "text-foreground/80 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {stepConfig?.label || stepKey}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
