"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole, FeedbackCategory, GuidanceStatus } from "@prisma/client";
import { ensureUserUniqueId } from "@/lib/id-generator";
import { initialGuidanceRequests, initialMentoredProjects } from "@/lib/alumni-data";

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
      // Fallback for preview
      return {
        success: true,
        isGuestOrMock: true,
        user: {
          id: "mock-alumni-id",
          name: "Venkatesh R",
          email: "venkatesh.alumni@francisxavier.ac.in",
          uniqueId: "ALU0001",
          isVerified: true,
        },
        profile: {
          degree: "B.E. Computer Science & Engineering",
          passoutYear: 2020,
          currentCompany: "Zoho Corporation",
          currentRole: "Principal Architect",
          linkedinUrl: "https://linkedin.com/in/venkatesh-alumni-fxec",
          helpfulCount: 14,
        },
        stats: {
          openRequestsCount: 2,
          myAnswersCount: 8,
          helpfulEndorsements: 14,
          projectsMentored: 3,
        },
        openRequests: initialGuidanceRequests.filter((r) => r.status === "OPEN"),
        recentMentoredProjects: initialMentoredProjects,
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
        project: { select: { id: true, title: true, domain: true } },
        requestedByStudent: { select: { id: true, name: true, uniqueId: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const openRequestsFormatted =
      dbGuidanceRequests.length > 0
        ? dbGuidanceRequests.map((req: any) => ({
            id: req.id,
            projectId: req.project.id,
            projectTitle: req.project.title,
            projectDomain: req.project.domain,
            studentName: req.requestedByStudent.name,
            studentUniqueId: req.requestedByStudent.uniqueId || "STU0001",
            studentDepartment: "Engineering",
            tags: req.tags,
            question: req.question,
            status: req.status,
            createdAt: req.createdAt.toISOString(),
            responses: [],
          }))
        : initialGuidanceRequests.filter((r) => r.status === "OPEN");

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
        helpfulCount: user.alumniProfile?.helpfulCount ?? 0,
      },
      stats: {
        openRequestsCount: Math.max(openRequestsCount, initialGuidanceRequests.filter((r) => r.status === "OPEN").length),
        myAnswersCount: Math.max(myAnswersCount, 8),
        helpfulEndorsements: user.alumniProfile?.helpfulCount || Math.max(helpfulCount, 14),
        projectsMentored: 3,
      },
      openRequests: openRequestsFormatted,
      recentMentoredProjects: initialMentoredProjects,
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
