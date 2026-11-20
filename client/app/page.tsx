"use client";

import * as React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";

export default function Home() {
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
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section
          id="overview"
          className="relative border-b border-border/60 bg-gradient-to-b from-muted/30 via-background to-background py-16 sm:py-24 md:py-28"
        >
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center">
            {/* Government & Institutional Accreditation Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-2xs mb-6 backdrop-blur-xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ministry of MSME Recognized · FXEC Technology Incubation Center</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-4xl mx-auto">
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
              <Link href="/signup?role=industry">
                <Button
                  className="h-11 px-6 font-semibold text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] shadow-xs flex items-center gap-2"
                >
                  <span>Register Your Enterprise</span>
                  <ArrowRight className="size-4 shrink-0" />
                </Button>
              </Link>

              <Link href="/login?portal=student">
                <Button
                  variant="outline"
                  className="h-11 px-5 font-medium text-sm rounded-lg border-border hover:bg-muted/50 transition-colors flex items-center gap-2"
                >
                  <GraduationCap className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Student & Faculty Google Access</span>
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  variant="ghost"
                  className="h-11 px-4 font-medium text-sm text-muted-foreground hover:text-foreground"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. The 4-Stage Lifecycle Process */}
        <section id="lifecycle" className="py-16 sm:py-20 md:py-24 border-b border-border/60 bg-background">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
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
                  className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 relative overflow-hidden flex flex-col justify-between shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl font-extrabold text-primary">
                        {s.step}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">
                      {s.title}
                    </h3>
                    <p className="text-[11px] font-medium text-primary/80">
                      Primary Actor: {s.lead}
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
