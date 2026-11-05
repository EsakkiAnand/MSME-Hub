import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getRoleDashboardPath } from "@/lib/auth-utils";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  uniqueId: string | null;
  institutionDomain: string | null;
}

/**
 * Retrieves the currently authenticated user from the server session, if valid.
 * Does not redirect; returns null for unauthenticated visitors or expired sessions.
 */
export async function getOptionalAuth(): Promise<AuthenticatedUser | null> {
  await connection();
  const reqHeaders = await headers();

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: reqHeaders,
    });
  } catch (err) {
    console.warn("Session check in getOptionalAuth returned null:", err);
    return null;
  }

  if (!session?.user?.id) {
    return null;
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        uniqueId: true,
        institutionDomain: true,
      },
    });
  } catch (err) {
    console.error("Database query error in getOptionalAuth:", err);
    return null;
  }

  return (dbUser as AuthenticatedUser) || null;
}

/**
 * Validates the current server session and returns the verified database user.
 * If unauthenticated, expired, missing, or invalid, throws redirect to /login.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getOptionalAuth();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Validates the current server session AND ensures the user's database role
 * matches one of the allowed roles.
 * If unauthenticated -> redirects to /login.
 * If role mismatch -> redirects to their legitimate authorized role workspace.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  const isAllowed = allowedRoles.includes(user.role);
  if (!isAllowed) {
    // Role mismatch: redirect to their legitimate authorized role workspace
    const authorizedPath = getRoleDashboardPath(user.role);
    redirect(authorizedPath);
  }

  return user;
}
