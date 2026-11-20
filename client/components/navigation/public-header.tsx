"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { MsmeLogoMark } from "@/components/ui/msme-logo";

export interface PublicHeaderProps {
  action?: "login" | "signup" | "home" | "none";
  className?: string;
  onActionClick?: (action: "login" | "signup") => void;
}

/**
 * Standardized application header for public and authentication pages.
 * Displays aligned institutional branding with clear return-to-home and contextual navigation.
 */
export function PublicHeader({
  action = "none",
  className,
  onActionClick,
}: PublicHeaderProps) {
  return (
    <header
      className={cn(
        "w-full border-b bg-background/80 backdrop-blur-md px-3 sm:px-8 lg:px-10 py-2.5 sm:py-4",
        className
      )}
    >
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Institutional Branding: Left Aligned */}
        <Link
          href="/"
          title="Return to MSME Hub Home"
          className="flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-90 select-none shrink-0"
        >
          <MsmeLogoMark size={28} className="sm:w-8 sm:h-8" />
          <div>
            <span className="font-bold text-sm sm:text-lg tracking-tight">
              FXEC MSME Hub
            </span>
            <span className="hidden lg:inline-block ml-2 text-xs font-medium text-muted-foreground">
              Academic Project Portal
            </span>
          </div>
        </Link>

        {/* Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm text-muted-foreground shrink-0">
          {/* Explicit Home / Exit link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="size-3.5 shrink-0" />
            <span>Home</span>
          </Link>

          <div className="h-3.5 w-px bg-border mx-0.5" />

          {action === "signup" && (
            <span>
              <span className="hidden lg:inline">Don&apos;t have an account? </span>
              <Link
                href="/signup"
                onClick={(e) => {
                  if (onActionClick) {
                    e.preventDefault();
                    onActionClick("signup");
                  }
                }}
                className="font-semibold text-primary hover:underline px-1 py-0.5"
              >
                Sign up
              </Link>
            </span>
          )}

          {action === "login" && (
            <span>
              <span className="hidden lg:inline">Already have an account? </span>
              <Link
                href="/login"
                onClick={(e) => {
                  if (onActionClick) {
                    e.preventDefault();
                    onActionClick("login");
                  }
                }}
                className="font-semibold text-primary hover:underline px-1 py-0.5"
              >
                Sign in
              </Link>
            </span>
          )}

          <div className="h-3.5 w-px bg-border mx-0.5 hidden md:block" />

          <Link
            href="/admin/login"
            className="hidden md:inline-flex text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline items-center gap-1 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="size-3.5 shrink-0" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
