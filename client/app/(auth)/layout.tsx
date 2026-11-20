"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/navigation/public-header";
import { cn } from "@/lib/utils";

/**
 * Shared (auth) layout.
 *
 * Stays mounted across both /login and /signup routes.
 * Uses lightweight, instant CSS transitions (180ms) without blocking route exit locks.
 * Completely immune to freezing, hanging, or unmount deadlocks during rapid navigation.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Safely handle browser Back button when on /login or /signup
  // If the user was redirected here from a protected dashboard route or post-logout,
  // pressing Back navigates them cleanly to "/" (Home) instead of looping back to /login.
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("redirect")?.startsWith("/dashboard") ||
        params.get("logged_out") === "1" ||
        document.referrer.includes("/dashboard")
      ) {
        window.location.replace("/");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Persistent header */}
      <PublicHeader
        action={pathname.includes("signup") ? "login" : "signup"}
      />

      <main className="flex flex-1 items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-[460px] sm:max-w-[480px]">
          {/* Professional Card Shell */}
          <div
            className={cn(
              "relative w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08]",
              "bg-card text-card-foreground",
              "shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none",
              "p-5 sm:p-7 min-h-[460px]",
              "flex flex-col transition-all duration-200 ease-out"
            )}
          >
            {/* Non-blocking keyframe enter animation on route switch */}
            <div
              key={pathname}
              className="animate-page-enter flex flex-col flex-1 h-full w-full"
            >
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
