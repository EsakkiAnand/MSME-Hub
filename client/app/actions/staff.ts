"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProblemStatus, ProjectStatus, IdeaStatus, ProjectMember } from "@prisma/client";
import { requireRole } from "@/lib/auth-server";
import { problemStateMachine } from "@/lib/state-machines/machines/problem-machine";
import { extensionStateMachine } from "@/lib/state-machines/machines/extension-machine";
import { assertTransition } from "@/lib/state-machines";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function getStaff() {
  const user = await requireRole([UserRole.STAFF]);
  return user;
}

/**
 * Count how many ACTIVE projects a student is currently assigned to.
 * Active = ASSIGNED | IN_PROGRESS | SOLUTION_SUBMITTED | REVISION_IN_PROGRESS
 */
async function getStudentActiveProjectCount(studentId: string): Promise<number> {
  return prisma.projectMember.count({
    where: {
      studentId,
      project: {
        status: {
          in: [
            ProjectStatus.ASSIGNED,
            ProjectStatus.IN_PROGRESS,
            ProjectStatus.SOLUTION_SUBMITTED,
            ProjectStatus.REVISION_IN_PROGRESS,
          ],
        },
      },
    },
  });
}

/**
 * Validate that each student in the list has < 2 active projects.
 * Returns { valid: boolean; blocked: string[] } where blocked are student IDs over the cap.
 */
async function validateConcurrencyCap(studentIds: string[]): Promise<{
  valid: boolean;
  blocked: { studentId: string; activeCount: number }[];
}> {
  const counts = await prisma.projectMember.findMany({
    where: {
      studentId: { in: studentIds },
      project: {
        status: {
          in: [
            ProjectStatus.ASSIGNED,
            ProjectStatus.IN_PROGRESS,
            ProjectStatus.SOLUTION_SUBMITTED,
            ProjectStatus.REVISION_IN_PROGRESS,
          ],
        },
      },
    },
    select: { studentId: true },
  });

  const activeCounts = new Map<string, number>();
  for (const m of counts) {
    activeCounts.set(m.studentId, (activeCounts.get(m.studentId) || 0) + 1);
  }

  const blocked = studentIds
    .filter((id) => (activeCounts.get(id) || 0) >= 2)
    .map((id) => ({ studentId: id, activeCount: activeCounts.get(id) || 0 }));

  return { valid: blocked.length === 0, blocked };
}

// ─────────────────────────────────────────────────────────────────────────────
// Problem Pool (Staff View & Claim)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Browse the problem pool — all POOL_AVAILABLE problems, plus problems
 * claimed by the current staff member.
 */
