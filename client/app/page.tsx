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
  GitBranch,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Code2,
  FolderGit2,
  Star,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Factory,
  Terminal,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { PublicNavHeader } from "@/components/navigation/public-nav-header";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";
import { MsmeLogoMark } from "@/components/ui/msme-logo";

export default function Home() {
  const [activePreviewTab, setActivePreviewTab] = React.useState<"powerloom" | "inventory" | "foundry">("powerloom");

  const previewProjects = {
    powerloom: {
      id: "PRJ-2024-007",
      title: "Automated Yarn Defect Vision Inspection System",
      company: "Apex Tex Machineries Ltd.",
      domain: "Computer Vision & Manufacturing AI",
      teamLead: "Mohamed Farhan (Lead)",
      mentor: "Prof. Kavitha R (Faculty Director)",
      milestone: "Phase 4 of 5 Completed (80%)",
      repo: "github.com/fxec-msme/powerloom-vision",
      rating: "5.0 ★ Highly Recommended",
      tags: ["OpenCV", "TensorFlow Lite", "Edge Computing"],
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    inventory: {
      id: "PRJ-2024-001",
      title: "Smart Multi-Warehouse Inventory & Supplier Tracker",
      company: "Nellai Precision Engineering Works",
      domain: "Cloud Enterprise Software & Analytics",
      teamLead: "Arjun R (Lead)",
      mentor: "Dr. Selvaraj M (Staff Mentor)",
      milestone: "Phase 5 of 5 · Solution Deployed (100%)",
      repo: "github.com/fxec-msme/msme-inventory-cloud",
      rating: "4.9 ★ Operational in Factory",
      tags: ["Next.js", "PostgreSQL", "Audit Logs"],
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    foundry: {
      id: "PRJ-2024-009",
      title: "High-Frequency Acoustic Crack Detection Pipeline",
      company: "South Castings & Alloys Pvt. Ltd.",
      domain: "Acoustics & Digital Signal Processing",
      teamLead: "Karthik V (Lead)",
      mentor: "Dr. S. Ramanathan (Professor)",
      milestone: "Phase 3 of 5 · Hardware Bench Tests",
      repo: "github.com/fxec-msme/foundry-acoustic-dsp",
      rating: "Pending Final Validation",
      tags: ["DSP Algorithms", "Fast Fourier Transform", "Industrial IoT"],
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
  };

  const currentPreview = previewProjects[activePreviewTab];

  const roles = [
    {
      title: "Industry Partner",
      icon: Building2,
      badge: "Operational Problem Provider",
      roleKey: "industry",
      color: "#007AFF",
      borderAccent: "hover:border-[#007AFF]/50 hover:shadow-[0_4px_24px_rgba(0,122,255,0.1)]",
      iconBg: "bg-[#007AFF]/10 text-[#007AFF]",
      description:
        "Submit operational factory bottlenecks, track transparent milestone deliverables, and evaluate public GitHub solutions with star ratings.",
      features: [
        "Submit operational challenges with deliverables",
        "Monitor student sprint progress in real-time",
        "Inspect verified MIT-licensed repository code",
        "Provide 1–5 star institutional satisfaction ratings",
      ],
      ctaText: "Join as Industry Partner",
      ctaHref: "/signup?role=industry",
    },
    {
      title: "Staff & Faculty Director",
      icon: Users,
      badge: "Academic Project Director",
      roleKey: "faculty",
      color: "#8B5CF6",
      borderAccent: "hover:border-[#8B5CF6]/50 hover:shadow-[0_4px_24px_rgba(139,92,246,0.1)]",
      iconBg: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
      description:
        "Claim domain problems from the pool, assemble multi-disciplinary student teams, oversee technical milestones, and evaluate idea submissions.",
      features: [
        "Claim industrial challenges into department scope",
        "Form student teams and designate Team Leads",
        "Approve milestone submissions and extension requests",
        "Review independent student innovation pitches",
      ],
      ctaText: "Faculty Sign In",
      ctaHref: "/login?portal=staff",
    },
    {
      title: "Student Builder",
      icon: GraduationCap,
      badge: "Capstone Solution Solver",
      roleKey: "student",
      color: "#10B981",
      borderAccent: "hover:border-[#10B981]/50 hover:shadow-[0_4px_24px_rgba(16,185,129,0.1)]",
      iconBg: "bg-[#10B981]/10 text-[#10B981]",
      description:
        "Collaborate on real industrial problems, submit MIT-licensed GitHub repositories via Team Lead, and pitch independent ideas for incubation.",
      features: [
        "Work on verified engineering problem statements",
        "Connect public GitHub code with automatic MIT license verification",
        "Request architectural guidance from industry alumni",
        "Earn institutional merit endorsements on the leaderboard",
      ],
      ctaText: "Student Portal Access",
      ctaHref: "/login?portal=student",
    },
    {
      title: "Industry Expert & Alumni",
      icon: Award,
      badge: "Architectural Mentor",
      roleKey: "alumni",
      color: "#F59E0B",
      borderAccent: "hover:border-[#F59E0B]/50 hover:shadow-[0_4px_24px_rgba(245,158,11,0.1)]",
      iconBg: "bg-[#F59E0B]/10 text-[#F59E0B]",
      description:
        "Review active capstone projects, provide technical architecture feedback via the Guidance Board, and mentor future engineering talent.",
      features: [
        "Browse discoverable engineering initiatives",
        "Answer architectural threads on the Guidance Board",
        "Provide code-review feedback and production tips",
        "Earn verified mentor badges in the directory",
      ],
      ctaText: "Mentor Registration",
      ctaHref: "/signup?role=alumni",
    },
    {
      title: "MSME Admin Authority",
      icon: ShieldCheck,
      badge: "Central Governance & Quality Gate",
      roleKey: "admin",
      color: "#E11D48",
      borderAccent: "hover:border-[#E11D48]/50 hover:shadow-[0_4px_24px_rgba(225,29,72,0.1)]",
      iconBg: "bg-[#E11D48]/10 text-[#E11D48]",
      description:
        "Verify registered MSME credentials, inspect public GitHub repositories for licensing compliance, arbitrate revisions, and approve student ideas.",
      features: [
        "Verify MSME company documentation and GSTINs",
        "Verify GitHub solution trees and MIT compliance",
        "Authorize or request improvements on student ideas",
        "Graduate proven students to Industry Expert status",
      ],
      ctaText: "Admin Portal Gateway",
      ctaHref: "/admin/login",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Problem Submission",
      role: "Industry Partner",
      roleColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      desc: "Verified MSMEs submit challenges with constraints, domain taxonomy, and expected deliverable criteria to the central pool.",
    },
    {
      num: "02",
      title: "Triage & Team Assembly",
      role: "Faculty Director",
      roleColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      desc: "Faculty claims problem statements, configures deliverables, and assigns 1–4 students designating a responsible Team Lead.",
    },
    {
      num: "03",
      title: "Architecture Guidance",
      role: "Alumni Expert",
      roleColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      desc: "Student teams build solutions and request real-world architectural reviews via the Guidance Board from seasoned alumni.",
    },
    {
      num: "04",
      title: "GitHub Submission & Audit",
      role: "Team Lead & Admin",
      roleColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      desc: "Team Lead connects a public GitHub repository. MSME Admin verifies repository structure, MIT license, and grants approval.",
    },
    {
      num: "05",
      title: "Industry Rating & Impact",
      role: "Industry Partner",
      roleColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      desc: "The MSME tests the final delivered software and logs an official 1–5 star rating, completing the project lifecycle.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#FAF9F6] dark:bg-[#0D0E12] text-foreground">
      {/* Top Navbar */}
      <PublicNavHeader />

      <main className="flex-1">
        {/* =====================================================================
            1. HERO SECTION: Engineered with Depth, Modern Lighting & Identity
        ====================================================================== */}
        <section className="relative overflow-hidden pt-10 sm:pt-16 md:pt-24 pb-16 sm:pb-24 border-b border-black/[0.06] dark:border-white/[0.08]">
          {/* Subtle Engineering Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Atmospheric Ambient Lighting Glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] sm:w-[960px] h-[480px] bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-indigo-500/15 blur-[120px] rounded-full pointer-events-none opacity-80" />

          <div className="container relative mx-auto px-4 sm:px-6 max-w-5xl text-center">
            {/* Institution Badge */}
            <div className="flex justify-center mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.12] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-xs text-xs font-medium text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold text-foreground">Francis Xavier Engineering College</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground hidden min-[480px]:inline">Autonomous Institution</span>
                <span className="text-muted-foreground/60 hidden sm:inline">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold hidden sm:inline">MSME Incubation Hub</span>
              </div>
            </div>

            {/* High-Impact Visual Headline */}
            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12] sm:leading-[1.1] text-balance max-w-4xl mx-auto">
              Where Real Industrial Problems Meet{" "}
              <span className="bg-gradient-to-r from-[#007AFF] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                Academic Engineering Excellence
              </span>
            </h1>

            {/* Sub-Headline */}
            <p className="mt-4 sm:mt-6 text-sm min-[400px]:text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-normal">
              A role-governed ecosystem connecting verified MSME operational bottlenecks with student engineering teams, directed by academic faculty mentors and validated through open-source GitHub repositories.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto w-full px-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-7 text-sm font-semibold shadow-md bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-xl ios-press transition-all"
                >
                  <span>Register Your Enterprise</span>
                  <ArrowRight className="ml-2 size-4 shrink-0" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 text-sm font-semibold rounded-xl border-black/[0.12] dark:border-white/[0.16] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 ios-press"
                >
                  <span>Sign In to Hub</span>
                </Button>
              </Link>
              <Link href="/admin/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 sm:h-12 px-6 text-sm rounded-xl border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold ios-press"
                >
                  <ShieldCheck className="mr-1.5 size-4 text-rose-500 shrink-0" />
                  <span>Admin Gateway</span>
                </Button>
              </Link>
            </div>

            {/* Core Trust Indicators */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 text-xs text-muted-foreground font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>GSTIN-Verified MSMEs</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Institutional Domain OAuth</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Mandatory MIT Open Source</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-rose-500 shrink-0" />
                <span>Central Admin Governance</span>
              </span>
            </div>

            {/* ===================================================================
                2. LIVE INNOVATION TERMINAL (Interactive Enterprise Proof Preview)
            ==================================================================== */}
            <div className="mt-12 sm:mt-16 text-left">
              <div className="rounded-2xl border border-black/[0.1] dark:border-white/[0.12] bg-white/90 dark:bg-[#15161C]/90 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Simulated Window Titlebar */}
                <div className="px-4 sm:px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 font-mono text-xs text-muted-foreground hidden min-[480px]:inline">
                      fxec-msme.edu.in/projects/{currentPreview.id}
                    </span>
                  </div>

                  {/* Interactive Tab Switcher */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("powerloom")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        activePreviewTab === "powerloom"
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      AI Vision (Apex Tex)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("inventory")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        activePreviewTab === "inventory"
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Cloud ERP (Nellai)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("foundry")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        activePreviewTab === "foundry"
                          ? "bg-foreground text-background font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Acoustic DSP (South Castings)
                    </button>
                  </div>
                </div>

                {/* Simulated Live Workspace Dashboard */}
                <div className="p-5 sm:p-7 space-y-6">
                  {/* Project Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06]">
                          {currentPreview.id}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${currentPreview.badgeColor}`}>
                          {currentPreview.domain}
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" />
                          <span>Admin Quality Verified</span>
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                        {currentPreview.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Factory className="size-3.5 text-muted-foreground" />
                        <span>Submitted by: <strong>{currentPreview.company}</strong></span>
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        <span>{currentPreview.rating}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">Verified Delivery Audit</p>
                    </div>
                  </div>

                  {/* 3-Column Lifecycle Inspection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Col 1: Student Engineering Team */}
                    <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <GraduationCap className="size-4 text-emerald-500" />
                        <span>Engineering Team</span>
                      </div>
                      <p className="font-semibold text-sm text-foreground">{currentPreview.teamLead}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>Supervisor: {currentPreview.mentor}</span>
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.04] text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {currentPreview.milestone}
                      </div>
                    </div>

                    {/* Col 2: Deliverable Repository */}
                    <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <FolderGit2 className="size-4 text-blue-500" />
                        <span>Public Deliverable</span>
                      </div>
                      <p className="font-mono text-xs font-medium text-foreground truncate">{currentPreview.repo}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          MIT License ✓
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          PRD §8.4 Approved
                        </span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.04] text-[11px] text-muted-foreground flex items-center gap-1">
                        <GitBranch className="size-3.5" />
                        <span>Open Source Academic Contribution</span>
                      </div>
                    </div>

                    {/* Col 3: Technology Stack */}
                    <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Cpu className="size-4 text-purple-500" />
                        <span>Domain Architecture</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPreview.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-2.5 border-t border-black/[0.04] dark:border-white/[0.04] text-[11px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="size-3.5 text-rose-500" />
                        <span>Institutional IP Governance Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. REAL IMPACT METRICS STRIP
        ====================================================================== */}
        <section className="py-10 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-zinc-900/40">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
              <div className="border-l-2 border-[#007AFF] pl-4 sm:pl-5">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">40+</div>
                <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">MSME Challenges</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Sourced from regional Tamil Nadu industries</p>
              </div>
              <div className="border-l-2 border-[#10B981] pl-4 sm:pl-5">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">100%</div>
                <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">Open Source Codebases</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Verified MIT license on public GitHub</p>
              </div>
              <div className="border-l-2 border-[#8B5CF6] pl-4 sm:pl-5">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">5 Roles</div>
                <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">Strict Governance</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">RBAC permissions with server-side validation</p>
              </div>
              <div className="border-l-2 border-[#F59E0B] pl-4 sm:pl-5">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">350+</div>
                <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">Engineers &amp; Mentors</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">Active students, staff, and alumni directors</p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. FIVE DEDICATED WORKSPACES: Professional Cards with Role Identity
        ====================================================================== */}
        <section className="py-14 sm:py-20 md:py-28 container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-xs font-semibold border-black/[0.08] dark:border-white/[0.12]">
              <Layers className="size-3.5 mr-1.5 text-primary" />
              Role-Governed Academic Architecture
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Tailored Workspaces for Every Stakeholder
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every participant operates within a tailored, authenticated environment designed specifically for their responsibilities in the project lifecycle.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <StaggerItem key={role.title} className="h-full">
                  <div
                    className={`rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#15161C] p-6 h-full flex flex-col justify-between transition-all duration-200 ${role.borderAccent}`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`p-2.5 rounded-xl ${role.iconBg}`}>
                          <Icon className="size-5 shrink-0" />
                        </div>
                        <Badge variant="secondary" className="text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5">
                          {role.badge}
                        </Badge>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {role.description}
                      </p>

                      {/* Key Capabilities Checklist */}
                      <ul className="space-y-2 border-t border-black/[0.05] dark:border-white/[0.06] pt-4 mb-6">
                        {role.features.map((feature) => (
                          <li key={feature} className="text-xs text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link href={role.ctaHref} className="block w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-9 text-xs font-semibold rounded-xl border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.03] dark:hover:bg-white/[0.04] flex items-center justify-between px-3"
                        >
                          <span>{role.ctaText}</span>
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* =====================================================================
            5. GOVERNED END-TO-END PIPELINE (Interactive Visual Flow)
        ====================================================================== */}
        <section className="py-14 sm:py-20 md:py-24 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/40 dark:bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <Badge variant="secondary" className="mb-2.5 text-xs font-semibold">
                PRD §8 Lifecycle Specification
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                How MSME Hub Works
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Transparent 5-stage engineering lifecycle from problem discovery to audited open-source code delivery and industrial rating.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#15161C] p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-foreground/20 font-mono tracking-tight">
                        {step.num}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${step.roleColor}`}>
                        {step.role}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground mb-1.5 leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. INSTITUTIONAL CALL TO ACTION
        ====================================================================== */}
        <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.12] bg-gradient-to-br from-white via-white to-amber-500/5 dark:from-[#15161C] dark:via-[#15161C] dark:to-indigo-500/10 p-8 sm:p-14 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-center mb-4">
              <MsmeLogoMark size={48} />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground max-w-2xl mx-auto">
              Ready to Collaborate with Francis Xavier Engineering College?
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join dozens of industrial partners and hundreds of engineering students building production-ready open-source technology for real business challenges.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto h-11 px-7 font-semibold text-sm rounded-xl bg-[#007AFF] hover:bg-[#007AFF]/90 text-white">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6 font-semibold text-sm rounded-xl">
                  Sign In to Existing Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          7. INSTITUTIONAL FOOTER
      ====================================================================== */}
      <footer className="border-t border-black/[0.08] dark:border-white/[0.08] py-8 sm:py-10 bg-white/70 dark:bg-zinc-950/70 text-xs text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MsmeLogoMark size={28} />
            <div>
              <p className="font-bold text-foreground">FXEC MSME Collaborative Hub</p>
              <p className="text-[11px] text-muted-foreground">Francis Xavier Engineering College · Autonomous Institution, Tirunelveli, Tamil Nadu</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Register</Link>
            <Link href="/admin/login" className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium">
              <ShieldCheck className="size-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 pt-6 mt-6 border-t border-black/[0.04] dark:border-white/[0.04] text-center text-[11px] text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Francis Xavier Engineering College. Approved by AICTE, Affiliated to Anna University. All Rights Reserved.</p>
          <p className="font-mono text-[10px]">Built for Regional MSME Innovation &amp; Academic Capstone Excellence</p>
        </div>
      </footer>
    </div>
  );
}
