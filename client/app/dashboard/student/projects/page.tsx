"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";

const allProjects = [
  {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    status: "IN_PROGRESS",
    mentor: "Dr. Selvaraj M",
    isLead: true,
    deadline: "2026-12-15",
    domain: "Software & Cloud",
  },
  {
    id: "PRJ-2024-007",
    name: "Predictive Maintenance IoT Dashboard",
    status: "SOLUTION_SUBMITTED",
    mentor: "Prof. Kavitha R",
    isLead: false,
    deadline: "2026-11-30",
    domain: "IoT & Analytics",
  },
];

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
  },
  SOLUTION_SUBMITTED: {
    label: "Solution Submitted",
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
  ASSIGNED: {
    label: "Assigned",
    badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
  },
};

const statusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SOLUTION_SUBMITTED", label: "Solution Submitted" },
  { value: "APPROVED", label: "Approved" },
  { value: "REVISION_IN_PROGRESS", label: "Revision Needed" },
];

export default function MyProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = allProjects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.mentor.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Toolbar */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by project name, ID, domain, or mentor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm rounded-[10px] border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="size-4 text-muted-foreground shrink-0" />
          <IOSSelect
            size="sm"
            className="w-44"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={statusOptions}
            placeholder="All Statuses"
          />
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Enrolled Projects
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {filtered.length} of {allProjects.length} total projects
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
                  Project Title & Domain
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-44">
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
                const st = statusConfig[project.status] ?? {
                  label: project.status,
                  badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
                };
                return (
                  <tr key={project.id} className="hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground font-medium">
                      {project.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {project.name}
                        </span>
                        {project.isLead && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-blue-50 text-[#007AFF] border-blue-200 shrink-0">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.domain}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded border ${st.badgeClass}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-foreground">
                      {project.mentor}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground font-mono">
                      {project.deadline}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/student/project-details?id=${project.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#007AFF] hover:underline"
                      >
                        Details
                        <ExternalLink className="size-3" />
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
          {filtered.map((project) => {
            const st = statusConfig[project.status] ?? {
              label: project.status,
              badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
            };
            return (
              <div key={project.id} className="p-4 space-y-2 hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">{project.name}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{project.id}</p>
                  </div>
                  {project.isLead && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-blue-50 text-[#007AFF] border-blue-200 shrink-0">
                      Team Lead
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className={`font-medium px-2 py-0.5 rounded border ${st.badgeClass}`}>
                    {st.label}
                  </span>
                  <span>Mentor: {project.mentor}</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Due: {project.deadline}</span>
                  <Link
                    href={`/dashboard/student/project-details?id=${project.id}`}
                    className="font-medium text-[#007AFF] hover:underline flex items-center gap-1"
                  >
                    View Details <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No projects match the specified filter or query.
          </div>
        )}
      </div>
    </div>
  );
}
