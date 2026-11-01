"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyIdBadgeProps {
  id: string;
  label?: string;
  variant?: "pill" | "card" | "inline";
  size?: "xs" | "sm" | "default";
  className?: string;
}

export function CopyIdBadge({
  id,
  label,
  variant = "pill",
  size = "sm",
  className,
}: CopyIdBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(id);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = id;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      toast.success(
        label ? `Copied ${label} (${id}) to clipboard!` : `Copied ${id} to clipboard!`
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy ID to clipboard.");
    }
  };

  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:bg-slate-100/70",
          className
        )}
      >
        <div className="min-w-0">
          {label && (
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
              {label}
            </span>
          )}
          <span className="font-mono text-sm font-bold text-slate-800 tracking-tight">
            {id}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all active:scale-95"
          title={`Copy ${label || "ID"}`}
          aria-label={`Copy ${label || "ID"} ${id}`}
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-slate-500" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        {label && <span className="text-slate-500 font-normal">{label}:</span>}
        <span className="font-mono font-semibold text-slate-800">{id}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={`Copy ${label || "ID"}`}
          aria-label={`Copy ${label || "ID"} ${id}`}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-600" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    );
  }

  // Default "pill" variant
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] font-mono font-medium bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.05] dark:border-white/[0.06] text-slate-700 dark:text-slate-300 select-none",
        sizeClasses,
        className
      )}
    >
      {label && (
        <span className="font-sans font-medium text-slate-500 text-[11px] pr-0.5">
          {label}:
        </span>
      )}
      <span className="tracking-tight">{id}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="p-0.5 rounded hover:bg-slate-200/60 text-slate-400 hover:text-slate-800 transition-all duration-120 active:scale-85 focus:outline-none cursor-pointer"
        title={`Copy ${label || "ID"} ${id}`}
        aria-label={`Copy ${label || "ID"} ${id}`}
      >
        {copied ? (
          <Check className="size-3 text-emerald-600 animate-in zoom-in-75 duration-150" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
    </div>
  );
}
