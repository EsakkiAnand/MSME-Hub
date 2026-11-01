import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all protected dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
      response.headers.set("Pragma", "no-cache");
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
  matcher: ["/dashboard/:path*"],
};
