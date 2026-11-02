"use client";

import { useState } from "react";
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
  X,
  RotateCcw,
  GitCommit,
  Building2,
  GraduationCap,
  MessageSquare,
  Award,
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
import { toast } from "sonner";
import { initialGitHubReviews, GitHubReviewItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  GitHubReviewItem["status"],
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  SOLUTION_SUBMITTED: {
    label: "Awaiting Review",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    icon: Clock,
  },
  APPROVED: {
    label: "Admin Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    icon: CheckCircle2,
  },
  REVISION_IN_PROGRESS: {
    label: "Revision Requested",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
    icon: AlertCircle,
  },
};

export default function AdminGitHubReviewPage() {
  const [reviews, setReviews] = useState<GitHubReviewItem[]>(initialGitHubReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [activeItem, setActiveItem] = useState<GitHubReviewItem | null>(null);
  const [activeTab, setActiveTab] = useState<"tree" | "readme" | "license" | "decision">("tree");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered reviews
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

  const handleOpenInspector = (item: GitHubReviewItem) => {
    setActiveItem(item);
    setActiveTab("tree");
    setRevisionNotes(item.revisionNotes || "");
  };

  const handleApproveSolution = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "APPROVED", revisionNotes: undefined } : item
      )
    );

    setIsProcessing(false);
    toast.success("GitHub deliverable approved! Project unlocked for Industry Partner rating.");
    setActiveItem(null);
  };

  const handleRequestRevision = async (id: string) => {
    if (!revisionNotes.trim()) {
      toast.error("Please provide itemized revision notes for the student team.");
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    setReviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "REVISION_IN_PROGRESS", revisionNotes: revisionNotes.trim() }
          : item
      )
    );

    setIsProcessing(false);
    toast.info("Revision notes dispatched. Student team lead notified to update repository.");
    setActiveItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Awaiting Gate Review</span>
            <Clock className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {pendingCount}
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">
            Submitted by Student Team Leads
          </p>
        </div>

        <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Approved Solutions</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {approvedCount}
          </div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">
            Passed MIT &amp; README validation
          </p>
        </div>

        <div className="rounded-[14px] border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Revisions Active</span>
            <AlertCircle className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {revisionCount}
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1">
            Teams addressing feedback
          </p>
        </div>

        <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col justify-between">
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
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search project title, ID, company, or team lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <option value="ALL">All Statuses</option>
          <option value="SOLUTION_SUBMITTED">Awaiting Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REVISION_IN_PROGRESS">Revision In Progress</option>
        </select>
      </div>

      {/* ── Submissions Table ────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
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
                const statusMeta = statusConfig[item.status];
                const StatusIcon = statusMeta.icon;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <CopyIdBadge id={item.projectId} size="xs" />
                        <span className="text-[10px] text-muted-foreground">
                          {item.domain}
                        </span>
                      </div>
                      <div className="font-semibold text-foreground text-xs leading-snug">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Client: {item.msmeCompany}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {item.studentTeamLead} (Lead)
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Mentor: {item.facultyMentor}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
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
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <GitCommit className="size-3" />
                        <span>{item.commitCount} commits</span>
                        <span>&middot;</span>
                        <span>{item.lastCommitDate}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {item.hasMitLicense ? (
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="size-3.5 text-rose-600" />
                          )}
                          <span className={item.hasMitLicense ? "text-foreground" : "text-rose-600 font-semibold"}>
                            MIT License: {item.hasMitLicense ? "Valid" : "Missing"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {item.hasReadme ? (
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="size-3.5 text-rose-600" />
                          )}
                          <span className="text-foreground">
                            README: {item.hasReadme ? "Present" : "Missing"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
                          statusMeta.badgeClass
                        )}
                      >
                        <StatusIcon className="size-3" />
                        <span>{statusMeta.label}</span>
                      </div>
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
                    No solutions found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── In-Dashboard Repository Inspector Dialog ─────────────────── */}
      <Dialog
        open={!!activeItem}
        onOpenChange={(open) => !open && setActiveItem(null)}
      >
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
                <a
                  href={activeItem.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Open GitHub</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <DialogTitle className="text-base font-bold text-foreground mt-1">
                {activeItem.projectTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Team Lead: {activeItem.studentTeamLead} &middot; Supervising Mentor: {activeItem.facultyMentor}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={(val: any) => setActiveTab(val)}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="tree" className="text-xs">
                  File Tree
                </TabsTrigger>
                <TabsTrigger value="readme" className="text-xs">
                  README.md
                </TabsTrigger>
                <TabsTrigger value="license" className="text-xs">
                  LICENSE (MIT)
                </TabsTrigger>
                <TabsTrigger value="decision" className="text-xs">
                  Sign-Off Decision
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: File Tree Preview (Cached server proxy preview) */}
              <TabsContent value="tree" className="space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border border-black/[0.04]">
                  <span>Server-cached repository tree (5-minute TTL)</span>
                  <span className="font-mono text-[11px]">{activeItem.commitCount} total commits</span>
                </div>

                <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-black/30 p-4 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Folder className="size-4 text-blue-500" />
                    <span>root</span>
                  </div>
                  <div className="pl-6 space-y-1.5 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Folder className="size-3.5 text-blue-400" />
                      <span>src/</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileCode className="size-3.5 text-slate-500" />
                        <span>main.py (IoT telemetry MQTT ingestion pipeline)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileCode className="size-3.5 text-slate-500" />
                        <span>sensors.py (Vibration FFT &amp; Accelerometer sampling)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Folder className="size-3.5 text-blue-400" />
                      <span>firmware/</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Folder className="size-3.5 text-blue-400" />
                      <span>docs/</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <FileText className="size-3.5 text-emerald-500" />
                      <span>README.md</span>
                      <CheckCircle2 className="size-3 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <FileText className="size-3.5 text-amber-500" />
                      <span>LICENSE</span>
                      {activeItem.hasMitLicense ? (
                        <CheckCircle2 className="size-3 text-emerald-600" />
                      ) : (
                        <span className="text-rose-600 text-[10px] font-bold">MISSING MIT NOTICE</span>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: README Viewer */}
              <TabsContent value="readme" className="space-y-3 pt-3">
                <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-muted/20 p-4 text-xs space-y-3">
                  <h3 className="text-sm font-bold text-foreground">
                    # {activeItem.projectTitle}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Designed and built under the FXEC MSME Hub initiative for <strong>{activeItem.msmeCompany}</strong>.
                    Provides an edge computing telemetry device and automated alert engine.
                  </p>
                  <h4 className="font-semibold text-foreground pt-1">## Setup &amp; Deployment</h4>
                  <pre className="bg-black/5 dark:bg-black/40 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                    pip install -r requirements.txt&#10;python src/main.py --broker mqtt://broker.hivemq.com
                  </pre>
                </div>
              </TabsContent>

              {/* Tab 3: LICENSE Check */}
              <TabsContent value="license" className="space-y-3 pt-3">
                {activeItem.hasMitLicense ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      <span>MIT License Verified</span>
                    </div>
                    <p className="font-mono text-[11px] text-emerald-900/80 dark:text-emerald-300/80 whitespace-pre-line bg-white/70 dark:bg-black/30 p-3 rounded-lg border border-emerald-200/60">
                      MIT License&#10;&#10;Copyright (c) 2026 FXEC MSME Hub &amp; {activeItem.studentTeamLead}&#10;&#10;Permission is hereby granted, free of charge, to any person obtaining a copy...
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold">
                      <AlertCircle className="size-4 text-rose-600" />
                      <span>Compliance Violation: Missing MIT License</span>
                    </div>
                    <p className="text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed">
                      As mandated by PRD §8.5 REQ-STU-02 and ADR 0003, all student deliverables must contain an MIT License file in the root repository. Request a revision to ensure student lead adds the file.
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
                      <Check className="size-3.5" />
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

