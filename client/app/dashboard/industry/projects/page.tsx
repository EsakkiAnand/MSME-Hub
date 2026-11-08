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
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { initialIndustryProjects, IndustryProjectItem } from "@/lib/industry-data";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectStatusCategory, getProjectStatusCategory } from "@/lib/project-data";

export default function IndustryProjectsPage() {
  const [projects] = useState<IndustryProjectItem[]>(initialIndustryProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");

  // Compute category counts
  const counts = {
    all: projects.length,
    inProgressLive: projects.filter((p) => getProjectStatusCategory(p.status) === "IN_PROGRESS_LIVE").length,
    completed: projects.filter((p) => getProjectStatusCategory(p.status) === "COMPLETED").length,
    rejected: projects.filter((p) => getProjectStatusCategory(p.status) === "REJECTED").length,
  };

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.studentTeamLeadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.facultyMentorName.toLowerCase().includes(searchQuery.toLowerCase());

    const projCategory = getProjectStatusCategory(prj.status);
    const matchesCategory = activeCategory === "ALL" || projCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban className="size-4 text-[#007AFF]" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Collaborative Project Deliverables &amp; History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            PRD §8.3: Track engineering progress across lifecycle categories (In Progress, Completed, Rejected), review audit histories, and inspect public GitHub deliverables.
          </p>
        </div>
      </div>

      {/* Category Tabs: In Progress / Live | Completed | Rejected */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <ProjectCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, student leads, mentors..."
            className="pl-9 text-xs h-9 bg-white"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((prj) => {
          return (
            <Card
              key={prj.id}
              className="border-black/[0.06] dark:border-white/[0.08] shadow-xs hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CopyIdBadge id={prj.id} label="ID" />
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Ref: {prj.problemId}
                    </span>
                  </div>
                  <ProjectStatusCategoryBadge status={prj.status} size="sm" />
                </div>

                <CardTitle className="text-base font-bold text-foreground leading-snug">
                  {prj.problemTitle}
                </CardTitle>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{prj.domain}</span>
                  <span>•</span>
                  <span>Target Deadline: <strong>{prj.targetDeadline}</strong></span>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0 space-y-3">
                {/* Team & Faculty Details */}
                <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="size-3.5 text-emerald-600" />
                      Student Team Lead:
                    </span>
                    <span className="font-semibold text-foreground">
                      {prj.studentTeamLeadName} ({prj.studentTeamLeadId})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5 text-purple-600" />
                      Student Roster:
                    </span>
                    <span className="font-medium text-foreground">
                      {prj.studentTeamCount} Assigned Engineers
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-[#007AFF]" />
                      Faculty Project Director:
                    </span>
                    <span className="font-medium text-foreground">{prj.facultyMentorName}</span>
                  </div>
                </div>

                {/* Rejection Note if Rejected */}
                {prj.status === "REJECTED" && prj.rejectionReason && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <XCircle className="size-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">
                      <strong>Rejection Note:</strong> {prj.rejectionReason}
                    </p>
                  </div>
                )}

                {/* GitHub Code Deliverable Link & Rating / Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div>
                    {prj.githubUrl ? (
                      <a
                        href={prj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline"
                      >
                        <GitBranch className="size-3.5" />
                        <span>Public GitHub (MIT)</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        Solution repo in development
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rating Call-to-Action for Approved Solutions */}
                    {prj.status === "APPROVED" && !prj.hasRated && (
                      <Link href="/dashboard/industry/ratings">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 px-2.5">
                          <Star className="size-3 mr-1 fill-white" />
                          Rate
                        </Button>
                      </Link>
                    )}

                    {prj.hasRated && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="size-3 text-amber-500 fill-amber-500" />
                        {prj.rating?.stars}/5 Stars
                      </span>
                    )}

                    <Link
                      href={`/dashboard/industry/project-details?id=${prj.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-black/[0.03] hover:bg-black/[0.06] text-foreground transition-all"
                    >
                      <span>Details &amp; History</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-12 text-center text-xs text-muted-foreground">
            No projects found matching the category and search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
