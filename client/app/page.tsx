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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNavHeader } from "@/components/navigation/public-nav-header";
import { MsmeFullLogo, MsmeLogoMark } from "@/components/ui/msme-logo";

export default function Home() {
  const roles = [
    {
      title: "Industry Partner",
      badge: "Problem Provider",
      icon: Building2,
      iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50",
      description: "Submit operational challenges, monitor project milestones, and rate completed solutions.",
      href: "/login?portal=industry",
      cta: "Industry Login",
    },
    {
      title: "Student Builder",
      badge: "Solution Solver",
      icon: GraduationCap,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50",
      description: "Solve real-world industrial problems, submit GitHub deliverables, and pitch ideas.",
      href: "/login?portal=student",
      cta: "Student Login",
    },
    {
      title: "Faculty / Staff",
      badge: "Project Director",
      icon: Users,
      iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50",
      description: "Triage domain problems, assemble student teams, and guide capstone milestones.",
      href: "/login?portal=staff",
      cta: "Faculty Login",
    },
    {
      title: "Alumni & Expert",
      badge: "Technical Mentor",
      icon: Award,
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50",
      description: "Provide architectural guidance, review active repositories, and mentor students.",
      href: "/login?portal=alumni",
      cta: "Mentor Login",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Submit Challenge",
      role: "Industry",
      desc: "Verified MSMEs post operational challenges and deliverable requirements.",
    },
    {
      step: "02",
      title: "Assign Team",
      role: "Faculty",
      desc: "Faculty claims problems and forms student teams with designated Leads.",
    },
    {
      step: "03",
      title: "Build & Guide",
      role: "Students & Alumni",
      desc: "Students build solutions and receive architectural guidance from mentors.",
    },
    {
      step: "04",
      title: "Verify & Rate",
      role: "Admin & Industry",
      desc: "Admin audits MIT GitHub code; Industry Partner tests and submits star rating.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 text-foreground">
      {/* Navigation Header */}
      <PublicNavHeader />

      <main className="flex-1">
        {/* =====================================================================
            1. HERO SECTION: Clean, Focused, Matching Form Aesthetic
        ====================================================================== */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            {/* Official Brand Logo */}
            <div className="flex justify-center mb-4 sm:mb-5">
              <MsmeFullLogo width={92} priority />
            </div>

            {/* Pill Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground border border-black/[0.06] dark:border-white/[0.08]">
                <Sparkles className="size-3 text-amber-500" />
                <span>Role-Governed Innovation Portal</span>
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight text-balance">
              Bridging Industry Problems with Academic Talent
            </h1>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A collaborative ecosystem connecting verified MSMEs, student engineers, faculty directors, and industry alumni.
            </p>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="default"
                  className="w-full sm:w-auto h-10 px-6 text-xs sm:text-sm font-semibold rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white shadow-xs ios-press"
                >
                  <span>Register Organization</span>
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto h-10 px-6 text-xs sm:text-sm font-semibold rounded-lg border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#1C1C1E] shadow-2xs hover:bg-black/[0.02] ios-press"
                >
                  <span>Sign In to Hub</span>
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified MSMEs</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Institutional OAuth</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>MIT Open Source</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Quality Governed</span>
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. ROLE WORKSPACES: Crisp, Clean Persona Cards (Like Signup Screen)
        ====================================================================== */}
        <section className="py-8 sm:py-12 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Select Your Workspace
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Choose your role to access your dedicated dashboard and tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Link
                    key={role.title}
                    href={role.href}
                    className="group rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1C1C1E] p-5 shadow-2xs hover:shadow-xs hover:border-black/[0.16] dark:hover:border-white/[0.2] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`p-2 rounded-lg border ${role.iconColor}`}>
                          <Icon className="size-4 shrink-0" />
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground">
                          {role.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-primary">
                      <span>{role.cta}</span>
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Central Admin Access Strip */}
            <div className="mt-4 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-[#1C1C1E] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shrink-0">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                    MSME Admin &amp; Ecosystem Governance
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Root portal for verifying industry partners, auditing GitHub trees, and managing student ideas.
                  </p>
                </div>
              </div>
              <Link href="/admin/login" className="shrink-0 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <span>Admin Portal &rarr;</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. CLEAN 4-STEP WORKFLOW
        ====================================================================== */}
        <section className="py-8 sm:py-12 border-t border-black/[0.06] dark:border-white/[0.08] bg-white/40 dark:bg-zinc-900/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                How MSME Hub Works
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                End-to-end governance lifecycle from problem statement to evaluated solution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#1C1C1E] p-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">
                      Step {step.step}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground">
                      {step.role}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          4. CLEAN INSTITUTIONAL FOOTER
      ====================================================================== */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] py-6 bg-white dark:bg-[#1C1C1E] text-xs text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <MsmeLogoMark size={24} />
            <div>
              <span className="font-semibold text-foreground">FXEC MSME Hub</span>
              <span className="text-muted-foreground/80 ml-1.5 hidden sm:inline">
                · Francis Xavier Engineering College (Autonomous)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Register
            </Link>
            <Link
              href="/admin/login"
              className="text-rose-600 dark:text-rose-400 hover:underline font-medium"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
