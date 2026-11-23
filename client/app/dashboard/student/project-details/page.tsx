"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import {
  Calendar,
  GitBranch,
  Crown,
  CheckCircle2,
  ExternalLink,
  Building2,
  XCircle,
  Star,
  Loader2,
  Users,
} from "lucide-react";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { LifecycleStepper, StateExplanationCard } from "@/components/state-machines";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getStudentProjectDetail, submitGithubSolutionAction, requestDeadlineExtensionAction } from "@/app/actions/student";

// Minimal display shape derived from DB data
interface LiveProject {
  id: string;
  title: string;
  status: string;
  isLead: boolean;
  targetDeadline: string | null;
  githubUrl: string | null;
  adminReviewNotes: string | null;
  description: string;
  domain: string;
  staff: { name: string; email: string; uniqueId: string | null } | null;
  problem: {
    description: string;
    domain: string;
    industry: { companyName: string; companyId: string; domain: string; udyamRegNo: string };
  } | null;
  idea: { title: string; description: string; domain: string } | null;
  members: {
    student: { id: string; name: string; uniqueId: string | null; email: string };
    isLead: boolean;
  }[];
  deadlineExtensions: {
    id: string;
    reason: string;
    status: string;
    requestedDate: string;
  }[];
  feedback: {
    id: string;
    content: string;
    category: string;
    author: { name: string; uniqueId: string | null; role: string };
    createdAt: string;
  }[];
  ratings: {
    stars: number;
    feedbackText: string;
    isModerated: boolean;
  }[];
}

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [project, setProject] = useState<LiveProject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [githubInput, setGithubInput] = useState("");
  const [isUpdatingRepo, setIsUpdatingRepo] = useState(false);

  const [extReason, setExtReason] = useState("");
  const [isRequestingExt, setIsRequestingExt] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getStudentProjectDetail(id);
      if (res.success && res.project) {
        const p: any = res.project;
        const live: LiveProject = {
          id: p.id,
          title: p.title,
          status: p.status,
          isLead: p.isLead,
          targetDeadline: p.targetDeadline,
          githubUrl: p.githubUrl,
          adminReviewNotes: p.adminReviewNotes,
          description: p.problem?.description || p.idea?.description || p.title,
          domain: p.problem?.domain || p.idea?.domain || "General Engineering",
          staff: p.staff,
          problem: p.problem ? { ...p.problem, description: p.problem.description || "" } : null,
          idea: p.idea,
          members: (p.members || []).map((m: any) => ({
            student: {
              id: m.student.id,
              name: m.student.name,
              uniqueId: m.student.uniqueId,
              email: m.student.email,
            },
            isLead: m.isLead,
          })),
          deadlineExtensions: (p.deadlineExtensions || []).map((d: any) => ({
            id: d.id,
            reason: d.reason,
            status: d.status,
            requestedDate: d.requestedDate,
          })),
          feedback: (p.feedback || []).map((f: any) => ({
            id: f.id,
            content: f.content,
            category: f.category,
            author: f.author,
            createdAt: f.createdAt,
          })),
          ratings: (p.ratings || []).map((r: any) => ({
            stars: r.stars,
            feedbackText: r.feedbackText,
            isModerated: r.isModerated,
          })),
        };
        setProject(live);
        setGithubInput(live.githubUrl || "");
      } else {
        setNotFound(true);
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

  if (notFound || !project) {
    return (
      <div className="space-y-6">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center">
          <p className="text-muted-foreground text-sm">Project details not found or you are not a member.</p>
          <div className="mt-4 flex justify-center">
            <ContextualBack
              label="Back to My Projects"
              fallbackHref="/dashboard/student/projects"
              className="px-3 py-1.5 rounded-[10px] bg-[#0f2744] text-white text-xs hover:bg-[#1a385c]"
            />
          </div>
        </div>
      </div>
    );
  }

  const isTeamLead = project.isLead;
  const pendingExtension = project.deadlineExtensions.find((d) => d.status === "PENDING");
  const activeRating = project.ratings[project.ratings.length - 1];

  const handleSubmitGithubUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim().startsWith("https://github.com/")) {
      toast.error("Please enter a valid public GitHub repository URL.");
      return;
    }

    setIsUpdatingRepo(true);
    const res = await submitGithubSolutionAction(project.id, githubInput.trim());
    setIsUpdatingRepo(false);

    if (res.success) {
      toast.success(res.message || "GitHub repository updated successfully!");
      setGithubInput(githubInput.trim());
    } else {
      toast.error(res.error || "Failed to submit GitHub solution.");
    }
  };

  const handleRequestExtension = async () => {
    if (!extReason.trim()) {
      toast.error("Please provide a reason for the extension request.");
      return;
    }

    setIsRequestingExt(true);
    const res = await requestDeadlineExtensionAction({
      projectId: project.id,
      reason: extReason.trim(),
      requestedDate: new Date().toISOString(),
    });
    setIsRequestingExt(false);

    if (res.success) {
      toast.success(res.message || "Extension request submitted.");
      setExtReason("");
    } else {
      toast.error(res.error || "Failed to submit extension request.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "My Projects", href: "/dashboard/student/projects" },
          { label: project.id, isCurrent: true },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CopyIdBadge id={project.id} label="ID" />
              <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
              {isTeamLead && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  <Crown className="size-2.5 text-amber-600" />
                  Team Lead
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{project.domain}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Partner:{" "}
                <strong className="text-foreground">
                  {project.problem?.industry?.companyName || "Student-Originated Idea"}
                </strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Staff Mentor
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{project.staff?.name || "—"}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground sm:justify-end">
              <Calendar className="size-3.5" />
              <span>
                Target Deadline:{" "}
                <strong className="text-foreground">
                  {project.targetDeadline ? new Date(project.targetDeadline).toLocaleDateString() : "Not set"}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Admin Revision / Rejection Banner */}
        {project.adminReviewNotes && (project.status === "REVISION_IN_PROGRESS" || project.status === "REJECTED") && (
          <div
            className={`mt-5 p-4 rounded-xl flex flex-col gap-2 ${
              project.status === "REJECTED"
                ? "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50"
                : "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <XCircle
                className={`size-4 shrink-0 mt-0.5 ${
                  project.status === "REJECTED" ? "text-rose-600 dark:text-rose-400" : "text-orange-600 dark:text-orange-400"
                }`}
              />
              <div>
                <p
                  className={`font-bold text-xs ${
                    project.status === "REJECTED"
                      ? "text-rose-900 dark:text-rose-200"
                      : "text-orange-900 dark:text-orange-200"
                  }`}
                >
                  {project.status === "REJECTED"
                    ? "Project Deliverable Rejected"
                    : "Admin has requested revisions — address the notes below and resubmit."}
                </p>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    project.status === "REJECTED"
                      ? "text-rose-800 dark:text-rose-300"
                      : "text-orange-800 dark:text-orange-300"
                  }`}
                >
                  {project.adminReviewNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Extension Banner */}
        {pendingExtension && (
          <div className="mt-5 p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Calendar className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-amber-900">Deadline extension request is pending staff approval</p>
                <p className="text-amber-800 mt-0.5">Reason: {pendingExtension.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rating Summary */}
        {activeRating && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Star className="size-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xs text-amber-950 dark:text-amber-200">
                    Industry Partner Rating ({activeRating.stars} / 5 Stars)
                  </p>
                  {activeRating.isModerated && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.2 rounded-full">
                      Under Admin Moderation
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-300 mt-1 italic">
                  &ldquo;{activeRating.feedbackText}&rdquo;
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
          currentState={project.status}
          className="pb-2"
        />
        <div className="mt-4 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
          <StateExplanationCard
            machineId="project"
            currentState={project.status}
            adminNotes={project.adminReviewNotes}
          />
        </div>
      </div>

      {/* Team Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="size-4 text-[#007AFF]" />
          <h3 className="text-sm font-semibold text-foreground">Student Team</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {project.members.map((m) => (
            <div
              key={m.student.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-xs text-foreground font-medium"
            >
              {m.isLead && <Crown className="size-3 text-amber-500 shrink-0" />}
              <span>{m.student.name}</span>
              {m.student.uniqueId && (
                <span className="text-[10px] text-muted-foreground font-normal">({m.student.uniqueId})</span>
              )}
            </div>
          ))}
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
                Problem Statement &amp; Project Scope
              </h3>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Extension Request (Team Lead only) */}
          {isTeamLead && !pendingExtension && project.status !== "COMPLETED" && project.status !== "REJECTED" && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Request a Deadline Extension
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Team Leads can request a formal deadline extension from your staff mentor.
              </p>
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={extReason}
                  onChange={(e) => setExtReason(e.target.value)}
                  placeholder="Reason for the extension request..."
                  className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleRequestExtension}
                  disabled={isRequestingExt}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-[#007AFF] hover:bg-[#007AFF]/90 disabled:opacity-50 text-white transition-all shadow-xs active:scale-[0.98]"
                >
                  {isRequestingExt ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                  <span>{isRequestingExt ? "Submitting..." : "Submit Extension Request"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Alumni Feedback Log */}
          {project.feedback.length > 0 && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <h3 className="text-sm font-semibold text-foreground">Mentorship &amp; Feedback Log</h3>
              </div>
              <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {project.feedback.map((f) => (
                  <li key={f.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{f.author?.name || "Mentor"}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.content}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                      {f.category}
                    </span>
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
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline break-all"
                >
                  <ExternalLink className="size-3.5 shrink-0" />
                  <span>{project.githubUrl}</span>
                </a>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead submits the official solution link.
                </p>
              )}

              {/* Team Lead Submission Form */}
              {isTeamLead && project.status !== "COMPLETED" && project.status !== "REJECTED" && (
                <form onSubmit={handleSubmitGithubUrl} className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    {project.githubUrl ? "Update" : "Submit"} GitHub Deliverable URL (Team Lead Only)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      placeholder="https://github.com/owner/repo"
                      className="text-xs h-8 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isUpdatingRepo}
                      className="px-3 py-1 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-md text-xs font-semibold shrink-0"
                    >
                      {isUpdatingRepo ? "Validating..." : "Save"}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Server validation checks: public repo, MIT License, README.md, and commits.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading project details...
        </div>
      }
    >
      <ProjectDetailsContent />
    </Suspense>
  );
}
