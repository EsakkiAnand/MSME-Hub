"use client";

import { ExternalLink, Share2, Users, GitBranch, Calendar } from "lucide-react";

const sharedProjects = [
  {
    id: "PRJ-2024-003",
    name: "Automated Quality Inspection System for Textile MSMEs",
    sharedBy: "Dr. Anand V (MECH Dept)",
    team: ["Karthikeyan S", "Divya B"],
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
];

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
  },
  APPROVED: {
    label: "Approved & Verified",
    badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent",
  },
  SOLUTION_SUBMITTED: {
    label: "Under Evaluation",
    badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent",
  },
};

export default function FacultySharedProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex items-start gap-4">
        <div className="size-10 rounded-md bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-foreground shrink-0">
          <Share2 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Institutional Benchmark &amp; Shared Repositories
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Curated repository reference architectures shared among academic faculty and student project leads for cross-departmental technical benchmarking, standardizing code quality, and peer review.
          </p>
        </div>
      </div>

      {/* Standardized Project Cards List */}
      <div className="space-y-4">
        {sharedProjects.map((project) => {
          const st = statusConfig[project.status] ?? {
            label: project.status,
            badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
          };

          return (
            <div
              key={project.id}
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all duration-150"
            >
              {/* Card Header: Metas on Left, Action on Right */}
              <div className="px-6 py-3.5 border-b border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-white border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded">
                    {project.id}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                  >
                    {st.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Domain: <span className="font-medium text-foreground">{project.domain}</span>
                  </span>
                </div>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open GitHub Code</span>
                </a>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {project.name}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Shared by:</span>
                    <strong className="text-foreground font-medium">{project.sharedBy}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    <span>Shared on: {project.sharedOn}</span>
                  </span>
                </div>

                {/* Architecture Note */}
                <div className="mt-4 p-3.5 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">Faculty Benchmark Note:</span>
                  <span>{project.note}</span>
                </div>

                {/* Team & Github URL */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>Student Team:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.team.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 font-medium text-foreground text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                    <GitBranch className="size-3" />
                    <span className="truncate max-w-[260px]">{project.githubUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sharedProjects.length === 0 && (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-8 text-center text-xs text-muted-foreground">
            No shared reference projects available.
          </div>
        )}
      </div>
    </div>
  );
}
