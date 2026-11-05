"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-server";
import { UserRole, IdeaStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SubmitIdeaInput {
  title: string;
  domain: string;
  problemStatement: string;
  proposedSolution: string;
  expectedImpact?: string;
  attachments?: string;
}

export interface ResubmitIdeaInput extends SubmitIdeaInput {
  ideaId: string;
}

export interface ReviewIdeaInput {
  ideaId: string;
  action: "APPROVE" | "REQUEST_IMPROVEMENT" | "REJECT";
  feedback?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Actions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submits a new project idea proposal for MSME Admin verification.
 * Enforces STUDENT role. Automatically sets initial status to SUBMITTED (Pending).
 */
export async function submitStudentIdea(data: SubmitIdeaInput) {
  const user = await requireRole([UserRole.STUDENT]);

  const title = data.title?.trim();
  const domain = data.domain?.trim();
  const problemStatement = data.problemStatement?.trim();
  const proposedSolution = data.proposedSolution?.trim();
  const expectedImpact = data.expectedImpact?.trim() || "";
  const attachments = data.attachments?.trim() || null;

  if (!title) throw new Error("Idea title is required.");
  if (!domain) throw new Error("Industry domain is required.");
  if (!problemStatement) throw new Error("Problem statement is required.");
  if (!proposedSolution) throw new Error("Proposed solution is required.");

  // Build combined description for backward compatibility
  const description = `${problemStatement}\n\nProposed Solution:\n${proposedSolution}`;

  const createdIdea = await prisma.idea.create({
    data: {
      studentId: user.id,
      title,
      domain,
      problemStatement,
      proposedSolution,
      expectedImpact,
      description,
      attachments,
      status: IdeaStatus.SUBMITTED,
      isShowcase: false,
    },
    include: {
      student: {
        select: { id: true, name: true, uniqueId: true, email: true },
      },
    },
  });

  revalidatePath("/dashboard/student/submit-idea");
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/admin/idea-verification");

  return { success: true, idea: createdIdea };
}

/**
 * Edits and resubmits an existing idea that was marked NEEDS_CHANGES (Needs Improvement).
 * Strictly validates student ownership and ensures only ideas needing improvement can be edited.
 */
export async function resubmitStudentIdea(data: ResubmitIdeaInput) {
  const user = await requireRole([UserRole.STUDENT]);

  if (!data.ideaId) throw new Error("Idea ID is required.");
  const title = data.title?.trim();
  const domain = data.domain?.trim();
  const problemStatement = data.problemStatement?.trim();
  const proposedSolution = data.proposedSolution?.trim();
  const expectedImpact = data.expectedImpact?.trim() || "";
  const attachments = data.attachments?.trim() || null;

  if (!title) throw new Error("Idea title is required.");
  if (!domain) throw new Error("Industry domain is required.");
  if (!problemStatement) throw new Error("Problem statement is required.");
  if (!proposedSolution) throw new Error("Proposed solution is required.");

  // Verify idea existence and ownership
  const existingIdea = await prisma.idea.findUnique({
    where: { id: data.ideaId },
  });

  if (!existingIdea) {
    throw new Error("Idea proposal not found.");
  }

  if (existingIdea.studentId !== user.id) {
    throw new Error("Unauthorized: You can only edit your own idea proposals.");
  }

  if (existingIdea.status !== IdeaStatus.NEEDS_CHANGES) {
    throw new Error(
      "Only ideas marked 'Needs Improvement' can be revised and resubmitted."
    );
  }

  const description = `${problemStatement}\n\nProposed Solution:\n${proposedSolution}`;

  // Execute transaction-safe resubmission: record history and update status to RESUBMITTED
  const updatedIdea = await prisma.$transaction(async (tx) => {
    // 1. Record snapshot entry in history
    await tx.ideaReview.create({
      data: {
        ideaId: existingIdea.id,
        adminId: user.id, // Record student submission in log
        action: IdeaStatus.RESUBMITTED,
        feedback: "Student submitted revised proposal addressing requested improvements.",
        previousStatus: existingIdea.status,
      },
    });

    // 2. Update the idea
    return tx.idea.update({
      where: { id: existingIdea.id },
      data: {
        title,
        domain,
        problemStatement,
        proposedSolution,
        expectedImpact,
        description,
        attachments,
        status: IdeaStatus.RESUBMITTED,
        resubmittedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: { id: true, name: true, uniqueId: true, email: true },
        },
        reviewHistory: {
          orderBy: { createdAt: "desc" },
        },
        reviewedByAdmin: {
          select: { id: true, name: true, uniqueId: true },
        },
      },
    });
  });

  revalidatePath("/dashboard/student/submit-idea");
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/admin/idea-verification");

  return { success: true, idea: updatedIdea };
}

/**
 * Retrieves all ideas submitted by the current authenticated student.
 */
export async function getStudentIdeas() {
  const user = await requireRole([UserRole.STUDENT]);

  const ideas = await prisma.idea.findMany({
    where: { studentId: user.id },
    include: {
      student: {
        select: { id: true, name: true, uniqueId: true, email: true },
      },
      reviewHistory: {
        include: {
          admin: {
            select: { id: true, name: true, uniqueId: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      reviewedByAdmin: {
        select: { id: true, name: true, uniqueId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return ideas;
}

// ─────────────────────────────────────────────────────────────────────────────
// MSME Admin Actions (Core Business Rule: ONLY MSME Admin can verify ideas)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retrieves the verification overview for MSME Admin dashboard:
 * KPI counts across pending, approved, needs improvement, and rejected ideas.
 */
export async function getAdminIdeasOverview(filter?: {
  status?: string;
  search?: string;
}) {
  await requireRole([UserRole.MSME_ADMIN]);

  // Aggregate KPI Counts
  const [
    pendingCount,
    resubmittedCount,
    approvedCount,
    needsImprovementCount,
    rejectedCount,
    totalCount,
  ] = await Promise.all([
    prisma.idea.count({ where: { status: IdeaStatus.SUBMITTED } }),
    prisma.idea.count({ where: { status: IdeaStatus.RESUBMITTED } }),
    prisma.idea.count({
      where: {
        status: {
          in: [
            IdeaStatus.ACCEPTED,
            IdeaStatus.SHOWCASE_PUBLISHED,
            IdeaStatus.CONVERTED_TO_PROJECT,
          ],
        },
      },
    }),
    prisma.idea.count({ where: { status: IdeaStatus.NEEDS_CHANGES } }),
    prisma.idea.count({ where: { status: IdeaStatus.REJECTED } }),
    prisma.idea.count(),
  ]);

  // Fetch list of ideas with filtering
  const whereClause: any = {};

  if (filter?.status && filter.status !== "ALL") {
    if (filter.status === "PENDING") {
      whereClause.status = {
        in: [IdeaStatus.SUBMITTED, IdeaStatus.UNDER_REVIEW, IdeaStatus.RESUBMITTED],
      };
    } else if (filter.status === "APPROVED") {
      whereClause.status = {
        in: [
          IdeaStatus.ACCEPTED,
          IdeaStatus.SHOWCASE_PUBLISHED,
          IdeaStatus.CONVERTED_TO_PROJECT,
        ],
      };
    } else if (filter.status === "NEEDS_IMPROVEMENT") {
      whereClause.status = IdeaStatus.NEEDS_CHANGES;
    } else if (filter.status === "REJECTED") {
      whereClause.status = IdeaStatus.REJECTED;
    }
  }

  if (filter?.search?.trim()) {
    const s = filter.search.trim();
    whereClause.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { domain: { contains: s, mode: "insensitive" } },
      { student: { name: { contains: s, mode: "insensitive" } } },
      { student: { uniqueId: { contains: s, mode: "insensitive" } } },
      { student: { email: { contains: s, mode: "insensitive" } } },
    ];
  }

  const ideas = await prisma.idea.findMany({
    where: whereClause,
    include: {
      student: {
        select: { id: true, name: true, uniqueId: true, email: true },
      },
      reviewHistory: {
        include: {
          admin: {
            select: { id: true, name: true, uniqueId: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      reviewedByAdmin: {
        select: { id: true, name: true, uniqueId: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return {
    stats: {
      pendingCount: pendingCount + resubmittedCount,
      freshPendingCount: pendingCount,
      resubmittedCount,
      approvedCount,
      needsImprovementCount,
      rejectedCount,
      totalCount,
    },
    ideas,
  };
}

/**
 * Retrieves full details of a specific idea for MSME Admin review.
 */
export async function getAdminIdeaDetails(ideaId: string) {
  await requireRole([UserRole.MSME_ADMIN]);

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          uniqueId: true,
          email: true,
          institutionDomain: true,
          createdAt: true,
        },
      },
      reviewHistory: {
        include: {
          admin: {
            select: { id: true, name: true, uniqueId: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      reviewedByAdmin: {
        select: { id: true, name: true, uniqueId: true },
      },
    },
  });

  if (!idea) {
    throw new Error("Idea proposal not found.");
  }

  return idea;
}

/**
 * Admin action to Approve, Request Improvement, or Reject a student idea.
 * Core Business Rule: ONLY MSME_ADMIN can call this action.
 * Enforces mandatory written reason for improvements and rejections.
 */
export async function reviewIdeaByAdmin(data: ReviewIdeaInput) {
  const admin = await requireRole([UserRole.MSME_ADMIN]);

  if (!data.ideaId) throw new Error("Idea ID is required.");
  const action = data.action;
  const feedback = data.feedback?.trim();

  // Validate action-specific requirements
  if (action === "REQUEST_IMPROVEMENT" && !feedback) {
    throw new Error(
      "Written feedback is mandatory when requesting idea improvements."
    );
  }

  if (action === "REJECT" && !feedback) {
    throw new Error("A clear rejection reason is mandatory when declining an idea.");
  }

  const existingIdea = await prisma.idea.findUnique({
    where: { id: data.ideaId },
  });

  if (!existingIdea) {
    throw new Error("Idea proposal not found.");
  }

  let targetStatus: IdeaStatus;
  let defaultFeedback = feedback || "";

  switch (action) {
    case "APPROVE":
      targetStatus = IdeaStatus.ACCEPTED;
      defaultFeedback =
        feedback ||
        "Approved by MSME Admin for incubation, faculty allocation, and industry showcase.";
      break;
    case "REQUEST_IMPROVEMENT":
      targetStatus = IdeaStatus.NEEDS_CHANGES;
      break;
    case "REJECT":
      targetStatus = IdeaStatus.REJECTED;
      break;
    default:
      throw new Error("Invalid review action.");
  }

  // Transaction-safe state update
  const updatedIdea = await prisma.$transaction(async (tx) => {
    // 1. Record the review entry in history
    await tx.ideaReview.create({
      data: {
        ideaId: existingIdea.id,
        adminId: admin.id,
        action: targetStatus,
        feedback: defaultFeedback,
        previousStatus: existingIdea.status,
      },
    });

    // 2. Update the Idea verification state
    return tx.idea.update({
      where: { id: existingIdea.id },
      data: {
        status: targetStatus,
        adminFeedback: defaultFeedback,
        reviewedByAdminId: admin.id,
        reviewedAt: new Date(),
        isShowcase: targetStatus === IdeaStatus.ACCEPTED,
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: { id: true, name: true, uniqueId: true, email: true },
        },
        reviewHistory: {
          include: {
            admin: {
              select: { id: true, name: true, uniqueId: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        reviewedByAdmin: {
          select: { id: true, name: true, uniqueId: true },
        },
      },
    });
  });

  revalidatePath("/dashboard/admin/idea-verification");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/student/submit-idea");
  revalidatePath("/dashboard/student/shared-projects");
  revalidatePath("/dashboard/student");

  return { success: true, idea: updatedIdea };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public / Discoverable Approved Ideas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns approved and showcase-ready ideas for student/faculty/industry review.
 * Strictly filters out pending, in-review, needs improvement, and rejected ideas.
 */
export async function getDiscoverableApprovedIdeas() {
  const approvedIdeas = await prisma.idea.findMany({
    where: {
      status: {
        in: [
          IdeaStatus.ACCEPTED,
          IdeaStatus.SHOWCASE_PUBLISHED,
          IdeaStatus.CONVERTED_TO_PROJECT,
        ],
      },
      isShowcase: true,
    },
    include: {
      student: {
        select: { id: true, name: true, uniqueId: true },
      },
      reviewedByAdmin: {
        select: { id: true, name: true, uniqueId: true },
      },
    },
    orderBy: { reviewedAt: "desc" },
  });

  return approvedIdeas;
}

