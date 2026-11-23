/**
 * Deadline Extension Request State Machine
 * PRD §8.4 REQ-STF-03 & §8.5 REQ-STU-04
 */

import { ExtensionStatus, UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export const extensionStateMachine: StateMachineDefinition<ExtensionStatus, UserRole> = {
  id: "deadline-extension-lifecycle",
  name: "Deadline Extension Machine",
  entityName: "Extension Request",
  description:
    "Manages timeline extension requests submitted by Student Team Leads and reviewed by Faculty Supervisors.",
  initialState: ExtensionStatus.PENDING,
  terminalStates: [ExtensionStatus.APPROVED, ExtensionStatus.REJECTED],
  orderedSteps: [
    ExtensionStatus.PENDING,
    ExtensionStatus.APPROVED,
  ],
  states: {
    PENDING: {
      id: ExtensionStatus.PENDING,
      label: "Pending Review",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Student Team Lead requested an extended target deadline with stated justification.",
      badge: {
        label: "Pending Review",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: ExtensionStatus.APPROVED,
          event: "GRANT_EXTENSION",
          label: "Grant Extension",
          actionDescription: "Approve extension request and update project target deadline.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: ExtensionStatus.REJECTED,
          event: "DECLINE_EXTENSION",
          label: "Decline Extension",
          actionDescription: "Decline extension request; original deadline remains active.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Provide the reason for declining the requested deadline extension.",
        },
      ],
    },

    APPROVED: {
      id: ExtensionStatus.APPROVED,
      label: "Extension Granted",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 2,
      isTerminal: true,
      description: "Faculty supervisor approved the new deadline. Project schedule updated.",
      badge: {
        label: "Granted",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [],
    },

    REJECTED: {
      id: ExtensionStatus.REJECTED,
      label: "Extension Declined",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Extension was declined. Team must deliver against the existing target date.",
      badge: {
        label: "Declined",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [],
    },
  },
};
