"use client";

import React, { useState } from "react";
import {
  StateMachineDefinition,
  TransitionGuardContext,
  AvailableAction,
} from "@/lib/state-machines/types";
import { getAvailableActions } from "@/lib/state-machines/core";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, RotateCcw, AlertTriangle, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

interface StateActionConsoleProps<TState extends string = string> {
  machine: StateMachineDefinition<TState, any, any>;
  currentState: TState;
  userRole?: UserRole | string;
  context?: TransitionGuardContext;
  onExecuteTransition: (targetState: TState, reason?: string) => Promise<void> | void;
  isProcessing?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function StateActionConsole<TState extends string = string>({
  machine,
  currentState,
  userRole,
  context = {},
  onExecuteTransition,
  isProcessing = false,
  className = "",
  title = "Governance & Lifecycle Decision Console",
  description,
}: StateActionConsoleProps<TState>) {
  const actions = getAvailableActions(machine, currentState, userRole, context);

  // Modal state for actions requiring structured reasoning
  const [activeAction, setActiveAction] = useState<AvailableAction<TState> | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [errorText, setErrorText] = useState("");

  if (actions.length === 0) {
    return null;
  }

  const handleActionClick = (action: AvailableAction<TState>) => {
    if (!action.isAllowed) return;

    if (action.requiresReason || action.isDestructive) {
      setActiveAction(action);
      setReasonInput("");
      setErrorText("");
    } else {
      onExecuteTransition(action.targetState);
    }
  };

  const handleConfirmModal = async () => {
    if (!activeAction) return;

    if (activeAction.requiresReason && !reasonInput.trim()) {
      setErrorText("Written explanation is mandatory for this lifecycle decision.");
      return;
    }

    const target = activeAction.targetState;
    const note = reasonInput.trim();
    setActiveAction(null);
    await onExecuteTransition(target, note);
  };

  return (
    <div
      className={`rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#007AFF]" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {title}
            </h4>
            {description && (
              <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-black/[0.02] dark:bg-white/[0.04] px-2 py-0.5 rounded border border-black/[0.04]">
          Machine: {machine.name}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {actions.map((act) => {
          const isDestructive = act.isDestructive;

          return (
            <div key={act.targetState} className="relative group">
              <Button
                type="button"
                size="sm"
                onClick={() => handleActionClick(act)}
                disabled={!act.isAllowed || isProcessing}
                variant={isDestructive ? "destructive" : "default"}
                className={`text-xs h-8 px-3.5 inline-flex items-center gap-1.5 font-semibold transition-all ${
                  act.isAllowed
                    ? isDestructive
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                    : "opacity-45 cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
                title={act.disabledReason}
              >
                {isProcessing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : isDestructive ? (
                  <X className="size-3.5" />
                ) : (
                  <ArrowRight className="size-3.5" />
                )}
                <span>{act.label}</span>
              </Button>

              {/* Explanatory Blocker Tooltip (UX elevation) */}
              {!act.isAllowed && act.disabledReason && (
                <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-2 rounded-lg bg-zinc-900 text-white text-[11px] leading-tight z-50 shadow-lg pointer-events-none">
                  <p className="font-semibold text-rose-300 flex items-center gap-1 mb-0.5">
                    <AlertTriangle className="size-3" /> Action Locked
                  </p>
                  <p>{act.disabledReason}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation & Structured Reason Modal */}
      <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              {activeAction?.isDestructive ? (
                <AlertTriangle className="size-4 text-rose-600" />
              ) : (
                <Check className="size-4 text-[#007AFF]" />
              )}
              <span>Confirm Action: {activeAction?.label}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {activeAction?.actionDescription}
            </DialogDescription>
          </DialogHeader>

          {activeAction?.requiresReason && (
            <div className="space-y-2 py-2">
              <label className="text-xs font-semibold text-foreground">
                {activeAction.reasonPrompt || "Please state the reason for this decision:"}
              </label>
              <Textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => {
                  setReasonInput(e.target.value);
                  if (errorText) setErrorText("");
                }}
                placeholder="Enter itemized feedback or justification..."
                className="text-xs"
              />
              {errorText && <p className="text-[11px] text-rose-600 font-medium">{errorText}</p>}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveAction(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmModal}
              variant={activeAction?.isDestructive ? "destructive" : "default"}
              className="text-xs font-semibold"
            >
              Confirm Transition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
