"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PublicHeader } from "@/components/navigation/public-header";
import { MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AuthContainerProps {
  action: "login" | "signup" | "home" | "none";
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared authentication container ensuring pixel-perfect identical outer dimensions,
 * horizontal alignment, padding, border radius, background, border, and shadow
 * between Login and Signup. Includes subtle, hardware-accelerated Apple-style
 * entrance motion with full reduced-motion accessibility support.
 *
 * Smooth directional animation when navigating between /login and /signup:
 * - Login → Signup: content slides left (new content slides in from right)
 * - Signup → Login: content slides right (new content slides in from left)
 */
export function AuthContainer({
  action,
  children,
  className,
}: AuthContainerProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Determine slide direction based on route
  // login → signup = slide left (-1), signup → login = slide right (1)
  const prevPathRef = React.useRef<string>(pathname);
  const [slideDir, setSlideDir] = React.useState<1 | -1>(1);

  React.useLayoutEffect(() => {
    const prev = prevPathRef.current;
    if (prev !== pathname) {
      if (prev.includes("login") && pathname.includes("signup")) {
        setSlideDir(-1); // slide left
      } else if (prev.includes("signup") && pathname.includes("login")) {
        setSlideDir(1); // slide right
      }
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  const xOffset = 28; // px — small, Apple-style
  const enterX = shouldReduceMotion ? 0 : -slideDir * xOffset;
  const exitX = shouldReduceMotion ? 0 : slideDir * xOffset;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Standardized Application Public Header */}
      <PublicHeader action={action} />

      {/* Centered Auth Card Viewport */}
      <main className="flex flex-1 items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-[480px]">
          {/* Static card shell */}
          <div
            className={cn(
              "w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card text-card-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none p-5 sm:p-8 sm:min-h-[580px] flex flex-col justify-between overflow-hidden",
              className
            )}
          >
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
