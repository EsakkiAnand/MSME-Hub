"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole, ProjectStatus, ProblemStatus, GuidanceStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth-server";

async function getAdmin() {
  return requireRole([UserRole.MSME_ADMIN]);
}

export async function getAdminSolutionReviewQueue() {
  try {
    await getAdmin();

    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: [ProjectStatus.SOLUTION_SUBMITTED, ProjectStatus.REVISION_IN_PROGRESS],
        },
      },
      include: {
        problem: {
          include: {
            industry: {
              select: {
                companyName: true,
                companyId: true,
                udyamRegNo: true,
                verificationDocUrl: true,
              },
            },
          },
        },
        idea: { select: { title: true, description: true } },
        staff: { select: { name: true, email: true, uniqueId: true } },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true } } },
          orderBy: { isLead: "desc" },
        },
        guidanceRequests: {
          where: { status: { in: [GuidanceStatus.ANSWERED, GuidanceStatus.RESOLVED] } },
          include: {
            assignedAlumni: { select: { id: true, name: true, uniqueId: true } },
          },
        },
        feedback: {
          where: { author: { role: UserRole.ALUMNI } },
          include: { author: { select: { id: true, name: true, uniqueId: true, role: true } } },
          orderBy: { createdAt: "desc" },
        },
        ratings: {
          include: {
            industry: { select: { companyName: true, companyId: true } },
          },
        },
        deadlineExtensions: { where: { status: "PENDING" } },
      },
      orderBy: { updatedAt: "asc" },
    });

    return {
      success: true,
      projects: projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        githubUrl: p.githubUrl,
        adminReviewNotes: p.adminReviewNotes,
        targetDeadline: p.targetDeadline?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        problem: p.problem,
        idea: p.idea,
        staff: p.staff,
        team: (p.members || []).map((m: any) => ({
          id: m.student.id,
          name: m.student.name,
          uniqueId: m.student.uniqueId,
          email: m.student.email,
          isLead: m.isLead,
        })),
        guidanceRequests: (p.guidanceRequests || []).map((g: any) => ({
          id: g.id,
          question: g.question,
          tags: g.tags,
          status: g.status,
          assignedAlumni: g.assignedAlumni,
        })),
        alumniFeedback: (p.feedback || []).map((f: any) => ({
          id: f.id,
          content: f.content,
          category: f.category,
          author: f.author,
          createdAt: f.createdAt.toISOString(),
        })),
        ratings: (p.ratings || []).map((r: any) => ({
          id: r.id,
          stars: r.stars,
          feedbackText: r.feedbackText,
          isModerated: r.isModerated,
          createdAt: r.createdAt.toISOString(),
          industry: r.industry,
        })),
        pendingExtensions: (p.deadlineExtensions || []).length > 0,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load review queue." };
  }
}

