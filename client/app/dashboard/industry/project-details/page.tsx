"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import {
  FolderKanban,
  Calendar,
  GitBranch,
  FileText,
  Crown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  XCircle,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { LifecycleStepper, StateExplanationCard } from "@/components/state-machines";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { getIndustryProjectDetailAction } from "@/app/actions/industry";
import { toast } from "sonner";

function IndustryProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getIndustryProjectDetailAction(id);
      if (res.success && (res as any).project) {
        setData((res as any).project);
      } else {
        setNotFound(true);
        toast.error((res as any).error || "Failed to load project detail.");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading project details...</span>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="w-full max-w-4xl mx-auto">
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

  const team = data.team || [];
  const rating = data.rating;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "Collaborative Projects", href: "/dashboard/industry/projects" },
          { label: data.id.slice(0, 8), isCurrent: true },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CopyIdBadge id={data.id} label="ID" />
              <ProjectStatusCategoryBadge status={data.status} size="sm" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {data.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{data.domain}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Client: <strong className="text-foreground">{data.industryPartner?.companyName}</strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Faculty Project Director
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              {data.facultySupervisor?.name || "Unassigned"}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground sm:justify-end">
              <Calendar className="size-3.5" />
              <span>
                Target Deadline:{" "}
                <strong className="text-foreground">
                  {data.targetDeadline ? new Date(data.targetDeadline).toLocaleDateString() : "Not set"}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Admin Review Notes / Rejection Banner */}
        {data.adminReviewNotes &&
          (data.status === "REJECTED" || data.status === "REVISION_IN_PROGRESS") && (
            <div
              className={`mt-5 p-4 rounded-xl flex flex-col gap-2 ${
                data.status === "REJECTED"
                  ? "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50"
                  : "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <XCircle
                  className={`size-4 shrink-0 mt-0.5 ${
                    data.status === "REJECTED"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                />
                <div>
                  <p
                    className={`font-bold text-xs ${
                      data.status === "REJECTED"
                        ? "text-rose-900 dark:text-rose-200"
                        : "text-orange-900 dark:text-orange-200"
                    }`}
                  >
                    {data.status === "REJECTED"
                      ? "Project Deliverable Rejected & Closed"
                      : "Admin has requested revisions — review notes below"}
                  </p>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      data.status === "REJECTED"
                        ? "text-rose-800 dark:text-rose-300"
                        : "text-orange-800 dark:text-orange-300"
                    }`}
                  >
                    {data.adminReviewNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Rating Summary */}
        {rating && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Star className="size-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-amber-950 dark:text-amber-200">
                    Industry Partner Rating ({rating.stars} / 5 Stars)
                  </p>
                  {rating.isModerated ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.2 rounded-full">
                      Under Moderation
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.2 rounded-full">
                      Published
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 mt-1 italic">
                  &ldquo;{rating.feedbackText}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lifecycle Progress Stepper (UX Elevation) */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Project Lifecycle Progression
        </h3>
        <LifecycleStepper
          machineId="project"
          currentState={data.status}
          className="pb-2"
        />
        <div className="mt-4 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
          <StateExplanationCard
            machineId="project"
            currentState={data.status}
            adminNotes={data.adminReviewNotes}
          />
        </div>
      </div>

      {/* Team Roster */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="size-4 text-[#007AFF]" />
          <h3 className="text-sm font-semibold text-foreground">Student Team</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {team.map((m: any) => (
            <div
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-xs text-foreground font-medium"
            >
              {m.isLead && <Crown className="size-3 text-amber-500 shrink-0" />}
              <span>{m.name}</span>
              {m.uniqueId && (
                <span className="text-[10px] text-muted-foreground font-normal">({m.uniqueId})</span>
              )}
            </div>
          ))}
          {team.length === 0 && (
            <span className="text-xs text-muted-foreground">No team members assigned yet.</span>
          )}
        </div>
      </div>

      {/* Grid: 2 Col Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Description */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-semibold text-foreground">
                Problem Statement &amp; Industrial Scope
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {data.description}
              </p>
              {data.constraints && (
                <div>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1">
                    Constraints
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{data.constraints}</p>
                </div>
              )}
              {data.expectedDeliverables && (
                <div>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1">
                    Expected Deliverables
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {data.expectedDeliverables}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Guidance + Mentorship */}
          {(data.guidanceRequests?.length > 0 || data.mentorshipFeedback?.length > 0) && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
                <MessageSquare className="size-4 text-[#007AFF]" />
                <h3 className="text-sm font-semibold text-foreground">
                  Mentorship &amp; Guidance Log
                </h3>
              </div>
              <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {(data.mentorshipFeedback || []).map((f: any) => (
                  <li key={f.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">
                        {f.author?.name || "Mentor"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.content}</p>
                  </li>
                ))}
                {(data.guidanceRequests || [])
                  .filter((g: any) => g.status !== "OPEN")
                  .map((g: any) => (
                    <li key={g.id} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">
                          Student guidance thread
                        </span>
                        <StatusBadge status={g.status} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{g.question}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* GitHub Repository */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <GitBranch className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Code Deliverable (GitHub)</h3>
            </div>
            <div className="p-5 space-y-3">
              {data.githubUrl ? (
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline break-all"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  <span>{data.githubUrl}</span>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead completes initial development sprint.
                </p>
              )}
            </div>
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
