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
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SOLUTION_SUBMITTED: {
    label: "Under Review",
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
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="size-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty Project Mentorship
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Assigned Projects
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Supervise multi-student engineering teams, track milestones, and evaluate deliverables.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto">
          {projectsList.length} Active Mentorships
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by project name, ID, MSME company, or student lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-md border-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Filter className="size-4 text-slate-400 shrink-0 hidden sm:block" />
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
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400 text-sm">
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
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 hover:shadow-xs transition-all duration-150"
              >
                {/* Header row: ID, Badge, Domain, Deadline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                      {project.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-medium text-slate-600">{project.domain}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="size-3.5" />
                    <span>Target Deadline: <strong className="text-slate-700">{project.deadline}</strong></span>
                  </div>
                </div>

                {/* Body: Title, MSME Partner, Description */}
                <div className="py-4">
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building2 className="size-3.5 text-slate-400" />
                    <span>Industrial Client: <strong className="text-slate-700">{project.msmeCompany}</strong></span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Team Roster & Milestone Progress */}
                <div className="bg-slate-50/75 rounded-md p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100">
                  {/* Team */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Assigned Student Team
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.team.map((m, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-200 text-xs text-slate-700 font-medium"
                        >
                          {m.isLead && <Crown className="size-3 text-amber-500 shrink-0" />}
                          <span>{m.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({m.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress & Milestones */}
                  <div className="md:text-right shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Milestones ({completedMilestones}/{project.milestones.length})
                    </span>
                    <div className="flex items-center gap-2 md:justify-end">
                      <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 font-mono">
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
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800"
                      >
                        <GitBranch className="size-3.5" />
                        <span>Inspect Code Deliverable (GitHub)</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <GitBranch className="size-3" />
                        Deliverable repository not yet submitted
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/faculty/project-details?id=${project.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white transition-all active:scale-[0.98]"
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