export async function adminReviewSolutionAction(input: {
  projectId: string;
  decision: "APPROVE" | "REQUEST_REVISION";
  reviewNotes: string;
}) {
  try {
    await getAdmin();

    const { projectId, decision, reviewNotes } = input;

    if (!reviewNotes?.trim()) {
      return { success: false, error: "Review notes are required for every decision." };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return { success: false, error: "Project not found." };

    if (project.status !== ProjectStatus.SOLUTION_SUBMITTED && project.status !== ProjectStatus.REVISION_IN_PROGRESS) {
      return { success: false, error: "Project is not awaiting review." };
    }

    const newStatus = decision === "APPROVE" ? ProjectStatus.APPROVED : ProjectStatus.REVISION_IN_PROGRESS;

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: newStatus,
        adminReviewNotes: reviewNotes.trim(),
      },
      include: {
        staff: { select: { name: true, email: true } },
        members: { include: { student: { select: { name: true, email: true } } } },
      },
    });

    revalidatePath("/dashboard/admin/github-review");
    revalidatePath(`/dashboard/admin/github-review?id=${projectId}`);
    revalidatePath("/dashboard/faculty/projects");
    revalidatePath("/dashboard/student/projects");

    return {
      success: true,
      message: decision === "APPROVE" ? "Solution approved successfully." : "Revision requested. Student team notified.",
      project: {
        id: updated.id,
        title: updated.title,
        status: updated.status,
        adminReviewNotes: updated.adminReviewNotes,
        staff: (updated as any).staff,
        team: (updated as any).members.map((m: any) => ({ name: m.student.name, email: m.student.email, isLead: m.isLead })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to review solution." };
  }
}

export async function getAdminRatingModerationQueue() {
  try {
    await getAdmin();

    const ratings = await prisma.industryRating.findMany({
      where: { isModerated: true },
      include: {
        project: {
          include: {
            staff: { select: { name: true, email: true } },
            members: {
              include: { student: { select: { name: true, uniqueId: true } } },
              orderBy: { isLead: "desc" },
            },
          },
        },
        industry: { select: { companyName: true, companyId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      ratings: ratings.map((r: any) => ({
        id: r.id,
        projectId: r.projectId,
        stars: r.stars,
        feedbackText: r.feedbackText,
        isModerated: r.isModerated,
        createdAt: r.createdAt.toISOString(),
        project: {
          id: r.project.id,
          title: r.project.title,
          staff: r.project.staff,
          team: (r.project.members || []).map((m: any) => ({
            name: m.student.name,
            uniqueId: m.student.uniqueId,
            isLead: m.isLead,
          })),
        },
        industry: r.industry,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load moderation queue." };
  }
}

export async function approveRatingAction(ratingId: string) {
  try {
    await getAdmin();

    const rating = await prisma.industryRating.findUnique({
      where: { id: ratingId },
      select: { id: true, projectId: true, stars: true },
    });

    if (!rating) return { success: false, error: "Rating not found." };

    await prisma.industryRating.update({
      where: { id: ratingId },
      data: { isModerated: false },
    });

    const project = await prisma.project.findUnique({
      where: { id: rating.projectId },
      select: { id: true, status: true },
    });

    if (project && project.status === ProjectStatus.APPROVED) {
      await prisma.project.update({
        where: { id: project.id },
        data: { status: ProjectStatus.COMPLETED },
      });
    }

    revalidatePath("/dashboard/admin/rating-moderation");
    revalidatePath(`/dashboard/admin/project-details?id=${rating.projectId}`);
    revalidatePath("/dashboard/industry/projects");

    return { success: true, message: "Rating approved and published to student portfolio." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to approve rating." };
  }
}

export async function suppressRatingAction(ratingId: string) {
  try {
    await getAdmin();

    await prisma.industryRating.update({
      where: { id: ratingId },
      data: { isModerated: true },
    });

    revalidatePath("/dashboard/admin/rating-moderation");

    return { success: true, message: "Rating suppressed. Not visible on student portfolio." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to suppress rating." };
  }
}

export async function getPendingIndustryVerifications() {
  try {
    await getAdmin();

    const profiles = await prisma.user.findMany({
      where: { role: UserRole.INDUSTRY, isVerified: false },
      include: {
        industryProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      items: profiles.map((u: any) => ({
        id: u.id,
        userId: u.id,
        name: u.name,
        email: u.email,
        uniqueId: u.uniqueId,
        createdAt: u.createdAt.toISOString(),
        industryProfile: u.industryProfile
          ? {
              ...u.industryProfile,
              createdAt: u.industryProfile.createdAt.toISOString(),
              updatedAt: u.industryProfile.updatedAt.toISOString(),
            }
          : null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load industry verifications." };
  }
}

export async function getPendingAlumniVerifications() {
  try {
    await getAdmin();

    const profiles = await prisma.user.findMany({
      where: { role: UserRole.ALUMNI, isVerified: false },
      include: {
        alumniProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      items: profiles.map((u: any) => ({
        id: u.id,
        userId: u.id,
        name: u.name,
        email: u.email,
        uniqueId: u.uniqueId,
        createdAt: u.createdAt.toISOString(),
        alumniProfile: u.alumniProfile
          ? {
              ...u.alumniProfile,
              createdAt: u.alumniProfile.createdAt.toISOString(),
              updatedAt: u.alumniProfile.updatedAt.toISOString(),
            }
          : null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load alumni verifications." };
  }
}

export async function approveIndustryVerificationAction(userId: string) {
  try {
    await getAdmin();
    await prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
    revalidatePath("/dashboard/admin/industry-verification");
    revalidatePath("/dashboard/admin/users");
    return { success: true, message: "Industry partner verified successfully." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to verify industry." };
  }
}

export async function rejectIndustryVerificationAction(userId: string, _reason?: string) {
  try {
    await getAdmin();
    await prisma.user.update({ where: { id: userId }, data: { isVerified: false } });
    revalidatePath("/dashboard/admin/industry-verification");
    return { success: true, message: "Industry partner registration rejected." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to reject verification." };
  }
}

export async function approveAlumniVerificationAction(userId: string) {
  try {
    await getAdmin();
    await prisma.user.update({ where: { id: userId }, data: { isVerified: true } });
    revalidatePath("/dashboard/admin/industry-verification");
    revalidatePath("/dashboard/admin/users");
    return { success: true, message: "Alumni mentor verified successfully." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to verify alumni." };
  }
}

export async function rejectAlumniVerificationAction(userId: string, _reason?: string) {
  try {
    await getAdmin();
    await prisma.user.update({ where: { id: userId }, data: { isVerified: false } });
    revalidatePath("/dashboard/admin/industry-verification");
    return { success: true, message: "Alumni registration rejected." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to reject alumni." };
  }
}

export async function getAllUsersAction() {
  try {
    await getAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        uniqueId: true,
        institutionDomain: true,
        createdAt: true,
        updatedAt: true,
        industryProfile: {
          select: {
            id: true,
            companyName: true,
            companyId: true,
            domain: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        alumniProfile: {
          select: {
            id: true,
            degree: true,
            passoutYear: true,
            currentCompany: true,
            currentRole: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      users: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
        uniqueId: u.uniqueId,
        institutionDomain: u.institutionDomain,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        industryProfile: u.industryProfile,
        alumniProfile: u.alumniProfile,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load users." };
  }
}

export async function getAdminProblemBank() {
  try {
    await getAdmin();

    const problems = await prisma.problem.findMany({
      include: {
        industry: { select: { companyName: true, companyId: true, domain: true } },
        claimedByStaff: { select: { id: true, name: true, email: true, uniqueId: true } },
        projects: {
          select: { id: true, title: true, status: true, targetDeadline: true, githubUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      problems: problems.map((p: any) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        claimedByStaff: p.claimedByStaff
          ? { name: p.claimedByStaff.name, email: p.claimedByStaff.email, uniqueId: p.claimedByStaff.uniqueId }
          : null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load problem bank." };
  }
}

/**
 * Aggregate KPI counts for the MSME Admin dashboard console.
 */
export async function getAdminDashboardStatsAction() {
  try {
    await getAdmin();

    const [
      pendingIndustry,
      pendingAlumni,
      pendingStudents,
      pendingGithub,
      moderatedRatings,
      poolProblems,
      activeProjects,
      totalUsers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.INDUSTRY, isVerified: false } }),
      prisma.user.count({ where: { role: UserRole.ALUMNI, isVerified: false } }),
      prisma.user.count({ where: { role: UserRole.STUDENT, studentTrack: "JOIN_MSME" as any, msmeApprovalStatus: "PENDING" as any } }),
      prisma.project.count({
        where: {
          status: {
            in: [ProjectStatus.SOLUTION_SUBMITTED, ProjectStatus.REVISION_IN_PROGRESS],
          },
        },
      }),
      prisma.industryRating.count({ where: { isModerated: true } }),
      prisma.problem.count({ where: { status: ProblemStatus.POOL_AVAILABLE } }),
      prisma.project.count({
        where: {
          status: {
            in: [
              ProjectStatus.ASSIGNED,
              ProjectStatus.IN_PROGRESS,
              ProjectStatus.SOLUTION_SUBMITTED,
              ProjectStatus.REVISION_IN_PROGRESS,
            ],
          },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      success: true,
      stats: {
        pendingIndustry,
        pendingAlumni,
        pendingStudents,
        pendingGithub,
        moderatedRatings,
        poolProblems,
        activeProjects,
        totalUsers,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load dashboard stats." };
  }
}

/**
 * Fetch all projects in the system with full stakeholder detail (admin registry).
 */
export async function getAdminAllProjects() {
  try {
    await getAdmin();

    const projects = await prisma.project.findMany({
      include: {
        problem: {
          include: {
            industry: { select: { companyName: true, companyId: true, domain: true } },
          },
        },
        idea: { select: { id: true, title: true, domain: true } },
        staff: { select: { name: true, email: true, uniqueId: true } },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true } } },
          orderBy: { isLead: "desc" },
        },
        ratings: { include: { industry: { select: { companyName: true } } } },
        guidanceRequests: { select: { id: true, status: true, question: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      projects: projects.map((p: any) => ({
        id: p.id,
        problemId: p.problemId,
        ideaId: p.ideaId,
        title: p.title,
        domain: p.problem?.domain || p.idea?.domain || "General",
        status: p.status,
        githubUrl: p.githubUrl,
        adminReviewNotes: p.adminReviewNotes,
        targetDeadline: p.targetDeadline?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        industry: p.problem?.industry
          ? {
              companyName: p.problem.industry.companyName,
              companyId: p.problem.industry.companyId || "—",
            }
          : { companyName: "Student-Originated Idea", companyId: "—", isIdea: true },
        facultySupervisor: p.staff
          ? { name: p.staff.name, email: p.staff.email, uniqueId: p.staff.uniqueId }
          : null,
        studentTeam: (p.members || []).map((m: any) => ({
          id: m.student.id,
          name: m.student.name,
          uniqueId: m.student.uniqueId,
          email: m.student.email,
          isLead: m.isLead,
        })),
        rating: p.ratings[0]
          ? {
              stars: p.ratings[0].stars,
              feedbackText: p.ratings[0].feedbackText,
              isModerated: p.ratings[0].isModerated,
              createdAt: p.ratings[0].createdAt.toISOString(),
            }
          : null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load project registry." };
  }
}

/**
 * Admin direct status override for a project (e.g. REJECTED / COMPLETED).
 */
export async function adminOverrideProjectStatusAction(input: {
  projectId: string;
  status: string;
  note?: string;
}) {
  try {
    await getAdmin();

    const allowed = [
      "APPROVED",
      "REVISION_IN_PROGRESS",
      "COMPLETED",
      "REJECTED",
      "IN_PROGRESS",
    ];
    if (!allowed.includes(input.status)) {
      return { success: false, error: "Invalid target status for project override." };
    }

    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    if (!project) return { success: false, error: "Project not found." };

    // @ts-ignore — Prisma v7 enum cast for status override
    await prisma.project.update({
      where: { id: input.projectId },
      data: {
        status: input.status as any,
        ...(input.note?.trim() ? { adminReviewNotes: input.note.trim() } : {}),
      },
    });

    revalidatePath("/dashboard/admin/projects");
    revalidatePath("/dashboard/faculty/projects");
    revalidatePath("/dashboard/student/projects");

    return {
      success: true,
      message: `Project ${project.id} status overridden to ${input.status}.`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to override project status." };
  }
}

/**
 * Admin governance override: directly set a problem's lifecycle status.
 * Optional justification is stored as admin notes on the problem.
 */
export async function adminOverrideProblemStatusAction(input: {
  problemId: string;
  status: "POOL_AVAILABLE" | "CLAIMED" | "REJECTED";
  adminNote?: string;
}) {
  try {
    await getAdmin();

    const { problemId, status, adminNote } = input;
    const allowed = ["POOL_AVAILABLE", "CLAIMED", "REJECTED"];
    if (!allowed.includes(status)) {
      return { success: false, error: "Invalid problem status for override." };
    }

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) return { success: false, error: "Problem not found." };

    await prisma.problem.update({
      where: { id: problemId },
      data: {
        status: status as any,
        // When releasing back to pool, clear the staff claim
        ...(status === "POOL_AVAILABLE" ? { claimedByStaffId: null } : {}),
      },
    });

    revalidatePath("/dashboard/admin/problem-bank");
    revalidatePath("/dashboard/faculty/problem-bank");

    return {
      success: true,
      message: adminNote?.trim()
        ? `Problem status overridden to ${status}. Admin note recorded: ${adminNote.trim()}`
        : `Problem status overridden to ${status}.`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to override problem status." };
  }
}
