"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  Crown,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStaffProjects, getStudentDirectory } from "@/app/actions/staff";

interface LiveProject {
  id: string;
  title: string;
  status: string;
  targetDeadline: string | null;
  problem: {
    description: string;
    domain: string;
    industry: { companyName: string; companyId: string; domain: string };
  } | null;
  members: {
    id: string;
    name: string;
    uniqueId: string | null;
    email: string;
    role: string;
    isLead: boolean;
  }[];
}

export default function FacultyDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const facultyName = user?.name ?? "Staff Mentor";
  const facultyId = (user as any)?.uniqueId;

  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [projRes, stuRes] = await Promise.all([getStaffProjects(), getStudentDirectory()]);
      if (projRes.success) setProjects((projRes.projects as any[]) || []);
      if (stuRes.success) setStudents((stuRes.students as any[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const projectsList = projects;
  const activeProjectsCount = projectsList.filter(
    (p) => ["ASSIGNED", "IN_PROGRESS", "REVISION_IN_PROGRESS"].includes(p.status)
  ).length;
  const underReviewCount = projectsList.filter((p) => p.status === "SOLUTION_SUBMITTED").length;
  const approvedProjectsCount = projectsList.filter(
    (p) => p.status === "APPROVED" || p.status === "COMPLETED"
  ).length;
  const assignedStudentsCount = projectsList.reduce((acc, p) => acc + p.members.length, 0);
  const pendingIdeasCount = 0; // Idea queue counts managed on /dashboard/faculty/idea-submissions

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading your faculty dashboard...</span>
      </div>
    );
  }

  const pendingReviewProjects = projectsList.filter((p) => p.status === "SOLUTION_SUBMITTED");

  return (
    <div className="space-y-6">
      {/* 1. Faculty Profile Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Welcome back, {facultyName}
            </h1>
            {facultyId && <CopyIdBadge id={facultyId} size="xs" />}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
              Faculty Supervisor
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>Academic Year 2026–2027</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Assigned Mentorships &amp; Industrial Challenges</span>
          </div>
        </div>

        {/* Primary Shortcuts */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Link
            href="/dashboard/faculty/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] text-foreground hover:bg-black/[0.05] active:scale-[0.98] transition-all"
          >
            <FolderKanban className="size-3.5 text-muted-foreground" />
            <span>Assigned Projects</span>
          </Link>

          <Link
            href="/dashboard/faculty/idea-submissions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-[10px] bg-[#007AFF] text-white hover:bg-[#007AFF]/90 active:scale-[0.98] transition-all shadow-none"
          >
            <Lightbulb className="size-3.5" />
            <span>Idea Queue</span>
            {pendingIdeasCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-bold">
                {pendingIdeasCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 2. Statistics Grid */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <StaggerItem className="h-full">
          <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] ios-card-interactive">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Supervised Students
            </span>
            <div className="mt-3">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {assignedStudentsCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Across {projectsList.length} project teams
              </p>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] ios-card-interactive">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Active Projects
            </span>
            <div className="mt-3">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {activeProjectsCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                In active development
              </p>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <Link
            href="/dashboard/faculty/projects"
            className="h-full rounded-[16px] border border-[#FF9500]/30 bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#FF9500]/60 transition-all duration-150 group cursor-pointer active:scale-[0.99] block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#FF9500] uppercase tracking-wider">
                Pending Reviews
              </span>
              <span className="size-2 rounded-full bg-[#FF9500] animate-pulse" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-semibold tracking-tight text-[#FF9500]">
                {underReviewCount}
              </div>
              <p className="text-[11px] font-medium text-[#FF9500] mt-1 flex items-center gap-0.5">
                <span>Awaiting evaluation</span>
                <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </div>
          </Link>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] ios-card-interactive">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Approved Projects
            </span>
            <div className="mt-3">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {approvedProjectsCount}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                MSME sign-off completed
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* 3. Actionable Pending Work Notice */}
      {underReviewCount > 0 && pendingReviewProjects[0] && (
        <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-900 dark:text-amber-200 truncate">
              {underReviewCount} Solution Submission{underReviewCount > 1 ? "s" : ""} awaiting review
            </span>
            <span className="hidden sm:inline text-amber-700 dark:text-amber-300/80 truncate">
              · {pendingReviewProjects[0].id} ({pendingReviewProjects[0].title})
            </span>
          </div>
          <Link
            href={`/dashboard/faculty/project-details?id=${pendingReviewProjects[0].id}`}
            className="shrink-0 font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white hover:underline flex items-center gap-1 ml-3"
          >
            <span>Review Submission</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>
      )}

      {/* 4. Main Two-Column Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          {/* Active Projects Overview */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Active Projects</h2>
                <p className="text-xs text-muted-foreground">
                  Problem statements currently under your supervision
                </p>
              </div>
              <Link
                href="/dashboard/faculty/projects"
                className="text-xs font-medium text-[#007AFF] hover:underline flex items-center gap-1"
              >
                <span>View all ({projectsList.length})</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {projectsList.slice(0, 5).map((project) => {
                const leadMember =
                  project.members.find((m) => m.isLead) || project.members[0] || { name: "Unassigned" };

                return (
                  <div
                    key={project.id}
                    className="p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-muted-foreground bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {project.id.slice(0, 8)}
                        </span>
                        <StatusBadge status={project.status} />
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          Due {project.targetDeadline ? new Date(project.targetDeadline).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground truncate">{project.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground truncate">
                        <span>{project.problem?.industry?.companyName || "Student-Originated Idea"}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-foreground font-medium truncate">
                          <Crown className="size-3 text-amber-500 shrink-0" />
                          Lead: {(leadMember as any).name}
                        </span>
                        <span>·</span>
                        <span>{project.members.length} Students</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center sm:self-center">
                      <Link
                        href={`/dashboard/faculty/project-details?id=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white text-foreground hover:bg-black/[0.02] transition-colors"
                      >
                        <span>Details</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {projectsList.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No projects assigned to you yet. Claim a problem from the industry pool to get started.
                </div>
              )}
            </div>
          </div>

          {/* Assigned Students Directory */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Student Directory</h2>
                <p className="text-xs text-muted-foreground">
                  Verified students available for project assignment
                </p>
              </div>
              <Link
                href="/dashboard/faculty/students"
                className="text-xs font-medium text-[#007AFF] hover:underline flex items-center gap-1"
              >
                <span>Full Directory ({students.length})</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-slate-100 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-5 py-2.5">Student</th>
                    <th className="px-3 py-2.5">Reg No</th>
                    <th className="px-3 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Active Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                  {students.slice(0, 5).map((student: any) => (
                    <tr
                      key={student.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-2.5">
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <span className="text-[11px] text-muted-foreground">{student.institutionDomain || ""}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-muted-foreground">
                        {student.uniqueId || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-foreground max-w-[200px] truncate">{student.email}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge
                          label={`${student.activeProjectCount ?? 0} / 2`}
                          variant={student.activeProjectCount >= 2 ? "warning" : "neutral"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No verified students in the directory yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5 min-w-0">
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-[#007AFF]" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Student Ideas
                </h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review innovative student proposals and assign academic mentorship before idea screening.
            </p>
            <Link
              href="/dashboard/faculty/idea-submissions"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-foreground dark:hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <span>Manage Idea Queue</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#007AFF]" />
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Industry Problem Pool
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse verified industrial challenges submitted by MSME partners and claim them for your department.
            </p>
            <Link
              href="/dashboard/faculty/problem-bank"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold px-3.5 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground hover:bg-black/[0.02] transition-colors shadow-2xs"
            >
              <span>Open Problem Bank</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
