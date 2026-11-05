"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  RotateCcw,
  User,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  Building,
  History,
  MessageSquare,
  Sparkles,
  Paperclip,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";
import {
  getAdminIdeasOverview,
  getAdminIdeaDetails,
  reviewIdeaByAdmin,
} from "@/app/actions/ideas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminIdeaVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      pendingCount: number;
      freshPendingCount: number;
      resubmittedCount: number;
      approvedCount: number;
      needsImprovementCount: number;
      rejectedCount: number;
      totalCount: number;
    };
    ideas: any[];
  } | null>(null);

  const [search, setSearch] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<
    "ALL" | "PENDING" | "NEEDS_IMPROVEMENT" | "APPROVED" | "REJECTED"
  >("ALL");

  // Detail Modal & Action states
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [detailIdea, setDetailIdea] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Decision state
  const [feedbackText, setFeedbackText] = useState("");
  const [actionConfirmType, setActionConfirmType] = useState<
    "APPROVE" | "REQUEST_IMPROVEMENT" | "REJECT" | null
  >(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAdminIdeasOverview({
        status: selectedStatusTab,
        search,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load idea proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStatusTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenDetails = async (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setDetailLoading(true);
    setFeedbackText("");
    try {
      const idea = await getAdminIdeaDetails(ideaId);
      setDetailIdea(idea);
    } catch (err: any) {
      toast.error(err.message || "Failed to load idea details");
      setSelectedIdeaId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedIdeaId(null);
    setDetailIdea(null);
    setFeedbackText("");
    setActionConfirmType(null);
  };

  const handleInitiateAction = (type: "APPROVE" | "REQUEST_IMPROVEMENT" | "REJECT") => {
    if ((type === "REQUEST_IMPROVEMENT" || type === "REJECT") && !feedbackText.trim()) {
      toast.error(
        type === "REQUEST_IMPROVEMENT"
          ? "Please provide written feedback detailing the required improvements."
          : "Please provide a written rejection reason."
      );
      return;
    }
    setActionConfirmType(type);
  };

  const handleExecuteReview = async () => {
    if (!detailIdea || !actionConfirmType) return;
    setIsSubmittingAction(true);
    try {
      const res = await reviewIdeaByAdmin({
        ideaId: detailIdea.id,
        action: actionConfirmType,
        feedback: feedbackText.trim(),
      });
      if (res.success) {
        toast.success(
          actionConfirmType === "APPROVE"
            ? `Idea "${detailIdea.title}" approved and published to showcase!`
            : actionConfirmType === "REQUEST_IMPROVEMENT"
            ? `Requested improvements for "${detailIdea.title}". Student notified.`
            : `Idea "${detailIdea.title}" rejected.`
        );
        handleCloseDetails();
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to complete review action");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Card ─────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Governance &amp; Incubation
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Student Idea Verification &amp; Review
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Exclusive MSME Admin authority to verify student technology pitches, request improvements, and approve high-impact proposals for incubation and industry sponsorship.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-slate-100 dark:bg-slate-800 text-xs font-medium text-foreground">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Admin-Only Authority</span>
          </div>
        </div>
      </div>

      {/* ── KPI Metrics ─────────────────────────────────────────────── */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Pending Review",
            count: data?.stats.pendingCount ?? 0,
            sublabel: `${data?.stats.resubmittedCount ?? 0} resubmitted by student`,
            icon: Clock,
            accent: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
            tabKey: "PENDING" as const,
          },
          {
            label: "Needs Improvement",
            count: data?.stats.needsImprovementCount ?? 0,
            sublabel: "Awaiting student revisions",
            icon: RotateCcw,
            accent: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
            tabKey: "NEEDS_IMPROVEMENT" as const,
          },
          {
            label: "Approved & Live",
            count: data?.stats.approvedCount ?? 0,
            sublabel: "Published for industry sponsorship",
            icon: CheckCircle2,
            accent: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
            tabKey: "APPROVED" as const,
          },
          {
            label: "Rejected",
            count: data?.stats.rejectedCount ?? 0,
            sublabel: "Declined proposals",
            icon: XCircle,
            accent: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300",
            tabKey: "REJECTED" as const,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          const isActive = selectedStatusTab === kpi.tabKey;
          return (
            <StaggerItem key={kpi.label}>
              <button
                type="button"
                onClick={() =>
                  setSelectedStatusTab(isActive ? "ALL" : kpi.tabKey)
                }
                className={cn(
                  "w-full text-left rounded-[16px] border p-4 transition-all duration-150 select-none active:scale-[0.98] flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                  isActive
                    ? "border-slate-400 bg-black/[0.03] dark:bg-white/[0.06] ring-1 ring-slate-400"
                    : "border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {kpi.label}
                  </span>
                  <div className={cn("size-7 rounded-[8px] flex items-center justify-center border shrink-0", kpi.accent)}>
                    <Icon className="size-3.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {kpi.count}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {kpi.sublabel}
                  </div>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Search & Filter Controls ─────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: "ALL", label: `All (${data?.stats.totalCount ?? 0})` },
            { key: "PENDING", label: `Pending (${data?.stats.pendingCount ?? 0})` },
            { key: "NEEDS_IMPROVEMENT", label: `Needs Improvement (${data?.stats.needsImprovementCount ?? 0})` },
            { key: "APPROVED", label: `Approved (${data?.stats.approvedCount ?? 0})` },
            { key: "REJECTED", label: `Rejected (${data?.stats.rejectedCount ?? 0})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusTab(tab.key as any)}
              className={cn(
                "px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all active:scale-[0.98]",
                selectedStatusTab === tab.key
                  ? "bg-foreground text-background font-semibold"
                  : "bg-black/[0.03] dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search idea, student, or ID..."
            className="pl-8 h-8 rounded-[8px] text-xs border-slate-200 dark:border-white/[0.08]"
          />
        </form>
      </div>

      {/* ── Review List ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Submitted Student Proposals
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any idea proposal to inspect technical feasibility, student profile, and execute verification decisions.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="h-8 rounded-[8px] text-xs"
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
            <span>Loading verification queue...</span>
          </div>
        ) : !data?.ideas || data.ideas.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <Lightbulb className="size-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-medium text-foreground text-sm">No idea proposals found</p>
            <p className="text-muted-foreground">
              {search
                ? "No matching student proposals for your search query."
                : "There are currently no proposals matching the selected filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {data.ideas.map((idea) => {
              const isPending =
                idea.status === "SUBMITTED" ||
                idea.status === "UNDER_REVIEW" ||
                idea.status === "RESUBMITTED";
              const isResubmitted = idea.status === "RESUBMITTED";

              return (
                <div
                  key={idea.id}
                  className="p-5 sm:px-6 hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={idea.status} />
                      {isResubmitted && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                          Revised by Student
                        </span>
                      )}
                      <span className="text-xs font-medium text-muted-foreground">
                        Domain: <strong className="text-foreground">{idea.domain}</strong>
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        Submitted: {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-foreground leading-snug">
                      {idea.title}
                    </h4>

                    {/* Student Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-foreground font-medium">
                        <User className="size-3.5 text-muted-foreground" />
                        {idea.student?.name || "Student"}
                      </span>
                      <CopyIdBadge id={idea.student?.uniqueId || "STU-ID"} size="xs" />
                      <span className="text-muted-foreground">{idea.student?.email}</span>
                    </div>

                    {/* Admin latest feedback snippet if exists */}
                    {idea.adminFeedback && (
                      <div className="mt-2 p-2.5 rounded-[8px] bg-slate-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-xs">
                        <span className="font-semibold text-foreground mr-1.5">
                          Admin Feedback:
                        </span>
                        <span className="text-muted-foreground line-clamp-2">
                          {idea.adminFeedback}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                    <Button
                      onClick={() => handleOpenDetails(idea.id)}
                      className={cn(
                        "rounded-[10px] text-xs font-medium px-4 py-2 transition-all active:scale-[0.98]",
                        isPending
                          ? "bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-foreground"
                      )}
                    >
                      <span>{isPending ? "Review Proposal" : "View Details"}</span>
                      <ChevronRight className="size-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Idea Details & Review Modal ──────────────────────────────── */}
      {selectedIdeaId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-[20px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#1C1C1E] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-[8px] bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Lightbulb className="size-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    Review Idea Proposal
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">
                    MSME Central Verification and Improvement Engine
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseDetails}
                className="size-7 rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.1] flex items-center justify-center text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {detailLoading || !detailIdea ? (
                <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading proposal dossier...</span>
                </div>
              ) : (
                <>
                  {/* Title & Status Banner */}
                  <div className="p-4 rounded-[12px] bg-slate-50 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={detailIdea.status} />
                        <span className="text-xs text-muted-foreground font-mono">
                          ID: {detailIdea.id.slice(0, 8)}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-foreground bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                        Domain: {detailIdea.domain}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-foreground">
                      {detailIdea.title}
                    </h2>
                  </div>

                  {/* 1. Student Dossier */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
                      <User className="size-3.5" />
                      Student Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-[12px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
                      <div>
                        <span className="text-muted-foreground text-[11px] block">Student Name</span>
                        <span className="font-semibold text-foreground">{detailIdea.student?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px] block">Student ID</span>
                        <CopyIdBadge id={detailIdea.student?.uniqueId || "STU-ID"} size="xs" />
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px] block">Email</span>
                        <span className="text-foreground">{detailIdea.student?.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px] block">Submission Date</span>
                        <span className="text-foreground">
                          {new Date(detailIdea.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Problem Statement */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
                      1. Problem Statement &amp; MSME Need
                    </h4>
                    <div className="p-3.5 rounded-[12px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] text-foreground leading-relaxed whitespace-pre-wrap">
                      {detailIdea.problemStatement || detailIdea.description}
                    </div>
                  </div>

                  {/* 3. Proposed Solution */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
                      2. Proposed Technical Solution &amp; Architecture
                    </h4>
                    <div className="p-3.5 rounded-[12px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] text-foreground leading-relaxed whitespace-pre-wrap">
                      {detailIdea.proposedSolution || "Refer to description section."}
                    </div>
                  </div>

                  {/* 4. Expected Impact */}
                  {detailIdea.expectedImpact && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
                        3. Expected Impact &amp; Deliverables
                      </h4>
                      <div className="p-3.5 rounded-[12px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06] text-foreground leading-relaxed whitespace-pre-wrap">
                        {detailIdea.expectedImpact}
                      </div>
                    </div>
                  )}

                  {/* 5. Uploaded Attachments / Links */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Paperclip className="size-3.5" />
                      4. Attachments &amp; Documentation
                    </h4>
                    <div className="p-3.5 rounded-[12px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.06]">
                      {detailIdea.attachments ? (
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <ExternalLink className="size-3.5" />
                          <a
                            href={detailIdea.attachments}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium hover:text-blue-700 truncate"
                          >
                            {detailIdea.attachments}
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No external repository or file attachments provided for this submission.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 6. Review History Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <History className="size-3.5" />
                      5. Review &amp; Improvement History
                    </h4>
                    {detailIdea.reviewHistory && detailIdea.reviewHistory.length > 0 ? (
                      <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
                        {detailIdea.reviewHistory.map((rev: any) => (
                          <div key={rev.id} className="relative pb-2">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={rev.action} />
                              <span className="text-[11px] text-muted-foreground">
                                {new Date(rev.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-foreground mt-1 bg-black/[0.02] dark:bg-white/[0.02] p-2.5 rounded-[8px] border border-black/[0.04]">
                              {rev.feedback}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-white/[0.02] text-muted-foreground">
                        No previous review actions logged for this proposal.
                      </div>
                    )}
                  </div>

                  {/* ── Decision & Feedback Area ──────────────────────── */}
                  <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <MessageSquare className="size-3.5 text-muted-foreground" />
                        Admin Evaluation Feedback / Reason
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        Required for Request Improvement &amp; Rejection
                      </span>
                    </div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      placeholder="Write feedback notes, required improvements, or approval remarks..."
                      className="w-full rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#151516] p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer: Action Buttons */}
            {detailIdea && !detailLoading && (
              <div className="px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.03] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <Button
                  variant="outline"
                  onClick={handleCloseDetails}
                  className="rounded-[10px] text-xs h-9"
                >
                  Close
                </Button>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => handleInitiateAction("APPROVE")}
                    className="rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Approve Idea
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleInitiateAction("REQUEST_IMPROVEMENT")}
                    className="rounded-[10px] border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs h-9 px-3.5 transition-all active:scale-[0.98]"
                  >
                    <RotateCcw className="size-3.5 mr-1.5" />
                    Request Improvement
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleInitiateAction("REJECT")}
                    className="rounded-[10px] border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs h-9 px-3.5 transition-all active:scale-[0.98]"
                  >
                    <XCircle className="size-3.5 mr-1.5" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Confirmation Dialog for Admin Actions ─────────────────────── */}
      <ConfirmationDialog
        open={actionConfirmType !== null}
        onOpenChange={(open) => !open && setActionConfirmType(null)}
        title={
          actionConfirmType === "APPROVE"
            ? "Approve Student Project Idea?"
            : actionConfirmType === "REQUEST_IMPROVEMENT"
            ? "Request Revisions on Student Idea?"
            : "Reject Student Project Idea?"
        }
        description={
          actionConfirmType === "APPROVE"
            ? "Approving this proposal will publish it to the Sponsorship Showcase and authorize faculty allocation. The status will become Approved."
            : actionConfirmType === "REQUEST_IMPROVEMENT"
            ? "The student will receive your written feedback and will be permitted to edit and resubmit their proposal draft."
            : "This action will decline the student proposal. The rejection reason and dossier will remain archived and accessible to the student."
        }
        itemName={detailIdea?.title}
        confirmText={
          actionConfirmType === "APPROVE"
            ? "Approve & Publish"
            : actionConfirmType === "REQUEST_IMPROVEMENT"
            ? "Send Improvement Request"
            : "Confirm Rejection"
        }
        cancelText="Cancel"
        variant={
          actionConfirmType === "REJECT"
            ? "destructive"
            : actionConfirmType === "REQUEST_IMPROVEMENT"
            ? "update"
            : "default"
        }
        isLoading={isSubmittingAction}
        onConfirm={handleExecuteReview}
      />
    </div>
  );
}

