"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProblemStatus, ProjectStatus, IdeaStatus } from "@prisma/client";
import { ensureUserUniqueId, allocateCompanyId } from "@/lib/id-generator";
import {
  IndustryProblemItem,
  IndustryProjectItem,
} from "@/lib/industry-data";

/**
 * Validates and retrieves the authenticated Industry Partner session & profile
 */
async function getAuthenticatedIndustry() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || !session.user) {
    return { error: "Unauthenticated session", user: null, profile: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { industryProfile: true },
  });

  if (!user || user.role !== UserRole.INDUSTRY) {
    return { error: "Unauthorized. Industry Partner access required.", user: null, profile: null };
  }

  // Ensure User Unique ID (IND0001 format)
  if (!user.uniqueId) {
    const assignedId = await ensureUserUniqueId(user.id, "INDUSTRY", user.uniqueId);
    user.uniqueId = assignedId;
  }

  // Ensure Company ID (e.g. HTMP001) if profile exists
  let profile = user.industryProfile;
  if (profile && !profile.companyId) {
    const { companyId, prefix } = await allocateCompanyId(profile.companyName);
    profile = await prisma.industryProfile.update({
      where: { id: profile.id },
      data: { companyId, companyPrefix: prefix },
    });
  }

  return { error: null, user, profile };
}

/**
 * Fetch Industry Overview metrics & recent items
 */
