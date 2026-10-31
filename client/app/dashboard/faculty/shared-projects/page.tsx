"use client";

import { ExternalLink, Share2, Users, GitBranch, Calendar } from "lucide-react";

const sharedProjects = [
  {
    id: "PRJ-2024-003",
    name: "Automated Quality Inspection System for Textile MSMEs",
    sharedBy: "Dr. Anand V (MECH Dept)",
    team: ["Karthikeyan S", "Divya B", "Rahul M"],
    githubUrl: "https://github.com/fxec-msme/textile-quality-inspection",
    status: "APPROVED",
    sharedOn: "2026-10-28",
    domain: "Computer Vision & AI",
    note: "Shared across departments as an engineering reference for OpenCV hardware calibration and automated defect thresholding.",
  },
  {
    id: "PRJ-2024-011",
    name: "Rural Supply Chain Digitization Platform",
    sharedBy: "Prof. Meenakshi S (IT Dept)",
    team: ["Vishnu V", "Keerthana R"],
    githubUrl: "https://github.com/fxec-msme/rural-supply-chain",
    status: "IN_PROGRESS",
    sharedOn: "2026-10-20",
    domain: "Distributed Systems & Mobile",
    note: "Shared by Staff mentor as architectural reference for offline-first SQLite sync and edge validation in low-connectivity rural hubs.",
  },
  {
    id: "PRJ-2024-019",
    name: "Smart Energy Metering & Power Factor Corrector for Small Foundries",
    sharedBy: "Dr. Suresh P (EEE Dept)",
    team: ["Arun Kumar T", "Bala Murugan S"],
    githubUrl: "https://github.com/fxec-msme/smart-energy-metering",
    status: "APPROVED",
    sharedOn: "2026-10-12",
    domain: "Embedded Systems & Power",
    note: "Reference benchmark for micro-grid power monitoring and industrial Modbus telemetry integration.",
  },
];

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  APPROVED: {
    label: "Approved & Verified",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  SOLUTION_SUBMITTED: {
    label: "Under Evaluation",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function FacultySharedProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-start gap-4">
        <div className="size-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <Share2 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Institutional Benchmark &amp; Shared Repositories
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Curated repository reference architectures shared among academic faculty and student project leads for cross-departmental technical benchmarking, standardizing code quality, and peer review.
          </p>
        </div>
      </div>

      {/* Standardized Project Cards List */}
      <div className="space-y-4">
        {sharedProjects.map((project) => {
          const st = statusConfig[project.status] ?? {
            label: project.status,
            badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
          };

          return (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all duration-150"
            >
              {/* Card Header: Metas on Left, Action on Right */}
              <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {project.id}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                  >
                    {st.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    Domain: <span className="font-medium text-slate-700">{project.domain}</span>
                  </span>
                </div>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open GitHub Code</span>
                </a>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  {project.name}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-400">Shared by:</span>
                    <strong className="text-slate-700 font-medium">{project.sharedBy}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-slate-400" />
                    <span>Shared on: {project.sharedOn}</span>
                  </span>
                </div>

                {/* Architecture Note */}
                <div className="mt-4 p-3.5 rounded-md bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-700 block mb-0.5">Faculty Benchmark Note:</span>
                  <span>{project.note}</span>
                </div>

                {/* Team & Github URL */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="size-3.5 text-slate-400" />
                    <span>Student Team:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.team.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                    <GitBranch className="size-3" />
                    <span className="truncate max-w-[260px]">{project.githubUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