export async function getStaffProblemPool() {
  try {
    await getStaff();

    const [available, claimed] = await Promise.all([
      prisma.problem.findMany({
        where: { status: ProblemStatus.POOL_AVAILABLE },
        include: { industry: { select: { companyName: true, domain: true, companyId: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.problem.findMany({
        where: { claimedByStaffId: (await getStaff()).id },
        include: { industry: { select: { companyName: true, domain: true, companyId: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      available: available.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        domain: p.domain,
        constraints: p.constraints,
        expectedDeliverables: p.expectedDeliverables,
        companyName: p.industry.companyName,
        companyId: p.industry.companyId,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      })),
      claimed: claimed.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        domain: p.domain,
        constraints: p.constraints,
        expectedDeliverables: p.expectedDeliverables,
        companyName: p.industry.companyName,
        companyId: p.industry.companyId,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load problem pool." };
  }
}

/**
 * Staff claims a problem from the domain pool.
 */
export async function claimProblemAction(problemId: string) {
  try {
    const staff = await getStaff();

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) return { success: false, error: "Problem not found." };
    if (problem.status !== ProblemStatus.POOL_AVAILABLE) {
      return { success: false, error: "Problem is no longer available in the pool." };
    }

    // State machine check
    assertTransition(
      problemStateMachine,
      problem.status,
      ProblemStatus.CLAIMED,
      UserRole.STAFF
    );

    await prisma.problem.update({
      where: { id: problemId },
      data: { status: ProblemStatus.CLAIMED, claimedByStaffId: staff.id },
    });

    revalidatePath("/dashboard/faculty/problem-bank");
    return { success: true, message: "Problem claimed successfully." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to claim problem." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Management
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Staff creates a project from a claimed problem.
 */
export async function createProjectAction(input: {
  problemId: string;
  title: string;
  targetDeadline: string;
  studentIds: string[];
  leadStudentId: string;
}) {
  try {
    const staff = await getStaff();

    const { problemId, title, targetDeadline, studentIds, leadStudentId } = input;

    if (!studentIds.includes(leadStudentId)) {
      return { success: false, error: "Team Lead must be one of the assigned students." };
    }

    // Concurrency cap enforcement
    const capResult = await validateConcurrencyCap(studentIds);
    if (!capResult.valid) {
      const names = await prisma.user.findMany({
        where: { id: { in: capResult.blocked.map((b) => b.studentId) } },
        select: { name: true },
      });
      const overCap = names.map((n, i) => `${n.name} (${capResult.blocked[i].activeCount} active projects)`).join(", ");
      return { success: false, error: `Concurrency cap exceeded: ${overCap}. Max 2 active projects per student.` };
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { industry: true },
    });

    if (!problem || problem.claimedByStaffId !== staff.id) {
      return { success: false, error: "Problem not found or not claimed by you." };
    }

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          problemId,
          title: title.trim() || problem.title,
          status: ProjectStatus.ASSIGNED,
          staffId: staff.id,
          targetDeadline: new Date(targetDeadline),
        },
        include: { staff: true },
      });

      // Create project members
      for (const sid of studentIds) {
        await tx.projectMember.create({
          data: {
            projectId: created.id,
            studentId: sid,
            isLead: sid === leadStudentId,
          },
        });
      }

      return created;
    });

    revalidatePath("/dashboard/faculty/projects");
    revalidatePath("/dashboard/student");

    return { success: true, projectId: project.id };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create project." };
  }
}

/**
 * Get all projects supervised by the current staff member.
 */
export async function getStaffProjects() {
  try {
    const staff = await getStaff();

    const projects = await prisma.project.findMany({
      where: { staffId: staff.id },
      include: {
        problem: { include: { industry: { select: { companyName: true, companyId: true, domain: true } } } },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true, role: true } } },
          orderBy: { isLead: "desc" },
        },
        ratings: true,
        deadlineExtensions: { orderBy: { createdAt: "desc" } },
        guidanceRequests: { select: { id: true, status: true, tags: true, question: true, createdAt: true } },
        feedback: { include: { author: { select: { name: true, role: true } } }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      projects: projects.map((p) => ({
        id: p.id,
        problemId: p.problemId,
        ideaId: p.ideaId,
        title: p.title,
        status: p.status,
        targetDeadline: p.targetDeadline?.toISOString() || null,
        githubUrl: p.githubUrl,
        adminReviewNotes: p.adminReviewNotes,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        problem: p.problem ? {
          title: p.problem.title,
          description: p.problem.description,
          domain: p.problem.domain,
          industry: p.problem.industry,
        } : null,
        members: p.members.map((m) => ({
          id: m.student.id,
          name: m.student.name,
          uniqueId: m.student.uniqueId,
          email: m.student.email,
          role: m.student.role,
          isLead: m.isLead,
          joinedAt: m.joinedAt.toISOString(),
        })),
        ratings: p.ratings.map((r) => ({
          id: r.id,
          stars: r.stars,
          feedbackText: r.feedbackText,
          isModerated: r.isModerated,
          createdAt: r.createdAt.toISOString(),
        })),
        deadlineExtensions: p.deadlineExtensions.map((d) => ({
          id: d.id,
          requestedDate: d.requestedDate.toISOString(),
          reason: d.reason,
          status: d.status,
          createdAt: d.createdAt.toISOString(),
          reviewedAt: d.reviewedAt?.toISOString() || null,
        })),
        guidanceRequests: p.guidanceRequests,
        feedback: p.feedback.map((f) => ({
          id: f.id,
          category: f.category,
          content: f.content,
          createdAt: f.createdAt.toISOString(),
          author: f.author,
        })),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load projects." };
  }
}

/**
 * Get a single project detail for staff.
 */
export async function getStaffProjectDetail(projectId: string) {
  try {
    await getStaff();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        problem: { include: { industry: true } },
        idea: true,
        staff: { select: { id: true, name: true, email: true, uniqueId: true } },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true, role: true } } },
          orderBy: { isLead: "desc" },
        },
        ratings: { include: { industry: { select: { companyName: true } } } },
        deadlineExtensions: { orderBy: { createdAt: "desc" } },
        guidanceRequests: {
          include: {
            requestedByStudent: { select: { name: true, uniqueId: true } },
            assignedAlumni: { select: { name: true, uniqueId: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        feedback: {
          include: { author: { select: { name: true, role: true, uniqueId: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) return { success: false, error: "Project not found." };

    return {
      success: true,
      project: {
        ...project,
        targetDeadline: project.targetDeadline?.toISOString() || null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        members: project.members.map((m) => ({
          ...m,
          joinedAt: m.joinedAt.toISOString(),
        })),
        ratings: project.ratings.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
        deadlineExtensions: project.deadlineExtensions.map((d) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
          reviewedAt: d.reviewedAt?.toISOString() || null,
        })),
        guidanceRequests: project.guidanceRequests.map((g) => ({
          ...g,
          createdAt: g.createdAt.toISOString(),
          updatedAt: g.updatedAt.toISOString(),
        })),
        feedback: project.feedback.map((f) => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load project detail." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mid-Flight Roster Management
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Add a student to a project (staff only). Enforces concurrency cap.
 */
export async function addProjectMemberAction(projectId: string, studentId: string) {
  try {
    await getStaff();

    // Check cap
    const cap = await getStudentActiveProjectCount(studentId);
    if (cap >= 2) {
      return { success: false, error: "Student already has 2 active projects (concurrency cap)." };
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId } },
    });
    if (existing) {
      return { success: false, error: "Student is already a member of this project." };
    }

    const member = await prisma.projectMember.create({
      data: { projectId, studentId, isLead: false },
      include: { student: true },
    });

    revalidatePath(`/dashboard/faculty/project-details?id=${projectId}`);
    return { success: true, member: { id: member.id, studentId, isLead: member.isLead } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to add member." };
  }
}

/**
 * Remove a student from a project. Cannot remove the current lead without designating a new one.
 */
export async function removeProjectMemberAction(projectId: string, studentId: string, newLeadId?: string) {
  try {
    await getStaff();

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId } },
    });
    if (!membership) return { success: false, error: "Student is not a member of this project." };

    // If removing the lead, ensure a new lead is set
    if (membership.isLead && !newLeadId) {
      return { success: false, error: "Cannot remove the Team Lead without designating a new one. Provide newLeadId." };
    }

    await prisma.$transaction(async (tx) => {
      // If we need to change the lead
      if (membership.isLead && newLeadId) {
        await tx.projectMember.updateMany({
          where: { projectId, isLead: true },
          data: { isLead: false },
        });
        await tx.projectMember.update({
          where: { projectId_studentId: { projectId, studentId: newLeadId } },
          data: { isLead: true },
        });
      }

      await tx.projectMember.delete({
        where: { projectId_studentId: { projectId, studentId } },
      });
    });

    revalidatePath(`/dashboard/faculty/project-details?id=${projectId}`);
    return { success: true, message: "Member removed successfully." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to remove member." };
  }
}

/**
 * Designate a new Team Lead for a project. Only one lead allowed.
 */
export async function setProjectLeadAction(projectId: string, studentId: string) {
  try {
    await getStaff();

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId } },
    });
    if (!membership) {
      return { success: false, error: "Student is not a member of this project." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.projectMember.updateMany({
        where: { projectId, isLead: true },
        data: { isLead: false },
      });
      await tx.projectMember.update({
        where: { projectId_studentId: { projectId, studentId } },
        data: { isLead: true },
      });
    });

    revalidatePath(`/dashboard/faculty/project-details?id=${projectId}`);
    return { success: true, message: "Team Lead updated successfully." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to set Team Lead." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Deadline Extension Requests (Staff Approval)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Staff approves or rejects a deadline extension request.
 */
export async function reviewDeadlineExtensionAction(extensionId: string, decision: "APPROVED" | "REJECTED", newDeadline?: string) {
  try {
    await getStaff();

    const ext = await prisma.deadlineExtension.findUnique({
      where: { id: extensionId },
      include: { project: true },
    });

    if (!ext) return { success: false, error: "Extension request not found." };
    if (ext.project.staffId !== (await getStaff()).id) {
      return { success: false, error: "You do not supervise this project." };
    }

    // State machine check
    assertTransition(
      extensionStateMachine,
      ext.status as any,
      decision as any,
      UserRole.STAFF
    );

    const updateData: any = {
      status: decision,
      reviewedAt: new Date(),
    };

    if (decision === "APPROVED" && newDeadline) {
      updateData.project = { update: { targetDeadline: new Date(newDeadline) } };
    }

    const updated = await prisma.deadlineExtension.update({
      where: { id: extensionId },
      data: updateData,
    });

    revalidatePath(`/dashboard/faculty/project-details?id=${ext.projectId}`);
    revalidatePath("/dashboard/faculty/projects");

    return {
      success: true,
      message: decision === "APPROVED" ? "Deadline extension approved." : "Deadline extension rejected.",
      extension: {
        ...updated,
        reviewedAt: updated.reviewedAt ? updated.reviewedAt.toISOString() : null,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to review extension." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Idea Review (Staff / Admin)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Staff or Admin reviews a student idea: ACCEPT, REJECT, or REQUEST_IMPROVEMENTS.
 * Note: Per PRD, MSME Admin also has authority to review ideas (RBAC matrix).
 */
export async function reviewStudentIdeaAction(input: {
  ideaId: string;
  action: "ACCEPT" | "REJECT" | "REQUEST_IMPROVEMENTS";
  feedback?: string;
}) {
  try {
    const user = await requireRole([UserRole.STAFF, UserRole.MSME_ADMIN]);

    const { ideaId, action, feedback } = input;

    if (!ideaId) throw new Error("Idea ID is required.");
    const fb = feedback?.trim();

    if ((action === "REJECT" || action === "REQUEST_IMPROVEMENTS") && !fb) {
      throw new Error("Feedback is required when rejecting or requesting improvements.");
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });
    if (!idea) return { success: false, error: "Idea not found." };

    let targetStatus: IdeaStatus;
    switch (action) {
      case "ACCEPT":
        targetStatus = IdeaStatus.ACCEPTED;
        break;
      case "REJECT":
        targetStatus = IdeaStatus.REJECTED;
        break;
      case "REQUEST_IMPROVEMENTS":
        targetStatus = IdeaStatus.NEEDS_CHANGES;
        break;
    }

    const updated = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        status: targetStatus,
        staffComments: fb || idea.staffComments,
        adminFeedback: action === "ACCEPT" ? (fb || "Accepted for incubation.") : idea.adminFeedback,
        reviewedAt: new Date(),
        isShowcase: targetStatus === IdeaStatus.ACCEPTED,
      },
      include: {
        student: { select: { id: true, name: true, uniqueId: true, email: true } },
      },
    });

    revalidatePath("/dashboard/faculty/idea-submissions");
    revalidatePath("/dashboard/admin/idea-verification");
    revalidatePath("/dashboard/student/submit-idea");

    return { success: true, idea: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to review idea." };
  }
}

/**
 * Convert an accepted idea to a formal project (staff action).
 * Preserves the originating student as Team Lead.
 */
export async function convertAcceptedIdeaToProjectAction(ideaId: string, input: {
  title: string;
  targetDeadline: string;
  studentIds: string[];
}) {
  try {
    const staff = await getStaff();

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) return { success: false, error: "Idea not found." };
    if (idea.status !== IdeaStatus.ACCEPTED && idea.status !== IdeaStatus.SHOWCASE_PUBLISHED) {
      return { success: false, error: "Idea must be accepted before converting to project." };
    }

    const allIds = [idea.studentId, ...input.studentIds.filter((id) => id !== idea.studentId)];
    const capResult = await validateConcurrencyCap(allIds);
    if (!capResult.valid) {
      return { success: false, error: "Concurrency cap exceeded for one or more students." };
    }

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ideaId: idea.id,
          title: input.title.trim() || idea.title,
          status: ProjectStatus.ASSIGNED,
          staffId: staff.id,
          targetDeadline: new Date(input.targetDeadline),
        },
      });

      // Originating student is always Team Lead
      await tx.projectMember.create({
        data: { projectId: created.id, studentId: idea.studentId, isLead: true },
      });

      for (const sid of input.studentIds) {
        if (sid === idea.studentId) continue;
        await tx.projectMember.create({
          data: { projectId: created.id, studentId: sid, isLead: false },
        });
      }

      // Mark idea as converted
      await tx.idea.update({
        where: { id: ideaId },
        data: { status: IdeaStatus.CONVERTED_TO_PROJECT },
      });

      return created;
    });

    revalidatePath("/dashboard/faculty/projects");
    revalidatePath("/dashboard/student");

    return { success: true, projectId: project.id };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to convert idea to project." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Staff Idea Review Queue
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all student ideas awaiting staff/admin review (not final states).
 */
export async function getStaffIdeaQueue() {
  try {
    await getStaff();

    const ideas = await prisma.idea.findMany({
      where: {
        status: {
          in: [IdeaStatus.SUBMITTED, IdeaStatus.UNDER_REVIEW, IdeaStatus.RESUBMITTED, IdeaStatus.NEEDS_CHANGES],
        },
      },
      include: {
        student: { select: { id: true, name: true, uniqueId: true, email: true, institutionDomain: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      ideas: ideas.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        reviewedAt: i.reviewedAt?.toISOString() || null,
        resubmittedAt: i.resubmittedAt?.toISOString() || null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load idea queue." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Staff Project Feedback (Milestone Evaluations)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Staff logs a formative feedback entry on a project they supervise.
 * Rubric scores are recorded as structured JSON within the feedback content.
 */
export async function submitStaffProjectFeedbackAction(input: {
  projectId: string;
  category: "ARCHITECTURE" | "INDUSTRY_RELEVANCE" | "SECURITY_QUALITY" | "GENERAL";
  content: string;
  rubric?: {
    architecture: number;
    execution: number;
    msmeFit: number;
    timeliness: number;
  };
}) {
  try {
    const staff = await getStaff();

    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
      select: { id: true, staffId: true, title: true },
    });

    if (!project) return { success: false, error: "Project not found." };
    if (project.staffId !== staff.id) {
      return { success: false, error: "You do not supervise this project." };
    }

    let fullContent = input.content.trim();
    if (input.rubric) {
      const avg = (
        (input.rubric.architecture + input.rubric.execution + input.rubric.msmeFit + input.rubric.timeliness) / 4
      ).toFixed(1);
      fullContent = `Milestone rubric: Architecture ${input.rubric.architecture}/5 · Execution ${input.rubric.execution}/5 · MSME Fit ${input.rubric.msmeFit}/5 · Timeliness ${input.rubric.timeliness}/5 (avg ${avg}).\n\n${fullContent}`;
    }

    const feedback = await prisma.feedback.create({
      data: {
        projectId: input.projectId,
        authorId: staff.id,
        category: input.category,
        content: fullContent,
      },
    });

    revalidatePath(`/dashboard/faculty/feedback`);
    revalidatePath(`/dashboard/faculty/project-details?id=${input.projectId}`);

    return {
      success: true,
      message: `Evaluation recorded for ${project.title}.`,
      feedback: {
        id: feedback.id,
        createdAt: feedback.createdAt.toISOString(),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit feedback." };
  }
}

/**
 * Fetch the feedback log for a project (staff viewing their supervised project).
 */
export async function getProjectFeedbackAction(projectId: string) {
  try {
    const staff = await getStaff();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { staffId: true },
    });

    if (!project || project.staffId !== staff.id) {
      return { success: false, error: "Project not found or not supervised by you." };
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { projectId },
      include: { author: { select: { name: true, role: true, uniqueId: true } } },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      feedbacks: feedbacks.map((f) => ({
        id: f.id,
        content: f.content,
        category: f.category,
        createdAt: f.createdAt.toISOString(),
        author: f.author,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load feedback." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Institutional Benchmark / Shared Reference Repositories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch cross-department benchmark projects: approved/completed projects
 * (by any staff) that have a public GitHub deliverable.
 * Shared as reference architectures for peer review across faculties.
 */
export async function getSharedReferenceProjectsAction() {
  try {
    const staff = await getStaff();

    const projects = await prisma.project.findMany({
      where: {
        status: { in: [ProjectStatus.APPROVED, ProjectStatus.COMPLETED] },
        githubUrl: { not: null },
      },
      include: {
        staff: { select: { id: true, name: true } },
        problem: {
          select: {
            domain: true,
            industry: { select: { companyName: true } },
          },
        },
        idea: { select: { domain: true } },
        members: {
          include: { student: { select: { name: true, uniqueId: true } } },
          orderBy: { isLead: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return {
      success: true,
      projects: projects.map((p) => ({
        id: p.id,
        name: p.title,
        status: p.status,
        githubUrl: p.githubUrl,
        sharedBy: p.staff.name === staff.name ? "You" : p.staff.name,
        sharedOn: p.updatedAt.toISOString(),
        domain: p.problem?.domain || p.idea?.domain || "General Engineering",
        team: p.members.map((m) => m.student.name),
        note: p.adminReviewNotes ||
          "Shared by faculty mentor as a reference architecture for cross-departmental technical benchmarking and peer review.",
        industry: p.problem?.industry?.companyName || "Student-Originated Idea",
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load shared reference projects." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Directory (for team assignment picker)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all verified students with their active project counts for staff assignment.
 */
export async function getStudentDirectory() {
  try {
    const students = await prisma.user.findMany({
      where: { role: UserRole.STUDENT, isVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        uniqueId: true,
        institutionDomain: true,
        studentTrack: true,
        msmeApprovalStatus: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });

    // Enrich with active project counts
    const enriched = await Promise.all(
      students.map(async (s) => ({
        ...s,
        activeProjectCount: await getStudentActiveProjectCount(s.id),
      }))
    );

    return {
      success: true,
      students: enriched.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load student directory." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Faculty Profile (Live)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load the authenticated staff member's profile.
 */
export async function getFacultyProfileAction() {
  try {
    const authed = await getStaff();
    // Fetch full profile from DB (not all fields are in AuthenticatedUser)
    const fullUser = await prisma.user.findUnique({
      where: { id: authed.id },
      select: {
        id: true,
        name: true,
        email: true,
        uniqueId: true,
        image: true,
        supervisedProjects: { select: { id: true } },
      },
    });

    if (!fullUser) return { success: false, error: "User not found." };

    return {
      success: true,
      faculty: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        uniqueId: fullUser.uniqueId,
        image: fullUser.image,
        supervisedProjectsCount: fullUser.supervisedProjects.length,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load faculty profile." };
  }
}

/**
 * Update the authenticated staff member's contact/office details.
 */
export async function updateFacultyProfileAction(input: {
  phone?: string;
  cabin?: string;
  officeHours?: string;
  researchDomains?: string;
}) {
  try {
    const authed = await getStaff();
    const updated = await prisma.user.update({
      where: { id: authed.id },
      data: input,
    });

    revalidatePath("/dashboard/faculty/profile");
    revalidatePath("/dashboard/faculty");

    return {
      success: true,
      message: "Faculty profile updated successfully.",
      faculty: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: (updated as any).phone,
        cabin: (updated as any).cabin,
        officeHours: (updated as any).officeHours,
        researchDomains: (updated as any).researchDomains,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update profile." };
  }
}
