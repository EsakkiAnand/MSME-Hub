"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { allocateUserUniqueId } from "@/lib/id-generator";

/**
 * Helper to ensure the current authenticated user has MSME_ADMIN role.
 */
async function requireAdminSession() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || !session.user) {
    throw new Error("Unauthenticated session");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (currentUser?.role !== UserRole.MSME_ADMIN) {
    throw new Error("Unauthorized: MSME Administrator privileges required.");
  }

  return currentUser;
}

/**
 * Fetch all students with their track selection and MSME approval status for the Admin Verification Queue.
 */
export async function getStudentMsmeRequestsAction() {
  try {
    await requireAdminSession();

    const students = await prisma.user.findMany({
      where: {
        role: UserRole.STUDENT,
        studentTrack: "JOIN_MSME",
      },
      select: {
        id: true,
        name: true,
        email: true,
        uniqueId: true,
        institutionDomain: true,
        studentTrack: true,
        msmeApprovalStatus: true,
        msmeApprovalReason: true,
        msmeApprovedAt: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      students: students.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        msmeApprovedAt: s.msmeApprovedAt ? s.msmeApprovedAt.toISOString() : null,
      })),
    };
  } catch (error: any) {
    console.error("Error in getStudentMsmeRequestsAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to fetch student MSME requests.",
      students: [],
    };
  }
}

/**
 * Approve a student's request to join MSME projects.
 * Unlocks active project assignment eligibility.
 */
export async function approveStudentMsmeAction(studentId: string) {
  try {
    await requireAdminSession();

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== UserRole.STUDENT) {
      return { success: false, error: "Student record not found." };
    }

    await prisma.user.update({
      where: { id: studentId },
      data: {
        msmeApprovalStatus: "APPROVED",
        isVerified: true,
        msmeApprovedAt: new Date(),
        msmeApprovalReason: null,
      },
    });

    revalidatePath("/dashboard/admin/industry-verification");
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/student/join-msme");

    return { success: true, message: `Approved MSME project access for ${student.name}.` };
  } catch (error: any) {
    console.error("Error in approveStudentMsmeAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to approve student MSME request.",
    };
  }
}

/**
 * Decline a student's request to join MSME projects with administrative feedback.
 */
export async function rejectStudentMsmeAction(studentId: string, reason: string) {
  try {
    await requireAdminSession();

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student || student.role !== UserRole.STUDENT) {
      return { success: false, error: "Student record not found." };
    }

    await prisma.user.update({
      where: { id: studentId },
      data: {
        msmeApprovalStatus: "REJECTED",
        isVerified: false,
        msmeApprovalReason: reason?.trim() || "Requirements not met for MSME challenge track.",
      },
    });

    revalidatePath("/dashboard/admin/industry-verification");
    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/student");
    revalidatePath("/dashboard/student/join-msme");

    return { success: true, message: `Declined MSME project access for ${student.name}.` };
  } catch (error: any) {
    console.error("Error in rejectStudentMsmeAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to decline student MSME request.",
    };
  }
}

/**
 * Transition a student who has graduated / passed out to the Industry Expert (Alumni) role.
 */
export async function graduateStudentToIndustryExpertAction(studentId: string, details?: {
  degree?: string;
  currentCompany?: string;
  currentRole?: string;
}) {
  try {
    await requireAdminSession();

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { alumniProfile: true },
    });

    if (!student) {
      return { success: false, error: "Student account not found." };
    }

    // Allocate Industry Expert (ALU) ID
    const expertUniqueId = await allocateUserUniqueId(UserRole.ALUMNI);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: studentId },
        data: {
          role: UserRole.ALUMNI,
          uniqueId: expertUniqueId,
          isVerified: true,
        },
      });

      if (!student.alumniProfile) {
        await tx.alumniProfile.create({
          data: {
            userId: studentId,
            degree: details?.degree || "Engineering",
            passoutYear: new Date().getFullYear(),
            currentCompany: details?.currentCompany || "Industry Professional",
            currentRole: details?.currentRole || "Industry Expert / Mentor",
          },
        });
      }
    });

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard/alumni");

    return {
      success: true,
      message: `Successfully graduated ${student.name} to Industry Expert (${expertUniqueId}).`,
    };
  } catch (error: any) {
    console.error("Error in graduateStudentToIndustryExpertAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to graduate student to Industry Expert.",
    };
  }
}

