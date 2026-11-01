"use client";

import * as React from "react";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "update";
  buttonLayout?: "auto" | "horizontal" | "vertical";
  icon?: React.ReactNode;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  itemType,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  buttonLayout = "auto",
  icon,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    if (isLoading) return;
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    await onConfirm();
  };

  const isDestructive = variant === "destructive";

  // Natural Apple HIG button layout detection:
  // If either action label is long (>16 chars, e.g. "Submit Formal Evaluation", "Submit Project Evaluation")
  // or combined length is large (>28 chars), use the native iOS stacked vertical layout.
  // Otherwise, use the horizontal side-by-side split on screens that can accommodate it.
  const isLongAction =
    confirmText.length > 16 ||
    cancelText.length > 16 ||
    confirmText.length + cancelText.length > 28;

  const useVerticalStack =
    buttonLayout === "vertical" ||
    (buttonLayout !== "horizontal" && isLongAction);

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <AnimatePresence>
        {open && (
          <DialogPortal>
            {/* iOS Translucent Dimmed Backdrop with Motion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[4px]"
              onClick={handleCancel}
              aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 pointer-events-none select-none">
              <motion.div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 2 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "pointer-events-auto relative w-full overflow-hidden outline-none",
                  // Balanced, responsive iOS alert width: never cramped on mobile, never stretched on desktop
                  "w-[310px] min-[370px]:w-[340px] min-[420px]:w-[370px] sm:w-[390px] max-w-[calc(100vw-24px)]",
                  "rounded-[22px] sm:rounded-[24px]",
                  "border border-black/[0.08] dark:border-white/[0.12]",
                  "bg-[#fbfbfb]/95 dark:bg-[#1e1e1e]/95 backdrop-blur-2xl backdrop-saturate-150",
                  "shadow-[0_20px_50px_rgba(0,0,0,0.22)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                )}
              >
              {/* Content Header & Body */}
              <div className="pt-6 pb-5 px-5 sm:px-6 text-center">
                {icon && (
                  <div className="mb-3.5 flex justify-center text-slate-700 dark:text-slate-300">
                    {icon}
                  </div>
                )}
                <h3
                  id="confirmation-dialog-title"
                  className="text-[17px] sm:text-[18px] font-semibold text-slate-900 dark:text-white tracking-[-0.016em] leading-snug break-words [overflow-wrap:break-word]"
                >
                  {title}
                </h3>
                <div
                  id="confirmation-dialog-description"
                  className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-[1.45] mt-2 font-normal break-words [overflow-wrap:break-word]"
                >
                  {description}
                </div>

                {/* Inset Item Detail (natural multi-line wrapping, no truncation) */}
                {itemName && (
                  <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-black/[0.035] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.08] text-left">
                    {itemType && (
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block leading-none mb-1.5">
                        {itemType}
                      </span>
                    )}
                    <p className="text-[12.5px] sm:text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-snug break-words [overflow-wrap:anywhere]">
                      {itemName}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {useVerticalStack ? (
                /* Native iOS Vertical Stacked Alert Actions */
                <div className="border-t border-black/[0.08] dark:border-white/[0.1] flex flex-col divide-y divide-black/[0.08] dark:border-white/[0.1]">
                  {/* Confirm Action (Primary action placed on top per iOS HIG) */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleConfirm}
                    className={cn(
                      "min-h-[48px] sm:min-h-[50px] w-full px-4 py-2.5 flex items-center justify-center gap-2",
                      "text-[16px] sm:text-[17px] font-semibold whitespace-nowrap",
                      "transition-colors hover:bg-black/[0.03] active:bg-black/[0.07] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08]",
                      "disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none",
                      isDestructive
                        ? "text-[#FF3B30] dark:text-[#FF453A]"
                        : "text-[#007AFF] dark:text-[#0A84FF]"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin shrink-0" />
                        <span>Working...</span>
                      </>
                    ) : (
                      <span>{confirmText}</span>
                    )}
                  </button>

                  {/* Cancel Action (Secondary action placed at bottom per iOS HIG) */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCancel}
                    className="min-h-[48px] sm:min-h-[50px] w-full px-4 py-2.5 flex items-center justify-center text-[16px] sm:text-[17px] font-normal text-[#007AFF] dark:text-[#0A84FF] transition-colors hover:bg-black/[0.03] active:bg-black/[0.07] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none whitespace-nowrap"
                  >
                    {cancelText}
                  </button>
                </div>
              ) : (
                /* Native iOS Side-by-Side Horizontal Alert Actions */
                <div className="border-t border-black/[0.08] dark:border-white/[0.1] grid grid-cols-2 divide-x divide-black/[0.08] dark:divide-white/[0.1] h-[48px] sm:h-[50px] max-[359px]:flex max-[359px]:flex-col max-[359px]:divide-x-0 max-[359px]:divide-y max-[359px]:h-auto">
                  {/* Cancel Action */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCancel}
                    className="h-full min-h-[48px] sm:min-h-[50px] w-full min-w-0 px-3 flex items-center justify-center text-[15.5px] sm:text-[16.5px] font-normal text-[#007AFF] dark:text-[#0A84FF] transition-colors hover:bg-black/[0.03] active:bg-black/[0.07] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none whitespace-nowrap"
                  >
                    <span className="truncate">{cancelText}</span>
                  </button>

                  {/* Confirm Action */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleConfirm}
                    className={cn(
                      "h-full min-h-[48px] sm:min-h-[50px] w-full min-w-0 px-3 flex items-center justify-center gap-1.5 text-[15.5px] sm:text-[16.5px] font-semibold whitespace-nowrap transition-colors hover:bg-black/[0.03] active:bg-black/[0.07] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none",
                      isDestructive
                        ? "text-[#FF3B30] dark:text-[#FF453A]"
                        : "text-[#007AFF] dark:text-[#0A84FF]"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin shrink-0" />
                        <span className="text-[15px]">Working...</span>
                      </>
                    ) : (
                      <span className="truncate">{confirmText}</span>
                    )}
                  </button>
                </div>
              )}
              </motion.div>
            </div>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
