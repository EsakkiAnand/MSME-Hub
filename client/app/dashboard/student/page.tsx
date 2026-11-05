"use client";

import { useState, useEffect } from "react";
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
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStudentIdeas } from "@/app/actions/ideas";

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
];



export default function StudentDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const studentName = user?.name ?? "Student";

  const [studentIdeas, setStudentIdeas] = useState<any[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  useEffect(() => {
    getStudentIdeas()
      .then((ideas) => setStudentIdeas(ideas || []))
      .catch((err) => console.log("Student ideas load notice:", err.message));
  }, []);

  const needsImprovementIdea = studentIdeas.find((i) => i.status === "NEEDS_CHANGES");

  const activeCount = myProjects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "ASSIGNED"
  ).length;
  const completedCount = myProjects.filter((p) => p.status === "APPROVED").length;
  const totalCount = myProjects.length;

  return (
    <div className="space-y-6">
      {/* Apple iOS Grouped Welcome Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Welcome, {studentName}
            </h2>
            <CopyIdBadge id={(user as any)?.uniqueId || "STU0001"} label="Student ID" size="xs" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Francis Xavier Engineering College · Academic Project Management Portal
          </p>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Active Project Load: <span className="font-medium text-foreground">{activeCount} of 2</span> slots utilized.
            {activeCount >= 2 && " Maximum project capacity reached."}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard/student/submit-idea"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs font-medium transition-all duration-150 active:scale-[0.98] shadow-none"
          >
            <Lightbulb className="size-3.5" />
            Submit Idea
          </Link>
          <Link
            href="/dashboard/student/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] text-foreground text-xs font-medium transition-all duration-150 active:scale-[0.98]"
          >
            <FolderKanban className="size-3.5 text-muted-foreground" />
            My Projects
          </Link>
        </div>
      </div>

      {/* MSME Admin Needs Improvement Action Alert */}
      {needsImprovementIdea && (
        <div className="rounded-[16px] border border-amber-300 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/30 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="size-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
              <RotateCcw className="size-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  MSME Admin Requested Improvements
                </span>
                <StatusBadge status="NEEDS_CHANGES" />
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 font-medium">
                "{needsImprovementIdea.title}"
              </p>
              {needsImprovementIdea.adminFeedback && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 line-clamp-2 leading-relaxed">
                  Note: {needsImprovementIdea.adminFeedback}
                </p>
              )}
            </div>
          </div>
          <Link
            href="/dashboard/student/submit-idea"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-all active:scale-[0.98] shrink-0"
          >
            <span>Revise &amp; Resubmit</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* Summary Metrics - Native iOS Metric Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <StaggerItem key={metric.label}>
            <div
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] ios-card-interactive"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </span>
                <metric.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground tracking-tight">
                  {metric.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{metric.subtext}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Main Grid: Projects List + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects Table Card */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-tight">Assigned Projects</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current active industry and institutional projects
              </p>
            </div>
            <Link
              href="/dashboard/student/projects"
              className="text-xs font-medium text-[#007AFF] hover:underline flex items-center gap-1"
            >
              View all ({totalCount}) <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {myProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-medium text-muted-foreground bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-[6px]">
                      {project.id}
                    </span>
                    {project.isLead && (
                      <StatusBadge status="STUDENT" label="Team Lead" variant="info" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">
                    {project.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span>Staff Mentor: {project.mentor}</span>
                    <span>·</span>
                    <span>Deadline: {project.deadline}</span>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                  <StatusBadge status={project.status} />
                  <Link
                    href={`/dashboard/student/project-details?id=${project.id}`}
                    className="text-xs font-medium text-[#007AFF] hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}

            {myProjects.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No active projects assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* Submitted Ideas & Verification Section */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  My Idea Submissions &amp; Verification
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proposals submitted for MSME Admin evaluation and industry showcase
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/student/submit-idea"
              className="text-xs font-medium text-[#007AFF] hover:underline flex items-center gap-1"
            >
              Submit Idea <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {studentIdeas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={idea.status} />
                    <span className="text-xs font-medium text-foreground bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {idea.domain}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground tracking-tight">
                    {idea.title}
                  </p>
                  {idea.adminFeedback && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      Admin Note: {idea.adminFeedback}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href="/dashboard/student/submit-idea"
                    className="text-xs font-medium px-3 py-1.5 rounded-[8px] bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-foreground flex items-center gap-1 transition-all active:scale-[0.98]"
                  >
                    <span>{idea.status === "NEEDS_CHANGES" ? "Revise Idea" : "View Status"}</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}

            {studentIdeas.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1.5">
                <p>No project ideas submitted yet.</p>
                <Link
                  href="/dashboard/student/submit-idea"
                  className="inline-block text-[#007AFF] hover:underline font-medium"
                >
                  Submit your first idea proposal →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Right Column: Capacity Limit & Quick Actions */}
        <div className="space-y-4">
          {/* Capacity Card */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Student Capacity Limit
              </span>
              <span className="text-xs font-semibold text-foreground">
                {activeCount} / 2 Slots
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  activeCount >= 2 ? "bg-[#FF9500]" : "bg-[#007AFF]"
                }`}
                style={{ width: `${(activeCount / 2) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Per college policy, students may participate in a maximum of 2 active projects simultaneously to preserve academic focus.
            </p>
          </div>

          {/* Quick Actions Card - iOS Grouped List Style */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-semibold text-foreground tracking-tight mb-3 uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h3>
            <div className="space-y-1.5">
              <Link
                href="/dashboard/student/projects"
                className="flex items-center justify-between p-2.5 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-all text-xs font-medium text-foreground active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="size-4 text-muted-foreground" />
                  <span>View Project Deliverables</span>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/dashboard/student/submit-idea"
                className="flex items-center justify-between p-2.5 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-all text-xs font-medium text-foreground active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="size-4 text-muted-foreground" />
                  <span>Submit Industry Solution Idea</span>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/dashboard/student/shared-projects"
                className="flex items-center justify-between p-2.5 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-all text-xs font-medium text-foreground active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="size-4 text-muted-foreground" />
                  <span>Browse Shared Reference Projects</span>
                </div>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Recent Activity Updates</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log of approvals, team assignments, and mentorship feedback
          </p>
        </div>
        <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
          {recentUpdates.map((update) => (
            <div
              key={update.id}
              className="p-4 sm:px-6 flex items-start gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="mt-1.5 size-1.5 rounded-full shrink-0 bg-[#007AFF]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-snug">
                  {update.event}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{update.project}</p>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                {update.time}
              </span>
            </div>
          ))}

          {recentUpdates.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recent activity updates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
