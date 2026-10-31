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
  IN_PROGRESS: { label: "In Progress", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  SOLUTION_SUBMITTED: { label: "Solution Submitted", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", icon: CheckCircle2 },
  APPROVED: { label: "Approved", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  REVISION_IN_PROGRESS: { label: "Revision Needed", badgeClass: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertCircle },
};

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "PRJ-2024-001";
  const project = projectsData[id];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500 text-sm">Project details not found.</p>
          <Link
            href="/dashboard/student/projects"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0f2744] text-white text-xs font-medium hover:bg-[#1a385c]"
          >
            <ArrowLeft className="size-3.5" /> Back to My Projects
          </Link>
        </div>
      </div>
    );
  }

  const st = statusConfig[project.status] ?? {
    label: project.status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  };
  const completedMilestones = project.milestones.filter((m) => m.done).length;
  const progressPct = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/dashboard/student/projects"
          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="size-3.5" />
          My Projects
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-mono text-slate-700 font-semibold">{project.id}</span>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {project.id}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
              >
                {st.label}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              {project.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Domain: {project.domain}</p>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Staff Mentor
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{project.mentor}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 sm:justify-end">
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
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Problem Statement & Project Scope
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Milestones & Progress Tracker */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Project Milestones
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {completedMilestones} of {project.milestones.length} milestones completed ({progressPct}%)
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded border bg-slate-50 text-slate-700 border-slate-200">
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
                            ? "text-slate-500 line-through"
                            : "text-slate-800 font-medium"
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{m.date}</p>
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
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <Users className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Project Team</h3>
            </div>
            <ul className="divide-y divide-slate-100">
              {project.team.map((member, i) => (
                <li key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="size-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {member.name}
                      </p>
                      {member.isLead && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                          <Crown className="size-2.5" />
                          Lead
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* GitHub Repository */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <GitBranch className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Code Repository</h3>
            </div>
            <div className="p-5">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 break-all"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  <span>{project.githubUrl}</span>
                </a>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Repository URL will be linked once the Project Team Lead submits the official solution link.
                </p>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
              <FileText className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">Attached Documents</h3>
            </div>
            <ul className="divide-y divide-slate-100">
              {project.documents.map((doc, i) => (
                <li key={i} className="px-5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-700 truncate">{doc.name}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
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
        <div className="p-12 text-center text-sm text-slate-500">
          Loading project details...
        </div>
      }
    >
      <ProjectDetailsContent />
    </Suspense>
  );
}
