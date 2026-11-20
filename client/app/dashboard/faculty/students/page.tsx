"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  Crown,
  ChevronRight,
  Mail,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStaffProjects } from "@/app/actions/staff";
import { toast } from "sonner";

interface AssignedStudentRow {
  id: string;
  name: string;
  email: string;
  uniqueId: string | null;
  isLead: boolean;
  projectId: string;
  projectName: string;
  projectStatus: string;
  activeProjectsCount: number;
}

const statusOptions = [
  { value: "All", label: "All Project Statuses" },
  { value: "ASSIGNED", label: "Team Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SOLUTION_SUBMITTED", label: "Under Review" },
  { value: "REVISION_IN_PROGRESS", label: "Revision In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "COMPLETED", label: "Completed" },
];

export default function MyStudentsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    const res = await getStaffProjects();
    if (res.success) {
      setProjects((res.projects as any[]) || []);
    } else {
      toast.error(res.error || "Failed to load supervised projects.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const students: AssignedStudentRow[] = useMemo(() => {
    const rows: AssignedStudentRow[] = [];
    const activeCounts = new Map<string, number>();
    for (const p of projects) {
      const isActive = ["ASSIGNED", "IN_PROGRESS", "SOLUTION_SUBMITTED", "REVISION_IN_PROGRESS"].includes(p.status);
      for (const m of p.members || []) {
        if (isActive) {
          activeCounts.set(m.id, (activeCounts.get(m.id) || 0) + 1);
        }
        rows.push({
          id: `${m.id}-${p.id}`,
          name: m.name,
          email: m.email,
          uniqueId: m.uniqueId,
          isLead: m.isLead,
          projectId: p.id,
          projectName: p.title,
          projectStatus: p.status,
          activeProjectsCount: 0,
        });
      }
    }
    for (const row of rows) {
      row.activeProjectsCount = activeCounts.get(row.id.split("-")[0]) || 0;
    }
    return rows;
  }, [projects]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      search.trim() === "" ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      (student.uniqueId || "").toLowerCase().includes(search.toLowerCase()) ||
      student.projectName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || student.projectStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading student directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="size-4 text-[#007AFF]" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mentored Student Directory
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Assigned Students
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Browse and monitor students enrolled in projects under your faculty supervision. Concurrency cap: 2 active projects per student.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto">
          Total Assignments: {students.length}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID, email, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <IOSSelect
            size="sm"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-44"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03]/75 border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-medium uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Information</th>
                <th className="px-4 py-3.5">Permanent ID</th>
                <th className="px-4 py-3.5">Active Projects</th>
                <th className="px-4 py-3.5">Assigned Project</th>
                <th className="px-4 py-3.5">Project Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No assigned students match the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr key={student.id} className="hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-semibold text-foreground text-xs shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground truncate">{student.name}</span>
                              {student.isLead && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  <Crown className="size-2.5" />
                                  Lead
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 text-muted-foreground" />
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-foreground font-medium">
                        {student.uniqueId || "—"}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge
                          label={`${student.activeProjectsCount} / 2 active`}
                          variant={student.activeProjectsCount >= 2 ? "warning" : "neutral"}
                        />
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-mono font-medium text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">
                          {student.projectId.slice(0, 8)}
                        </span>
                        <p className="font-medium text-foreground truncate max-w-[220px] mt-1">
                          {student.projectName}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={student.projectStatus} />
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/dashboard/faculty/project-details?id=${student.projectId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-black/[0.06] dark:border-white/[0.08] text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03] hover:text-[#007AFF] transition-colors shadow-2xs"
                        >
                          <span>View Project</span>
                          <ChevronRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
