/**
 * Industry Problem Lifecycle State Machine
 * PRD §7.1, §8.3 & §8.4
 */

import { ProblemStatus, UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export const problemStateMachine: StateMachineDefinition<ProblemStatus, UserRole> = {
  id: "industry-problem-lifecycle",
  name: "Industry Problem Lifecycle Machine",
  entityName: "Industry Challenge",
  description:
    "Tracks operational challenges submitted by MSMEs from initial draft through pool availability, faculty claiming, and conversion to active student projects.",
  initialState: ProblemStatus.POOL_AVAILABLE,
  terminalStates: [ProblemStatus.CLAIMED, ProblemStatus.REJECTED],
  orderedSteps: [
    ProblemStatus.DRAFT,
    ProblemStatus.POOL_AVAILABLE,
    ProblemStatus.CLAIMED,
  ],
  states: {
    DRAFT: {
      id: ProblemStatus.DRAFT,
      label: "Draft",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Problem statement saved as draft by industry partner before publishing.",
      badge: {
        label: "Draft",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300",
        dotClass: "bg-slate-400",
      },
      transitions: [
        {
          targetState: ProblemStatus.POOL_AVAILABLE,
          event: "PUBLISH_TO_POOL",
          label: "Publish to Problem Pool",
          actionDescription: "Publish problem to the institutional pool for faculty discovery.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          guard: (ctx) => {
            if (ctx.userRole === UserRole.INDUSTRY && !ctx.isVerified) {
              return { allowed: false, reason: "Your industry account must be verified before publishing problems to the pool." };
            }
            return { allowed: true };
          },
        },
        {
          targetState: ProblemStatus.REJECTED,
          event: "DISCARD_DRAFT",
          label: "Discard Draft",
          actionDescription: "Discard draft problem statement.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          isDestructive: true,
        },
      ],
    },

    POOL_AVAILABLE: {
      id: ProblemStatus.POOL_AVAILABLE,
      label: "Available in Pool",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Live in the problem bank. Academic staff can browse by domain and claim for student teams.",
      badge: {
        label: "In Pool",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500 animate-pulse",
      },
      transitions: [
        {
          targetState: ProblemStatus.CLAIMED,
          event: "CLAIM_PROBLEM",
          label: "Claim Problem",
          actionDescription: "Faculty supervisor claims challenge to form a student project team.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: ProblemStatus.REJECTED,
          event: "REJECT_PROBLEM",
          label: "Decline / Archive",
          actionDescription: "Admin or author archives problem if obsolete or non-compliant.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.INDUSTRY],
          isDestructive: true,
          requiresReason: true,
        },
      ],
    },

    CLAIMED: {
      id: ProblemStatus.CLAIMED,
      label: "Claimed & Project Formed",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Claimed by a faculty supervisor and converted to an active student project.",
      badge: {
        label: "Claimed",
        badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        dotClass: "bg-[#007AFF]",
      },
      transitions: [
        {
          targetState: ProblemStatus.POOL_AVAILABLE,
          event: "RELEASE_TO_POOL",
          label: "Release Back to Pool",
          actionDescription: "Release problem back to pool if faculty supervisor cannot proceed.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          requiresReason: true,
        },
      ],
    },

    REJECTED: {
      id: ProblemStatus.REJECTED,
      label: "Archived / Rejected",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Problem statement was declined or archived.",
      badge: {
        label: "Archived",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [],
    },
  },
};
