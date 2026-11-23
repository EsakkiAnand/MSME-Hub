/**
 * Alumni Guidance Board & Mentorship State Machine
 * PRD §8.5 REQ-STU-03 & §8.6 REQ-ALM-01
 */

import { GuidanceStatus, UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export const guidanceStateMachine: StateMachineDefinition<GuidanceStatus, UserRole> = {
  id: "alumni-guidance-lifecycle",
  name: "Alumni Guidance Board Machine",
  entityName: "Guidance Request",
  description:
    "Governs student architectural questions to alumni mentors, answer submissions, resolution verification, and reputation endorsement rewards.",
  initialState: GuidanceStatus.OPEN,
  terminalStates: [GuidanceStatus.RESOLVED, GuidanceStatus.CLOSED],
  orderedSteps: [
    GuidanceStatus.OPEN,
    GuidanceStatus.ANSWERED,
    GuidanceStatus.RESOLVED,
  ],
  states: {
    OPEN: {
      id: GuidanceStatus.OPEN,
      label: "Open for Mentorship",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Student query is visible on the Guidance Board and tagged by tech domain.",
      badge: {
        label: "Open Query",
        badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        dotClass: "bg-[#007AFF] animate-pulse",
      },
      transitions: [
        {
          targetState: GuidanceStatus.ANSWERED,
          event: "SUBMIT_ANSWER",
          label: "Provide Guidance & Answer",
          actionDescription: "Alumni mentor posts architectural answer or code critique.",
          allowedRoles: [UserRole.ALUMNI, UserRole.MSME_ADMIN],
        },
        {
          targetState: GuidanceStatus.CLOSED,
          event: "CANCEL_REQUEST",
          label: "Close Query",
          actionDescription: "Student closes query if self-resolved.",
          allowedRoles: [UserRole.STUDENT, UserRole.MSME_ADMIN],
        },
      ],
    },

    ANSWERED: {
      id: GuidanceStatus.ANSWERED,
      label: "Answered by Alumni",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Mentor has provided guidance. Student must verify if answer solved the bottleneck.",
      badge: {
        label: "Answered",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500",
      },
      transitions: [
        {
          targetState: GuidanceStatus.RESOLVED,
          event: "ACCEPT_AND_ENDORSE",
          label: "Resolve & Award Helpful Endorsement",
          actionDescription: "Student marks query resolved and awards a Helpful Endorsement point to the mentor.",
          allowedRoles: [UserRole.STUDENT, UserRole.MSME_ADMIN],
        },
        {
          targetState: GuidanceStatus.OPEN,
          event: "REQUEST_CLARIFICATION",
          label: "Request Follow-up",
          actionDescription: "Student asks follow-up clarification if answer requires further depth.",
          allowedRoles: [UserRole.STUDENT],
        },
        {
          targetState: GuidanceStatus.CLOSED,
          event: "CLOSE_WITHOUT_ENDORSEMENT",
          label: "Close Thread",
          actionDescription: "Close thread without awarding endorsement.",
          allowedRoles: [UserRole.STUDENT, UserRole.MSME_ADMIN],
        },
      ],
    },

    RESOLVED: {
      id: GuidanceStatus.RESOLVED,
      label: "Resolved & Endorsed",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Query successfully resolved. Alumni mentor awarded a Helpful Endorsement.",
      badge: {
        label: "Resolved",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [],
    },

    CLOSED: {
      id: GuidanceStatus.CLOSED,
      label: "Closed",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Thread concluded without endorsement.",
      badge: {
        label: "Closed",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300",
        dotClass: "bg-slate-400",
      },
      transitions: [],
    },
  },
};
