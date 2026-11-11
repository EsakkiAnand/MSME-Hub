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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PublicNavHeader } from "@/components/navigation/public-nav-header";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";

export default function Home() {
  const roles = [
    {
      title: "Industry Partner",
      icon: Building2,
      badge: "Problem Provider",
      description:
        "Submit operational challenges, browse student innovations in the showcase, and rate delivered solutions.",
      accent: "border-blue-500/20 hover:border-blue-500/40",
      iconBg: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Staff & Faculty",
      icon: Users,
      badge: "Project Director",
      description:
        "Triage domain problems, assemble collaborative student teams, oversee milestones, and evaluate ideas.",
      accent: "border-purple-500/20 hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Student Builder",
      icon: GraduationCap,
      badge: "Solution Solver",
      description:
        "Collaborate on active projects, submit MIT-licensed GitHub repositories via Team Lead, and pitch ideas.",
      accent: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Industry Expert",
      icon: Award,
      badge: "Expert Guidance",
      description:
        "Browse active projects, provide architectural feedback via Guidance Board, and earn mentor endorsements.",
      accent: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "MSME Admin",
      icon: ShieldCheck,
      badge: "Ecosystem Governance",
      description:
        "Verify industry credentials, inspect public GitHub repositories, manage revisions, and enforce governance.",
      accent: "border-rose-500/30 hover:border-rose-500/50 shadow-xs",
      iconBg: "bg-rose-500/10 text-rose-500",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Industry Problem Submission",
      desc: "Verified MSMEs submit challenges with constraints and expected deliverables to the domain pool.",
    },
    {
      num: "02",
      title: "Staff Triage & Team Assembly",
      desc: "Staff claims problems and directly assigns 1 to N students, designating a Student Team Lead.",
    },
    {
      num: "03",
      title: "Development & Industry Expert Guidance",
      desc: "Students build solutions and request architectural guidance from registered Industry Experts via Guidance Board.",
    },
    {
      num: "04",
      title: "GitHub Submission & Admin Approval",
      desc: "Team Lead submits public GitHub repository. MSME Admin reviews code and grants formal approval.",
    },
    {
      num: "05",
      title: "Industry Rating & Portfolio",
      desc: "Industry Partner tests solution and submits 1–5 star rating, completing the project lifecycle.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Fully Responsive Header with Accessible Mobile Drawer */}
      <PublicNavHeader />

      <main className="flex-1">
        {/* Responsive Hero Section */}
        <section className="relative overflow-hidden py-8 sm:py-14 md:py-20 lg:py-28 border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="mb-3 sm:mb-5 gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium border-border/80 bg-background/80 shadow-2xs"
              >
                <Sparkles className="size-3.5 text-primary shrink-0" />
                <span className="truncate">Industry-Academia Collaborative Innovation</span>
              </Badge>
            </div>

            <h1 className="text-2xl min-[360px]:text-[28px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.2] sm:leading-[1.15] text-balance max-w-3xl mx-auto">
              Bridging Real Industry Problems with Academic Talent
            </h1>

            <p className="mt-3 sm:mt-5 text-xs min-[360px]:text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl sm:max-w-2xl mx-auto px-2">
              A role-governed ecosystem where verified MSMEs submit operational bottlenecks, university teams build MIT-licensed open-source solutions, industry experts mentor, and admins validate quality.
            </p>

            {/* Responsive Primary Actions: Distinct entry points for Register, Sign In, and Admin */}
            <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 max-w-md sm:max-w-none mx-auto w-full px-2">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-7 text-xs sm:text-sm font-semibold shadow-xs ios-press"
                >
                  <span>Register Your Organization</span>
                  <ArrowRight className="ml-1.5 size-4 shrink-0" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm font-semibold ios-press"
                >
                  <span>Sign In to Hub</span>
                </Button>
              </Link>
              <Link href="/admin/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-10 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 font-semibold ios-press"
                >
                  <ShieldCheck className="mr-1.5 size-4 text-rose-500 shrink-0" />
                  <span>Admin Portal</span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators: Gracefully wraps across 320px-414px viewports without clipping */}
            <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2 text-[11px] sm:text-xs text-muted-foreground max-w-2xl mx-auto px-2">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Verified MSMEs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>Institutional OAuth</span>
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                <span>MIT Open Source</span>
              </span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="size-3.5 text-rose-500 shrink-0" />
                <span>Central Governance</span>
              </span>
            </div>
          </div>
        </section>

        {/* Roles Grid with Smooth Staggered Animation & Mobile Proportions */}
        <section className="py-8 sm:py-14 md:py-18 container mx-auto px-3.5 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Five Dedicated Roles
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Structured permissions and tailored workspaces ensuring seamless governance and accountability.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <StaggerItem key={role.title} className="h-full">
                  <Card
                    className={`border rounded-xl transition-all duration-200 ios-card-interactive flex flex-col justify-between p-3.5 sm:p-5 h-full ${role.accent}`}
                  >
                    <div>
                      {/* Compact aligned header: Icon + Title + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${role.iconBg}`}>
                            <Icon className="size-4 shrink-0" />
                          </div>
                          <CardTitle className="text-sm sm:text-base font-bold text-foreground truncate">
                            {role.title}
                          </CardTitle>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs px-2 py-0.5 shrink-0 font-medium"
                        >
                          {role.badge}
                        </Badge>
                      </div>

                      {/* Concise, readable description */}
                      <CardDescription className="text-xs sm:text-[13px] text-muted-foreground leading-normal sm:leading-relaxed">
                        {role.description}
                      </CardDescription>
                    </div>

                    {/* Dedicated MSME Admin action */}
                    {role.title === "MSME Admin" && (
                      <div className="mt-3 pt-2.5 border-t border-border/50">
                        <Link href="/admin/login">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 ios-press"
                          >
                            <ShieldCheck className="size-3.5 mr-1.5 shrink-0" />
                            <span>Access MSME Admin Portal &rarr;</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        {/* Workflow Pipeline */}
        <section className="py-8 sm:py-14 md:py-18 border-t bg-muted/20">
          <div className="container mx-auto px-3.5 sm:px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
              <Badge variant="secondary" className="mb-2 sm:mb-2.5 text-xs">
                End-to-End Pipeline
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                How MSME-Hub Works
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                From initial problem submission to verified GitHub repository delivery and industry satisfaction rating.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="relative p-3.5 sm:p-4 rounded-xl border bg-card/80 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div>
                    <span className="text-lg sm:text-xl font-black text-primary/30 tracking-tight block">
                      {step.num}
                    </span>
                    <h3 className="font-semibold text-xs sm:text-sm mt-1.5 mb-1 text-foreground leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Responsive Footer */}
      <footer className="border-t py-5 sm:py-7 bg-background">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© 2026 FXEC MSME Hub. Industry-Academia Collaborative Innovation.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1">
              <GitBranch className="size-3.5 shrink-0" /> Public GitHub Deliverables
            </span>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/admin/login"
              className="hover:underline inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium"
            >
              <ShieldCheck className="size-3.5 shrink-0" /> MSME Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
