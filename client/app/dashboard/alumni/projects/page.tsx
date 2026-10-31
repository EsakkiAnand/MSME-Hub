"use client";

import { useState } from "react";
import {
  FolderKanban,
  Search,
  ExternalLink,
  GitBranch,
  Building2,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialMentoredProjects, MentoredProject } from "@/lib/alumni-data";

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  SOLUTION_SUBMITTED: {
    label: "Solution Submitted",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Approved by Admin",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  REVISION_IN_PROGRESS: {
    label: "Revision in Progress",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
};

export default function MentoredProjectsPage() {
  const [projects] = useState<MentoredProject[]>(initialMentoredProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamLeadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industryPartner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === "ALL" || p.domain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Mentored Projects Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          PRD §8.6: Active industry challenges where alumni mentors provide architectural critique, code quality reviews, and open-source guidance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, students, partner..."
            className="pl-9 text-xs h-9 bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <IOSSelect
            value={domainFilter}
            onChange={setDomainFilter}
            options={[
              { value: "ALL", label: "All Tech Domains" },
              { value: "Software & Cloud", label: "Software & Cloud" },
              { value: "IoT & Analytics", label: "IoT & Analytics" },
              { value: "FinTech & Web", label: "FinTech & Web" },
            ]}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const cfg = statusConfig[p.status] || statusConfig.IN_PROGRESS;
          const StatusIcon = cfg.icon;

          return (
            <Card key={p.id} className="border-slate-200 shadow-xs hover:border-slate-300 transition-all bg-white flex flex-col justify-between">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-[11px] bg-slate-50">
                    {p.id}
                  </Badge>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badgeClass}`}>
                    <StatusIcon className="size-3" />
                    {cfg.label}
                  </span>
                </div>

                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  {p.title}
                </CardTitle>
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                  <span className="font-medium">{p.domain}</span>
                  <span>•</span>
                  <span>{p.lastActivity}</span>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0 space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <GraduationCap className="size-3.5 text-emerald-600" />
                      Student Team Lead:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {p.teamLeadName} ({p.teamLeadUniqueId})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="size-3.5 text-purple-600" />
                      Faculty Director:
                    </span>
                    <span className="font-medium text-slate-800">{p.facultyMentor}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Building2 className="size-3.5 text-blue-600" />
                      Industry Partner:
                    </span>
                    <span className="font-medium text-slate-800">{p.industryPartner}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
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
                      Solution repository not yet submitted
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

