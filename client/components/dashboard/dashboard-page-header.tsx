"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Standardized Apple-inspired Page Header Card for all role dashboards.
 * Guarantees identical typography, padding, border radius, background, and alignment.
 */
export function DashboardPageHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {Icon && <Icon className="size-4.5 text-[#14283F] dark:text-sky-400 shrink-0" />}
          <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {action}
        </div>
      )}
    </div>
  );
}
