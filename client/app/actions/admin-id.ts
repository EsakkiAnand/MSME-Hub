"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";
import { allocateCompanyId } from "@/lib/id-generator";

/**
 * Configure or correct a company's prefix and regenerate/assign an atomic Company ID.
 * Strictly restricted to verified MSME Admins.
 */
export async function adminConfigureCompanyPrefixAction(params: {
  industryProfileId: string;
  newPrefix: string;
}) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session || !session.user) {
      return { success: false, error: "Unauthenticated session" };
    }

    // Role check: Only MSME_ADMIN is authorized
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (currentUser?.role !== UserRole.MSME_ADMIN) {
      return {
        success: false,
        error: "Unauthorized: Only MSME Administrators have permission to configure company prefixes.",
      };
    }

    const { industryProfileId, newPrefix } = params;
    const cleanPrefix = newPrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);

    if (cleanPrefix.length < 2) {
      return { success: false, error: "Company prefix must be at least 2 alphanumeric characters." };
    }

    const existingProfile = await prisma.industryProfile.findUnique({
      where: { id: industryProfileId },
      select: { id: true, companyName: true, companyId: true },
    });

    if (!existingProfile) {
      return { success: false, error: "Company profile not found." };
    }

    // Atomically allocate the next available sequential company ID for the new prefix
    const { companyId, prefix } = await allocateCompanyId(existingProfile.companyName, cleanPrefix);

    const updatedProfile = await prisma.industryProfile.update({
      where: { id: industryProfileId },
      data: {
        companyId,
        companyPrefix: prefix,
      },
      select: {
        id: true,
        companyName: true,
        companyId: true,
        companyPrefix: true,
      },
    });

    return {
      success: true,
      companyId: updatedProfile.companyId,
      companyPrefix: updatedProfile.companyPrefix,
      message: `Company prefix updated to ${prefix}. New unique ID: ${companyId}`,
    };
  } catch (error: any) {
    console.error("Error in adminConfigureCompanyPrefixAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to update company prefix.",
    };
  }
}
