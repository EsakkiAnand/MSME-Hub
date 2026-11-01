"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PublicHeaderProps {
  action?: "login" | "signup" | "home" | "none";
  className?: string;
}

/**
 * Standardized application header for public and authentication pages.
 * Displays aligned institutional branding with a single, clear contextual action.
 * Eliminates redundant Exit / Close / duplicate Back buttons.
 */
export function PublicHeader({ action = "none", className }: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "w-full border-b bg-background/80 backdrop-blur-md px-6 py-4",
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Institutional Branding: Always navigates to public root ("/") */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 select-none"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm text-sm">
            M
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              MSME-Hub
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
              Innovation Platform
            </span>
          </div>
        </Link>

        {/* Single Contextual Navigation Control */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {action === "signup" && (
            <span>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline ml-1"
              >
                Sign up
              </Link>
            </span>
          )}

          {action === "login" && (
            <span>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline ml-1"
              >
                Sign in
              </Link>
            </span>
          )}

          {action === "home" && (
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
