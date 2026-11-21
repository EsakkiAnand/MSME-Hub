"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, ExternalLink, ChevronRight, Crown, XCircle, FolderKanban, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import {
  ProjectStatusCategory,
  getProjectStatusCategory,
} from "@/lib/project-data";
import { getStudentProjects } from "@/app/actions/student";

interface StudentProject {
  id: string;
  title: string;
  status: string;
  isLead: boolean;
  targetDeadline: string | null;
  githubUrl: string | null;
  adminReviewNotes: string | null;
  staff: { name: string; email: string; uniqueId: string | null } | null;
  problem: {
    industry: { companyName: string; companyId: string; domain: string };
    domain: string;
  } | null;
  idea: { title: string; description: string } | null;
}

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getStudentProjects();
      if (res.success) {
        setProjects(res.projects as StudentProject[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const normalize = (p: StudentProject) => ({
    id: p.id,
    name: p.title,
    status: p.status,
    mentor: p.staff?.name ?? "—",
    msmeCompany: p.problem?.industry?.companyName ?? "Student-Originated Idea",
    domain: p.problem?.domain ?? "General",
    isLead: p.isLead,
    deadline: p.targetDeadline ? new Date(p.targetDeadline).toLocaleDateString() : "Not set",
    rejectionReason: p.status === "REJECTED" ? p.adminReviewNotes : undefined,
  });

  const studentProjectsList = projects.map(normalize);

  const counts = {
    all: studentProjectsList.length,
    inProgressLive: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "IN_PROGRESS_LIVE"
    ).length,
    completed: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "COMPLETED"
    ).length,
    rejected: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "REJECTED"
    ).length,
  };

  const filtered = studentProjectsList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.mentor.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());

    const projCategory = getProjectStatusCategory(p.status as any);
    const matchCategory = activeCategory === "ALL" || projCategory === activeCategory;

    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading your projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Standardized Page Header Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="size-4.5 text-[#14283F] dark:text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              My Enrolled Projects &amp; History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track capstone progress, review individual project history timelines, and manage deliverables. Max 2 active concurrent projects enforced.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-foreground self-start sm:self-auto shrink-0 shadow-2xs">
          {filtered.length} {filtered.length === 1 ? "Project" : "Projects"}
        </div>
      </div>

      {/* Category Tabs & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <ProjectCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name, ID, domain, or mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 text-xs h-9 bg-white dark:bg-slate-900 rounded-xl border-slate-200/90 dark:border-slate-800 focus-visible:ring-[#14283F]/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Enrolled Capstone Projects
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {filtered.length} of {studentProjectsList.length} enrolled projects
            </p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]/75">
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                  Project ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Project Title &amp; Partner
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48">
                  Status Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-40">
                  Staff Mentor
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Deadline
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-28">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filtered.map((project) => {
                return (
                  <tr key={project.id} className="hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium">
                      <CopyIdBadge id={project.id} label="ID" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-xs">{project.name}</span>
                        {project.isLead && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Crown className="size-2.5 text-amber-600 fill-amber-500" />
                            Lead
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span>{project.domain}</span>
                        <span>·</span>
                        <span>Client: {project.msmeCompany}</span>
                      </div>
                      {project.status === "REJECTED" && (project as any).rejectionReason && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <XCircle className="size-3 shrink-0" />
                          <span>{(project as any).rejectionReason}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-xs text-foreground font-medium">
                      {project.mentor}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-muted-foreground">
                      {project.deadline}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/student/project-details?id=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#007AFF] hover:underline"
                      >
                        <span>Details</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-black/[0.05] dark:divide-white/[0.06]">
          {filtered.map((project) => (
            <div key={project.id} className="p-4 space-y-2 hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{project.name}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{project.id}</p>
                </div>
                {project.isLead && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    <Crown className="size-2.5 text-amber-600 fill-amber-500" />
                    Lead
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
                <span>Mentor: {project.mentor}</span>
              </div>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Due: {project.deadline}</span>
                <Link
                  href={`/dashboard/student/project-details?id=${project.id}`}
                  className="font-medium text-[#14283F] dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  View Details <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground mb-3">
              <FolderKanban className="size-6 opacity-60" />
            </div>
            <p className="text-sm font-semibold text-foreground">No projects found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {search
                ? `No projects match "${search}". Try searching with a different keyword or project ID.`
                : "No projects found matching the selected category filter."}
            </p>
            {(search || activeCategory !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("ALL");
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                Reset Search &amp; Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
