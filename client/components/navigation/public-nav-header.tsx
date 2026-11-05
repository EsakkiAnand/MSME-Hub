"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";
import {
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Building2,
  Users,
  Award,
  LogIn,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MOTION_EASE } from "@/lib/motion";

export function PublicNavHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close mobile menu on Escape key and restore focus
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll cleanly when mobile menu is open without layout shift
  React.useEffect(() => {
    if (mobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileMenuOpen]);

  const handleClose = () => {
    setMobileMenuOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3.5 sm:px-6">
        {/* Institutional Branding */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-90 select-none shrink-0 min-w-0"
        >
          <MsmeLogoMark size={32} />
          <div className="flex flex-col sm:flex-row sm:items-baseline min-w-0">
            <span className="font-bold text-sm min-[360px]:text-base sm:text-lg tracking-tight text-foreground leading-tight truncate">
              FXEC MSME Hub
            </span>
            <span className="hidden sm:inline-block sm:ml-2 text-xs font-medium text-muted-foreground">
              Academic Project Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Actions (md and up) - Preserved */}
        <nav
          className="hidden md:flex items-center gap-2.5 lg:gap-3"
          aria-label="Main Navigation"
        >
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-xs sm:text-sm ios-press"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 font-medium text-xs sm:text-sm ios-press"
            >
              <ShieldCheck className="size-3.5 mr-1.5 text-rose-500 shrink-0" />
              <span>Admin Login</span>
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="font-semibold text-xs sm:text-sm shadow-xs ios-press"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-1.5 size-3.5 shrink-0" />
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation Toggle (< md) - Clean single trigger without overcrowding */}
        <div className="flex md:hidden items-center shrink-0">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer select-none"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                ease: MOTION_EASE.ios,
              }}
              className="flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="size-5 shrink-0" />
              ) : (
                <Menu className="size-5 shrink-0" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.16,
                ease: "easeOut",
              }}
              className="fixed inset-0 top-14 sm:top-16 z-40 bg-black/40 backdrop-blur-xs md:hidden"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.2,
                ease: MOTION_EASE.ios,
              }}
              className="fixed inset-x-0 top-14 sm:top-16 z-50 border-b bg-background/95 backdrop-blur-2xl shadow-xl p-3.5 sm:p-5 md:hidden overflow-y-auto max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] space-y-3"
            >
              {/* Primary Actions Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted transition-colors ios-press"
                >
                  <LogIn className="size-3.5 text-primary shrink-0" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={handleClose}
                  className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-xs ios-press"
                >
                  <UserPlus className="size-3.5 shrink-0" />
                  <span>Register</span>
                </Link>
              </div>

              {/* Dedicated MSME Administrator Login */}
              <Link
                href="/admin/login"
                onClick={handleClose}
                className="flex items-center justify-between h-10 px-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-semibold text-xs hover:bg-rose-100/70 transition-colors ios-press"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-rose-600 shrink-0" />
                  <span>MSME Admin Governance Portal</span>
                </div>
                <ArrowRight className="size-3.5 text-rose-500 shrink-0" />
              </Link>

              {/* Compact Role Ecosystem Access */}
              <div className="pt-2 border-t border-border/60">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Role Workspaces
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ios-press"
                  >
                    <GraduationCap className="size-3.5 text-emerald-500 shrink-0" />
                    <span className="font-medium text-xs">Students</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ios-press"
                  >
                    <Users className="size-3.5 text-purple-500 shrink-0" />
                    <span className="font-medium text-xs">Faculty</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ios-press"
                  >
                    <Building2 className="size-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium text-xs">Industry</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={handleClose}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ios-press"
                  >
                    <Award className="size-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-xs">Alumni</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
