"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Star,
  ExternalLink,
  ChevronRight,
  Layers,
  Lock,
  FileCode2,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";
import { cn } from "@/lib/utils";

type RoleKey = "industry" | "student" | "faculty" | "alumni";

export default function Home() {
  const [activePersona, setActivePersona] = React.useState<RoleKey>("industry");

  const personasConfig: Record<
    RoleKey,
    {
      title: string;
      tagline: string;
      icon: React.ElementType;
      color: string;
      borderActive: string;
      badgeText: string;
      description: string;
      deliverables: string[];
      loginHref: string;
      signupHref: string;
      ctaLabel: string;
    }
  > = {
    industry: {
      title: "Industry Partner",
      tagline: "Operational Factory Bottleneck Provider",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      borderActive: "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20",
      badgeText: "Enterprise Onboarding",
      description:
        "Verified MSMEs and manufacturing enterprises post operational bottlenecks, monitor weekly student sprint progress via public GitHub repositories, and evaluate delivered software with transparent 1–5 star ratings.",
      deliverables: [
        "Submit technical challenge statements with input/output criteria",
        "Monitor live GitHub commit frequency and pull request milestones",
        "Test final build deliverables and log official 1–5 star ratings",
        "Direct access to faculty project leads for domain alignment",
      ],
      loginHref: "/login?portal=industry",
      signupHref: "/signup?role=industry",
      ctaLabel: "Register Organization",
    },
    student: {
      title: "Student Builder",
      tagline: "Capstone Engineering & Open Source Solver",
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400",
      borderActive: "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20",
      badgeText: "Autonomous Engineering",
      description:
        "Engineering students form multidisciplinary teams, claim approved industry problem statements, connect public MIT-licensed GitHub repositories, and pitch novel capstone ideas to faculty and mentors.",
      deliverables: [
        "Claim verified problems from the central departmental problem bank",
        "Link public GitHub repository with automated commit and branch tracking",
        "Receive direct architectural mentorship from corporate alumni",
        "Build a verifiable public engineering portfolio backed by real industry ratings",
      ],
      loginHref: "/login?portal=student",
      signupHref: "/signup?role=student",
      ctaLabel: "Student Sign In (Google SSO)",
    },
    faculty: {
      title: "Faculty Project Director",
      tagline: "Academic Oversight & Team Direction",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      borderActive: "border-purple-500 bg-purple-50/40 dark:bg-purple-950/20",
      badgeText: "Academic Governance",
      description:
        "Department faculty claim problems from the pool, assign multi-student cohorts, appoint team leads, track milestone progress, and evaluate project submissions against academic and industry standards.",
      deliverables: [
        "Review and claim unallocated MSME problem statements",
        "Designate student teams, leads, and technical sprint deliverables",
        "Approve student capstone idea proposals and guide domain research",
        "Authorize final submissions before institutional admin sign-off",
      ],
      loginHref: "/login?portal=staff",
      signupHref: "/signup?role=staff",
      ctaLabel: "Faculty Portal Sign In",
    },
    alumni: {
      title: "Alumni Technical Mentor",
      tagline: "Corporate Engineering Guidance",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      borderActive: "border-amber-500 bg-amber-50/40 dark:bg-amber-950/20",
      badgeText: "Industry Advisory",
      description:
        "Alumni working at top technology enterprises provide architectural guidance, review code quality, and advise student teams through the centralized Guidance Board.",
      deliverables: [
        "Review student repository architecture and code quality",
        "Provide asynchronous technical guidance on active milestones",
        "Guide modern engineering practices (CI/CD, testing, clean code)",
        "Bridge academic capstone projects to corporate production standards",
      ],
      loginHref: "/login?portal=alumni",
      signupHref: "/signup?role=alumni",
      ctaLabel: "Alumni Mentor Access",
    },
  };

  const currentPersona = personasConfig[activePersona];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary">
      {/* 1. Global Enterprise Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Official Institutional Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-95 select-none"
          >
            <MsmeLogoMark size={34} />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base tracking-tight text-foreground sm:text-lg">
                FXEC MSME Hub
              </span>
              <span className="text-[11px] font-medium text-muted-foreground hidden sm:block">
                Francis Xavier Engineering College · Academic Project Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="#overview"
              className="hover:text-foreground transition-colors"
            >
              Overview
            </a>
            <a
              href="#workspaces"
              className="hover:text-foreground transition-colors"
            >
              Workspaces
            </a>
            <a
              href="#lifecycle"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#governance"
              className="hover:text-foreground transition-colors"
            >
              Governance
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <Link
              href="/login"
              className="px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>

            <Link href="/signup?role=industry">
              <Button
                size="sm"
                className="h-9 px-4 font-semibold text-xs sm:text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] shadow-xs"
              >
                Register Enterprise
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
        {/* 2. Hero Section: MNC Product Grade */}
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

            {/* Institutional Trust & Governance Bar */}
            <div className="mt-14 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>100% MIT Open Source</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Zero intellectual property lock-in. All deliverables public on GitHub.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Building2 className="size-4 text-blue-500 shrink-0" />
                  <span>Verified MSMEs</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Validated against Udyam registration and corporate credentials.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Users className="size-4 text-purple-500 shrink-0" />
                  <span>Accredited Faculty</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Engineering department leads direct milestones and capstone rigor.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/60">
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs sm:text-sm">
                  <Star className="size-4 text-amber-500 shrink-0" />
                  <span>5-Star Verification</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  Industrial rating and admin audit required for capstone completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Workspaces Showcase */}
        <section id="workspaces" className="py-16 sm:py-20 md:py-24 bg-muted/20 border-b border-border/60">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Multi-Role Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
                Tailored Workspaces for Every Stakeholder
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Structured permissions, milestone reporting, and accountability designed for academic-industrial symbiosis.
              </p>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 max-w-2xl w-full">
                {(["industry", "student", "faculty", "alumni"] as RoleKey[]).map((rKey) => {
                  const p = personasConfig[rKey];
                  const Icon = p.icon;
                  const isSelected = activePersona === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => setActivePersona(rKey)}
                      className={cn(
                        "relative h-10 px-3 text-xs sm:text-[13px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none",
                        isSelected
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="workspaceTabPill"
                          className="absolute inset-0 rounded-lg bg-white dark:bg-[#1C1C1E] shadow-xs"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <Icon className={`relative z-10 size-4 shrink-0 ${p.color}`} />
                      <span className="relative z-10 truncate">{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Detailed Content Card with Smooth Morph */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
              className="max-w-3xl mx-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card text-card-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none p-6 sm:p-8"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activePersona}
                  initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {/* Header of Active Role Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-muted/60">
                        <currentPersona.icon className={`size-6 ${currentPersona.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {currentPersona.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {currentPersona.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {currentPersona.badgeText}
                    </span>
                  </div>

                  {/* Role Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentPersona.description}
                  </p>

                  {/* Key Capabilities */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      Core Responsibilities & Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentPersona.deliverables.map((d, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-muted/30"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="leading-snug">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href={currentPersona.signupHref}>
                      <Button
                        className="h-10 px-5 font-semibold text-xs sm:text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] shadow-xs flex items-center gap-1.5"
                      >
                        <span>{currentPersona.ctaLabel}</span>
                        <ArrowRight className="size-4 shrink-0" />
                      </Button>
                    </Link>

                    <Link href={currentPersona.loginHref}>
                      <Button
                        variant="outline"
                        className="h-10 px-4 font-medium text-xs sm:text-sm rounded-lg border-border hover:bg-muted/50 text-foreground"
                      >
                        Direct Portal Sign In
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* 4. The 4-Stage Lifecycle Process */}
        <section id="lifecycle" className="py-16 sm:py-20 md:py-24 border-b border-border/60">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* 5. Institutional Governance & Security */}
        <section id="governance" className="py-16 sm:py-20 bg-muted/20 border-b border-border/60">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  <span>Central Root Governance</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Institutional Quality & IP Compliance
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  MSME Hub operates under central administrative oversight. Every registered industrial enterprise,
                  student idea pitch, and completed repository deliverable undergoes rigorous verification to maintain
                  autonomous institutional standards and open-source compliance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link href="/admin/login">
                  <Button
                    variant="outline"
                    className="h-10 px-4 font-semibold text-xs rounded-lg border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>Admin Security Portal</span>
                  </Button>
                </Link>

                <Link href="/signup?role=industry">
                  <Button
                    className="h-10 px-5 font-semibold text-xs rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all shadow-xs"
                  >
                    Get Started as Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Enterprise Institutional Footer */}
      <footer className="border-t border-border/80 bg-background py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Institutional Credentials */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <MsmeLogoMark size={28} />
                <span className="font-bold text-base tracking-tight text-foreground">
                  Francis Xavier Engineering College
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                Autonomous Institution · Accredited by NAAC with &apos;A+&apos; Grade · Approved by AICTE, New Delhi · Affiliated to Anna University, Chennai.
              </p>
              <p className="text-xs text-muted-foreground">
                103/G2, Bypass Road, Vannarpettai, Tirunelveli - 627 003, Tamil Nadu, India.
              </p>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground block">
                Workspaces
              </span>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/login?portal=industry" className="hover:text-foreground transition-colors">
                    Industry Partner Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login?portal=student" className="hover:text-foreground transition-colors">
                    Student Builder Portal
                  </Link>
                </li>
                <li>
                  <Link href="/login?portal=staff" className="hover:text-foreground transition-colors">
                    Faculty Project Director
                  </Link>
                </li>
                <li>
                  <Link href="/login?portal=alumni" className="hover:text-foreground transition-colors">
                    Alumni Mentorship Board
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Governance */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-foreground block">
                Platform
              </span>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/admin/login" className="hover:text-foreground transition-colors text-rose-600 dark:text-rose-400">
                    MSME Admin Portal
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-foreground transition-colors">
                    Create New Account
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <span className="text-muted-foreground/80">
                    MIT Open Source License
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Francis Xavier Engineering College. All rights reserved.
            </p>
            <p className="font-mono text-[11px]">
              MSME-Hub v2.0 · Production Grade
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
