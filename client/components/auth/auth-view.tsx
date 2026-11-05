"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { PublicHeader } from "@/components/navigation/public-header";
import { LoginFormContent } from "@/app/login/login-form-content";
import { SignupFormContent } from "@/app/signup/signup-form-content";
import { cn } from "@/lib/utils";

export interface AuthViewProps {
  initialMode: "login" | "signup";
  className?: string;
}

/**
 * High-performance, Apple-inspired unified Authentication View.
 *
 * Architecture:
 * - Keeps the outer card and header mounted to eliminate layout jumps.
 * - Directional slide & fade transitions when switching between Login and Signup:
 *   - Login → Signup: Current form slides 16px left and fades out; new form slides in from 16px right and fades in.
 *   - Signup → Login: Current form slides 16px right and fades out; new form slides in from 16px left and fades in.
 * - Full browser history synchronization: updates URL without hard page unmounts,
 *   and listens to `popstate` so browser Back / Forward buttons trigger directional animations.
 */
export function AuthView({ initialMode = "login", className }: AuthViewProps) {
  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);
  // Direction: 1 = forward (to signup), -1 = backward (to login)
  const [direction, setDirection] = React.useState<number>(initialMode === "signup" ? 1 : -1);
  const shouldReduceMotion = useReducedMotion();

  // Keep state in sync if initialMode prop changes (e.g. cross-route load)
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle browser Back and Forward navigation smoothly
  React.useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.includes("signup")) {
        setDirection(1);
        setMode("signup");
      } else if (pathname.includes("login")) {
        setDirection(-1);
        setMode("login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle switching between Login and Signup
  const handleSwitch = React.useCallback(
    (targetMode: "login" | "signup") => {
      if (targetMode === mode) return;

      const newDir = targetMode === "signup" ? 1 : -1;
      setDirection(newDir);
      setMode(targetMode);

      // Update URL cleanly in browser history without triggering an App Router page unmount
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.pathname = `/${targetMode}`;
        window.history.pushState({ mode: targetMode }, "", url.toString());
      }
    },
    [mode]
  );

  // Use a stable ease tuple typed as const to satisfy Easing
  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

  const enterX = shouldReduceMotion ? 0 : direction > 0 ? 18 : -18;
  const exitX  = shouldReduceMotion ? 0 : direction > 0 ? -18 : 18;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Standardized Application Public Header with interactive action link */}
      <PublicHeader
        action={mode === "login" ? "signup" : "login"}
        onActionClick={handleSwitch}
      />

      {/* Centered Auth Card Viewport */}
      <main className="flex flex-1 items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-[480px]">
          {/* Static card shell — remains perfectly stable during transitions */}
          <div
            className={cn(
              "w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card text-card-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none p-5 sm:p-8 sm:min-h-[620px] flex flex-col justify-between overflow-hidden relative",
              className
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ x: enterX, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    x:       { duration: shouldReduceMotion ? 0 : 0.22, ease: EASE },
                    opacity: { duration: shouldReduceMotion ? 0 : 0.18, ease: EASE },
                  },
                }}
                exit={{
                  x: exitX,
                  opacity: 0,
                  transition: {
                    x:       { duration: shouldReduceMotion ? 0 : 0.15, ease: EASE },
                    opacity: { duration: shouldReduceMotion ? 0 : 0.12, ease: EASE },
                  },
                }}
                className="flex flex-col flex-1 h-full w-full"
              >
                {mode === "login" ? (
                  <LoginFormContent onSwitchToSignup={() => handleSwitch("signup")} />
                ) : (
                  <SignupFormContent onSwitchToLogin={() => handleSwitch("login")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
