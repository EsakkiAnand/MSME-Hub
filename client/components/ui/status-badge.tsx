import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — all status colors defined in one place.
// ─────────────────────────────────────────────────────────────────────────────

export type StatusVariant =
  | "neutral"      // pending, assigned, draft, queued
  | "info"         // in-progress, active, claimed
  | "review"       // submitted, under-review, pool-available, answered
  | "success"      // approved, completed, resolved, accepted, published
  | "warning"      // revision, on-hold, mediation
  | "destructive"  // rejected, failed, suppressed
  | "role-admin"
  | "role-faculty"
  | "role-student"
  | "role-industry"
  | "role-alumni";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  neutral:
    "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300",
  info:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  review:
    "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  destructive:
    "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  "role-admin":
    "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  "role-faculty":
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "role-student":
    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "role-industry":
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  "role-alumni":
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
};

// ─────────────────────────────────────────────────────────────────────────────
// Centralized status map — every enum value in the app listed exactly once.
// ─────────────────────────────────────────────────────────────────────────────

export interface StatusMeta {
  label: string;
  variant: StatusVariant;
}

export const STATUS_MAP: Record<string, StatusMeta> = {
  // Project lifecycle
  ASSIGNED:             { label: "Assigned",           variant: "neutral"      },
  IN_PROGRESS:          { label: "In Progress",        variant: "info"         },
  SOLUTION_SUBMITTED:   { label: "Solution Submitted", variant: "review"       },
  REVISION_IN_PROGRESS: { label: "Revision Needed",    variant: "warning"      },
  APPROVED:             { label: "Approved",           variant: "success"      },
  COMPLETED:            { label: "Completed",          variant: "success"      },
  REJECTED:             { label: "Rejected",           variant: "destructive"  },
  // Problem / pool
  DRAFT:                { label: "Draft",              variant: "neutral"      },
  POOL_AVAILABLE:       { label: "Available",          variant: "review"       },
  CLAIMED:              { label: "Claimed",            variant: "info"         },
  // Idea submissions
  PENDING_REVIEW:       { label: "Pending Review",     variant: "neutral"      },
  ACCEPTED:             { label: "Approved",           variant: "success"      },
  REVISION_REQUESTED:   { label: "Revision Requested", variant: "warning"      },
  NEEDS_CHANGES:        { label: "Needs Improvement",  variant: "warning"      },
  NEEDS_IMPROVEMENT:    { label: "Needs Improvement",  variant: "warning"      },
  RESUBMITTED:          { label: "Resubmitted",        variant: "info"         },
  UNDER_REVIEW:         { label: "Under Review",       variant: "neutral"      },
  SHOWCASE_PUBLISHED:   { label: "Approved & Live",    variant: "success"      },
  CONVERTED_TO_PROJECT: { label: "Project Incubated",  variant: "success"      },
  // Verification / admin
  PENDING:              { label: "Pending",            variant: "neutral"      },
  SUBMITTED:            { label: "Submitted",          variant: "review"       },
  // Ratings moderation
  QUEUED:               { label: "Queued",             variant: "neutral"      },
  APPROVED_PUBLISHED:   { label: "Published",          variant: "success"      },
  MEDIATION_REQUESTED:  { label: "Mediation",          variant: "warning"      },
  SUPPRESSED:           { label: "Suppressed",         variant: "destructive"  },
  // Guidance / alumni
  OPEN:                 { label: "Open",               variant: "info"         },
  ANSWERED:             { label: "Answered",           variant: "review"       },
  RESOLVED:             { label: "Resolved",           variant: "success"      },
  CLOSED:               { label: "Closed",             variant: "neutral"      },
  // Code / repository access
  ACCESSIBLE:           { label: "Accessible",         variant: "success"      },
  NO_REPO:              { label: "Pending Link",       variant: "neutral"      },
  RESTRICTED:           { label: "Restricted",         variant: "destructive"  },
  // Role labels (used in admin users table)
  MSME_ADMIN:           { label: "MSME Admin",         variant: "role-admin"   },
  STAFF:                { label: "Faculty Supervisor", variant: "role-faculty" },
  FACULTY:              { label: "Faculty",            variant: "role-faculty" },
  STUDENT:              { label: "Student Scholar",    variant: "role-student" },
  INDUSTRY:             { label: "Industry Partner",   variant: "role-industry"},
  ALUMNI:               { label: "Alumni Mentor",      variant: "role-alumni"  },
};

// Helper: resolve a status key to its meta (with a safe fallback).
export function resolveStatus(statusKey: string): StatusMeta {
  return (
    STATUS_MAP[statusKey] ?? {
      label: statusKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      variant: "neutral" as StatusVariant,
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge component
// ─────────────────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  /**
   * Pass a raw status key (e.g. "IN_PROGRESS") — label + color are resolved
   * automatically. Alternatively supply explicit `variant` and/or `label`.
   */
  status?: string;
  label?: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  variant,
  className,
}: StatusBadgeProps) {
  const resolved = status ? resolveStatus(status) : null;
  const finalLabel  = label   ?? resolved?.label   ?? status ?? "";
  const finalVariant: StatusVariant = variant ?? resolved?.variant ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap",
        "h-[22px] px-2 rounded-md",
        "text-[12px] font-medium leading-none",
        VARIANT_CLASSES[finalVariant],
        className
      )}
    >
      {finalLabel}
    </span>
  );
}
