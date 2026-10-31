"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserRole } from "@prisma/client";
import {
  IndustrySignupSchema,
  AlumniSignupSchema,
  IndustrySignupInput,
  AlumniSignupInput,
  getRoleDashboardPath,
} from "@/lib/auth-utils";

// ---------------------------------------------------------------------------
// Helper: Allowed Institutional Domains Check
// ---------------------------------------------------------------------------

export async function validateInstitutionalEmail(email: string): Promise<{
  isValid: boolean;
  domain: string;
  error?: string;
}> {
  const parts = email.split("@");
  if (parts.length !== 2) {
    return { isValid: false, domain: "", error: "Invalid email format" };
  }

  const domain = parts[1].toLowerCase();
  const allowedConfig = process.env.ALLOWED_INSTITUTION_DOMAINS;

  // In development or if unconfigured, permit all domains with notice
  if (!allowedConfig || process.env.NODE_ENV !== "production") {
    return { isValid: true, domain };
  }

  const allowedList = allowedConfig
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  if (allowedList.length > 0 && !allowedList.includes(domain)) {
    return {
      isValid: false,
      domain,
      error: `Institutional access is restricted to official email domains (${allowedList.join(
        ", "
      )}). Found @${domain}.`,
    };
  }

  return { isValid: true, domain };
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Register an Industry Partner with credentials and IndustryProfile
 */
export async function registerIndustryAction(input: IndustrySignupInput) {
  const validated = IndustrySignupSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { name, email, password, companyName, udyamRegNo, domain, websiteUrl } =
    validated.data;

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this business email already exists. Please sign in.",
    };
  }

  // Check unique Udyam registration
  const existingUdyam = await prisma.industryProfile.findUnique({
    where: { udyamRegNo },
  });

  if (existingUdyam) {
    return {
      success: false,
      error: "This Udyam Registration Number is already registered in MSME-Hub.",
    };
  }

  try {
    const reqHeaders = await headers();

    // Call Better Auth to create user with credentials
    const authResult = await auth.api.signUpEmail({
      body: {
        name,
        email: email.toLowerCase(),
        password,
      },
      headers: reqHeaders,
    });

    if (!authResult || !authResult.user) {
      return {
        success: false,
        error: "Failed to create user account. Please try again.",
      };
    }

    const userId = authResult.user.id;

    // Update role and create IndustryProfile in transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          role: UserRole.INDUSTRY,
          isVerified: false,
          institutionDomain: email.split("@")[1] || null,
        },
      });

      await tx.industryProfile.create({
        data: {
          userId,
          companyName,
          udyamRegNo,
          domain,
          websiteUrl: websiteUrl || null,
        },
      });
    });

    return {
      success: true,
      redirectUrl: "/dashboard/industry?status=registered",
    };
  } catch (error: any) {
    console.error("Error in registerIndustryAction:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during registration.",
    };
  }
}

/**
 * Register an Alumni Mentor with credentials and AlumniProfile
 */
export async function registerAlumniAction(input: AlumniSignupInput) {
  const validated = AlumniSignupSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid input data",
    };
  }

  const {
    name,
    email,
    password,
    degree,
    passoutYear,
    currentCompany,
    currentRole,
    linkedinUrl,
  } = validated.data;

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in.",
    };
  }

  try {
    const reqHeaders = await headers();

    const authResult = await auth.api.signUpEmail({
      body: {
        name,
        email: email.toLowerCase(),
        password,
      },
      headers: reqHeaders,
    });

    if (!authResult || !authResult.user) {
      return {
        success: false,
        error: "Failed to create user account. Please try again.",
      };
    }

    const userId = authResult.user.id;

    // Update role and create AlumniProfile in transaction
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          role: UserRole.ALUMNI,
          isVerified: false,
          institutionDomain: email.split("@")[1] || null,
        },
      });

      await tx.alumniProfile.create({
        data: {
          userId,
          degree,
          passoutYear,
          currentCompany,
          currentRole,
          linkedinUrl: linkedinUrl || null,
        },
      });
    });

    return {
      success: true,
      redirectUrl: "/dashboard/alumni?status=registered",
    };
  } catch (error: any) {
    console.error("Error in registerAlumniAction:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred during registration.",
    };
  }
}

/**
 * Sync Google OAuth user role and validate domain upon login/signup
 */
export async function syncOAuthRoleAction(intendedRole?: "STUDENT" | "STAFF") {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthenticated session" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "User record not found" };
    }

    // Verify institutional domain
    const domainCheck = await validateInstitutionalEmail(user.email);
    if (!domainCheck.isValid) {
      return {
        success: false,
        error: domainCheck.error || "Institutional domain verification failed.",
      };
    }

    // If intended role is STAFF and user is still at default STUDENT, elevate to STAFF
    let activeRole = user.role;
    if (
      intendedRole === "STAFF" &&
      user.role === UserRole.STUDENT
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.STAFF,
          institutionDomain: domainCheck.domain,
          isVerified: true,
        },
      });
      activeRole = UserRole.STAFF;
    } else if (user.role === UserRole.STUDENT) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          institutionDomain: domainCheck.domain,
        },
      });
    }

    // Determine redirect destination
    const redirectUrl = getRoleDashboardPath(activeRole);
    return { success: true, redirectUrl, role: activeRole };
  } catch (error: any) {
    console.error("Error in syncOAuthRoleAction:", error);
    return {
      success: false,
      error: error?.message || "Failed to process role synchronization.",
    };
  }
}
