"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface ContextualBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Standardized hierarchical breadcrumb navigation for detail and nested workflow pages.
 * Replaces ad-hoc arrow-left links within breadcrumb paths with clean ChevronRight hierarchy.
 */
export function ContextualBreadcrumb({
  items,
  className,
}: ContextualBreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600 shrink-0 select-none" />
            )}

            {isLast || !item.href ? (
              <span
                aria-current={isLast ? "page" : undefined}
                className="font-semibold text-slate-800 dark:text-foreground truncate"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
