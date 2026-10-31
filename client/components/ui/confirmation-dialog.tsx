"use client";

import * as React from "react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Save,
  Loader2,
  Send,
  Trash2,
  LogOut,
  ShieldAlert,
} from "lucide-react";

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
  const isUpdate = variant === "update";

  const renderIcon = () => {
    if (icon) return icon;
    if (isDestructive) {
      return (
        <div className="size-11 rounded-2xl bg-red-50 text-red-600 border border-red-200/80 flex items-center justify-center shrink-0">
          <AlertTriangle className="size-5.5 stroke-[2.2]" />
        </div>
      );
    }
    if (isUpdate) {
      return (
        <div className="size-11 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0">
          <Save className="size-5.5 stroke-[2.2]" />
        </div>
      );
    }
    return (
      <div className="size-11 rounded-2xl bg-blue-50 text-[#007AFF] border border-blue-200/80 flex items-center justify-center shrink-0">
        <Send className="size-5.5 stroke-[2.2]" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      {open && (
        <DialogPortal>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-150" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              role="alertdialog"
              aria-modal="true"
              className="relative w-full max-w-md rounded-2xl sm:rounded-[22px] border border-black/[0.08] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.06)] animate-in fade-in-0 zoom-in-95 duration-150 text-left outline-none"
            >
              {/* Header with Icon */}
              <div className="flex items-start gap-4">
                {renderIcon()}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {title}
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                    {description}
                  </div>
                </div>
              </div>

              {/* Highlighted Item Badge (if provided) */}
              {itemName && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                  {itemType && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {itemType}
                    </span>
                  )}
                  <p className="font-semibold text-slate-900 truncate">{itemName}</p>
                </div>
              )}

              {/* iOS Action Buttons Footer */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleConfirm}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDestructive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#007AFF] hover:bg-[#0062cc]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin shrink-0" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogPortal>
      )}
    </Dialog>
  );
}
