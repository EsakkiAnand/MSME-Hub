import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRoleDashboardPath } from "@/lib/auth-utils";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle common route aliases for dashboard access
  if (pathname === "/student/dashboard" || pathname.startsWith("/student/dashboard/")) {
    const targetUrl = new URL(pathname.replace("/student/dashboard", "/dashboard/student"), request.url);
    return NextResponse.redirect(targetUrl);
  }
  if (pathname === "/admin/dashboard" || pathname.startsWith("/admin/dashboard/")) {
    const targetUrl = new URL(pathname.replace("/admin/dashboard", "/dashboard/admin"), request.url);
    return NextResponse.redirect(targetUrl);
  }
  if (pathname === "/faculty/dashboard" || pathname.startsWith("/faculty/dashboard/")) {
    const targetUrl = new URL(pathname.replace("/faculty/dashboard", "/dashboard/faculty"), request.url);
    return NextResponse.redirect(targetUrl);
  }
  if (pathname === "/industry/dashboard" || pathname.startsWith("/industry/dashboard/")) {
    const targetUrl = new URL(pathname.replace("/industry/dashboard", "/dashboard/industry"), request.url);
    return NextResponse.redirect(targetUrl);
  }
  if (pathname === "/alumni/dashboard" || pathname.startsWith("/alumni/dashboard/")) {
    const targetUrl = new URL(pathname.replace("/alumni/dashboard", "/dashboard/alumni"), request.url);
    return NextResponse.redirect(targetUrl);
  }
  if (pathname === "/dashboard/industry-expert" || pathname.startsWith("/dashboard/industry-expert/")) {
    const targetUrl = new URL(pathname.replace("/dashboard/industry-expert", "/dashboard/alumni"), request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 2. Intercept all protected dashboard routes
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const rawToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    // Better Auth cookie format may be signed (token.signature). Extract token identifier.
    const sessionToken = rawToken ? rawToken.split(".")[0] : null;

    let validSession = null;
    let queryError = false;
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
                studentTrack: true,
              },
            },
          },
        });
      } catch (err: any) {
        queryError = true;
        console.error("Proxy session verification database error:", err);
      }
    }

    // Check if session exists and is not expired
    const isExpired = validSession
      ? new Date(validSession.expiresAt).getTime() <= Date.now()
      : true;

    // Reject unauthenticated, expired, or missing sessions immediately
    if (!validSession || isExpired || !validSession.user) {
      // If there was a database query error, allow the request to proceed to downstream handlers
      // instead of aggressively wiping cookies and redirecting to /login
      if (queryError) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      // Expire stale cookie on client if explicitly confirmed expired/missing in DB
      if (rawToken && !queryError) {
        response.cookies.set("better-auth.session_token", "", {
          path: "/",
          maxAge: 0,
        });
        response.cookies.set("__Secure-better-auth.session_token", "", {
          path: "/",
          maxAge: 0,
        });
      }
      return response;
    }

    const userRole = validSession.user.role;
    const studentTrack = (validSession.user as any).studentTrack;

    // Student track onboarding redirection: unselected students must choose their pathway first
    if (
      userRole === "STUDENT" &&
      (!studentTrack || studentTrack === "UNSELECTED") &&
      pathname.startsWith("/dashboard/student") &&
      pathname !== "/dashboard/student/onboarding"
    ) {
      const response = NextResponse.redirect(new URL("/dashboard/student/onboarding", request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      return response;
    }

    const authorizedPath =
      userRole === "STUDENT" && (!studentTrack || studentTrack === "UNSELECTED")
        ? "/dashboard/student/onboarding"
        : getRoleDashboardPath(userRole);

    // Root /dashboard index: redirect to the user's role workspace
    if (pathname === "/dashboard") {
      const response = NextResponse.redirect(new URL(authorizedPath, request.url));
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
      );
      return response;
    }

    // Role-based routing boundary checks
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

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/student/dashboard",
    "/student/dashboard/:path*",
    "/admin/dashboard",
    "/admin/dashboard/:path*",
    "/faculty/dashboard",
    "/faculty/dashboard/:path*",
    "/industry/dashboard",
    "/industry/dashboard/:path*",
    "/alumni/dashboard",
    "/alumni/dashboard/:path*",
  ],
};
