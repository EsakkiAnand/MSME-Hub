"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { safeNavigateBack } from "@/lib/navigation-utils";
import { cn } from "@/lib/utils";

export interface ContextualBackProps {
  label: string;
  fallbackHref: string;
  className?: string;
}

/**
 * Contextual Back navigation link for views that return to a parent entity
 * (e.g., from an error/empty state or specialized subview).
 * Uses history-aware safeNavigateBack to prevent jumping out of app bounds.
 */
export function ContextualBack({
  label,
  fallbackHref,
  className,
}: ContextualBackProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    safeNavigateBack(router, fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer select-none",
        className
      )}
    >
      <ArrowLeft className="size-3.5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}
