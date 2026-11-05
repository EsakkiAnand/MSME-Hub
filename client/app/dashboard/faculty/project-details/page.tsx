"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  GitBranch,
  FileText,
  Crown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  Check,
  RotateCcw,
  CalendarClock,
  ShieldCheck,
  XCircle,
  X,
} from "lucide-react";
import {
  initialProjectsMaster,
  getProjectById,
  ProjectItem,
  ProjectLifecycleStatus,
} from "@/lib/project-data";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectHistoryTimeline } from "@/components/projects/project-history-timeline";
import { AuthorizedStakeholdersCard } from "@/components/projects/authorized-stakeholders-card";

function FacultyProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "PRJ-2024-001";

  const [projectsState, setProjectsState] = useState<Record<string, ProjectItem>>(initialProjectsMaster);
  const project = projectsState[id] ?? projectsState["PRJ-2024-001"];

  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center">
          <p className="text-muted-foreground text-sm">Project details not found.</p>
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

  const completedMilestones = project.milestones.filter((m) => m.done).length;
  const progressPct = Math.round((completedMilestones / project.milestones.length) * 100);

  // Approve Project Solution
  const handleApproveSolution = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const newHistoryEvent = {
        id: `H-${Date.now()}`,
        timestamp: "Just now",
        title: "Faculty Academic Verification Approved",
        category: "GOVERNANCE" as const,
        actor: {
          name: project.facultySupervisor.name,
          role: "FACULTY_MENTOR" as const,
          roleTitle: "Faculty Project Director",
          email: project.facultySupervisor.email,
        },
        description: "Solution validated against engineering rubric and approved for MSME Admin sign-off.",
        metadata: {
          oldStatus: project.status,
          newStatus: "APPROVED" as ProjectLifecycleStatus,
        },
      };

      setProjectsState((prev) => ({
        ...prev,
        [project.id]: {
          ...prev[project.id],
          status: "APPROVED",
          history: [newHistoryEvent, ...prev[project.id].history],
        },
      }));
      toast.success(`Solution for ${project.id} approved successfully!`);
    } catch {
      toast.error("Failed to approve project solution.");
    } finally {
      setIsProcessing(false);
      setShowApproveDialog(false);
    }
  };

  // Request Revisions
  const handleRequestRevision = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const newHistoryEvent = {
        id: `H-${Date.now()}`,
        timestamp: "Just now",
        title: "Itemized Revision Requested",
        category: "GOVERNANCE" as const,
        actor: {
          name: project.facultySupervisor.name,
          role: "FACULTY_MENTOR" as const,
          roleTitle: "Faculty Project Director",
          email: project.facultySupervisor.email,
        },
        description: "Deliverable returned to student lead with technical notes for sprint corrections.",
        metadata: {
          oldStatus: project.status,
          newStatus: "REVISION_IN_PROGRESS" as ProjectLifecycleStatus,
        },
      };

      setProjectsState((prev) => ({
        ...prev,
        [project.id]: {
          ...prev[project.id],
          status: "REVISION_IN_PROGRESS",
          history: [newHistoryEvent, ...prev[project.id].history],
        },
      }));
      toast.success(`Revision request issued for ${project.id}.`);
    } catch {
      toast.error("Failed to request revision.");
    } finally {
      setIsProcessing(false);
      setShowRevisionDialog(false);
    }
  };

  // Reject / Drop Solution
  const handleRejectSolution = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const newHistoryEvent = {
        id: `H-${Date.now()}`,
        timestamp: "Just now",
        title: "Project Deliverable Formally Rejected",
        category: "GOVERNANCE" as const,
        actor: {
          name: project.facultySupervisor.name,
          role: "FACULTY_MENTOR" as const,
          roleTitle: "Faculty Project Director",
          email: project.facultySupervisor.email,
        },
        description: "Deliverable did not meet minimum viable criteria. Logged formal rejection and closed project.",
        notes: "Project categorized as REJECTED. Student team released from capstone concurrency lock.",
        metadata: {
          oldStatus: project.status,
          newStatus: "REJECTED" as ProjectLifecycleStatus,
          rejectionReason: "Fails technical benchmark requirements",
        },
      };

      setProjectsState((prev) => ({
        ...prev,
        [project.id]: {
          ...prev[project.id],
          status: "REJECTED",
          rejectionInfo: {
            reason: "Deliverable failed technical benchmarks and PRD compliance standards during faculty supervision review.",
            rejectedAt: new Date().toISOString(),
            rejectedBy: project.facultySupervisor.name,
            remediationAction: "Problem re-queued to pool. Team released to select alternate project.",
          },
          history: [newHistoryEvent, ...prev[project.id].history],
        },
      }));
      toast.error(`Project ${project.id} marked as Rejected.`);
    } catch {
      toast.error("Failed to reject project.");
    } finally {
      setIsProcessing(false);
      setShowRejectDialog(false);
    }
  };

  // Grant Deadline Extension
  const handleGrantExtension = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (project.extensionRequested) {
        setProjectsState((prev) => ({
          ...prev,
          [project.id]: {
            ...prev[project.id],
            targetDeadline: project.extensionRequested!.requestedDate,
            extensionRequested: null,
          },
        }));
      }
      toast.success("Deadline extension approved and updated.");
    } catch {
      toast.error("Failed to grant deadline extension.");
    } finally {
      setIsProcessing(false);
      setShowExtensionDialog(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Contextual Breadcrumb */}
      <ContextualBreadcrumb
        items={[
          { label: "Assigned Projects", href: "/dashboard/faculty/projects" },
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
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{project.domain}</strong></span>
              <span>·</span>
              <span className="font-mono">Ref: <strong className="text-foreground">{project.problemId}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Client: <strong className="text-foreground">{project.industryPartner.companyName}</strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Project Director / Mentor
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

        {/* Extension Banner (if applicable) */}
        {project.extensionRequested && (
          <div className="mt-5 p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CalendarClock className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-amber-900">
                  Student Team Lead requested a Deadline Extension
                </p>
                <p className="text-amber-800 mt-0.5">
                  Requested Date: <strong className="font-mono">{project.extensionRequested.requestedDate}</strong> · Reason: {project.extensionRequested.reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowExtensionDialog(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-all shrink-0 self-start sm:self-auto"
            >
              <Check className="size-3.5" />
              <span>Grant Extension</span>
            </button>
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
        {/* Left Column: Scope + Milestones + Faculty Supervision Controls + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Faculty Review Decision Console */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
              <ShieldCheck className="size-4 text-[#007AFF]" />
              <h3 className="text-sm font-semibold text-foreground">
                Faculty Evaluation &amp; Governance Console
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              As the designated faculty project director, evaluate deliverables against the MSME problem statement. You have the authority to grant academic sign-off, request itemized sprint revisions, or mark unviable work as rejected.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowApproveDialog(true)}
                disabled={project.status === "APPROVED" || project.status === "COMPLETED"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-xs active:scale-[0.98]"
              >
                <Check className="size-3.5" />
                <span>{project.status === "APPROVED" || project.status === "COMPLETED" ? "Approved" : "Approve Solution"}</span>
              </button>

              <button
                onClick={() => setShowRevisionDialog(true)}
                disabled={project.status === "REVISION_IN_PROGRESS" || project.status === "COMPLETED" || project.status === "REJECTED"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-all shadow-xs active:scale-[0.98]"
              >
                <RotateCcw className="size-3.5" />
                <span>Request Revisions</span>
              </button>

              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={project.status === "REJECTED" || project.status === "COMPLETED"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-all shadow-xs active:scale-[0.98]"
              >
                <X className="size-3.5" />
                <span>{project.status === "REJECTED" ? "Rejected" : "Reject Deliverable"}</span>
              </button>

              <Link
                href="/dashboard/faculty/feedback"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md bg-white border border-black/[0.06] dark:border-white/[0.08] text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03] transition-all"
              >
                <FileText className="size-3.5" />
                <span>Log Rubric Feedback</span>
              </Link>
            </div>
          </div>

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
              <span className="text-xs font-medium px-2 py-0.5 rounded border bg-black/[0.02] dark:bg-white/[0.03] text-foreground border-black/[0.06] dark:border-white/[0.08]">
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

        {/* Right Column: Repository & Documents */}
        <div className="space-y-6">
          {/* GitHub Repository */}
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
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead submits the official solution link.
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

      {/* Confirmation Dialog 1: Approve Solution */}
      <ConfirmationDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        title="Approve Project Solution"
        description="Are you sure you want to approve this project solution? This marks the student team's engineering deliverable as academically verified."
        itemName={`${project.id} - ${project.title}`}
        confirmText="Approve Solution"
        variant="default"
        isLoading={isProcessing}
        onConfirm={handleApproveSolution}
      />

      {/* Confirmation Dialog 2: Request Revisions */}
      <ConfirmationDialog
        open={showRevisionDialog}
        onOpenChange={setShowRevisionDialog}
        title="Request Project Revisions"
        description="Are you sure you want to return this project for revision? The student team will be notified to address your technical feedback."
        itemName={`${project.id} - ${project.title}`}
        confirmText="Request Revisions"
        variant="destructive"
        isLoading={isProcessing}
        onConfirm={handleRequestRevision}
      />

      {/* Confirmation Dialog 3: Reject Solution */}
      <ConfirmationDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Project Deliverable"
        description="Are you sure you want to reject and close this project? This will record a formal rejection audit event and release students from the project."
        itemName={`${project.id} - ${project.title}`}
        confirmText="Reject Deliverable"
        variant="destructive"
        isLoading={isProcessing}
        onConfirm={handleRejectSolution}
      />

      {/* Confirmation Dialog 4: Grant Extension */}
      <ConfirmationDialog
        open={showExtensionDialog}
        onOpenChange={setShowExtensionDialog}
        title="Grant Deadline Extension"
        description={`Do you want to extend the deadline for this project to ${project.extensionRequested?.requestedDate}?`}
        itemName={`${project.id} - ${project.title}`}
        confirmText="Grant Extension"
        variant="update"
        isLoading={isProcessing}
        onConfirm={handleGrantExtension}
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
