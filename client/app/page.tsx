"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Star,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";
import { authClient } from "@/lib/auth-client";
import { signOutAction } from "@/app/actions/auth";
import { getAuthorizedUserPath } from "@/lib/auth-utils";

export default function Home() {
  const session = authClient.useSession();
  const sessionUser = session.data?.user as any;

  const dashboardPath = sessionUser
    ? getAuthorizedUserPath(sessionUser.role, sessionUser.studentTrack)
    : "/dashboard";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch {}
    await signOutAction();
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch {}
    window.location.href = "/login?logged_out=1";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* 1. Global Enterprise Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="w-full flex h-14 sm:h-16 items-center justify-between px-3 sm:px-8 lg:px-10">
          {/* Official Institutional Brand (Left Aligned) */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-95 select-none shrink-0"
          >
            <MsmeLogoMark size={28} className="sm:w-8 sm:h-8" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm sm:text-lg tracking-tight text-foreground">
                FXEC MSME Hub
              </span>
              <span className="text-[11px] font-medium text-muted-foreground hidden sm:block">
                Francis Xavier Engineering College · Academic Project Portal
              </span>
            </div>
          </Link>

          {/* Action CTAs (Right Aligned) */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm">
            {sessionUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs font-medium text-muted-foreground truncate max-w-[150px]">
                  {sessionUser.name || sessionUser.email}
                </span>
                <Link href={dashboardPath}>
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 px-3 font-semibold text-xs sm:text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="h-8 sm:h-9 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-1"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 sm:px-3 py-1 sm:py-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>

                <Link href="/signup?role=industry">
                  <Button
                    size="sm"
                    className="h-8 sm:h-9 px-2.5 sm:px-4 font-semibold text-xs sm:text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] shadow-xs"
                  >
                    <span className="hidden sm:inline">Register Enterprise</span>
                    <span className="sm:hidden">Register</span>
                  </Button>
                </Link>

                <div className="h-4 w-px bg-border hidden sm:block" />

                <Link
                  href="/admin/login"
                  className="hidden lg:flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <ShieldCheck className="size-3.5 shrink-0" />
                  <span>Admin Portal</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section
          id="overview"
          className="relative border-b border-border/60 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,40,63,0.07),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.08),rgba(0,0,0,0))] py-16 sm:py-24 md:py-28"
        >
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-foreground leading-[1.14] max-w-4xl mx-auto">
              Connecting Verified Industrial MSMEs with University Engineering Talent
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A centralized collaboration platform where micro, small, and medium enterprises
              submit real factory bottlenecks, and multidisciplinary engineering teams deliver
              audited, MIT-licensed open-source solutions under faculty direction and corporate alumni mentorship.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {sessionUser ? (
                <>
                  <Link href={dashboardPath}>
                    <Button
                      className="h-11 px-6 font-semibold text-sm rounded-xl bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center gap-2"
                    >
                      <span>Go to Your Workspace</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="h-11 px-5 font-medium text-sm rounded-xl border-border hover:bg-muted/50 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                  >
                    <LogOut className="size-4 shrink-0" />
                    <span>Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signup?role=industry">
                    <Button
                      className="h-11 px-6 font-semibold text-sm rounded-xl bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center gap-2"
                    >
                      <span>Register Your Enterprise</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </Button>
                  </Link>

                  <Link href="/login?portal=student">
                    <Button
                      variant="outline"
                      className="h-11 px-5 font-medium text-sm rounded-xl border-border hover:bg-muted/50 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                    >
                      <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Student & Faculty Google Access</span>
                    </Button>
                  </Link>

                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="h-11 px-4 font-medium text-sm rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    >
                      Sign In to Workspace
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* 4 Feature Trust Cards */}
            <div className="mt-12 sm:mt-14 pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left">
              <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card/80 backdrop-blur-xs shadow-2xs hover:shadow-xs hover:border-[#14283F]/30 dark:hover:border-primary/30 transition-all duration-150">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>100% MIT Open Source</span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Zero intellectual property lock in. All deliverables public on GitHub.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card/80 backdrop-blur-xs shadow-2xs hover:shadow-xs hover:border-[#14283F]/30 dark:hover:border-primary/30 transition-all duration-150">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Building2 className="size-4 text-blue-500 shrink-0" />
                  <span>Verified MSMEs</span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Validated against Udyam registration and corporate credentials.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card/80 backdrop-blur-xs shadow-2xs hover:shadow-xs hover:border-[#14283F]/30 dark:hover:border-primary/30 transition-all duration-150">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Users className="size-4 text-purple-500 shrink-0" />
                  <span>Accredited Faculty</span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Engineering department leads direct milestones and capstone rigor.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card/80 backdrop-blur-xs shadow-2xs hover:shadow-xs hover:border-[#14283F]/30 dark:hover:border-primary/30 transition-all duration-150">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Star className="size-4 text-amber-500 shrink-0" />
                  <span>5-Star Verification</span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Industrial rating and admin audit required for capstone completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The 4-Stage Lifecycle Process */}
        <section id="lifecycle" className="py-16 sm:py-20 md:py-24 border-b border-border/60 bg-background">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#14283F] dark:text-primary">
                Engineering Lifecycle
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
                From Factory Floor Problem to Verified Software
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                A transparent, four-phase delivery pipeline governed by faculty rigor and industrial feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Problem Registration",
                  lead: "MSME Partner",
                  desc: "Verified industrial enterprises post operational constraints, factory bottlenecks, and deliverable targets.",
                  badge: "Udyam Verified",
                },
                {
                  step: "02",
                  title: "Faculty Allocation",
                  lead: "Department Faculty",
                  desc: "Faculty claims problems from the pool, structures engineering cohorts, and designates project sprint leads.",
                  badge: "Team Formation",
                },
                {
                  step: "03",
                  title: "Open Source Sprints",
                  lead: "Student Builders",
                  desc: "Students build MIT-licensed GitHub repositories with continuous commits, mentored by industry alumni.",
                  badge: "GitHub Sprints",
                },
                {
                  step: "04",
                  title: "Audit & 5-Star Rating",
                  lead: "MSME & Admin",
                  desc: "Admin audits public repository code quality; MSME tests deployment and logs final satisfaction rating.",
                  badge: "Dual Sign-off",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card p-5 sm:p-6 space-y-3.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:border-[#14283F]/30 dark:hover:border-primary/40 transition-all duration-200"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-black text-[#14283F] dark:text-primary tracking-tight">
                        {s.step}
                      </span>
                      <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-[15px] text-foreground tracking-tight group-hover:text-[#14283F] dark:group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#14283F]/90 dark:text-primary/90 flex items-center gap-1">
                      <span className="text-muted-foreground font-normal">Primary Actor:</span> {s.lead}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 4. Clean 1-Line Minimal Footer */}
      <footer className="border-t border-border/60 bg-background py-5 px-4 sm:px-8 lg:px-10">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; 2026 Francis Xavier Engineering College · Academic Project Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-3 font-medium">
            <Link
              href="/admin/login"
              className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin Portal</span>
            </Link>
            <span className="text-border">·</span>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <span className="text-border">·</span>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
