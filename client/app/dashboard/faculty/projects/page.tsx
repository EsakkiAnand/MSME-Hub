"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FolderKanban,
  Calendar,
  Users,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Building2,
  Crown,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { initialProjects, FacultyProject } from "@/lib/faculty-data";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectStatusCategory, getProjectStatusCategory } from "@/lib/project-data";

const domainFilterOptions = [
  { value: "All", label: "All Tech Domains" },
  { value: "Software", label: "Software / Web" },
  { value: "IoT", label: "IoT / Machine Learning" },
  { value: "Analytics", label: "IoT & Analytics" },
  { value: "Acoustics", label: "Acoustics & Signal" },
];

export default function FacultyProjectsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");
  const [domainFilter, setDomainFilter] = useState("All");

  const projectsList = Object.values(initialProjects);

  // Compute category counts
  const counts = {
    all: projectsList.length,
    inProgressLive: projectsList.filter((p) => getProjectStatusCategory(p.status as any) === "IN_PROGRESS_LIVE").length,
    completed: projectsList.filter((p) => getProjectStatusCategory(p.status as any) === "COMPLETED").length,
    rejected: projectsList.filter((p) => getProjectStatusCategory(p.status as any) === "REJECTED").length,
  };

  const filteredProjects = projectsList.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.id.toLowerCase().includes(search.toLowerCase()) ||
      project.msmeCompany.toLowerCase().includes(search.toLowerCase()) ||
      project.team.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));

    const projCategory = getProjectStatusCategory(project.status as any);
    const matchesCategory = activeCategory === "ALL" || projCategory === activeCategory;
    const matchesDomain =
      domainFilter === "All" || project.domain.toLowerCase().includes(domainFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="size-4 text-[#007AFF]" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Faculty Project Mentorship &amp; Governance
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Assigned Student Projects
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Supervise multi-student engineering teams, track lifecycle categories (In Progress, Completed, Rejected), and evaluate deliverables.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto font-mono">
          {projectsList.length} Total Supervised Projects
        </div>
      </div>

      {/* Category Tabs: In Progress / Live | Completed | Rejected */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <ProjectCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by project name, ID, MSME company, or student lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs h-9 rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600 bg-white"
            />
          </div>

          <IOSSelect
            size="sm"
            options={domainFilterOptions}
            value={domainFilter}
            onChange={setDomainFilter}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Projects Grid / List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center text-muted-foreground text-sm">
            No projects match the selected category and search criteria.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const completedMilestones = project.milestones.filter((m) => m.done).length;
            const progressPct = Math.round(
              (completedMilestones / project.milestones.length) * 100
            );

            return (
              <div
                key={project.id}
                className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 hover:border-slate-300 hover:shadow-xs transition-all duration-150"
              >
                {/* Header row: ID, Badges, Domain, Deadline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <CopyIdBadge id={project.id} label="ID" />
                    <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-muted-foreground">{project.domain}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>Target Deadline: <strong className="text-foreground">{project.deadline}</strong></span>
                  </div>
                </div>

                {/* Body: Title, MSME Partner, Description */}
                <div className="py-4">
                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    <span>Industrial Client: <strong className="text-foreground">{project.msmeCompany}</strong></span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Rejection Note if Rejected */}
                {project.status === "REJECTED" && project.rejectionReason && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <XCircle className="size-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[11px]">Deliverable Rejected / Closed:</p>
                      <p className="mt-0.5 leading-relaxed">{project.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {/* Team Roster & Milestone Progress */}
                <div className="bg-black/[0.02] dark:bg-white/[0.03]/75 rounded-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100">
                  {/* Team */}
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Assigned Student Team
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.team.map((m, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-black/[0.06] dark:border-white/[0.08] text-xs text-foreground font-medium"
                        >
                          {m.isLead && <Crown className="size-3 text-amber-500 shrink-0" />}
                          <span>{m.name}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({m.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Milestones */}
                  <div className="md:text-right shrink-0">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Milestones ({completedMilestones}/{project.milestones.length})
                    </span>
                    <div className="flex items-center gap-2 md:justify-end">
                      <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#007AFF] rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {progressPct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#007AFF] hover:underline"
                      >
                        <GitBranch className="size-3.5" />
                        <span>Inspect Code Deliverable (GitHub)</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <GitBranch className="size-3" />
                        Deliverable repository not yet submitted
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/faculty/project-details?id=${project.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all active:scale-[0.98]"
                  >
                    <span>Supervise, Details &amp; History</span>
                    <ChevronRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
