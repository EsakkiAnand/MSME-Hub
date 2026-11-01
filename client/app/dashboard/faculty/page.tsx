"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  FolderKanban,
  FileCheck2,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
  Crown,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import {
  initialStudents,
  initialProjects,
  initialIdeaSubmissions,
} from "@/lib/faculty-data";

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    icon: Clock,
  },
  SOLUTION_SUBMITTED: {
    label: "Under Review",
    badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    icon: CheckCircle2,
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Needed",
    badgeClass: "bg-[#FF3B30]/10 text-[#FF3B30] border-transparent dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    icon: AlertCircle,
  },
};

const recentActivities = [
  {
    id: 1,
    title: "Solution Submitted for Review",
    project: "PRJ-2024-007 (Predictive Maintenance IoT Dashboard)",
    student: "Santhosh G (Team Lead)",
    time: "2h ago",
    link: "/dashboard/faculty/project-details?id=PRJ-2024-007",
  },
  {
    id: 2,
    title: "New Student Innovation Pitch",
    project: "AI-Powered Micro-Cold Storage Automation",
    student: "Mohamed Farhan",
    time: "5h ago",
    link: "/dashboard/faculty/idea-submissions",
  },
];

export default function FacultyDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const facultyName = user?.name ?? "Dr. Selvaraj M";
  const facultyId = (user as any)?.uniqueId || "FAC0001";
  const department = (user as any)?.department || "Computer Science & Engineering";

  const projectsList = Object.values(initialProjects);
  const activeProjectsCount = projectsList.filter((p) => p.status === "IN_PROGRESS").length;
  const underReviewCount = projectsList.filter((p) => p.status === "SOLUTION_SUBMITTED").length;
  const approvedProjectsCount = projectsList.filter((p) => p.status === "APPROVED").length;
  const assignedStudentsCount = initialStudents.length;
  const pendingIdeasCount = initialIdeaSubmissions.filter((i) => i.status === "PENDING_REVIEW").length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* 1. Compact Faculty Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]/80 dark:border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
            Welcome back, {facultyName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground dark:text-slate-300">Faculty ID:</span>
              <CopyIdBadge id={facultyId} size="xs" />
            </div>
            <span className="text-slate-300 dark:text-foreground">·</span>
            <span>{department}</span>
            <span className="text-slate-300 dark:text-foreground">·</span>
            <span>Academic Year 2026–2027</span>
          </div>
        </div>

        {/* Primary Shortcuts */}
        <div className="flex items-center gap-2 shrink-0">
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

      {/* 2. Standardized Equal-Height Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Assigned Students */}
        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Assigned Students
          </span>
          <div className="mt-3">
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {assignedStudentsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Across 4 project teams
            </p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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

        {/* Pending Review */}
        <Link
          href="/dashboard/faculty/projects"
          className="h-full rounded-[16px] border border-[#FF9500]/30 bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#FF9500]/60 transition-all group cursor-pointer"
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

        {/* Approved Projects */}
        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
      </div>

      {/* 3. Actionable Pending Work Notice */}
      {underReviewCount > 0 && (
        <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-900 dark:text-amber-200 truncate">
              {underReviewCount} Solution Submission awaiting review
            </span>
            <span className="hidden sm:inline text-amber-700 dark:text-amber-300/80 truncate">
              · PRJ-2024-007 (Predictive Maintenance IoT Dashboard)
            </span>
          </div>
          <Link
            href="/dashboard/faculty/project-details?id=PRJ-2024-007"
            className="shrink-0 font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white hover:underline flex items-center gap-1 ml-3"
          >
            <span>Review Submission</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>
      )}

      {/* 4. Main Two-Column Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column (2 Cols): Active Projects & Assigned Students */}
        <div className="lg:col-span-2 space-y-5 min-w-0">
          {/* Active Projects Overview */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 dark:border-border overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground dark:text-foreground">
                  Active Projects
                </h2>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  Problem statements currently under your supervision
                </p>
              </div>
              <Link
                href="/dashboard/faculty/projects"
                className="text-xs font-medium text-[#007AFF] dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View all ({projectsList.length})</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06] dark:divide-border/60">
              {projectsList.map((project) => {
                const st = statusConfig[project.status] ?? statusConfig.IN_PROGRESS;
                const leadMember =
                  project.team.find((m) => m.isLead) || project.team[0] || { name: "Unassigned" };

                return (
                  <div
                    key={project.id}
                    className="p-4 hover:bg-black/[0.02] dark:bg-white/[0.03]/75 dark:hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-muted-foreground dark:text-slate-300 bg-slate-100 dark:bg-muted px-1.5 py-0.5 rounded">
                          {project.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${st.badgeClass}`}
                        >
                          {st.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground dark:text-muted-foreground hidden sm:inline">
                          Due {project.deadline}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground dark:text-foreground truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground dark:text-muted-foreground truncate">
                        <span>{project.msmeCompany}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-foreground dark:text-slate-300 font-medium truncate">
                          <Crown className="size-3 text-amber-500 shrink-0" />
                          Lead: {leadMember.name}
                        </span>
                        <span>·</span>
                        <span>{project.team.length} Students</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center sm:self-center">
                      <Link
                        href={`/dashboard/faculty/project-details?id=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-white dark:bg-card text-foreground dark:text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03] dark:hover:bg-muted transition-colors"
                      >
                        <span>Details</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Students Table */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 dark:border-border overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground dark:text-foreground">
                  Assigned Students
                </h2>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  Students currently mentored in your project domain
                </p>
              </div>
              <Link
                href="/dashboard/faculty/students"
                className="text-xs font-medium text-[#007AFF] dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Directory ({initialStudents.length})</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03]/75 dark:bg-muted/40 border-b border-slate-100 dark:border-border text-muted-foreground dark:text-muted-foreground font-medium">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Student Name</th>
                    <th className="px-3 py-2.5 font-medium">Reg No</th>
                    <th className="px-3 py-2.5 font-medium">Dept</th>
                    <th className="px-3 py-2.5 font-medium">Assigned Project</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06] dark:divide-border/60">
                  {initialStudents.slice(0, 5).map((student) => {
                    const st = statusConfig[student.projectStatus] ?? statusConfig.IN_PROGRESS;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-black/[0.02] dark:bg-white/[0.02] dark:hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground dark:text-foreground">
                              {student.name}
                            </span>
                            {student.isLead && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                                Lead
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground dark:text-muted-foreground">
                            {student.role}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-muted-foreground dark:text-slate-300">
                          {student.regNo}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-foreground dark:text-slate-300">
                          {student.department}
                        </td>
                        <td className="px-3 py-2.5 max-w-[200px]">
                          <Link
                            href={`/dashboard/faculty/project-details?id=${student.projectId}`}
                            className="text-[#007AFF] dark:text-blue-400 hover:underline font-medium truncate block"
                          >
                            {student.projectName}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${st.badgeClass}`}
                          >
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Recent Activity & Idea Queue */}
        <div className="space-y-5 min-w-0">
          {/* Recent Activity Timeline */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 dark:border-border overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-border">
              <h2 className="text-sm font-semibold text-foreground dark:text-foreground">
                Recent Activity
              </h2>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                Student submissions and project updates
              </p>
            </div>

            <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06] dark:divide-border/60">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-4 hover:bg-black/[0.02] dark:bg-white/[0.02] dark:hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-foreground dark:text-foreground leading-snug">
                      {act.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground dark:text-muted-foreground shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-slate-300 mt-1 truncate">
                    {act.project}
                  </p>
                  <p className="text-[11px] text-muted-foreground dark:text-muted-foreground mt-0.5">
                    {act.student}
                  </p>
                  <Link
                    href={act.link}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#007AFF] dark:text-blue-400 hover:underline"
                  >
                    <span>Open review</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </div>

          {/* Compact Idea Submissions Card */}
          <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08]/90 dark:border-border p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-[#007AFF] dark:text-blue-400" />
                <h3 className="text-xs font-semibold text-foreground dark:text-foreground uppercase tracking-wider">
                  Student Ideas
                </h3>
              </div>
              {pendingIdeasCount > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40">
                  {pendingIdeasCount} pending
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground leading-relaxed">
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
        </div>
      </div>
    </div>
  );
}
