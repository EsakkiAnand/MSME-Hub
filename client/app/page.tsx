import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Home() {
  const roles = [
    {
      title: "Industry Partner",
      icon: Building2,
      badge: "Problem Provider",
      description:
        "Verified MSMEs submit real-world operational challenges, browse student innovations in the Sponsorship Showcase, and rate delivered solutions.",
      accent: "border-blue-500/20 hover:border-blue-500/40",
      iconBg: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Staff & Faculty",
      icon: Users,
      badge: "Project Director",
      description:
        "Triage industry problems from the domain pool, form collaborative multi-student teams, manage deadlines, and evaluate student ideas.",
      accent: "border-purple-500/20 hover:border-purple-500/40",
      iconBg: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Student Builder",
      icon: GraduationCap,
      badge: "Solution Solver",
      description:
        "Collaborate on industry projects (max 2 active), submit MIT-licensed public GitHub repositories via Team Lead, and pitch independent ideas.",
      accent: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Alumni Mentor",
      icon: Award,
      badge: "Expert Guidance",
      description:
        "Browse active projects by domain, provide architectural and security feedback, answer Guidance Board requests, and earn helpful endorsements.",
      accent: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "MSME Admin",
      icon: ShieldCheck,
      badge: "Ecosystem Governance",
      description:
        "Verify industry business credentials, inspect submitted GitHub repositories, manage revisions, and moderate satisfaction ratings.",
      accent: "border-rose-500/20 hover:border-rose-500/40",
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
      title: "Development & Alumni Guidance",
      desc: "Students build solutions and request architectural guidance from registered Alumni via the Guidance Board.",
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
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              M
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">MSME-Hub</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
                Innovation Platform
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <Badge variant="outline" className="mb-4 gap-1.5 px-3 py-1">
              <Sparkles className="size-3.5 text-primary" />
              Industry-Academia Collaborative Innovation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Bridging Real Industry Problems with Academic Talent
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A role-governed ecosystem where verified MSMEs submit operational bottlenecks, university teams build MIT-licensed open-source solutions, alumni mentor, and admins validate quality.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  Register Your Organization
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  <Lightbulb className="mr-2 size-4 text-amber-500" />
                  Explore Sponsorship Showcase
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" /> Verified MSMEs
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" /> Institutional OAuth
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" /> MIT Open Source
              </span>
            </div>
          </div>
        </section>

        {/* Roles Grid */}
        <section className="py-20 container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Five Dedicated Roles</h2>
            <p className="mt-3 text-muted-foreground">
              Structured permissions and tailored workspaces ensuring seamless governance and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.title}
                  className={`border transition-all duration-200 hover:shadow-md ${role.accent}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-lg ${role.iconBg}`}>
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {role.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription className="text-sm mt-2 leading-relaxed">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Workflow Pipeline */}
        <section className="py-20 border-t bg-muted/30">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="secondary" className="mb-3">
                End-to-End Pipeline
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">How MSME-Hub Works</h2>
              <p className="mt-3 text-muted-foreground">
                From initial problem submission to verified GitHub repository delivery and industry satisfaction rating.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="relative p-5 rounded-xl border bg-card/60 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-2xl font-black text-primary/30 tracking-tight">
                      {step.num}
                    </span>
                    <h3 className="font-semibold text-base mt-2 mb-1.5">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 MSME-Hub. Built with Next.js, Better Auth, Prisma & PostgreSQL.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <GitBranch className="size-3.5" /> Public GitHub Deliverables
            </span>
            <span>•</span>
            <span>Protected by Admin Moderation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
