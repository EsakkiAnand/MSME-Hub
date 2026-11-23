/**
 * Project Lifecycle State Machine
 * PRD §7.1, §8.2, §8.4, §8.5 & ADR 0002
 */

import { ProjectStatus, UserRole } from "@prisma/client";
import { StateMachineDefinition } from "../types";

export const projectStateMachine: StateMachineDefinition<ProjectStatus, UserRole> = {
  id: "project-lifecycle",
  name: "Project Lifecycle & Deliverable Machine",
  entityName: "Collaborative Project",
  description:
    "Governs the end-to-end lifecycle of an engineering project from student assignment to GitHub delivery, administrative approval, and industry rating.",
  initialState: ProjectStatus.ASSIGNED,
  terminalStates: [ProjectStatus.COMPLETED, ProjectStatus.REJECTED],
  orderedSteps: [
    ProjectStatus.ASSIGNED,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.SOLUTION_SUBMITTED,
    ProjectStatus.APPROVED,
    ProjectStatus.COMPLETED,
  ],
  states: {
    ASSIGNED: {
      id: ProjectStatus.ASSIGNED,
      label: "Team Assigned",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 1,
      description:
        "Faculty project director has claimed the problem and assigned student team members with a designated Team Lead.",
      badge: {
        label: "Team Assigned",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300",
        dotClass: "bg-slate-400",
      },
      transitions: [
        {
          targetState: ProjectStatus.IN_PROGRESS,
          event: "START_DEVELOPMENT",
          label: "Start Development",
          actionDescription: "Kick off engineering sprints and begin solution implementation.",
          allowedRoles: [UserRole.STUDENT, UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: ProjectStatus.REJECTED,
          event: "ABORT_PROJECT",
          label: "Cancel / Reject Project",
          actionDescription: "Close project if problem statement is deemed unviable or withdrawn.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Provide a detailed justification for dropping this project.",
        },
      ],
    },

    IN_PROGRESS: {
      id: ProjectStatus.IN_PROGRESS,
      label: "In Progress",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 2,
      description:
        "Student team is actively developing the software/hardware solution, seeking alumni guidance, and testing milestones.",
      badge: {
        label: "In Progress",
        badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
        dotClass: "bg-[#007AFF] animate-pulse",
      },
      transitions: [
        {
          targetState: ProjectStatus.SOLUTION_SUBMITTED,
          event: "SUBMIT_SOLUTION",
          label: "Submit GitHub Solution",
          actionDescription: "Submit public GitHub repository for faculty and MSME Admin review.",
          allowedRoles: [UserRole.STUDENT],
          guard: (ctx) => {
            if (!ctx.isLead) {
              return {
                allowed: false,
                reason: "Only the designated Student Team Lead has authority to submit the official GitHub repository.",
              };
            }
            if (!ctx.hasGithubUrl) {
              return {
                allowed: false,
                reason: "A valid public GitHub repository URL is required.",
              };
            }
            return { allowed: true };
          },
        },
        {
          targetState: ProjectStatus.REJECTED,
          event: "REJECT_PROJECT",
          label: "Reject / Drop Project",
          actionDescription: "Discontinue project due to insurmountable technical or compliance blockers.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Specify the reason for rejecting and closing this project.",
        },
      ],
    },

    SOLUTION_SUBMITTED: {
      id: ProjectStatus.SOLUTION_SUBMITTED,
      label: "Under Review",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 3,
      description:
        "Public GitHub deliverable submitted. Awaiting code inspection, MIT license audit, and governance approval.",
      badge: {
        label: "Under Review",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        dotClass: "bg-amber-500 animate-pulse",
      },
      transitions: [
        {
          targetState: ProjectStatus.APPROVED,
          event: "APPROVE_SOLUTION",
          label: "Approve Deliverable",
          actionDescription: "Sign off on solution deliverables, confirming MIT license and academic standards.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
        },
        {
          targetState: ProjectStatus.REVISION_IN_PROGRESS,
          event: "REQUEST_REVISIONS",
          label: "Request Revisions",
          actionDescription: "Return repository to student team with itemized technical feedback.",
          allowedRoles: [UserRole.STAFF, UserRole.MSME_ADMIN],
          requiresReason: true,
          reasonPrompt: "Detail the specific technical revisions required from the student team.",
        },
        {
          targetState: ProjectStatus.IN_PROGRESS,
          event: "UNLINK_REPOSITORY",
          label: "Withdraw / Unlink Submission",
          actionDescription: "Student lead withdraws submission to push critical code updates.",
          allowedRoles: [UserRole.STUDENT],
          guard: (ctx) => {
            if (!ctx.isLead) {
              return { allowed: false, reason: "Only the Project Team Lead can withdraw the repository." };
            }
            return { allowed: true };
          },
        },
        {
          targetState: ProjectStatus.REJECTED,
          event: "REJECT_DELIVERABLE",
          label: "Reject Deliverable",
          actionDescription: "Formally reject deliverable due to plagiarism, missing MIT license, or policy failure.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
          isDestructive: true,
          requiresReason: true,
          reasonPrompt: "Explain the compliance or safety failure causing deliverable rejection.",
        },
      ],
    },

    REVISION_IN_PROGRESS: {
      id: ProjectStatus.REVISION_IN_PROGRESS,
      label: "Revision Needed",
      category: "IN_PROGRESS_LIVE",
      categoryLabel: "In Progress / Live",
      stepNumber: 3,
      description:
        "Deliverable returned for itemized sprint revision. Team must address feedback before resubmitting.",
      badge: {
        label: "Revision Needed",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
        dotClass: "bg-orange-500",
      },
      transitions: [
        {
          targetState: ProjectStatus.SOLUTION_SUBMITTED,
          event: "RESUBMIT_SOLUTION",
          label: "Resubmit Revised Deliverable",
          actionDescription: "Submit updated repository after addressing revision items.",
          allowedRoles: [UserRole.STUDENT],
          guard: (ctx) => {
            if (!ctx.isLead) {
              return { allowed: false, reason: "Only the Project Team Lead can resubmit the deliverable." };
            }
            return { allowed: true };
          },
        },
        {
          targetState: ProjectStatus.REJECTED,
          event: "TERMINATE_PROJECT",
          label: "Reject / Terminate",
          actionDescription: "Close project if revision cycle fails to meet required thresholds.",
          allowedRoles: [UserRole.MSME_ADMIN, UserRole.STAFF],
          isDestructive: true,
          requiresReason: true,
        },
      ],
    },

    APPROVED: {
      id: ProjectStatus.APPROVED,
      label: "Approved & Sign-off Complete",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 4,
      description:
        "Solution verified by faculty director and MSME Administration. Unlocks industry partner rating and testimonial.",
      badge: {
        label: "Approved",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClass: "bg-emerald-500",
      },
      transitions: [
        {
          targetState: ProjectStatus.COMPLETED,
          event: "RATE_AND_CLOSE",
          label: "Submit Rating & Close Project",
          actionDescription: "Industry client provides 1-5 star review; project formally closes and appears on student portfolios.",
          allowedRoles: [UserRole.INDUSTRY, UserRole.MSME_ADMIN],
          guard: (ctx) => {
            if (ctx.userRole === UserRole.INDUSTRY && !ctx.ratingStars) {
              return { allowed: false, reason: "A star rating between 1 and 5 is required to close the project." };
            }
            return { allowed: true };
          },
        },
      ],
    },

    COMPLETED: {
      id: ProjectStatus.COMPLETED,
      label: "Project Closed & Rated",
      category: "COMPLETED",
      categoryLabel: "Completed",
      stepNumber: 5,
      isTerminal: true,
      description:
        "Project successfully delivered, academically approved, and rated by the industrial client. Portfolios updated.",
      badge: {
        label: "Closed & Rated",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200",
        dotClass: "bg-emerald-600",
      },
      transitions: [],
    },

    REJECTED: {
      id: ProjectStatus.REJECTED,
      label: "Deliverable Rejected / Closed",
      category: "REJECTED",
      categoryLabel: "Rejected",
      stepNumber: 0,
      isTerminal: true,
      description:
        "Project discontinued due to technical infeasibility, non-compliance with PRD open-source criteria, or mutual agreement.",
      badge: {
        label: "Rejected",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        dotClass: "bg-rose-500",
      },
      transitions: [],
    },
  },
};
