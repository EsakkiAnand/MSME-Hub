import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRoleDashboardPath } from "@/lib/auth-utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all protected dashboard routes
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const rawToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    // Better Auth cookie format may be signed (token.signature). Extract token identifier.
    const sessionToken = rawToken ? rawToken.split(".")[0] : null;

    let validSession = null;
    if (sessionToken) {
      try {
        validSession = await prisma.session.findUnique({
          where: { token: sessionToken },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                isVerified: true,
              },
            },
          },
        });
      } catch (err) {
        console.error("Proxy session verification database error:", err);
      }
    }

    // Check if session exists and is not expired
    const isExpired = validSession
      ? new Date(validSession.expiresAt).getTime() <= Date.now()
      : true;

    if (!validSession || isExpired || !validSession.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }

    const userRole = validSession.user.role;
    const authorizedPath = getRoleDashboardPath(userRole);

    // 1. Root /dashboard index: redirect to the user's role workspace
    if (pathname === "/dashboard") {
      const response = NextResponse.redirect(new URL(authorizedPath, request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      return response;
    }

    // 2. Role-based routing boundary checks
    let isAuthorized = true;
    if (pathname.startsWith("/dashboard/student") && userRole !== "STUDENT") {
      isAuthorized = false;
    } else if (
      (pathname.startsWith("/dashboard/faculty") || pathname === "/dashboard/staff") &&
      userRole !== "STAFF"
    ) {
      isAuthorized = false;
    } else if (pathname.startsWith("/dashboard/industry") && userRole !== "INDUSTRY") {
      isAuthorized = false;
    } else if (pathname.startsWith("/dashboard/alumni") && userRole !== "ALUMNI") {
      isAuthorized = false;
    } else if (pathname.startsWith("/dashboard/admin") && userRole !== "MSME_ADMIN") {
      isAuthorized = false;
    }

    if (!isAuthorized) {
      const response = NextResponse.redirect(new URL(authorizedPath, request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }

    // Attach anti-caching headers so browsers never cache protected dashboard pages in bfcache or disk
    const response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
