"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MsmeFullLogo, MsmeLogoMark } from "@/components/ui/msme-logo";

type RoleKey = "industry" | "student" | "faculty" | "alumni";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<"roles" | "howItWorks">("roles");
  const [selectedRole, setSelectedRole] = React.useState<RoleKey>("industry");

  const rolesConfig: Record<
    RoleKey,
    {
      title: string;
      badge: string;
      icon: React.ElementType;
      color: string;
      activeBorder: string;
      activeBadge: string;
      description: string;
      infoTitle: string;
      infoText: string;
      loginHref: string;
      signupHref: string;
      loginLabel: string;
      signupLabel: string;
    }
  > = {
    industry: {
      title: "Industry Partner",
      badge: "Operational Problem Provider",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      activeBorder: "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
      activeBadge: "text-blue-700 bg-blue-100 dark:bg-blue-900/50",
      description:
        "Submit operational factory challenges, track sprint progress, and rate delivered open-source solutions.",
      infoTitle: "Streamlined MSME Onboarding",
      infoText:
        "Register using your company or business email. Upload problem statements with deliverables.",
      loginHref: "/login?portal=industry",
      signupHref: "/signup?role=industry",
      loginLabel: "Sign In as Industry Partner",
      signupLabel: "Register New Enterprise",
    },
    student: {
      title: "Student Builder",
      badge: "Capstone Solution Solver",
      icon: GraduationCap,
      color: "text-emerald-600 dark:text-emerald-400",
      activeBorder: "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
      activeBadge: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50",
      description:
        "Solve verified MSME problems, connect public MIT-licensed GitHub repositories, and pitch innovative ideas.",
      infoTitle: "Institutional Domain Requirement",
      infoText:
        "Requires official college email (@francisxavier.ac.in) via Google Workspace OAuth.",
      loginHref: "/login?portal=student",
      signupHref: "/signup?role=student",
      loginLabel: "Sign In as Student Builder",
      signupLabel: "Register Student Account",
    },
    faculty: {
      title: "Faculty / Staff",
      badge: "Academic Project Director",
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      activeBorder: "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20",
      activeBadge: "text-purple-700 bg-purple-100 dark:bg-purple-900/50",
      description:
        "Claim domain problems from the central pool, assign student teams with leads, and oversee milestones.",
      infoTitle: "Academic Oversight Portal",
      infoText:
        "Department faculty guide engineering milestones and evaluate capstone deliverables.",
      loginHref: "/login?portal=staff",
      signupHref: "/signup?role=staff",
      loginLabel: "Sign In as Faculty Director",
      signupLabel: "Register Faculty Account",
    },
    alumni: {
      title: "Alumni Mentor",
      badge: "Technical Guidance Expert",
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      activeBorder: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
      activeBadge: "text-amber-700 bg-amber-100 dark:bg-amber-900/50",
      description:
        "Review active student projects, provide architectural guidance on the Guidance Board, and mentor talent.",
      infoTitle: "1-Click Staff Verification",
      infoText:
        "Alumni profiles are verified by faculty before student guidance threads are unlocked.",
      loginHref: "/login?portal=alumni",
      signupHref: "/signup?role=alumni",
      loginLabel: "Sign In as Alumni Mentor",
      signupLabel: "Register as Mentor",
    },
  };

  const currentRole = rolesConfig[selectedRole];

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 text-foreground">
      {/* Top Standardized Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur-md px-3.5 sm:px-6 py-3 sm:py-4">
        <div className="container mx-auto flex items-center justify-between gap-2 max-w-4xl">
          {/* Institutional Branding */}
          <Link
            href="/"
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

          {/* Quick Header Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground shrink-0">
            <Link
              href="/login"
              className="font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline transition-colors"
            >
              Register
            </Link>
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

      {/* Main Centered Gateway Card */}
      <main className="flex flex-1 items-center justify-center px-3.5 sm:px-6 py-6 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-[480px]">
          <div className="relative w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card text-card-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none p-5 sm:p-8 flex flex-col">
            {/* 1. Official Brand Logo */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <MsmeFullLogo width={92} priority />
            </div>

            {/* 2. Title & Subtitle */}
            <div className="space-y-1 text-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                FXEC MSME Hub
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Academic & Industry Project Portal
              </p>
            </div>

            {/* 3. Top-Level Mode Selector: Workspaces vs How It Works */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 my-4">
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className={`h-8 text-xs font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === "roles"
                    ? "bg-white dark:bg-[#1C1C1E] text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Portal Workspaces</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("howItWorks")}
                className={`h-8 text-xs font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === "howItWorks"
                    ? "bg-white dark:bg-[#1C1C1E] text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Tab 1: Roles View */}
            {activeTab === "roles" ? (
              <div className="space-y-4">
                {/* 4-Role Segmented Selector (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  {(["industry", "student", "faculty", "alumni"] as RoleKey[]).map((rKey) => {
                    const r = rolesConfig[rKey];
                    const Icon = r.icon;
                    const isSelected = selectedRole === rKey;
                    return (
                      <button
                        key={rKey}
                        type="button"
                        onClick={() => setSelectedRole(rKey)}
                        className={`h-9 px-2.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-left truncate ${
                          isSelected
                            ? "bg-white dark:bg-[#1C1C1E] text-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className={`size-3.5 shrink-0 ${r.color}`} />
                        <span className="truncate">{r.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Role Card Box */}
                <div
                  className={`rounded-xl border p-4 transition-all duration-150 space-y-2.5 ${currentRole.activeBorder}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <currentRole.icon className={`size-4 ${currentRole.color}`} />
                      <span className="text-xs font-bold text-foreground">
                        {currentRole.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentRole.activeBadge}`}
                    >
                      {currentRole.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentRole.description}
                  </p>
                </div>

                {/* Subtle Policy / Requirement Note */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 p-3 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Info className="size-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">
                    <strong>{currentRole.infoTitle}:</strong> {currentRole.infoText}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <Link href={currentRole.loginHref} className="block w-full">
                    <Button
                      type="button"
                      className="w-full h-10 font-semibold text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>{currentRole.loginLabel}</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </Button>
                  </Link>

                  <Link href={currentRole.signupHref} className="block w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-9 font-medium text-xs rounded-lg border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-foreground"
                    >
                      <span>{currentRole.signupLabel}</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Tab 2: How It Works Clean Process */
              <div className="space-y-3 pt-1">
                <div className="space-y-2.5">
                  {[
                    {
                      num: "01",
                      title: "Submit Challenge",
                      actor: "Industry",
                      desc: "Verified MSMEs post operational challenges with deliverable requirements.",
                    },
                    {
                      num: "02",
                      title: "Assign Team",
                      actor: "Faculty",
                      desc: "Faculty claims problems and forms student teams with designated Leads.",
                    },
                    {
                      num: "03",
                      title: "Build & Guide",
                      actor: "Students & Alumni",
                      desc: "Students build solutions and receive architectural guidance from alumni mentors.",
                    },
                    {
                      num: "04",
                      title: "Verify & Rate",
                      actor: "Admin & Industry",
                      desc: "Admin audits public GitHub code; Industry Partner tests and logs 1–5 star rating.",
                    },
                  ].map((s) => (
                    <div
                      key={s.num}
                      className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] p-3 flex items-start gap-3"
                    >
                      <span className="font-mono font-bold text-xs text-primary/70 shrink-0 mt-0.5">
                        {s.num}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">
                            {s.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ({s.actor})
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("roles")}
                  className="w-full h-9 text-xs font-semibold rounded-lg mt-2"
                >
                  &larr; Return to Workspaces
                </Button>
              </div>
            )}

            {/* Central Admin Row */}
            <div className="mt-5 pt-3.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="size-3.5 text-rose-500 shrink-0" />
                <span>Central Governance</span>
              </span>
              <Link
                href="/admin/login"
                className="font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Admin Portal &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Institutional Credit Below Card */}
          <p className="text-center text-[11px] text-muted-foreground mt-4">
            Francis Xavier Engineering College · Academic Project Portal
          </p>
        </div>
      </main>
    </div>
  );
}
