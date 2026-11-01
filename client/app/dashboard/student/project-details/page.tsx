"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calendar,
  GitBranch,
  FileText,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Suspense } from "react";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";

const projectsData: Record<
  string,
  {
    id: string;
    name: string;
    status: string;
    mentor: string;
    description: string;
    deadline: string;
    domain: string;
    team: { name: string; role: string; isLead: boolean }[];
    milestones: { label: string; done: boolean; date: string }[];
    githubUrl: string | null;
    documents: { name: string; type: string }[];
  }
> = {
  "PRJ-2024-001": {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    status: "IN_PROGRESS",
    mentor: "Dr. Selvaraj M",
    description:
      "Develop a web-based inventory management system tailored for micro and small enterprises. The solution should handle stock tracking, low-stock alerts, supplier management, and monthly report generation. Target stack includes Next.js, PostgreSQL, and cloud deployment.",
    deadline: "2026-12-15",
    domain: "Software / Web Development",
    team: [
      { name: "Mohamed Farhan", role: "Full-Stack Developer", isLead: true },
      { name: "Priya K", role: "Frontend Developer", isLead: false },
      { name: "Arjun R", role: "Backend Developer", isLead: false },
    ],
    milestones: [
      { label: "Requirements gathering & wireframes", done: true, date: "2026-09-20" },
      { label: "Database schema & API design", done: true, date: "2026-10-05" },
      { label: "Frontend prototype", done: false, date: "2026-11-10" },
      { label: "Backend integration & testing", done: false, date: "2026-12-01" },
      { label: "Final solution submission", done: false, date: "2026-12-15" },
    ],
    githubUrl: null,
    documents: [
      { name: "Problem Brief.pdf", type: "Brief" },
      { name: "Initial Wireframes.pdf", type: "Design" },
    ],
  },
  "PRJ-2024-007": {
    id: "PRJ-2024-007",
    name: "Predictive Maintenance IoT Dashboard",
    status: "SOLUTION_SUBMITTED",
    mentor: "Prof. Kavitha R",
    description:
      "Design and implement an IoT-powered dashboard that collects sensor data from manufacturing equipment and uses ML models to predict maintenance windows, reducing unplanned downtime for MSME factories.",
    deadline: "2026-11-30",
    domain: "IoT / Machine Learning",
    team: [
      { name: "Mohamed Farhan", role: "ML Engineer", isLead: false },
      { name: "Santhosh G", role: "IoT Integration", isLead: true },
      { name: "Nandhini P", role: "Data Analyst", isLead: false },
    ],
    milestones: [
      { label: "Sensor data pipeline setup", done: true, date: "2026-09-15" },
      { label: "ML model training & validation", done: true, date: "2026-10-20" },
      { label: "Dashboard UI development", done: true, date: "2026-11-10" },
      { label: "Testing & deployment", done: true, date: "2026-11-25" },
      { label: "Solution submitted for review", done: true, date: "2026-11-30" },
    ],
    githubUrl: "https://github.com/fxec-msme/predictive-maintenance",
    documents: [
      { name: "Problem Brief.pdf", type: "Brief" },
      { name: "Solution Report.pdf", type: "Report" },
      { name: "API Documentation.pdf", type: "Docs" },
    ],
  },
};

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  IN_PROGRESS: { label: "In Progress", badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200", icon: Clock },
  SOLUTION_SUBMITTED: { label: "Solution Submitted", badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent", icon: CheckCircle2 },
  APPROVED: { label: "Approved", badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent", icon: CheckCircle2 },
  REVISION_IN_PROGRESS: { label: "Revision Needed", badgeClass: "bg-[#FF3B30]/10 text-[#FF3B30] border-transparent", icon: AlertCircle },
};

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "PRJ-2024-001";
  const project = projectsData[id];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center">
          <p className="text-muted-foreground text-sm">Project details not found.</p>
          <div className="mt-4 flex justify-center">
            <ContextualBack
              label="Back to My Projects"
              fallbackHref="/dashboard/student/projects"
              className="px-3 py-1.5 rounded-[10px] bg-[#0f2744] text-white text-xs hover:bg-[#1a385c]"
            />
          </div>
        </div>
      </div>
    );
  }

  const st = statusConfig[project.status] ?? {
    label: project.status,
    badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
    icon: Clock,
  };
  const completedMilestones = project.milestones.filter((m) => m.done).length;
  const progressPct = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "My Projects", href: "/dashboard/student/projects" },
          { label: project.id, isCurrent: true },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                {project.id}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
              >
                {st.label}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {project.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Domain: {project.domain}</p>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Staff Mentor
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{project.mentor}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground sm:justify-end">
              <Calendar className="size-3.5" />
              <span>Deadline: {project.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Col Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Scope + Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-base font-semibold text-foreground">
                Problem Statement & Project Scope
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Milestones & Progress Tracker */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Project Milestones
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedMilestones} of {project.milestones.length} milestones completed ({progressPct}%)
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded border bg-black/[0.02] dark:bg-white/[0.03] text-foreground border-black/[0.06] dark:border-white/[0.08]">
                {progressPct}% Done
              </span>
            </div>

            <div className="p-6">
              {/* Clean Standard Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <ul className="space-y-4">
                {project.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 size-4 rounded-full flex items-center justify-center shrink-0 border ${
                        m.done
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 text-transparent bg-white"
                      }`}
                    >
                      {m.done && <CheckCircle2 className="size-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          m.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{m.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Team, Repository, Documents */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Project Team</h3>
            </div>
            <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {project.team.map((member, i) => (
                <li key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-[10px] bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {member.name}
                      </p>
                      {member.isLead && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50 text-[#007AFF] border border-blue-200 shrink-0">
                          <Crown className="size-2.5" />
                          Lead
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* GitHub Repository */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <GitBranch className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Code Repository</h3>
            </div>
            <div className="p-5">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#007AFF] hover:underline break-all"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  <span>{project.githubUrl}</span>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead submits the official solution link.
                </p>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Attached Documents</h3>
            </div>
            <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {project.documents.map((doc, i) => (
                <li key={i} className="px-5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground truncate">{doc.name}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-muted-foreground border border-black/[0.06] dark:border-white/[0.08] shrink-0">
                    {doc.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading project details...
        </div>
      }
    >
      <ProjectDetailsContent />
    </Suspense>
  );
}
