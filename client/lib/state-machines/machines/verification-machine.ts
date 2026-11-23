/**
 * Industry Partner Verification & Student Track State Machines
 * PRD §8.1 REQ-AUTH-02, §8.2 REQ-ADM-01 & §8.5 REQ-STU-01
 */

import { UserRole, StudentTrack, MsmeApprovalStatus } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export type IndustryVerificationStatus =
  | "UNVERIFIED_PENDING"
  | "VERIFIED_ACTIVE"
  | "VERIFICATION_REJECTED";

export const industryVerificationStateMachine: StateMachineDefinition<
  IndustryVerificationStatus,
  UserRole
> = {
  id: "industry-verification-lifecycle",
  name: "Industry Partner Verification Machine",
  entityName: "Industry Registration",
  description:
    "Controls enterprise onboarding: ensures Udyam certificate PDF is reviewed and approved by MSME Admin before problem creation is unlocked.",
  initialState: "UNVERIFIED_PENDING",
  terminalStates: ["VERIFIED_ACTIVE", "VERIFICATION_REJECTED"],
  orderedSteps: ["UNVERIFIED_PENDING", "VERIFIED_ACTIVE"],
  states: {
    UNVERIFIED_PENDING: {
      id: "UNVERIFIED_PENDING",
      label: "Pending Verification",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description:
        "Registered with Udyam proof PDF. Problem submission and idea sponsorship locked pending MSME Admin verification.",
      badge: {
        label: "Pending Verification",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: "VERIFIED_ACTIVE",
          event: "APPROVE_INDUSTRY",
          label: "Verify & Approve Partner",
          actionDescription: "Approve Udyam documentation and unlock full MSME capabilities.",
          allowedRoles: [UserRole.MSME_ADMIN],
        },
        {
          targetState: "VERIFICATION_REJECTED",
          event: "REJECT_INDUSTRY",
          label: "Decline Verification",
          actionDescription: "Decline registration with note if documentation is fraudulent or unreadable.",
          allowedRoles: [UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Specify the compliance deficiency in the Udyam document.",
        },
      ],
    },

    VERIFIED_ACTIVE: {
      id: "VERIFIED_ACTIVE",
      label: "Verified Partner",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 2,
      isTerminal: true,
      description: "Enterprise verified. Authorized to submit industrial problems and adopt showcase ideas.",
      badge: {
        label: "Verified Enterprise",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [],
    },

    VERIFICATION_REJECTED: {
      id: "VERIFICATION_REJECTED",
      label: "Verification Declined",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Registration was declined. Company representative must re-upload valid Udyam proof.",
      badge: {
        label: "Declined",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [
        {
          targetState: "UNVERIFIED_PENDING",
          event: "RESUBMIT_PROOF",
          label: "Re-upload Verification Document",
          actionDescription: "Upload new Udyam certificate for administrative re-evaluation.",
          allowedRoles: [UserRole.INDUSTRY],
        },
      ],
    },
  },
};

export type StudentTrackLifecycleStatus =
  | "UNSELECTED"
  | "IDEA_TRACK_ACTIVE"
  | "MSME_TRACK_PENDING"
  | "MSME_TRACK_APPROVED"
  | "MSME_TRACK_REJECTED";

export const studentTrackStateMachine: StateMachineDefinition<
  StudentTrackLifecycleStatus,
  UserRole
> = {
  id: "student-track-lifecycle",
  name: "Student Innovation Track Machine",
  entityName: "Student Track Selection",
  description:
    "Directs students into independent Idea Incubation (Track A) or Collaborative MSME Capstone Projects (Track B) with concurrency guardrails (max 2 active projects).",
  initialState: "UNSELECTED",
  terminalStates: ["IDEA_TRACK_ACTIVE", "MSME_TRACK_APPROVED"],
  orderedSteps: ["UNSELECTED", "MSME_TRACK_PENDING", "MSME_TRACK_APPROVED"],
  states: {
    UNSELECTED: {
      id: "UNSELECTED",
      label: "Track Unselected",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Student has authenticated via institutional Google OAuth and must select an innovation pathway.",
      badge: {
        label: "Pending Selection",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300",
        dotClass: "bg-slate-400",
      },
      transitions: [
        {
          targetState: "IDEA_TRACK_ACTIVE",
          event: "SELECT_IDEA_TRACK",
          label: "Select Student Idea Incubation",
          actionDescription: "Immediate access to submit original ideas for faculty review.",
          allowedRoles: [UserRole.STUDENT],
        },
        {
          targetState: "MSME_TRACK_PENDING",
          event: "APPLY_MSME_TRACK",
          label: "Apply for MSME Project Assignment",
          actionDescription: "Submit application to work on authentic industrial client problems.",
          allowedRoles: [UserRole.STUDENT],
        },
      ],
    },

    IDEA_TRACK_ACTIVE: {
      id: "IDEA_TRACK_ACTIVE",
      label: "Idea Incubation Track",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 2,
      isTerminal: true,
      description: "Student is actively participating in independent innovation incubation and showcase pitches.",
      badge: {
        label: "Idea Track Active",
        badgeClass: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        dotClass: "bg-teal-500",
      },
      transitions: [
        {
          targetState: "MSME_TRACK_PENDING",
          event: "CROSSOVER_TO_MSME",
          label: "Apply for MSME Projects as well",
          actionDescription: "Apply for collaborative industrial assignments in addition to ideas.",
          allowedRoles: [UserRole.STUDENT],
        },
      ],
    },

    MSME_TRACK_PENDING: {
      id: "MSME_TRACK_PENDING",
      label: "MSME Track Pending Approval",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Application is in the MSME Admin verification desk. Awaiting project eligibility sign-off.",
      badge: {
        label: "Under Admin Review",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: "MSME_TRACK_APPROVED",
          event: "APPROVE_MSME_TRACK",
          label: "Approve Student for MSME Projects",
          actionDescription: "Unlock eligibility for faculty project assignment (subject to 2 active projects cap).",
          allowedRoles: [UserRole.MSME_ADMIN],
        },
        {
          targetState: "MSME_TRACK_REJECTED",
          event: "REJECT_MSME_TRACK",
          label: "Decline MSME Track Application",
          actionDescription: "Decline application if prerequisites or academic standing not met.",
          allowedRoles: [UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
        },
      ],
    },

    MSME_TRACK_APPROVED: {
      id: "MSME_TRACK_APPROVED",
      label: "Eligible for MSME Projects",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      isTerminal: true,
      description: "Student is approved and can be assigned to up to 2 active industry projects concurrently by faculty.",
      badge: {
        label: "Eligible for Assignment",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [],
    },

    MSME_TRACK_REJECTED: {
      id: "MSME_TRACK_REJECTED",
      label: "Application Declined",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Application declined by MSME Admin. Student can participate in Idea Incubation or re-apply.",
      badge: {
        label: "Declined",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [
        {
          targetState: "MSME_TRACK_PENDING",
          event: "REAPPLY_MSME_TRACK",
          label: "Re-apply for MSME Projects",
          actionDescription: "Re-apply after addressing prerequisites.",
          allowedRoles: [UserRole.STUDENT],
        },
      ],
    },
  },
};
