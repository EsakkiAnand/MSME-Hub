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
import { StatusBadge } from "@/components/ui/status-badge";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { initialMentoredProjects, MentoredProject } from "@/lib/alumni-data";


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
    <div className="space-y-6">
      <DashboardPageHeader
        icon={FolderKanban}
        title="Mentored Projects Directory"
        badge={
          <Badge variant="outline" className="text-[11px] font-medium border-black/[0.08] dark:border-white/[0.08]">
            PRD §8.6
          </Badge>
        }
        subtitle="Active industry challenges where alumni mentors provide architectural critique, code quality reviews, and open-source guidance."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
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
          return (
            <Card key={p.id} className="border-black/[0.06] dark:border-white/[0.08] shadow-xs hover:border-slate-300 transition-all bg-white flex flex-col justify-between">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="font-mono text-[11px] bg-black/[0.02] dark:bg-white/[0.03]">
                    {p.id}
                  </Badge>
                  <StatusBadge status={p.status} />
                </div>

                <CardTitle className="text-base font-bold text-foreground leading-snug">
                  {p.title}
                </CardTitle>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="font-medium">{p.domain}</span>
                  <span>•</span>
                  <span>{p.lastActivity}</span>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0 space-y-3">
                <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="size-3.5 text-emerald-600" />
                      Student Team Lead:
                    </span>
                    <span className="font-semibold text-foreground">
                      {p.teamLeadName} ({p.teamLeadUniqueId})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5 text-purple-600" />
                      Faculty Director:
                    </span>
                    <span className="font-medium text-foreground">{p.facultyMentor}</span>
                  </div>

                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="size-3.5 text-[#007AFF]" />
                      Industry Partner:
                    </span>
                    <span className="font-medium text-foreground">{p.industryPartner}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline"
                    >
                      <GitBranch className="size-3.5" />
                      Inspect Public GitHub (MIT)
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">
                      Solution repository not yet submitted
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-8 text-center text-xs text-muted-foreground">
            No mentored projects found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

