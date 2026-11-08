"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
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
  XCircle,
  Star,
  Send,
} from "lucide-react";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { ContextualBack } from "@/components/navigation/contextual-back";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { getProjectById, ProjectItem, initialProjectsMaster } from "@/lib/project-data";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectHistoryTimeline } from "@/components/projects/project-history-timeline";
import { AuthorizedStakeholdersCard } from "@/components/projects/authorized-stakeholders-card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "PRJ-2024-001";
  const [projects, setProjects] = useState<Record<string, ProjectItem>>(initialProjectsMaster);
  const project = projects[id] ?? projects["PRJ-2024-001"];

  const [githubInput, setGithubInput] = useState(project?.githubUrl || "");
  const [isUpdatingRepo, setIsUpdatingRepo] = useState(false);

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center">
          <p className="text-muted-foreground text-sm">Project details not found.</p>
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

  const completedMilestones = project.milestones.filter((m) => m.done).length;
  const progressPct = Math.round((completedMilestones / project.milestones.length) * 100);

  // Check if current user is Lead (Farhan is lead on PRJ-2024-001)
  const isTeamLead = project.studentTeam.some(
    (m) => m.isLead && (m.name.includes("Farhan") || m.name.includes("Karthik") || m.name.includes("Vigneshwaran"))
  );

  const handleSubmitGithubUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim().startsWith("https://github.com/")) {
      toast.error("Please enter a valid public GitHub repository URL.");
      return;
    }

    setIsUpdatingRepo(true);
    await new Promise((r) => setTimeout(r, 600));

    const historyEvent = {
      id: `H-${Date.now()}`,
      timestamp: "Just now",
      title: "Public GitHub Deliverable Updated",
      category: "DELIVERABLE" as const,
      actor: {
        name: "Student Team Lead",
        role: "STUDENT_LEAD" as const,
        roleTitle: "Project Team Lead",
      },
      description: `Updated deliverable repository URL: ${githubInput}. MIT license check triggered.`,
      metadata: {
        githubCommit: "latest",
      },
    };

    setProjects((prev) => ({
      ...prev,
      [project.id]: {
        ...prev[project.id],
        githubUrl: githubInput,
        hasMitLicense: true,
        hasReadme: true,
        history: [historyEvent, ...prev[project.id].history],
      },
    }));

    setIsUpdatingRepo(false);
    toast.success("GitHub repository updated successfully! Compliance check queued.");
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
              <ProjectStatusCategoryBadge status={project.status} size="sm" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span>Domain: <strong className="text-foreground">{project.domain}</strong></span>
              <span>·</span>
              <span className="font-mono">Ref: <strong className="text-foreground">{project.problemId}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                Partner: <strong className="text-foreground">{project.industryPartner.companyName}</strong>
              </span>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Staff Mentor
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
                    Moderated &amp; Added to Student Portfolio
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
        {/* Left Column: Scope + Milestones + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
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

          {/* Milestones & Progress Tracker */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Project Milestones
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedMilestones} of {project.milestones.length} milestones completed ({progressPct}%)
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-black/[0.02] dark:bg-white/[0.03] text-foreground border-black/[0.06] dark:border-white/[0.08]">
                {progressPct}% Done
              </span>
            </div>

            <div className="p-6">
              <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
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
                          m.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {m.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{m.date}</p>
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
          {/* GitHub Repository Deliverable Management */}
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
                        {project.hasMitLicense ? "Verified" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>README.md:</span>
                      <span className={project.hasReadme ? "font-bold text-emerald-600" : "text-rose-600 font-bold"}>
                        {project.hasReadme ? "Verified" : "Missing"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Commits:</span>
                      <span className="font-mono font-bold text-foreground">{project.commitCount}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Repository URL will be linked once the Project Team Lead submits the official solution link.
                </p>
              )}

              {/* Team Lead Submission Input */}
              {isTeamLead && project.status !== "COMPLETED" && project.status !== "REJECTED" && (
                <form onSubmit={handleSubmitGithubUrl} className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] space-y-2">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Update GitHub Deliverable URL (Team Lead Only)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      placeholder="https://github.com/..."
                      className="text-xs h-8 bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isUpdatingRepo}
                      className="px-3 py-1 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white rounded-md text-xs font-semibold shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Attached Documents</h3>
            </div>
            <ul className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {project.documents.map((doc, i) => (
                <li key={i} className="px-5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground truncate">{doc.name}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-muted-foreground border border-black/[0.06] dark:border-white/[0.08] shrink-0">
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
