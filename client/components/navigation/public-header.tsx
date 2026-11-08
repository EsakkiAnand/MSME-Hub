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
        "w-full border-b bg-background/80 backdrop-blur-md px-3.5 sm:px-6 py-3 sm:py-4",
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-2">
        {/* Institutional Branding: Always navigates to public root ("/") */}
        <Link
          href="/"
          title="Return to MSME Hub Home"
          className="flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-90 select-none shrink-0"
        >
          <MsmeLogoMark size={32} />
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              FXEC MSME Hub
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
              Academic Project Portal
            </span>
          </div>
        </Link>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground shrink-0">
          {/* Explicit Home / Exit link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="size-3.5 shrink-0" />
            <span>Home</span>
          </Link>

          <div className="h-4 w-px bg-border mx-0.5" />

          {action === "signup" && (
            <span>
              <span className="hidden sm:inline">Don&apos;t have an account? </span>
              <Link
                href="/signup"
                onClick={(e) => {
                  if (onActionClick) {
                    e.preventDefault();
                    onActionClick("signup");
                  }
                }}
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </span>
          )}

          {action === "login" && (
            <span>
              <span className="hidden sm:inline">Already have an account? </span>
              <Link
                href="/login"
                onClick={(e) => {
                  if (onActionClick) {
                    e.preventDefault();
                    onActionClick("login");
                  }
                }}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </span>
          )}

          <div className="h-4 w-px bg-border mx-0.5" />

          <Link
            href="/admin/login"
            className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="size-3.5 shrink-0" />
            <span className="hidden xs:inline">Admin Portal</span>
            <span className="xs:hidden">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
