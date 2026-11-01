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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialProjects, FacultyProject } from "@/lib/faculty-data";

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
  },
  SOLUTION_SUBMITTED: {
    label: "Under Review",
    badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent",
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Needed",
    badgeClass: "bg-[#FF3B30]/10 text-[#FF3B30] border-transparent",
  },
};

const statusFilterOptions = [
  { value: "All", label: "All Project Statuses" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SOLUTION_SUBMITTED", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
];

const domainFilterOptions = [
  { value: "All", label: "All Tech Domains" },
  { value: "Software", label: "Software / Web" },
  { value: "IoT", label: "IoT / Embedded" },
  { value: "Enterprise", label: "Enterprise Software" },
  { value: "FinTech", label: "FinTech" },
];

export default function FacultyProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");

  const projectsList = Object.values(initialProjects);

  const filteredProjects = projectsList.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.id.toLowerCase().includes(search.toLowerCase()) ||
      project.msmeCompany.toLowerCase().includes(search.toLowerCase()) ||
      project.team.some((m) => m.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesDomain =
      domainFilter === "All" || project.domain.toLowerCase().includes(domainFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="size-4 text-[#007AFF]" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Faculty Project Mentorship
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Assigned Projects
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Supervise multi-student engineering teams, track milestones, and evaluate deliverables.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto">
          {projectsList.length} Active Mentorships
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name, ID, MSME company, or student lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <IOSSelect
            size="sm"
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-44"
          />
          <IOSSelect
            size="sm"
            options={domainFilterOptions}
            value={domainFilter}
            onChange={setDomainFilter}
            className="w-44"
          />
        </div>
      </div>

      {/* Projects Grid / List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center text-muted-foreground text-sm">
            No projects match the selected search criteria.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const st = statusConfig[project.status] ?? statusConfig.IN_PROGRESS;
            const completedMilestones = project.milestones.filter((m) => m.done).length;
            const progressPct = Math.round(
              (completedMilestones / project.milestones.length) * 100
            );

            return (
              <div
                key={project.id}
                className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 hover:border-slate-300 hover:shadow-xs transition-all duration-150"
              >
                {/* Header row: ID, Badge, Domain, Deadline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground bg-slate-100 px-2.5 py-0.5 rounded">
                      {project.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
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
                    <span>Supervise &amp; Review</span>
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
