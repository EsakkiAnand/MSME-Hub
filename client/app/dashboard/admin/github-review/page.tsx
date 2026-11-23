"use client";

import { useState, useEffect } from "react";
import {
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Folder,
  FileCode,
  FileText,
  Search,
  Check,
  RotateCcw,
  GitCommit,
  Award,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { LifecycleStepper } from "@/components/state-machines";
import { toast } from "sonner";
import {
  getAdminSolutionReviewQueue,
  adminReviewSolutionAction,
} from "@/app/actions/admin-projects";
import { getProjectGithubTree } from "@/app/actions/projects";

interface ReviewItem {
  id: string;
  projectId: string;
  projectTitle: string;
  msmeCompany: string;
  domain: string;
  studentTeamLead: string;
  facultyMentor: string;
  githubUrl: string | null;
  status: string;
  revisionNotes: string | null;
  submittedDate: string;
  commitCount: number;
  hasMitLicense: boolean;
  hasReadme: boolean;
  lastCommitDate: string | null;
  treeFiles: { path: string; type: string; size?: number }[];
}

export default function AdminGitHubReviewPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [activeItem, setActiveItem] = useState<ReviewItem | null>(null);
  const [activeTab, setActiveTab] = useState<"tree" | "readme" | "license" | "decision">("tree");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadQueue = async () => {
    const res = await getAdminSolutionReviewQueue();
    if (res.success) {
      setReviews(
        (res.projects as any[]).map((p) => ({
          id: p.id,
          projectId: p.id,
          projectTitle: p.title,
          msmeCompany: p.problem?.industry?.companyName || "Student-Originated Idea",
          domain: p.problem?.industry?.domain || p.problem?.domain || "General",
          studentTeamLead: p.team?.find((m: any) => m.isLead)?.name || "Unassigned",
          facultyMentor: p.staff?.name || "—",
          githubUrl: p.githubUrl,
          status: p.status,
          revisionNotes: p.adminReviewNotes,
          submittedDate: p.updatedAt,
          commitCount: 0,
          hasMitLicense: false,
          hasReadme: false,
          lastCommitDate: null,
          treeFiles: [],
        }))
      );
    } else {
      toast.error(res.error || "Failed to load solution review queue.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadQueue();
      setLoading(false);
    })();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.msmeCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentTeamLead.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter((r) => r.status === "SOLUTION_SUBMITTED").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const revisionCount = reviews.filter((r) => r.status === "REVISION_IN_PROGRESS").length;

  const handleOpenInspector = async (item: ReviewItem) => {
    setActiveItem(item);
    setActiveTab("tree");
    setRevisionNotes(item.revisionNotes || "");

    // Fetch cached live GitHub tree (5-min TTL) to populate file tree + compliance checks
    if (item.githubUrl) {
      const treeRes: any = await getProjectGithubTree(item.id);
      if (treeRes.success) {
        const files = (treeRes.tree || []).map((f: any) => ({
          path: f.path,
          type: f.type,
          size: f.size,
        }));
        const lower = files.map((f: any) => f.path.toLowerCase());
        setActiveItem((prev) =>
          prev?.id === item.id
            ? {
                ...prev,
                treeFiles: files,
                commitCount: treeRes.details?.commitCount ?? prev.commitCount,
                hasMitLicense: treeRes.details?.hasMitLicense ?? prev.hasMitLicense,
                hasReadme: treeRes.details?.hasReadme ?? prev.hasReadme,
                lastCommitDate: treeRes.details?.lastCommitDate ?? prev.lastCommitDate,
              }
            : prev
        );
      }
    }
  };

  const handleApproveSolution = async (id: string) => {
    setIsProcessing(true);
    const res = await adminReviewSolutionAction({
      projectId: id,
      decision: "APPROVE",
      reviewNotes: "Solution approved by MSME Admin after GitHub compliance inspection.",
    });
    setIsProcessing(false);

    if (res.success) {
      toast.success(res.message || "Solution approved! Project unlocked for Industry Partner rating.");
      await loadQueue();
    } else {
      toast.error(res.error || "Failed to approve solution.");
    }
    setActiveItem(null);
  };

  const handleRequestRevision = async (id: string) => {
    if (!revisionNotes.trim()) {
      toast.error("Please provide itemized revision notes for the student team.");
      return;
    }

    setIsProcessing(true);
    const res = await adminReviewSolutionAction({
      projectId: id,
      decision: "REQUEST_REVISION",
      reviewNotes: revisionNotes.trim(),
    });
    setIsProcessing(false);

    if (res.success) {
      toast.info(res.message || "Revision notes dispatched. Student team lead notified.");
      await loadQueue();
    } else {
      toast.error(res.error || "Failed to request revision.");
    }
    setActiveItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading solution review gate...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Solution Approval Gate &amp; GitHub Review
            </h1>
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
              PRD §8.2 REQ-ADM-02
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Inspect student public GitHub repositories for mandatory MIT License compliance, valid README documentation, commit integrity, and architectural standards.
          </p>
        </div>
      </div>

      {/* ── KPI Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between hover:border-blue-300 transition-all duration-150">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Awaiting Gate Review</span>
            <Clock className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{pendingCount}</div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">
            Submitted by Student Team Leads
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs p-4 flex flex-col justify-between hover:border-emerald-300 transition-all duration-150">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Approved Solutions</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{approvedCount}</div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">
            Passed MIT &amp; README validation
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs p-4 flex flex-col justify-between hover:border-amber-300 transition-all duration-150">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Revisions Active</span>
            <AlertCircle className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{revisionCount}</div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1">
            Teams addressing feedback
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-4 flex flex-col justify-between hover:border-[#14283F]/30 dark:hover:border-primary/40 transition-all duration-150">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>License Policy</span>
            <Award className="size-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">MIT Req.</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Strict open source licensing
          </p>
        </div>
      </div>

      {/* ── Filter Toolbar ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search project title, ID, company, or team lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 rounded-xl"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
        >
          <option value="ALL">All Statuses</option>
          <option value="SOLUTION_SUBMITTED">Awaiting Review</option>
          <option value="REVISION_IN_PROGRESS">Revision In Progress</option>
        </select>
      </div>

      {/* ── Submissions Table ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Project &amp; Partner</th>
                <th className="px-4 py-3.5">Team Lead &amp; Mentor</th>
                <th className="px-4 py-3.5">GitHub Repository</th>
                <th className="px-4 py-3.5">Automated Checks</th>
                <th className="px-4 py-3.5">Review Status</th>
                <th className="px-5 py-3.5 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredReviews.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <CopyIdBadge id={item.projectId} size="xs" />
                        <span className="text-[10px] text-muted-foreground">{item.domain}</span>
                      </div>
                      <div className="font-semibold text-foreground text-xs leading-snug">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Client: {item.msmeCompany}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{item.studentTeamLead} (Lead)</div>
                      <div className="text-[10px] text-muted-foreground">
                        Mentor: {item.facultyMentor}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.githubUrl ? (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <GitBranch className="size-3.5" />
                          <span className="truncate max-w-[170px]">{item.githubUrl}</span>
                          <ExternalLink className="size-2.5 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Not submitted yet</span>
                      )}
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <GitCommit className="size-3" />
                        <span>Open inspector for commit &amp; license audit</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-[11px] text-muted-foreground">Populated on inspection</div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenInspector(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                      >
                        <ShieldCheck className="size-3.5 text-rose-500" />
                        <span>Inspect Gate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No solutions awaiting review. Gate queue is clear.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── In-Dashboard Repository Inspector Dialog ─────────────────── */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        {activeItem && (
          <DialogContent className="max-w-3xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CopyIdBadge id={activeItem.projectId} size="xs" />
                  <span className="text-xs text-muted-foreground">
                    Client: {activeItem.msmeCompany}
                  </span>
                </div>
                {activeItem.githubUrl && (
                  <a
                    href={activeItem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Open GitHub</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              <DialogTitle className="text-base font-bold text-foreground mt-1">
                {activeItem.projectTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Team Lead: {activeItem.studentTeamLead} &middot; Supervising Mentor:{" "}
                {activeItem.facultyMentor}
              </DialogDescription>
            </DialogHeader>

            {/* Lifecycle Progress Stepper (UX Elevation) */}
            <div className="py-3 px-1 border-b border-black/[0.04] dark:border-white/[0.06]">
              <LifecycleStepper machineId="project" currentState={activeItem.status} size="sm" />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(val: any) => setActiveTab(val)}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="tree" className="text-xs">File Tree</TabsTrigger>
                <TabsTrigger value="readme" className="text-xs">README</TabsTrigger>
                <TabsTrigger value="license" className="text-xs">LICENSE</TabsTrigger>
                <TabsTrigger value="decision" className="text-xs">Sign-Off</TabsTrigger>
              </TabsList>

              {/* Tab 1: File Tree (server-cached, 5-min TTL) */}
              <TabsContent value="tree" className="space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border border-black/[0.04]">
                  <span>Server-cached repository tree (5-minute TTL)</span>
                  <span className="font-mono text-[11px]">
                    {activeItem.treeFiles.length} entries
                  </span>
                </div>

                <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-black/30 p-4 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
                  {activeItem.treeFiles.length > 0 ? (
                    activeItem.treeFiles.slice(0, 60).map((f) => (
                      <div key={f.path} className="flex items-center gap-2">
                        {f.type === "tree" ? (
                          <>
                            <Folder className="size-3.5 text-blue-400 shrink-0" />
                            <span>{f.path}/</span>
                          </>
                        ) : (
                          <>
                            <FileCode className="size-3.5 text-slate-500 shrink-0" />
                            <span>{f.path}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : activeItem.githubUrl ? (
                    <div className="text-muted-foreground">
                      Tree not yet cached. Fetching from GitHub may be rate-limited — try again
                      shortly.
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No repository URL has been submitted for this project.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tab 2: README */}
              <TabsContent value="readme" className="space-y-3 pt-3">
                {activeItem.hasReadme ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    <span>README.md verified present in repository root.</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 text-xs flex items-center gap-2 text-rose-800 dark:text-rose-300">
                    <AlertCircle className="size-4" />
                    <span>README.md not detected — request a revision.</span>
                  </div>
                )}
                {activeItem.githubUrl && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Open the linked repository to review the README contents in full.
                  </p>
                )}
              </TabsContent>

              {/* Tab 3: LICENSE Check */}
              <TabsContent value="license" className="space-y-3 pt-3">
                {activeItem.hasMitLicense ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    <span>MIT License detected in repository.</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold">
                      <AlertCircle className="size-4" />
                      <span>Compliance Violation: MIT License not detected</span>
                    </div>
                    <p className="text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed">
                      As mandated by PRD §8.5 REQ-STU-02 and ADR 0003, all student deliverables
                      must contain an MIT License file in the root repository. Request a revision
                      to ensure the student lead adds the file.
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Tab 4: Gate Decision */}
              <TabsContent value="decision" className="space-y-4 pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Structured Revision / Sign-Off Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter detailed feedback for student team lead if requesting revisions (e.g. Add MIT License, document calibration procedure in README)..."
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleRequestRevision(activeItem.id)}
                    className="px-3.5 py-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <AlertCircle className="size-3.5" />
                    <span>Request Revision</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveItem(null)}
                      className="px-3.5 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApproveSolution(activeItem.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Check className="size-3.5" />
                      )}
                      <span>{isProcessing ? "Approving..." : "Approve Solution Gate"}</span>
                    </button>
                  </div>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
