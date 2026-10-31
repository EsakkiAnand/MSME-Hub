"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  Crown,
  ChevronRight,
  Mail,
  UserCheck,
  Building,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialStudents } from "@/lib/faculty-data";

const departmentOptions = [
  { value: "All", label: "All Departments" },
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "IT", label: "Information Technology (IT)" },
  { value: "ECE", label: "Electronics & Comm (ECE)" },
];

const statusOptions = [
  { value: "All", label: "All Project Statuses" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SOLUTION_SUBMITTED", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
];

const statusBadge: Record<string, { label: string; badgeClass: string }> = {
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

export default function MyStudentsPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredStudents = initialStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.regNo.toLowerCase().includes(search.toLowerCase()) ||
      student.projectName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === "All" || student.department === deptFilter;
    const matchesStatus = statusFilter === "All" || student.projectStatus === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="size-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Mentored Student Directory
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Assigned Students
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and monitor students enrolled in projects under your faculty supervision.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto">
          Total Assigned: {initialStudents.length} Students
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by student name, register number, email, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-md border-slate-200 focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Filter className="size-4 text-slate-400 shrink-0 hidden sm:block" />
          <IOSSelect
            size="sm"
            options={departmentOptions}
            value={deptFilter}
            onChange={setDeptFilter}
            className="w-44"
          />
          <IOSSelect
            size="sm"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-44"
          />
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student Information</th>
                <th className="px-4 py-3.5">Register Number</th>
                <th className="px-4 py-3.5">Dept &amp; Year</th>
                <th className="px-4 py-3.5">Assigned Project</th>
                <th className="px-4 py-3.5">Project Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No assigned students match the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const st = statusBadge[student.projectStatus] ?? statusBadge.IN_PROGRESS;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Role */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 text-xs shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 truncate">
                                {student.name}
                              </span>
                              {student.isLead && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  <Crown className="size-2.5" />
                                  Lead
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 text-slate-400" />
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Register Number */}
                      <td className="px-4 py-3.5 font-mono text-slate-700 font-medium">
                        {student.regNo}
                      </td>

                      {/* Dept & Academic Standing */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{student.department}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">CGPA: {student.cgpa}</p>
                      </td>

                      {/* Assigned Project */}
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {student.projectId}
                        </span>
                        <p className="font-medium text-slate-800 truncate max-w-[220px] mt-1">
                          {student.projectName}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                        >
                          {st.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/dashboard/faculty/project-details?id=${student.projectId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-2xs"
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