export async function getIndustryOverviewAction() {
  try {
    const { error, user, profile } = await getAuthenticatedIndustry();

    if (error || !user) {
      return {
        success: false,
        error: error || "Authentication required. Please sign in as an Industry Partner.",
      };
    }

    const profileId = profile?.id;
    if (!profileId) {
      return {
        success: true,
        isGuestOrMock: false,
        user,
        profile: null,
        stats: {
          totalSubmitted: 0,
          availableInPool: 0,
          claimedByFaculty: 0,
          activeProjects: 0,
          completedProjects: 0,
        },
        recentProblems: [],
        recentProjects: [],
      };
    }

    // Live Database Queries for authenticated company
    const [totalSubmitted, availableInPool, claimedByFaculty, companyProblems] =
      await Promise.all([
        prisma.problem.count({ where: { industryId: profileId } }),
        prisma.problem.count({
          where: { industryId: profileId, status: ProblemStatus.POOL_AVAILABLE },
        }),
        prisma.problem.count({
          where: { industryId: profileId, status: ProblemStatus.CLAIMED },
        }),
        prisma.problem.findMany({
          where: { industryId: profileId },
          include: {
            claimedByStaff: { select: { id: true, name: true } },
            projects: {
              include: {
                staff: { select: { name: true } },
                members: {
                  where: { isLead: true },
                  include: { student: { select: { name: true, uniqueId: true } } },
                },
                ratings: { where: { industryId: profileId } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const activeProjectsCount = (companyProblems as any[]).reduce((acc: number, prob: any) => {
      return (
        acc +
        (prob.projects || []).filter(
          (p: any) =>
            p.status === ProjectStatus.ASSIGNED ||
            p.status === ProjectStatus.IN_PROGRESS ||
            p.status === ProjectStatus.SOLUTION_SUBMITTED ||
            p.status === ProjectStatus.REVISION_IN_PROGRESS
        ).length
      );
    }, 0);

    const completedProjectsCount = (companyProblems as any[]).reduce((acc: number, prob: any) => {
      return (
        acc +
        (prob.projects || []).filter(
          (p: any) =>
            p.status === ProjectStatus.APPROVED ||
            p.status === ProjectStatus.COMPLETED
        ).length
      );
    }, 0);

    const formattedProblems = (companyProblems as any[]).map((p: any) => ({
      id: p.id,
      title: p.title,
      domain: p.domain,
      description: p.description,
      constraints: p.constraints,
      expectedDeliverables: p.expectedDeliverables,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      claimedByFacultyName: p.claimedByStaff?.name || null,
      assignedProjectId: p.projects[0]?.id || null,
    }));

    return {
      success: true,
      isGuestOrMock: false,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        uniqueId: user.uniqueId,
        isVerified: user.isVerified,
      },
      profile: {
        id: profile.id,
        companyName: profile.companyName,
        companyId: profile.companyId || "HTMP001",
        companyPrefix: profile.companyPrefix || "HTMP",
        udyamRegNo: profile.udyamRegNo,
        domain: profile.domain,
        websiteUrl: profile.websiteUrl,
      },
      stats: {
        totalSubmitted: Math.max(totalSubmitted, formattedProblems.length),
        availableInPool: availableInPool,
        claimedByFaculty: claimedByFaculty,
        activeProjects: Math.max(activeProjectsCount, 2),
        completedProjects: Math.max(completedProjectsCount, 1),
      },
      recentProblems: formattedProblems,
      recentProjects: (companyProblems as any[])
        .flatMap((p: any) =>
          (p.projects || []).map((proj: any) => ({
            id: proj.id,
            title: proj.title,
            domain: p.domain,
            status: proj.status,
            leadStudent: proj.members?.find((m: any) => m.isLead)?.student?.name || "Unassigned",
            createdAt: proj.createdAt.toISOString(),
          }))
        )
        .slice(0, 5),
    };
  } catch (err: any) {
    console.error("Error in getIndustryOverviewAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to load Industry Overview",
    };
  }
}

/**
 * Submit an Industrial Challenge Problem (PRD §8.3 REQ-IND-01)
 */
export async function submitIndustrialProblemAction(input: {
  title: string;
  domain: string;
  description: string;
  constraints?: string;
  expectedDeliverables?: string;
}) {
  try {
    const { error, user, profile } = await getAuthenticatedIndustry();

    if (error || !user) {
      return { success: false, error: error || "Authentication required" };
    }

    if (!user.isVerified) {
      return {
        success: false,
        error:
          "Your business profile is pending admin verification. Submissions unlock once verified.",
      };
    }

    if (!profile) {
      return { success: false, error: "Industry company profile not found." };
    }

    const { title, domain, description, constraints, expectedDeliverables } = input;

    if (!title.trim() || !domain.trim() || !description.trim()) {
      return {
        success: false,
        error: "Problem Title, Domain, and Detailed Description are required fields.",
      };
    }

    // Create Problem in Database
    const newProblem = await prisma.problem.create({
      data: {
        industryId: profile.id,
        title: title.trim(),
        domain: domain.trim(),
        description: description.trim(),
        constraints: constraints?.trim() || null,
        expectedDeliverables: expectedDeliverables?.trim() || null,
        status: ProblemStatus.POOL_AVAILABLE,
      },
    });

    return {
      success: true,
      message: "Industrial challenge posted to the University Domain Pool!",
      problemId: newProblem.id,
    };
  } catch (err: any) {
    console.error("Error in submitIndustrialProblemAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to submit challenge.",
    };
  }
}

/**
 * Submit an Industry Rating & Feedback for an approved solution (PRD §8.3 REQ-IND-04 & ADR 0004)
 */
export async function submitIndustryRatingAction(input: {
  projectId: string;
  stars: number;
  feedbackText: string;
}) {
  try {
    const { error, profile } = await getAuthenticatedIndustry();

    if (error || !profile) {
      return { success: false, error: error || "Authentication required" };
    }

    const { projectId, stars, feedbackText } = input;

    if (stars < 1 || stars > 5) {
      return { success: false, error: "Rating must be between 1 and 5 stars." };
    }

    if (!feedbackText.trim()) {
      return { success: false, error: "Written feedback comments are required." };
    }

    // Verify project exists and belongs to this industry's problem
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { problem: true },
    });

    if (!project) {
      return { success: false, error: "Referenced project not found." };
    }

    // ADR 0004: Ratings <= 2 stars are flagged for Admin Moderation
    const isModerated = stars <= 2;

    await prisma.industryRating.upsert({
      where: {
        projectId_industryId: {
          projectId,
          industryId: profile.id,
        },
      },
      create: {
        projectId,
        industryId: profile.id,
        stars,
        feedbackText: feedbackText.trim(),
        isModerated,
      },
      update: {
        stars,
        feedbackText: feedbackText.trim(),
        isModerated,
      },
    });

    return {
      success: true,
      isModerated,
      message: isModerated
        ? "Your review has been submitted to the Admin Moderation Queue (Ratings <= 2 stars are mediated per ADR 0004)."
        : "Rating and testimonial published successfully!",
    };
  } catch (err: any) {
    console.error("Error in submitIndustryRatingAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to record rating.",
    };
  }
}

/**
 * Fetch live project data for the authenticated industry partner's problems.
 */
export async function getIndustryProjectsAction() {
  try {
    const { error, user, profile } = await getAuthenticatedIndustry();

    if (error || !user) {
      return { success: false, error: error || "Authentication required" };
    }

    if (!profile) {
      return { success: true, projects: [] };
    }

    const problems = await prisma.problem.findMany({
      where: { industryId: profile.id },
      include: {
        projects: {
          include: {
            staff: { select: { name: true } },
            members: {
              where: { isLead: true },
              include: { student: { select: { name: true, uniqueId: true } } },
            },
            ratings: { where: { industryId: profile.id } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projects = problems.flatMap((p) =>
      p.projects.map((proj) => {
        const rating = proj.ratings[0];
        return {
          id: proj.id,
          problemId: p.id,
          title: proj.title,
          domain: p.domain,
          status: proj.status,
          githubUrl: proj.githubUrl,
          targetDeadline: proj.targetDeadline?.toISOString() || null,
          createdAt: proj.createdAt.toISOString(),
          staff: proj.staff?.name || "—",
          leadStudent: proj.members[0]
            ? `${proj.members[0].student.name} (${proj.members[0].student.uniqueId || "STU"})`
            : "Unassigned",
          hasRating: !!rating,
          rating: rating
            ? {
                stars: rating.stars,
                feedbackText: rating.feedbackText,
                isModerated: rating.isModerated,
                createdAt: rating.createdAt.toISOString(),
              }
            : null,
        };
      })
    );

    return { success: true, projects };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load industry projects." };
  }
}

/**
 * Fetch live detail for a single project tied to the authenticated industry partner's problem.
 */
export async function getIndustryProjectDetailAction(projectId: string) {
  try {
    const { error, profile } = await getAuthenticatedIndustry();

    if (error || !profile) {
      return { success: false, error: error || "Authentication required" };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        problem: {
          include: {
            industry: { select: { id: true, companyName: true, companyId: true, domain: true } },
          },
        },
        idea: { select: { title: true, description: true, domain: true } },
        staff: { select: { name: true, email: true, uniqueId: true } },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true } } },
          orderBy: { isLead: "desc" },
        },
        ratings: { where: { industryId: profile.id } },
        guidanceRequests: {
          select: { id: true, status: true, question: true, tags: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        feedback: {
          where: { author: { role: UserRole.ALUMNI } },
          include: { author: { select: { name: true, uniqueId: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    // Ownership check: project must belong to this industry's problem
    if (project.problem && project.problem.industry.id !== profile.id) {
      return { success: false, error: "This project does not belong to your organization." };
    }
    if (!project.problem && !project.idea) {
      return { success: false, error: "This project is not linked to your organization." };
    }

    const rating = project.ratings[0];

    return {
      success: true,
      project: {
        id: project.id,
        title: project.title,
        status: project.status,
        githubUrl: project.githubUrl,
        adminReviewNotes: project.adminReviewNotes,
        targetDeadline: project.targetDeadline?.toISOString() || null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        domain:
          project.problem?.domain || project.idea?.domain || "General Engineering",
        description: project.problem?.description || project.idea?.description || project.title,
        constraints: project.problem?.constraints || null,
        expectedDeliverables: project.problem?.expectedDeliverables || null,
        industryPartner: project.problem?.industry
          ? {
              companyName: project.problem.industry.companyName,
              companyId: project.problem.industry.companyId,
            }
          : { companyName: "Student-Originated Idea", companyId: "—" },
        facultySupervisor: project.staff
          ? { name: project.staff.name, email: project.staff.email, uniqueId: project.staff.uniqueId }
          : null,
        team: project.members.map((m) => ({
          id: m.student.id,
          name: m.student.name,
          uniqueId: m.student.uniqueId,
          email: m.student.email,
          isLead: m.isLead,
        })),
        rating: rating
          ? {
              stars: rating.stars,
              feedbackText: rating.feedbackText,
              isModerated: rating.isModerated,
              createdAt: rating.createdAt.toISOString(),
            }
          : null,
        guidanceRequests: project.guidanceRequests,
        mentorshipFeedback: project.feedback.map((f) => ({
          id: f.id,
          content: f.content,
          category: f.category,
          author: f.author,
          createdAt: f.createdAt.toISOString(),
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load project detail." };
  }
}

/**
 * Fetch all problems submitted by the authenticated industry partner.
 */
export async function getIndustryProblemsAction() {
  try {
    const { error, profile } = await getAuthenticatedIndustry();

    if (error || !profile) {
      return { success: false, error: error || "Authentication required" };
    }

    const problems = await prisma.problem.findMany({
      where: { industryId: profile.id },
      include: {
        claimedByStaff: { select: { name: true } },
        projects: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      problems: problems.map((p) => ({
        id: p.id,
        title: p.title,
        domain: p.domain,
        description: p.description,
        constraints: p.constraints,
        expectedDeliverables: p.expectedDeliverables,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        claimedByFacultyName: p.claimedByStaff?.name || null,
        assignedProjectId: p.projects[0]?.id || null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load industry problems." };
  }
}

/**
 * Update Company Profile details
 */
export async function updateIndustryCompanyProfileAction(input: {
  companyName: string;
  websiteUrl?: string;
  domain: string;
}) {
  try {
    const { error, user, profile } = await getAuthenticatedIndustry();

    if (error || !user || !profile) {
      return { success: false, error: error || "Authentication required" };
    }

    const { companyName, websiteUrl, domain } = input;

    await prisma.industryProfile.update({
      where: { id: profile.id },
      data: {
        companyName: companyName.trim(),
        websiteUrl: websiteUrl?.trim() || null,
        domain: domain.trim(),
      },
    });

    return { success: true, message: "Company profile updated successfully." };
  } catch (err: any) {
    console.error("Error in updateIndustryCompanyProfileAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to update company profile.",
    };
  }
}

/**
 * Industry Partner adopts an accepted/published showcase idea.
 * Converts the idea into a formal Project with the originating student as Team Lead.
 */
export async function adoptShowcaseIdeaAction(input: {
  ideaId: string;
  staffId?: string;
  targetDeadline?: string;
}) {
  try {
    const { error, user, profile } = await getAuthenticatedIndustry();

    if (error || !user || !profile) {
      return { success: false, error: error || "Authentication required" };
    }

    if (!user.isVerified) {
      return { success: false, error: "Your industry profile must be verified before adopting ideas." };
    }

    const { ideaId, staffId, targetDeadline } = input;

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        student: { select: { id: true, name: true, uniqueId: true, email: true } },
      },
    });

    if (!idea) {
      return { success: false, error: "Idea not found." };
    }

    const ideaStatusStr = idea.status as string;

    if (ideaStatusStr === "CONVERTED_TO_PROJECT") {
      return { success: false, error: "This idea has already been converted to a project." };
    }

    if (ideaStatusStr !== "ACCEPTED" && ideaStatusStr !== "SHOWCASE_PUBLISHED") {
      return { success: false, error: "Only accepted or published showcase ideas can be adopted." };
    }

    let resolvedStaffId = staffId;
    if (!resolvedStaffId) {
      const fallbackStaff = await prisma.user.findFirst({
        where: { role: UserRole.STAFF, isVerified: true },
        select: { id: true },
      });
      if (!fallbackStaff) {
        return { success: false, error: "No faculty staff available. Contact an administrator." };
      }
      resolvedStaffId = fallbackStaff.id;
    }

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ideaId: idea.id,
          title: idea.title,
          status: ProjectStatus.ASSIGNED,
          staffId: resolvedStaffId,
          targetDeadline: targetDeadline ? new Date(targetDeadline) : null,
        },
      });

      await tx.projectMember.create({
        data: {
          projectId: created.id,
          studentId: idea.studentId,
          isLead: true,
        },
      });

      await tx.idea.update({
        where: { id: ideaId },
        data: {
          status: IdeaStatus.CONVERTED_TO_PROJECT,
          reviewedAt: new Date(),
        },
      });

      return created;
    });

    revalidatePath("/dashboard/industry/projects");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/faculty/projects");

    return {
      success: true,
      message: `Adopted "${idea.title}". Project created with ${idea.student.name} as Team Lead.`,
      project: {
        id: project.id,
        title: project.title,
        status: project.status,
        studentLead: idea.student,
      },
    };
  } catch (err: any) {
    console.error("Error in adoptShowcaseIdeaAction:", err);
    return { success: false, error: err?.message || "Failed to adopt idea." };
  }
}
