"use client";

import { useState, useEffect } from "react";
import {
  ExternalLink,
  Share2,
  Users,
  GitBranch,
  Calendar,
  Lightbulb,
  CheckCircle2,
  Loader2,
  User,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDiscoverableApprovedIdeas } from "@/app/actions/ideas";
import { cn } from "@/lib/utils";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

const sharedProjects = [
  {
    id: "PRJ-2024-003",
    name: "Automated Quality Inspection System for Textile MSMEs",
    sharedBy: "Dr. Anand V",
    team: ["Karthikeyan S", "Divya B", "Rahul M"],
    githubUrl: "https://github.com/fxec-msme/textile-quality-inspection",
    status: "APPROVED",
    sharedOn: "2026-10-28",
    domain: "Computer Vision & AI",
    note: "Shared for cross-departmental technical benchmarking and dataset review. Read-only access for reference.",
  },
  {
    id: "PRJ-2024-011",
    name: "Rural Supply Chain Digitization Platform",
    sharedBy: "Prof. Meenakshi S",
    team: ["Vishnu V", "Keerthana R"],
    githubUrl: "https://github.com/fxec-msme/rural-supply-chain",
    status: "IN_PROGRESS",
    sharedOn: "2026-10-20",
    domain: "Distributed Systems & Mobile",
    note: "Shared by Staff mentor as architectural reference for offline-first data synchronization and edge validation.",
  },
];

export default function SharedProjectsPage() {
  const [activeTab, setActiveTab] = useState<"projects" | "approvedIdeas">("projects");
  const [approvedIdeas, setApprovedIdeas] = useState<any[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  useEffect(() => {
    if (activeTab === "approvedIdeas") {
      setLoadingIdeas(true);
      getDiscoverableApprovedIdeas()
        .then((list) => setApprovedIdeas(list || []))
        .catch((err) => console.error("Failed to load approved ideas:", err))
        .finally(() => setLoadingIdeas(false));
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-[10px] bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-foreground shrink-0">
            {activeTab === "projects" ? (
              <Share2 className="size-5" />
            ) : (
              <Lightbulb className="size-5 text-amber-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {activeTab === "projects"
                ? "Shared Project Repositories"
                : "Approved Student Idea Showcase"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {activeTab === "projects"
                ? "Institutional reference solutions and cross-departmental repositories shared by staff mentors for academic study and architecture review."
                : "Student project ideas verified and approved by MSME Admin for incubation and industry partner sponsorship."}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-[10px] self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={cn(
              "px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5",
              activeTab === "projects"
                ? "bg-white dark:bg-[#2C2C2E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FolderKanban className="size-3.5" />
            <span>Shared Repositories</span>
          </button>
          <button
            onClick={() => setActiveTab("approvedIdeas")}
            className={cn(
              "px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5",
              activeTab === "approvedIdeas"
                ? "bg-white dark:bg-[#2C2C2E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Lightbulb className="size-3.5 text-amber-500" />
            <span>Approved Showcase</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: SHARED REPOSITORIES ─────────────────────────────── */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {sharedProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all duration-150"
            >
              {/* Card Header: Metas on Left, Action on Right */}
              <div className="px-6 py-3.5 border-b border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-white border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded">
                    {project.id}
                  </span>
                  <StatusBadge status={project.status} />
                  <span className="text-xs text-muted-foreground">
                    Domain: <span className="font-medium text-foreground">{project.domain}</span>
                  </span>
                </div>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Repository</span>
                </a>
              </div>

              {/* Card Body: Title, Mentor, Notes */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span>
                      Shared by Mentor: <span className="font-semibold text-foreground">{project.sharedBy}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      Shared on {project.sharedOn}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed bg-black/[0.02] dark:bg-white/[0.03] p-3 rounded-[10px] border border-slate-100">
                  <span className="font-medium text-foreground">Scope Note: </span>
                  {project.note}
                </p>
              </div>

              {/* Card Footer: Team Members */}
              <div className="px-6 py-3 border-t border-slate-100 bg-black/[0.02] dark:bg-white/[0.03]/75 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="size-3.5 text-muted-foreground shrink-0" />
                  <p className="truncate">
                    <span className="font-medium text-foreground">Project Contributors: </span>
                    {project.team.join(", ")}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <GitBranch className="size-3" />
                  <span>MIT License</span>
                </div>
              </div>
            </div>
          ))}

          {sharedProjects.length === 0 && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-12 text-center">
              <p className="text-sm text-muted-foreground">No shared repositories assigned to your account.</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: APPROVED STUDENT IDEAS SHOWCASE ───────────────────── */}
      {activeTab === "approvedIdeas" && (
        <div className="space-y-4">
          {loadingIdeas ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span>Loading verified proposals...</span>
            </div>
          ) : approvedIdeas.length === 0 ? (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
              <Lightbulb className="size-8 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-semibold text-foreground">No Showcase Proposals Yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Student ideas verified and approved by MSME Admin will appear here in the incubator showcase.
              </p>
            </div>
          ) : (
            approvedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="ACCEPTED" label="Approved by MSME Admin" />
                    <span className="text-xs font-medium text-foreground bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {idea.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified for Incubation</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-base font-semibold text-foreground">{idea.title}</h3>
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {idea.problemStatement || idea.description}
                  </div>

                  {idea.proposedSolution && (
                    <div className="p-3 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] text-xs">
                      <span className="font-semibold text-foreground block mb-0.5">
                        Technical Architecture:
                      </span>
                      <span className="text-muted-foreground">{idea.proposedSolution}</span>
                    </div>
                  )}

                  {idea.attachments && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                      <ExternalLink className="size-3.5" />
                      <a
                        href={idea.attachments}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline truncate"
                      >
                        Project Repository / Documentation
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>
                      Innovator: <strong className="text-foreground">{idea.student?.name}</strong>
                    </span>
                    <CopyIdBadge id={idea.student?.uniqueId || "STU-ID"} size="xs" />
                  </div>
                  {idea.reviewedAt && (
                    <span className="text-[11px] text-muted-foreground">
                      Verified on {new Date(idea.reviewedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
