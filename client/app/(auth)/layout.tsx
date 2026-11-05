"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PublicHeader } from "@/components/navigation/public-header";
import { cn } from "@/lib/utils";

/**
 * Shared (auth) layout.
 *
 * This component stays MOUNTED across both /login and /signup routes.
 * Next.js will NOT unmount this layout when navigating between sibling routes
 * inside the same route group — so AnimatePresence can animate between pages.
 *
 * Animation: directional fade + slide (18 px).
 *  /login → /signup  content slides left
 *  /signup → /login  content slides right
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Track previous pathname to determine direction
  const prevPathRef = React.useRef<string>(pathname);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  React.useLayoutEffect(() => {
    if (prevPathRef.current !== pathname) {
      // login → signup = slide left (-1 exit / +1 enter)
      if (
        prevPathRef.current.includes("login") &&
        pathname.includes("signup")
      ) {
        setDirection(1);
      } else if (
        prevPathRef.current.includes("signup") &&
        pathname.includes("login")
      ) {
        setDirection(-1);
      }
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  const OFFSET = shouldReduceMotion ? 0 : 20;
  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Single persistent header — never re-mounts */}
      <PublicHeader
        action={pathname.includes("signup") ? "login" : "signup"}
      />

      <main className="flex flex-1 items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-[480px]">
          {/* Static card shell — keeps its size during transitions */}
          <div
            className={cn(
              "relative w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08]",
              "bg-card text-card-foreground",
              "shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none",
              "p-5 sm:p-8 min-h-[580px] sm:min-h-[620px]",
              "flex flex-col overflow-hidden"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? OFFSET : -OFFSET,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    opacity: { duration: 0.22, ease: EASE },
                    x:       { duration: 0.28, ease: EASE },
                  },
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -OFFSET : OFFSET,
                  transition: {
                    opacity: { duration: 0.16, ease: EASE },
                    x:       { duration: 0.20, ease: EASE },
                  },
                }}
                className="flex flex-col flex-1 h-full w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
