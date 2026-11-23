/**
 * Industry Rating & Moderation State Machine
 * PRD §8.2 REQ-ADM-03 & ADR 0004 (2-Tier Rating Moderation Architecture)
 */

import { UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export type ModeratedRatingStatus =
  | "PENDING_SUBMISSION"
  | "AUTO_PUBLISHED"
  | "QUEUED_FOR_MODERATION"
  | "ADMIN_APPROVED_PUBLISHED"
  | "SUPPRESSED";

export const ratingModerationStateMachine: StateMachineDefinition<ModeratedRatingStatus, UserRole> = {
  id: "industry-rating-moderation",
  name: "Industry Rating Moderation Machine",
  entityName: "Industry Deliverable Evaluation",
  description:
    "Enforces ADR 0004: Ratings >= 3 stars publish immediately to student portfolios; ratings <= 2 stars route automatically to MSME Admin moderation to prevent unfair grading.",
  initialState: "PENDING_SUBMISSION",
  terminalStates: ["AUTO_PUBLISHED", "ADMIN_APPROVED_PUBLISHED", "SUPPRESSED"],
  orderedSteps: [
    "PENDING_SUBMISSION",
    "QUEUED_FOR_MODERATION",
    "ADMIN_APPROVED_PUBLISHED",
  ],
  states: {
    PENDING_SUBMISSION: {
      id: "PENDING_SUBMISSION",
      label: "Awaiting Client Review",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Project approved. Industry client has been invited to rate deliverables and submit written review.",
      badge: {
        label: "Awaiting Rating",
        badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        dotClass: "bg-[#007AFF] animate-pulse",
      },
      transitions: [
        {
          targetState: "AUTO_PUBLISHED",
          event: "SUBMIT_HIGH_RATING",
          label: "Submit Rating (3-5 Stars)",
          actionDescription: "Ratings >= 3 stars automatically publish to student portfolio.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          guard: (ctx) => {
            if ((ctx.ratingStars || 0) < 3) {
              return { allowed: false, reason: "Ratings <= 2 stars must be routed through moderation." };
            }
            return { allowed: true };
          },
        },
        {
          targetState: "QUEUED_FOR_MODERATION",
          event: "SUBMIT_LOW_RATING",
          label: "Submit Rating (1-2 Stars)",
          actionDescription: "Ratings <= 2 stars held in MSME Admin moderation queue before publication.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          guard: (ctx) => {
            if ((ctx.ratingStars || 0) > 2) {
              return { allowed: false, reason: "Ratings >= 3 stars are published directly without moderation." };
            }
            return { allowed: true };
          },
        },
      ],
    },

    QUEUED_FOR_MODERATION: {
      id: "QUEUED_FOR_MODERATION",
      label: "In Admin Moderation Queue",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description:
        "Held in Admin Moderation Desk. Administrator evaluates written critique and mediates with client if grading was unjust.",
      badge: {
        label: "Held for Moderation",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: "ADMIN_APPROVED_PUBLISHED",
          event: "ADMIN_APPROVE_RATING",
          label: "Approve & Publish to Portfolio",
          actionDescription: "Admin validates client's critical review as constructive and releases it to student portfolio.",
          allowedRoles: [UserRole.MSME_ADMIN],
        },
        {
          targetState: "SUPPRESSED",
          event: "ADMIN_SUPPRESS_RATING",
          label: "Suppress Rating",
          actionDescription: "Suppress rating due to unfair grading, breach of scope, or malicious evaluation.",
          allowedRoles: [UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Document administrative findings for suppressing this rating.",
        },
      ],
    },

    AUTO_PUBLISHED: {
      id: "AUTO_PUBLISHED",
      label: "Published (Direct)",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Verified rating >= 3 stars directly visible on student portfolio.",
      badge: {
        label: "Published",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [],
    },

    ADMIN_APPROVED_PUBLISHED: {
      id: "ADMIN_APPROVED_PUBLISHED",
      label: "Published (Admin Moderated)",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Low rating was reviewed, mediated by MSME Admin, and published with governance audit record.",
      badge: {
        label: "Moderated & Published",
        badgeClass: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        dotClass: "bg-teal-600",
      },
      transitions: [],
    },

    SUPPRESSED: {
      id: "SUPPRESSED",
      label: "Suppressed by Admin",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Rating was suppressed by MSME Admin. Hidden from student public portfolios.",
      badge: {
        label: "Suppressed",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [],
    },
  },
};
