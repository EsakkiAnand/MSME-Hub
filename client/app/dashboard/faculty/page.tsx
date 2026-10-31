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
  GraduationCap,
  ExternalLink,
  Crown,
  Lightbulb,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { initialStudents, initialProjects, initialIdeaSubmissions } from "@/lib/faculty-data";

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  SOLUTION_SUBMITTED: {
    label: "Under Review",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Needed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
};

const recentActivities = [
  {
    id: 1,
    title: "Solution Submitted for Review",
    project: "PRJ-2024-007 (Predictive Maintenance IoT Dashboard)",
    student: "Santhosh G (Team Lead)",
    time: "2 hours ago",
    type: "REVIEW_AWAITING",
    link: "/dashboard/faculty/project-details?id=PRJ-2024-007",
  },
  {
    id: 2,
    title: "New Student Innovation Pitch",
    project: "AI-Powered Micro-Cold Storage Automation",
    student: "Mohamed Farhan",
    time: "5 hours ago",
    type: "IDEA_SUBMISSION",
    link: "/dashboard/faculty/idea-submissions",
  },
  {
    id: 3,
    title: "Extension Request Submitted",
    project: "PRJ-2024-012 (Cloud Micro-ERP for Brassware)",
    student: "Karthikeyan S (Team Lead)",
    time: "1 day ago",
    type: "EXTENSION",
    link: "/dashboard/faculty/project-details?id=PRJ-2024-012",
  },
  {
    id: 4,
    title: "Milestone Completed",
    project: "PRJ-2024-001 (Smart Inventory Management)",
    student: "Mohamed Farhan",
    time: "2 days ago",
    type: "MILESTONE",
    link: "/dashboard/faculty/project-details?id=PRJ-2024-001",
  },
];

export default function FacultyDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const facultyName = user?.name ?? "Dr. Selvaraj M";

  const projectsList = Object.values(initialProjects);
  const activeProjectsCount = projectsList.filter((p) => p.status === "IN_PROGRESS").length;
  const underReviewCount = projectsList.filter((p) => p.status === "SOLUTION_SUBMITTED").length;
  const approvedProjectsCount = projectsList.filter((p) => p.status === "APPROVED").length;
  const assignedStudentsCount = initialStudents.length;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty Mentor &amp; Project Director Console
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome, {facultyName}
            </h2>
            <CopyIdBadge id={(user as any)?.uniqueId || "FAC0001"} label="Faculty ID" size="xs" />
          </div>
          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span>Department of Computer Science &amp; Engineering</span>
            <span className="text-slate-300">·</span>
            <span>Francis Xavier Engineering College (Autonomous)</span>
          </p>
        </div>
        <div className="flex flex-col sm:items-end shrink-0">
          <span className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700">
            Academic Year: 2026–2027 (Odd Sem)
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Supervising Final &amp; Pre-Final Year Clusters
          </span>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Students */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Assigned Students
            </span>
            <div className="size-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{assignedStudentsCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Across 4 project teams</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="size-8 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FolderKanban className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{activeProjectsCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">In development &amp; field testing</p>
          </div>
        </div>

        {/* Projects Under Review */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Under Review
            </span>
            <div className="size-8 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <FileCheck2 className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-amber-700">{underReviewCount}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting faculty evaluation</p>
          </div>
        </div>

        {/* Approved Projects */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Approved Projects
            </span>
            <div className="size-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{approvedProjectsCount}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">MSME sign-off completed</p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Col Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Project Overview & Assigned Students */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Project Supervision Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Industry problem statements assigned under your mentorship
                </p>
              </div>
              <Link
                href="/dashboard/faculty/projects"
                className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {projectsList.map((project) => {
                const st = statusConfig[project.status] ?? statusConfig.IN_PROGRESS;
                const leadMember = project.team.find((m) => m.isLead) ?? project.team[0];
                return (
                  <div
                    key={project.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {project.id}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded border ${st.badgeClass}`}
                        >
                          {st.label}
                        </span>
                        <span className="text-[11px] text-slate-400">Target: {project.deadline}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="truncate">Client: {project.msmeCompany}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Crown className="size-3 text-amber-500" />
                          Lead: {leadMember.name}
                        </span>
                        <span>·</span>
                        <span>{project.team.length} Members</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        href={`/dashboard/faculty/project-details?id=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
                      >
                        <span>View Details</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Students Summary Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Assigned Students</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Roster of students currently mentored in your domain
                </p>
              </div>
              <Link
                href="/dashboard/faculty/students"
                className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Full Directory</span>
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-4 py-3">Register No</th>
                    <th className="px-4 py-3">Dept</th>
                    <th className="px-4 py-3">Assigned Project</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialStudents.slice(0, 5).map((student) => {
                    const st = statusConfig[student.projectStatus] ?? statusConfig.IN_PROGRESS;
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{student.name}</span>
                            {student.isLead && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Lead
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{student.role}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{student.regNo}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{student.department}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/faculty/project-details?id=${student.projectId}`}
                            className="text-blue-700 hover:text-blue-800 hover:underline font-medium truncate block max-w-[180px]"
                          >
                            {student.projectName}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${st.badgeClass}`}
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

        {/* Right Column (1 Col): Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Project submissions and student requests</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 leading-snug">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 truncate">{act.project}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">By {act.student}</p>
                  <Link
                    href={act.link}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-800"
                  >
                    <span>Review submission</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Navigation Shortcut Card */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-blue-600" />
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Innovation Idea Queue
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have <strong className="text-slate-900">2 pending student idea submissions</strong> awaiting evaluation. Review them to approve or request revisions.
            </p>
            <Link
              href="/dashboard/faculty/idea-submissions"
              className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-medium px-3.5 py-2 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white transition-all shadow-xs"
            >
              <span>Open Idea Submissions Queue</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
