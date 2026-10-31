"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialIndustryProjects, IndustryProjectItem } from "@/lib/industry-data";

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  ASSIGNED: {
    label: "Team Assigned",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "Under Development",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  SOLUTION_SUBMITTED: {
    label: "Solution Submitted for Admin Review",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: AlertCircle,
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Requested by Admin",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Solution Approved by MSME Admin",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Project Closed & Rated",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: CheckCircle2,
  },
};

export default function IndustryProjectsPage() {
  const [projects] = useState<IndustryProjectItem[]>(initialIndustryProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.studentTeamLeadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.facultyMentorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || prj.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Collaborative Project Deliverables
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          PRD §8.3 REQ-IND-02 &amp; REQ-IND-03: Track project progression from faculty assignment to public GitHub solution delivery and admin validation.
        </p>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, student leads, mentors..."
            className="pl-9 text-xs h-9 bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <IOSSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "ALL", label: "All Project Statuses" },
              { value: "IN_PROGRESS", label: "Under Development" },
              { value: "SOLUTION_SUBMITTED", label: "Solution Submitted" },
              { value: "APPROVED", label: "Approved by Admin" },
            ]}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((prj) => {
          const cfg = statusConfig[prj.status] || statusConfig.IN_PROGRESS;
          const StatusIcon = cfg.icon;

          return (
            <Card
              key={prj.id}
              className="border-slate-200 shadow-xs hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px] bg-slate-50 font-bold">
                      {prj.id}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {prj.problemId}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badgeClass}`}>
                    <StatusIcon className="size-3" />
                    {cfg.label}
                  </span>
                </div>

                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  {prj.problemTitle}
                </CardTitle>
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{prj.domain}</span>
                  <span>•</span>
                  <span>Target Deadline: <strong>{prj.targetDeadline}</strong></span>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0 space-y-3">
                {/* Team & Faculty Details */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <GraduationCap className="size-3.5 text-emerald-600" />
                      Student Team Lead:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {prj.studentTeamLeadName} ({prj.studentTeamLeadId})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="size-3.5 text-purple-600" />
                      Student Roster:
                    </span>
                    <span className="font-medium text-slate-800">
                      {prj.studentTeamCount} Assigned Engineers
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <ShieldCheck className="size-3.5 text-blue-600" />
                      Faculty Project Director:
                    </span>
                    <span className="font-medium text-slate-800">{prj.facultyMentorName}</span>
                  </div>
                </div>

                {/* GitHub Code Deliverable Link (ADR 0002) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  {prj.githubUrl ? (
                    <a
                      href={prj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4ed8] hover:underline"
                    >
                      <GitBranch className="size-3.5" />
                      Inspect Public GitHub (MIT)
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Solution repository in active development
                    </span>
                  )}

                  {/* Rating Call-to-Action for Approved Solutions */}
                  {prj.status === "APPROVED" && !prj.hasRated && (
                    <Link href="/dashboard/industry/ratings">
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 px-3">
                        <Star className="size-3 mr-1 fill-white" />
                        Rate Deliverable
                      </Button>
                    </Link>
                  )}

                  {prj.hasRated && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      Rated {prj.rating?.stars}/5 Stars
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

