"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  FolderKanban,
  Lightbulb,
  CheckCircle2,
  Clock,
  Share2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

const myProjects = [
  {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    status: "IN_PROGRESS",
    mentor: "Dr. Selvaraj M",
    isLead: true,
    deadline: "2026-12-15",
    domain: "Software",
  },
  {
    id: "PRJ-2024-007",
    name: "Predictive Maintenance IoT Dashboard",
    status: "SOLUTION_SUBMITTED",
    mentor: "Prof. Kavitha R",
    isLead: false,
    deadline: "2026-11-30",
    domain: "IoT & Analytics",
  },
];

const recentUpdates = [
  {
    id: 1,
    project: "Smart Inventory Management for MSMEs",
    event: "Staff approved your Deadline Extension Request",
    time: "2 hours ago",
    status: "APPROVED",
  },
  {
    id: 2,
    project: "Predictive Maintenance IoT Dashboard",
    event: "Solution submitted for MSME Admin review",
    time: "1 day ago",
    status: "SUBMITTED",
  },
  {
    id: 3,
    project: "Smart Inventory Management for MSMEs",
    event: "Alumni Mentor Ravi S responded to your Guidance Request",
    time: "2 days ago",
    status: "INFO",
  },
  {
    id: 4,
    project: "Predictive Maintenance IoT Dashboard",
    event: "Team member Priya K added to your project",
    time: "3 days ago",
    status: "INFO",
  },
];

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SOLUTION_SUBMITTED: {
    label: "Solution Submitted",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Needed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  ASSIGNED: {
    label: "Assigned",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export default function StudentDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const studentName = user?.name ?? "Student";

  const activeCount = myProjects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED"
  ).length;
  const completedCount = myProjects.filter((p) => p.status === "APPROVED").length;
  const totalCount = myProjects.length;

  return (
    <div className="space-y-6">
      {/* Institutional Welcome Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Welcome, {studentName}
            </h2>
            <CopyIdBadge id={(user as any)?.uniqueId || "STU0001"} label="Student ID" size="xs" />
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            Francis Xavier Engineering College · Academic Project Management Portal
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Active Project Load: <span className="font-semibold text-slate-700">{activeCount} of 2</span> slots utilized.
            {activeCount >= 2 && " Maximum project capacity reached."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/student/submit-idea"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white text-sm font-medium transition-all duration-150 active:scale-[0.98] shadow-xs"
          >
            <Lightbulb className="size-4" />
            Submit Idea
          </Link>
          <Link
            href="/dashboard/student/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all duration-150 active:scale-[0.98]"
          >
            <FolderKanban className="size-4 text-slate-500" />
            My Projects
          </Link>
        </div>
      </div>

      {/* Summary Metrics - Equal Height Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            label: "Enrolled Projects",
            value: totalCount,
            subtext: "Total assigned this academic year",
            icon: FolderKanban,
          },
          {
            label: "Projects in Progress",
            value: activeCount,
            subtext: "Maximum capacity limit: 2",
            icon: Clock,
          },
          {
            label: "Completed & Approved",
            value: completedCount,
            subtext: "Validated by MSME & Staff",
            icon: CheckCircle2,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between h-full hover:-translate-y-0.5 hover:shadow-xs hover:border-slate-300 transition-all duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {metric.label}
              </span>
              <metric.icon className="size-4 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                {metric.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{metric.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Projects List + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active Projects Table Card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Assigned Projects</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current active industry and institutional projects
              </p>
            </div>
            <Link
              href="/dashboard/student/projects"
              className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              View all ({totalCount}) <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {myProjects.map((project) => {
              const st = statusConfig[project.status] ?? {
                label: project.status,
                badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
              };
              return (
                <div
                  key={project.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {project.id}
                      </span>
                      {project.isLead && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200">
                          Project Team Lead
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {project.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      <span>Staff Mentor: {project.mentor}</span>
                      <span>•</span>
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                    <Link
                      href={`/dashboard/student/project-details?id=${project.id}`}
                      className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1"
                    >
                      View Details
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {myProjects.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                No active projects assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Capacity Limit & Quick Actions */}
        <div className="space-y-6">
          {/* Capacity Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Student Capacity Limit
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {activeCount} / 2 Slots
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all ${
                  activeCount >= 2 ? "bg-amber-500" : "bg-[#1d4ed8]"
                }`}
                style={{ width: `${(activeCount / 2) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
              Per college policy, students may participate in a maximum of 2 active projects simultaneously to preserve academic focus.
            </p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/student/projects"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-[0.99] text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="size-4 text-slate-500" />
                  <span>View Project Deliverables</span>
                </div>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/dashboard/student/submit-idea"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-[0.99] text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="size-4 text-slate-500" />
                  <span>Submit Industry Solution Idea</span>
                </div>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/dashboard/student/shared-projects"
                className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-[0.99] text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="size-4 text-slate-500" />
                  <span>Browse Shared Reference Projects</span>
                </div>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Recent Activity Updates</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of approvals, team assignments, and mentorship feedback
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentUpdates.map((update) => (
            <div
              key={update.id}
              className="p-4 sm:px-6 flex items-start gap-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="mt-1 size-2 rounded-full shrink-0 bg-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {update.event}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{update.project}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 font-medium">
                {update.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
