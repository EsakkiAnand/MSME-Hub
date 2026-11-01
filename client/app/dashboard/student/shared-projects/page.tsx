"use client";

import { ExternalLink, Share2, Users, GitBranch, Calendar } from "lucide-react";

const sharedProjects = [
  {
    id: "PRJ-2024-003",
    name: "Automated Quality Inspection System for Textile MSMEs",
    sharedBy: "Dr. Anand V",
    team: ["Karthikeyan S", "Divya B", "Rahul M"],
    githubUrl: "https://github.com/fxec-msme/textile-quality-inspection",
    status: "APPROVED",
    sharedOn: "2026-10-28",
    domain: "Computer Vision & AI",
    note: "Shared for cross-departmental technical benchmarking and dataset review. Read-only access for reference.",
  },
  {
    id: "PRJ-2024-011",
    name: "Rural Supply Chain Digitization Platform",
    sharedBy: "Prof. Meenakshi S",
    team: ["Vishnu V", "Keerthana R"],
    githubUrl: "https://github.com/fxec-msme/rural-supply-chain",
    status: "IN_PROGRESS",
    sharedOn: "2026-10-20",
    domain: "Distributed Systems & Mobile",
    note: "Shared by Staff mentor as architectural reference for offline-first data synchronization and edge validation.",
  },
];

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent",
  },
  SOLUTION_SUBMITTED: {
    label: "Solution Submitted",
    badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent",
  },
};

export default function SharedProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex items-start gap-4">
        <div className="size-10 rounded-[10px] bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-foreground shrink-0">
          <Share2 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Shared Project Repositories
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Institutional reference solutions and cross-departmental repositories shared by staff mentors for academic study, architecture review, and benchmark comparisons.
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
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Repository</span>
                </a>
              </div>

              {/* Card Body: Title, Mentor, Notes */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span>
                      Shared by Mentor: <span className="font-semibold text-foreground">{project.sharedBy}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      Shared on {project.sharedOn}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-[10px] border border-slate-100">
                  <span className="font-medium text-foreground">Scope Note: </span>
                  {project.note}
                </p>
              </div>

              {/* Card Footer: Team Members */}
              <div className="px-6 py-3 border-t border-slate-100 bg-black/[0.02] dark:bg-white/[0.03]/75 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="size-3.5 text-muted-foreground shrink-0" />
                  <p className="truncate">
                    <span className="font-medium text-foreground">Project Contributors: </span>
                    {project.team.join(", ")}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <GitBranch className="size-3" />
                  <span>MIT License</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sharedProjects.length === 0 && (
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-12 text-center">
          <p className="text-sm text-muted-foreground">No shared repositories assigned to your account.</p>
        </div>
      )}
    </div>
  );
}
