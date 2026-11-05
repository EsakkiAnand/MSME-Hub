"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ExternalLink, ChevronRight, Crown, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import {
  ProjectStatusCategory,
  getProjectStatusCategory,
  initialProjectsMaster,
} from "@/lib/project-data";

// Extract enrolled projects for current student (Mohamed Farhan STU-001 & teammates)
const studentProjectsList = [
  {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    status: "IN_PROGRESS" as const,
    mentor: "Dr. Selvaraj M",
    msmeCompany: "Nellai Precision Engineering Ltd.",
    isLead: true,
    deadline: "2026-12-15",
    domain: "Software / Web Development",
  },
  {
    id: "PRJ-2024-007",
    name: "Automated Yarn Defect Vision Inspection System for Powerlooms",
    status: "COMPLETED" as const,
    mentor: "Prof. Kavitha R",
    msmeCompany: "Apex Tex Machineries",
    isLead: false,
    deadline: "2026-10-30",
    domain: "Manufacturing & AI",
  },
  {
    id: "PRJ-2024-009",
    name: "High-Frequency Acoustic Crack Detection for Foundries",
    status: "REJECTED" as const,
    mentor: "Dr. S. Ramanathan",
    msmeCompany: "South Castings & Alloys",
    isLead: true,
    deadline: "2026-09-30",
    domain: "Acoustics & Signal Processing",
    rejectionReason:
      "Failed foundry floor noise threshold tests; repository missed mandatory MIT licensing requirements.",
  },
];

export default function MyProjectsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");

  const counts = {
    all: studentProjectsList.length,
    inProgressLive: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "IN_PROGRESS_LIVE"
    ).length,
    completed: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "COMPLETED"
    ).length,
    rejected: studentProjectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "REJECTED"
    ).length,
  };

  const filtered = studentProjectsList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.mentor.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());

    const projCategory = getProjectStatusCategory(p.status);
    const matchCategory = activeCategory === "ALL" || projCategory === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          My Enrolled Projects &amp; History
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          PRD §8.4: Track capstone progress, review individual project history timelines, and manage deliverables. Max 2 active concurrent projects enforced.
        </p>
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
            className="pl-9 text-xs h-9 bg-white rounded-[10px] border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
          />
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
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
                      <ProjectStatusCategoryBadge status={project.status} size="sm" />
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

        {filtered.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No projects found matching the selected category.
          </div>
        )}
      </div>
    </div>
  );
}
