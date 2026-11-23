"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import {
  Users,
  Calendar,
  GitBranch,
  FileText,
  Crown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  Check,
  RotateCcw,
  XCircle,
  X,
  Star,
  ShieldCheck,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  ConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { LifecycleStepper, StateExplanationCard } from "@/components/state-machines";
import {
  getStaffProjectDetail,
  addProjectMemberAction,
  removeProjectMemberAction,
  setProjectLeadAction,
  reviewDeadlineExtensionAction,
} from "@/app/actions/staff";

interface LiveProject {
  id: string;
  title: string;
  status: string;
  targetDeadline: string | null;
  githubUrl: string | null;
  adminReviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
  problem: {
    title: string;
    description: string;
    domain: string;
    constraints: string | null;
    expectedDeliverables: string | null;
    industry: {
      companyName: string;
      companyId: string;
      domain: string;
      udyamRegNo: string;
      websiteUrl: string | null;
      verificationDocUrl: string | null;
    };
  } | null;
  idea: { title: string; description: string; domain: string } | null;
  staff: { name: string; email: string; uniqueId: string | null } | null;
  members: {
    id: string;
    name: string;
    uniqueId: string | null;
    email: string;
    role: string;
    isLead: boolean;
    joinedAt: string;
  }[];
  ratings: {
    id: string;
    stars: number;
    feedbackText: string;
    isModerated: boolean;
    createdAt: string;
  }[];
  deadlineExtensions: {
    id: string;
    requestedDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedAt: string | null;
  }[];
  guidanceRequests: {
    id: string;
    question: string;
    tags: string[];
    status: string;
    createdAt: string;
    requestedByStudent: { name: string; uniqueId: string | null };
    assignedAlumni: { name: string; uniqueId: string | null } | null;
  }[];
  feedback: {
    id: string;
    category: string;
    content: string;
    createdAt: string;
    author: { name: string; role: string; uniqueId: string | null };
  }[];
}

function FacultyProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [project, setProject] = useState<LiveProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showExtensionDecision, setShowExtensionDecision] = useState(false);
  const [extensionDecision, setExtensionDecision] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const load = async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await getStaffProjectDetail(id);
    if (res.success && res.project) {
      setProject(res.project as unknown as LiveProject);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <p className="text-muted-foreground text-sm">Project details not found or not under your supervision.</p>
          <div className="mt-4 flex justify-center">
            <ContextualBack
              label="Back to Assigned Projects"
              fallbackHref="/dashboard/faculty/projects"
              className="px-3 py-1.5 rounded-md bg-[#0f2744] text-white text-xs hover:bg-[#1a385c]"
            />
          </div>
        </div>
      </div>
    );
  }

  const pendingExtensions = project.deadlineExtensions.filter((e) => e.status === "PENDING");
  const leadMember = project.members.find((m) => m.isLead);
  const latestRating = project.ratings[project.ratings.length - 1];

  const handleExtensionDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (pendingExtensions.length === 0) return;
    setIsProcessing(true);

    const results = await Promise.all(
      pendingExtensions.map((ext) =>
        reviewDeadlineExtensionAction(ext.id, decision)
      )
    );

    setIsProcessing(false);
    const ok = results.every((r) => (r as any).success);
    if (ok) {
      toast.success(decision === "APPROVED" ? "Deadline extension approved and deadline updated." : "Deadline extension request rejected.");
      setShowExtensionDecision(false);
      await load();
    } else {
      toast.error(results.find((r) => !(r as any).success)?.error || "Failed to process extension decision.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "Assigned Projects", href: "/dashboard/faculty/projects" },
          { label: project.id.slice(0, 8), isCurrent: true },
        ]}
      />

      {/* Main Project Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CopyIdBadge id={project.id} label="ID" />
              <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
            </div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{project.problem?.domain || project.idea?.domain || "—"}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Client: <strong className="text-foreground">{project.problem?.industry?.companyName || "Student-Originated Idea"}</strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Project Director
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

        {/* Admin Revision Notes Banner */}
        {project.adminReviewNotes && project.status === "REVISION_IN_PROGRESS" && (
          <div className="mt-5 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-orange-900 dark:text-orange-200">
                  MSME Admin has requested revisions
                </p>
                <p className="text-xs text-orange-800 dark:text-orange-300 mt-1 leading-relaxed">
                  {project.adminReviewNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Extension Banner */}
        {pendingExtensions.length > 0 && (
          <div className="mt-5 p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Calendar className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-amber-900">
                  {pendingExtensions.length} Deadline Extension request{pendingExtensions.length > 1 ? "s" : ""} pending your decision
                </p>
                <p className="text-amber-800 mt-0.5">
                  Reason: {pendingExtensions[0].reason}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => {
                  setExtensionDecision("APPROVED");
                  setShowExtensionDecision(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-all"
              >
                <Check className="size-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => {
                  setExtensionDecision("REJECTED");
                  setShowExtensionDecision(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border border-rose-300 text-rose-700 hover:bg-rose-50 transition-all"
              >
                <X className="size-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {/* Latest Rating */}
        {latestRating && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <div className="flex items-start gap-2.5">
              <Star className="size-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-amber-950 dark:text-amber-200">
                  Industry Partner Rating ({latestRating.stars}/5)
                  {latestRating.isModerated && (
                    <span className="ml-2 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-200/60 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                      Under Moderation
                    </span>
                  )}
                </p>
                <p className="text-xs text-amber-900 dark:text-amber-300 mt-1 italic">
                  &ldquo;{latestRating.feedbackText}&rdquo;
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

      {/* Grid: 2 Col Left + 1 Col Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Roster Management */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="size-4 text-[#007AFF]" />
              <h3 className="text-sm font-semibold text-foreground">
                Student Team Roster ({project.members.length})
              </h3>
            </div>

            <div className="space-y-2">
              {project.members.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {m.isLead && <Crown className="size-3.5 text-amber-500 shrink-0" />}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {m.name}
                        {m.isLead && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">{m.uniqueId || m.id.slice(0, 8)} · {m.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!m.isLead && project.members.length > 1 && (
                      <button
                        onClick={async () => {
                          const res = await setProjectLeadAction(project.id, m.id);
                          if ((res as any).success) {
                            toast.success(`${m.name} designated as Project Team Lead.`);
                            await load();
                          } else {
                            toast.error((res as any).error || "Failed to update lead.");
                          }
                        }}
                        className="px-2 py-1 rounded-md border border-amber-200 text-amber-700 hover:bg-amber-50 text-[11px] font-medium transition-colors"
                      >
                        Make Lead
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const lead = project.members.find((x) => x.isLead);
                        const res = await removeProjectMemberAction(
                          project.id,
                          m.id,
                          m.isLead ? lead?.id : undefined
                        );
                        if ((res as any).success) {
                          toast.success(`${m.name} removed from the team.`);
                          await load();
                        } else {
                          toast.error((res as any).error || "Failed to remove member.");
                        }
                      }}
                      className="px-2 py-1 rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {project.members.length === 0 && (
                <p className="text-xs text-muted-foreground">No students assigned yet. Assign students from the problem bank flow.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Add Student to Team
              </label>
              <div className="flex gap-2">
                <input
                  id="add-student-id"
                  placeholder="Student ID (from directory)"
                  className="flex-1 text-xs h-8 border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2.5 text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={async () => {
                    const el = document.getElementById("add-student-id") as HTMLInputElement;
                    const studentId = el?.value?.trim();
                    if (!studentId) {
                      toast.error("Enter a valid student ID.");
                      return;
                    }
                    const res = await addProjectMemberAction(project.id, studentId);
                    if ((res as any).success) {
                      toast.success("Student added to the team.");
                      el.value = "";
                      await load();
                    } else {
                      toast.error((res as any).error || "Failed to add student. Check the 2-project concurrency cap.");
                    }
                  }}
                  className="px-3 py-1 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-md text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          {project.problem && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <h3 className="text-sm font-semibold text-foreground">
                  Problem Statement &amp; Industrial Scope
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {project.problem.description}
                </p>
                {project.problem.constraints && (
                  <div>
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1">Constraints</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{project.problem.constraints}</p>
                  </div>
                )}
                {project.problem.expectedDeliverables && (
                  <div>
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide block mb-1">Expected Deliverables</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{project.problem.expectedDeliverables}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Guidance Threads */}
          {project.guidanceRequests.length > 0 && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <h3 className="text-sm font-semibold text-foreground">
                  Guidance Board Threads ({project.guidanceRequests.length})
                </h3>
              </div>
              <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {project.guidanceRequests.map((g) => (
                  <li key={g.id} className="px-6 py-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {g.requestedByStudent?.name || "Student"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(g.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{g.question}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                        {g.status}
                      </span>
                      {g.tags?.map((t) => (
                        <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mentorship Feedback Log */}
          {project.feedback.length > 0 && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <h3 className="text-sm font-semibold text-foreground">Mentorship &amp; Alumni Feedback Log</h3>
              </div>
              <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {project.feedback.map((f) => (
                  <li key={f.id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{f.author?.name || "Mentor"}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{new Date(f.createdAt).toLocaleDateString()}</span>
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
            </div>
          </div>

          {/* Extension Requests Log */}
          {project.deadlineExtensions.length > 0 && (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Deadline Extensions</h3>
              </div>
              <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {project.deadlineExtensions.map((e) => (
                  <li key={e.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          e.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : e.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {e.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(e.requestedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground mt-1 leading-relaxed">{e.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Extension Decision Dialog */}
      <ConfirmationDialog
        open={showExtensionDecision}
        onOpenChange={(open) => !open && setShowExtensionDecision(false)}
        title="Decide Deadline Extension Request"
        description={
          extensionDecision === "APPROVED"
            ? `Approve the extension request? The project's target deadline will be set to the requested date.`
            : "Reject the extension request? The original deadline remains in force and the student team is notified."
        }
        itemName={project.id.slice(0, 8)}
        confirmText={extensionDecision === "APPROVED" ? "Approve Extension" : "Reject Extension"}
        variant={extensionDecision === "APPROVED" ? "default" : "destructive"}
        isLoading={isProcessing}
        onConfirm={() => handleExtensionDecision(extensionDecision || "APPROVED")}
      />
    </div>
  );
}

export default function FacultyProjectDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-muted-foreground">
          Loading project details...
        </div>
      }
    >
      <FacultyProjectDetailsContent />
    </Suspense>
  );
}
