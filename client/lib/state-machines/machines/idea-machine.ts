/**
 * Student Idea Incubation & Showcase State Machine
 * PRD §7.2, §8.4, §8.5 & REQ-IND-05
 */

import { IdeaStatus, UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export const ideaStateMachine: StateMachineDefinition<IdeaStatus, UserRole> = {
  id: "student-idea-lifecycle",
  name: "Student Idea Incubation Machine",
  entityName: "Innovation Idea",
  description:
    "Manages independent student ideas from initial submission through faculty rubric review, improvement cycles, showcase publication, and industry sponsorship.",
  initialState: IdeaStatus.SUBMITTED,
  terminalStates: [IdeaStatus.REJECTED, IdeaStatus.CONVERTED_TO_PROJECT],
  orderedSteps: [
    IdeaStatus.SUBMITTED,
    IdeaStatus.UNDER_REVIEW,
    IdeaStatus.ACCEPTED,
    IdeaStatus.SHOWCASE_PUBLISHED,
    IdeaStatus.CONVERTED_TO_PROJECT,
  ],
  states: {
    SUBMITTED: {
      id: IdeaStatus.SUBMITTED,
      label: "Proposal Submitted",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description: "Student has pitched an original concept. Queued for faculty and MSME Admin review.",
      badge: {
        label: "Submitted",
        badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        dotClass: "bg-[#007AFF] animate-pulse",
      },
      transitions: [
        {
          targetState: IdeaStatus.UNDER_REVIEW,
          event: "BEGIN_REVIEW",
          label: "Begin Evaluation",
          actionDescription: "Faculty supervisor opens idea for rubric evaluation.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: IdeaStatus.ACCEPTED,
          event: "FAST_TRACK_APPROVE",
          label: "Approve Proposal",
          actionDescription: "Directly accept high-potential idea without triage delay.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
        },
        {
          targetState: IdeaStatus.NEEDS_CHANGES,
          event: "REQUEST_IMPROVEMENTS",
          label: "Request Improvements",
          actionDescription: "Return to student with guidance on scope or feasibility.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          requiresReason: true,
          reasonPrompt: "Itemize what needs improvement (problem clarity, solution viability, or deliverables).",
        },
        {
          targetState: IdeaStatus.REJECTED,
          event: "REJECT_IDEA",
          label: "Decline Proposal",
          actionDescription: "Decline idea proposal with constructive feedback.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Provide constructive feedback explaining why this proposal was declined.",
        },
      ],
    },

    UNDER_REVIEW: {
      id: IdeaStatus.UNDER_REVIEW,
      label: "Under Evaluation",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Staff and MSME Admin are assessing technical viability and industry relevance.",
      badge: {
        label: "Under Review",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: IdeaStatus.ACCEPTED,
          event: "APPROVE_IDEA",
          label: "Accept Proposal",
          actionDescription: "Accept proposal for academic incubation or sponsorship showcase.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: IdeaStatus.NEEDS_CHANGES,
          event: "REQUEST_IMPROVEMENTS",
          label: "Request Improvements",
          actionDescription: "Return proposal for revision with itemized rubric feedback.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          requiresReason: true,
          reasonPrompt: "Provide specific revision guidance for the student.",
        },
        {
          targetState: IdeaStatus.REJECTED,
          event: "REJECT_IDEA",
          label: "Decline Proposal",
          actionDescription: "Decline proposal if concept is non-viable or duplicates existing projects.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
        },
      ],
    },

    NEEDS_CHANGES: {
      id: IdeaStatus.NEEDS_CHANGES,
      label: "Needs Improvements",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Faculty has requested enhancements. Student can update fields and resubmit.",
      badge: {
        label: "Needs Improvements",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
        dotClass: "bg-orange-500",
      },
      transitions: [
        {
          targetState: IdeaStatus.RESUBMITTED,
          event: "RESUBMIT_IDEA",
          label: "Resubmit Revised Proposal",
          actionDescription: "Student submits updated proposal addressing reviewer comments.",
          allowedRoles: [UserRole.STUDENT],
        },
        {
          targetState: IdeaStatus.REJECTED,
          event: "ABANDON_IDEA",
          label: "Withdraw / Close",
          actionDescription: "Close proposal if student elects not to revise.",
          allowedRoles: [UserRole.STUDENT, UserRole.MSME_ADMIN],
          isDestructive: true,
        },
      ],
    },

    RESUBMITTED: {
      id: IdeaStatus.RESUBMITTED,
      label: "Revised & Resubmitted",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description: "Student has incorporated requested feedback. Awaiting re-evaluation.",
      badge: {
        label: "Resubmitted",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        dotClass: "bg-purple-500 animate-pulse",
      },
      transitions: [
        {
          targetState: IdeaStatus.ACCEPTED,
          event: "ACCEPT_RESUBMISSION",
          label: "Accept Revised Proposal",
          actionDescription: "Approve revised proposal after improvements verified.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
        },
        {
          targetState: IdeaStatus.NEEDS_CHANGES,
          event: "REQUEST_FURTHER_CHANGES",
          label: "Request Further Changes",
          actionDescription: "Ask for additional adjustments if issues remain.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
          requiresReason: true,
        },
        {
          targetState: IdeaStatus.REJECTED,
          event: "REJECT_RESUBMISSION",
          label: "Decline Proposal",
          actionDescription: "Decline proposal if revisions fail to satisfy standards.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
          isDestructive: true,
          requiresReason: true,
        },
      ],
    },

    ACCEPTED: {
      id: IdeaStatus.ACCEPTED,
      label: "Accepted & Incubating",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 3,
      description:
        "Proposal accepted. Eligible for conversion to an internal capstone project or publishing to Industry Sponsorship Showcase.",
      badge: {
        label: "Accepted",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [
        {
          targetState: IdeaStatus.SHOWCASE_PUBLISHED,
          event: "PUBLISH_SHOWCASE",
          label: "Publish to Industry Showcase",
          actionDescription: "Feature idea in the public MSME showcase for enterprise adoption.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: IdeaStatus.CONVERTED_TO_PROJECT,
          event: "CONVERT_TO_INTERNAL_PROJECT",
          label: "Convert to Capstone Project",
          actionDescription: "Create a formal engineering project with student locked as Team Lead.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
      ],
    },

    SHOWCASE_PUBLISHED: {
      id: IdeaStatus.SHOWCASE_PUBLISHED,
      label: "Published in Showcase",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 4,
      description:
        "Live in the MSME Sponsorship Showcase. Verified industry partners can adopt and fund this idea.",
      badge: {
        label: "In Showcase",
        badgeClass: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        dotClass: "bg-teal-500 animate-pulse",
      },
      transitions: [
        {
          targetState: IdeaStatus.CONVERTED_TO_PROJECT,
          event: "INDUSTRY_ADOPT",
          label: "Adopt & Sponsor Idea",
          actionDescription: "Industry client adopts idea; creates project with originating student locked as Team Lead.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          guard: (ctx) => {
            if (ctx.userRole === UserRole.INDUSTRY && !ctx.isVerified) {
              return { allowed: false, reason: "Your industry account must be verified before adopting showcase ideas." };
            }
            return { allowed: true };
          },
        },
      ],
    },

    CONVERTED_TO_PROJECT: {
      id: IdeaStatus.CONVERTED_TO_PROJECT,
      label: "Converted to Project",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 5,
      isTerminal: true,
      description:
        "Idea graduated into an active collaborative project. Originating student is locked as Project Team Lead.",
      badge: {
        label: "Graduated to Project",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200",
        dotClass: "bg-emerald-600",
      },
      transitions: [],
    },

    REJECTED: {
      id: IdeaStatus.REJECTED,
      label: "Declined",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description: "Proposal was declined during evaluation. Student can submit a new concept.",
      badge: {
        label: "Declined",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [],
    },
  },
};
