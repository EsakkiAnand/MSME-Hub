"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole, FeedbackCategory, GuidanceStatus } from "@prisma/client";
import { ensureUserUniqueId } from "@/lib/id-generator";

/**
 * Ensures authenticated user has role ALUMNI
 */
async function getAuthenticatedAlumni() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || !session.user) {
    return { error: "Unauthenticated session", user: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { alumniProfile: true },
  });

  if (!user || user.role !== UserRole.ALUMNI) {
    return { error: "Unauthorized. Alumni access required.", user: null };
  }

  // Ensure ALU0001 format ID is allocated
  if (!user.uniqueId) {
    const assignedId = await ensureUserUniqueId(user.id, "ALUMNI", user.uniqueId);
    user.uniqueId = assignedId;
  }

  return { error: null, user };
}

/**
 * Fetch overview data for Alumni Dashboard
 */
export async function getAlumniOverviewAction() {
  try {
    const { error, user } = await getAuthenticatedAlumni();
    if (error || !user) {
      return {
        success: false,
        error: error || "Authentication required. Please sign in as an Alumni Mentor.",
      };
    }

    // Live Database Queries
    const [openRequestsCount, myAnswersCount, helpfulCount] = await Promise.all([
      prisma.guidanceRequest.count({
        where: { status: GuidanceStatus.OPEN },
      }),
      prisma.feedback.count({
        where: { authorId: user.id },
      }),
      prisma.guidanceRequest.count({
        where: { alumniId: user.id, isHelpful: true },
      }),
    ]);

    // Live Open Guidance Requests
    const dbGuidanceRequests = await prisma.guidanceRequest.findMany({
      where: { status: GuidanceStatus.OPEN },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            problem: { select: { domain: true } },
            idea: { select: { domain: true } },
          },
        },
        requestedByStudent: { select: { id: true, name: true, uniqueId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const openRequestsFormatted = dbGuidanceRequests.map((req: any) => ({
      id: req.id,
      projectId: req.project.id,
      projectTitle: req.project.title,
      projectDomain:
        req.project.problem?.domain || req.project.idea?.domain || "General Engineering",
      studentName: req.requestedByStudent.name,
      studentUniqueId: req.requestedByStudent.uniqueId || "STU0001",
      studentDepartment: "Engineering",
      tags: req.tags,
      question: req.question,
      status: req.status,
      createdAt: req.createdAt.toISOString(),
      responses: [],
    }));

    // Live recently mentored projects (projects where this alumnus authored feedback)
    const mentoredFeedback = await prisma.feedback.findMany({
      where: { authorId: user.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            githubUrl: true,
            problem: { select: { domain: true } },
            idea: { select: { domain: true } },
            members: { where: { isLead: true }, select: { student: { select: { name: true, uniqueId: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const seenProjectIds = new Set<string>();
    const recentMentoredProjects = mentoredFeedback
      .filter((f) => {
        if (seenProjectIds.has(f.projectId)) return false;
        seenProjectIds.add(f.projectId);
        return true;
      })
      .map((f) => {
        const p = f.project;
        const lead = p?.members?.[0]?.student;
        return {
          id: p?.id || f.projectId,
          title: p?.title || "Project",
          domain: p?.problem?.domain || p?.idea?.domain || "General Engineering",
          status: (p?.status || "IN_PROGRESS") as
            | "IN_PROGRESS"
            | "SOLUTION_SUBMITTED"
            | "APPROVED"
            | "REVISION_IN_PROGRESS",
          teamLeadName: lead?.name || "Unassigned",
          teamLeadUniqueId: lead?.uniqueId || "STU-0001",
          facultyMentor: "Faculty",
          industryPartner: "MSME Partner",
          lastActivity: `Mentor feedback: ${f.category} (${new Date(f.createdAt).toLocaleDateString()})`,
          githubUrl: p?.githubUrl || null,
        };
      });

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
      profile: user.alumniProfile || {
        degree: "B.E. Computer Science",
        passoutYear: 2021,
        currentCompany: "Technology Services",
        currentRole: "Senior Engineer",
        linkedinUrl: null,
        helpfulCount: 0,
      },
      stats: {
        openRequestsCount,
        myAnswersCount,
        helpfulEndorsements: user.alumniProfile?.helpfulCount || helpfulCount,
        projectsMentored: mentoredFeedback.length,
      },
      openRequests: openRequestsFormatted,
      recentMentoredProjects,
    };
  } catch (err: any) {
    console.error("Error in getAlumniOverviewAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to load Alumni Overview",
    };
  }
}

/**
 * Submit feedback / response to a student guidance request
 */
export async function respondToGuidanceRequestAction(input: {
  guidanceRequestId: string;
  projectId: string;
  category: "ARCHITECTURE" | "INDUSTRY_RELEVANCE" | "SECURITY_QUALITY" | "GENERAL";
  content: string;
}) {
  try {
    const { error, user } = await getAuthenticatedAlumni();
    if (error || !user) {
      return { success: false, error: error || "Authentication required" };
    }

    const { guidanceRequestId, projectId, category, content } = input;

    if (!content.trim()) {
      return { success: false, error: "Response comments cannot be empty." };
    }

    // Create Feedback record and update GuidanceRequest in transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Create Feedback
      await tx.feedback.create({
        data: {
          projectId,
          authorId: user.id,
          category: category as FeedbackCategory,
          content: content.trim(),
        },
      });

      // 2. Mark GuidanceRequest as ANSWERED by this Alumnus
      await tx.guidanceRequest.update({
        where: { id: guidanceRequestId },
        data: {
          status: GuidanceStatus.ANSWERED,
          alumniId: user.id,
        },
      });
    });

    return {
      success: true,
      message: "Guidance response published successfully to the student team.",
    };
  } catch (err: any) {
    console.error("Error in respondToGuidanceRequestAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to submit response.",
    };
  }
}

/**
 * Fetch all guidance requests (open + answered) for the Guidance Board.
 * Alumni mentors browse and answer student queries.
 */
export async function getGuidanceBoardAction() {
  try {
    const { error, user } = await getAuthenticatedAlumni();
    if (error || !user) {
      return { success: false, error: error || "Authentication required." };
    }

    const requests = await prisma.guidanceRequest.findMany({
      where: {
        status: { in: [GuidanceStatus.OPEN, GuidanceStatus.ANSWERED, GuidanceStatus.RESOLVED] },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            problem: { select: { domain: true } },
            idea: { select: { domain: true } },
          },
        },
        requestedByStudent: { select: { id: true, name: true, uniqueId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch alumni-authored feedback entries to attach as responses
    const feedbacks = await prisma.feedback.findMany({
      where: {
        author: { role: UserRole.ALUMNI },
        project: {
          guidanceRequests: {
            some: {
              id: { in: requests.map((r) => r.id) },
            },
          },
        },
      },
      select: {
        id: true,
        projectId: true,
        category: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const grouped = new Map<string, any[]>();
    for (const f of feedbacks) {
      const arr = grouped.get(f.projectId) || [];
      arr.push({
        id: f.id,
        authorName: "Mentor",
        authorRole: "Alumni Industry Expert",
        category: f.category,
        content: f.content,
        createdAt: f.createdAt.toISOString(),
      });
      grouped.set(f.projectId, arr);
    }

    return {
      success: true,
      requests: requests.map((r) => ({
        id: r.id,
        projectId: r.projectId,
        projectTitle: r.project?.title || "Untitled Project",
        projectDomain:
          r.project?.problem?.domain || r.project?.idea?.domain || "General Engineering",
        studentName: r.requestedByStudent?.name || "Student",
        studentUniqueId: r.requestedByStudent?.uniqueId || "STU-0001",
        studentDepartment: "Engineering",
        tags: r.tags || [],
        question: r.question,
        status: r.status,
        isHelpful: r.isHelpful,
        createdAt: r.createdAt.toISOString(),
        responses: grouped.get(r.projectId) || [],
      })),
    };
  } catch (err: any) {
    console.error("Error in getGuidanceBoardAction:", err);
    return { success: false, error: err?.message || "Failed to load guidance board." };
  }
}

/**
 * Update Alumni Profile details
 */
export async function updateAlumniProfileAction(input: {
  degree: string;
  passoutYear: number;
  currentCompany: string;
  currentRole: string;
  linkedinUrl?: string;
}) {
  try {
    const { error, user } = await getAuthenticatedAlumni();
    if (error || !user) {
      return { success: false, error: error || "Authentication required" };
    }

    const { degree, passoutYear, currentCompany, currentRole, linkedinUrl } = input;

    await prisma.alumniProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        degree,
        passoutYear: Number(passoutYear),
        currentCompany,
        currentRole,
        linkedinUrl: linkedinUrl || null,
      },
      update: {
        degree,
        passoutYear: Number(passoutYear),
        currentCompany,
        currentRole,
        linkedinUrl: linkedinUrl || null,
      },
    });

    return { success: true, message: "Profile updated successfully." };
  } catch (err: any) {
    console.error("Error in updateAlumniProfileAction:", err);
    return {
      success: false,
      error: err?.message || "Failed to update profile.",
    };
  }
}
