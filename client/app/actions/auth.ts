"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import {
  IndustrySignupSchema,
  AlumniSignupSchema,
  IndustrySignupInput,
  AlumniSignupInput,
  getRoleDashboardPath,
} from "@/lib/auth-utils";
import { allocateUserUniqueId, allocateCompanyId } from "@/lib/id-generator";

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

    // Update role and create IndustryProfile with companyId in atomic transaction
    await prisma.$transaction(async (tx: any) => {
      // Allocate permanent User Unique ID (IND0001 format)
      const userUniqueId = await allocateUserUniqueId(UserRole.INDUSTRY, tx);
      
      // Allocate permanent Company ID (e.g. HTMP001 or derived company prefix)
      const { companyId, prefix } = await allocateCompanyId(companyName, undefined, tx);

      await tx.user.update({
        where: { id: userId },
        data: {
          role: UserRole.INDUSTRY,
          isVerified: false,
          institutionDomain: email.split("@")[1] || null,
          uniqueId: userUniqueId,
        },
      });

      await tx.industryProfile.create({
        data: {
          userId,
          companyName,
          udyamRegNo,
          companyId,
          companyPrefix: prefix,
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

    // Update role and create AlumniProfile with ALU ID in atomic transaction
    await prisma.$transaction(async (tx: any) => {
      // Allocate permanent Alumni User Unique ID (ALU0001 format)
      const userUniqueId = await allocateUserUniqueId(UserRole.ALUMNI, tx);

      await tx.user.update({
        where: { id: userId },
        data: {
          role: UserRole.ALUMNI,
          isVerified: false,
          institutionDomain: email.split("@")[1] || null,
          uniqueId: userUniqueId,
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

    let activeRole: UserRole = user.role;
    if (intendedRole === "STAFF" && user.role === UserRole.STUDENT) {
      activeRole = UserRole.STAFF;
    }

    // Ensure permanent Unique ID is allocated atomically if not yet present
    let currentUniqueId = user.uniqueId;
    if (!currentUniqueId) {
      currentUniqueId = await allocateUserUniqueId(activeRole);
    }

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
          uniqueId: currentUniqueId,
        },
      });
      activeRole = UserRole.STAFF;
    } else if (user.role === UserRole.STUDENT) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          institutionDomain: domainCheck.domain,
          uniqueId: currentUniqueId,
        },
      });
    } else if (!user.uniqueId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          uniqueId: currentUniqueId,
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

/**
 * Invalidate server session, delete database record, expire all auth cookies,
 * and purge Next.js router cache.
 */
export async function signOutAction() {
  try {
    const reqHeaders = await headers();
    const cookieStore = await cookies();

    // 1. Fetch current session to identify the exact session token and user ID
    let sessionToken: string | null = null;
    let userId: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: reqHeaders,
      });
      if (session?.session?.token) {
        sessionToken = session.session.token;
      }
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch (err) {
      console.warn("Could not retrieve session prior to signout:", err);
    }

    // 2. Call Better-Auth API signOut to trigger library hooks
    try {
      await auth.api.signOut({
        headers: reqHeaders,
      });
    } catch (err) {
      console.warn("Better-Auth API signOut warning:", err);
    }

    // 3. Atomically purge session(s) from database
    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });
    }
    if (userId) {
      await prisma.session.deleteMany({
        where: { userId },
      });
    }

    // 4. Force-expire all possible Better-Auth cookie names across both secure and standard prefixes
    const authCookieNames = [
      "better-auth.session_token",
      "__Secure-better-auth.session_token",
      "better-auth.session_data",
      "__Secure-better-auth.session_data",
      "better-auth.csrf_token",
      "__Secure-better-auth.csrf_token",
      "better-auth.dont_remember",
    ];

    for (const name of authCookieNames) {
      cookieStore.delete(name);
      cookieStore.set(name, "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    // 5. Revalidate all cached layouts
    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");

    return { success: true };
  } catch (error: any) {
    console.error("Error in signOutAction:", error);
    return { success: false, error: error?.message || "Failed to sign out." };
  }
}
