"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import {
  FolderKanban,
  Calendar,
  GitBranch,
  FileText,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  Users,
  ShieldCheck,
  Star,
  XCircle,
  Info,
} from "lucide-react";
import { getProjectById, ProjectItem, getProjectStatusCategory, PROJECT_STATUS_CATEGORY_CONFIG } from "@/lib/project-data";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectHistoryTimeline } from "@/components/projects/project-history-timeline";
import { AuthorizedStakeholdersCard } from "@/components/projects/authorized-stakeholders-card";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

function IndustryProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "PRJ-2024-001";
  const project = getProjectById(id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center">
          <p className="text-muted-foreground text-sm">Project details not found.</p>
          <div className="mt-4 flex justify-center">
            <ContextualBack
              label="Back to Collaborative Projects"
              fallbackHref="/dashboard/industry/projects"
              className="px-3 py-1.5 rounded-md bg-[#0f2744] text-white text-xs hover:bg-[#1a385c]"
            />
          </div>
        </div>
      </div>
    );
  }

  const category = getProjectStatusCategory(project.status);
  const completedMilestones = project.milestones.filter((m) => m.done).length;
  const progressPct = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "Active Projects", href: "/dashboard/industry/projects" },
          { label: project.id, isCurrent: true },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CopyIdBadge id={project.id} label="ID" />
              <ProjectStatusCategoryBadge status={project.status} size="sm" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{project.domain}</strong></span>
              <span>·</span>
              <span className="font-mono">Problem Ref: <strong className="text-foreground">{project.problemId}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Client: <strong className="text-foreground">{project.industryPartner.companyName}</strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Faculty Project Director
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{project.facultySupervisor.name}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground sm:justify-end">
              <Calendar className="size-3.5" />
              <span>Target Deadline: <strong className="text-foreground">{project.targetDeadline}</strong></span>
            </div>
          </div>
        </div>

        {/* Rejection Banner if Rejected */}
        {project.status === "REJECTED" && project.rejectionInfo && (
          <div className="mt-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <XCircle className="size-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-rose-900 dark:text-rose-200">
                  Project Deliverable Formally Rejected &amp; Discontinued
                </p>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  {project.rejectionInfo.reason}
                </p>
                {project.rejectionInfo.remediationAction && (
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-1.5 font-medium">
                    Remediation: {project.rejectionInfo.remediationAction}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rating Summary if Completed & Rated */}
        {project.rating && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Star className="size-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-amber-950 dark:text-amber-200">
                    Industry Partner Verified Rating ({project.rating.stars} / 5 Stars)
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.2 rounded-full">
                    Moderated &amp; Published
                  </span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 mt-1 italic">
                  &ldquo;{project.rating.feedbackText}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Authorized Stakeholders Directory Card */}
      <AuthorizedStakeholdersCard
        studentTeam={project.studentTeam}
        facultySupervisor={project.facultySupervisor}
        industryPartner={project.industryPartner}
        projectId={project.id}
      />

      {/* Grid: 2 Col Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Scope + Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-semibold text-foreground">
                Problem Statement &amp; Industrial Scope
              </h3>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Milestones & Progress Tracker */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Project Milestones</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedMilestones} of {project.milestones.length} milestones verified ({progressPct}%)
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-black/[0.02] dark:bg-white/[0.03] text-foreground border-black/[0.06] dark:border-white/[0.08]">
                {progressPct}% Done
              </span>
            </div>

            <div className="p-6">
              <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-[#007AFF] rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <ul className="space-y-4">
                {project.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 size-4 rounded-full flex items-center justify-center shrink-0 border ${
                        m.done
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-zinc-700 text-transparent bg-white dark:bg-zinc-900"
                      }`}
                    >
                      {m.done && <CheckCircle2 className="size-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm ${
                          m.done ? "text-muted-foreground line-through" : "text-foreground font-medium"
                        }`}
                      >
                        {m.label}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground font-mono">
                        <span>Target: {m.date}</span>
                        {m.verifiedBy && <span>· Verified by: {m.verifiedBy}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Individual Project History & Audit Trail */}
          <ProjectHistoryTimeline history={project.history} projectId={project.id} />
        </div>

        {/* Right Column: Code Deliverable & Documents */}
        <div className="space-y-6">
          {/* Public GitHub Repository (ADR 0002) */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <GitBranch className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Code Deliverable (GitHub)</h3>
            </div>
            <div className="p-5 space-y-3">
              {project.githubUrl ? (
                <>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline break-all"
                  >
                    <ExternalLink className="size-3.5 shrink-0" />
                    <span>{project.githubUrl}</span>
                  </a>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>MIT License:</span>
                      <span className={project.hasMitLicense ? "font-bold text-emerald-600" : "text-rose-600 font-bold"}>
                        {project.hasMitLicense ? "Verified Present" : "Missing / Non-compliant"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>README.md Docs:</span>
                      <span className={project.hasReadme ? "font-bold text-emerald-600" : "text-rose-600 font-bold"}>
                        {project.hasReadme ? "Verified Present" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Commits Audited:</span>
                      <span className="font-mono font-bold text-foreground">{project.commitCount}</span>
                    </div>
                    {project.lastCommitSha && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Latest SHA:</span>
                        <span className="font-mono text-muted-foreground">{project.lastCommitSha}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead completes initial development sprint.
                </p>
              )}
            </div>
          </div>

          {/* Attached Documents */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Attached Project Specs</h3>
            </div>
            <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {project.documents.map((doc, i) => (
                <li key={i} className="px-5 py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{doc.size} · {doc.date}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-muted-foreground shrink-0">
                    {doc.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IndustryProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading project details...
        </div>
      }
    >
      <IndustryProjectDetailsContent />
    </Suspense>
  );
}
