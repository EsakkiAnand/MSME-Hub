import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Publicly accessible routes that unauthenticated users can visit safely.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/sign-in",
  "/register",
  "/auth/callback",
];

/**
 * Checks if a given pathname belongs to a public route.
 */
export function isPublicRoute(pathname: string): boolean {
  if (!pathname) return false;
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  });
}

/**
 * Checks if a given pathname belongs to a protected dashboard route.
 */
export function isDashboardRoute(pathname: string): boolean {
  if (!pathname) return false;
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

/**
 * Safely navigates backwards.
 * If the document referrer is from the same origin, is not the current page,
 * and does NOT belong to any disallowed prefixes (such as protected dashboards for unauthenticated users),
 * it calls router.back().
 * Otherwise, it navigates predictably to the designated fallback route.
 */
export function safeNavigateBack(
  router: AppRouterInstance,
  fallbackRoute: string = "/",
  disallowedPrefixes: string[] = ["/dashboard"]
): void {
  if (typeof window === "undefined") {
    router.push(fallbackRoute);
    return;
  }

  try {
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    if (referrer && referrer.startsWith(currentOrigin)) {
      const refUrl = new URL(referrer);
      const refPath = refUrl.pathname;

      const isDisallowed = disallowedPrefixes.some(
        (prefix) => refPath === prefix || refPath.startsWith(prefix + "/")
      );

      const isSamePage = refPath === window.location.pathname;

      if (!isDisallowed && !isSamePage && window.history.length > 1) {
        router.back();
        return;
      }
    }
  } catch {
    // If referrer parsing fails, fall through to safe push
  }

  router.push(fallbackRoute);
}
