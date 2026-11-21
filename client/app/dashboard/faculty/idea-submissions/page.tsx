"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Building,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStaffIdeaQueue, reviewStudentIdeaAction } from "@/app/actions/staff";

interface LiveIdea {
  id: string;
  title: string;
  domain: string;
  description: string;
  problemStatement: string | null;
  proposedSolution: string | null;
  expectedImpact: string | null;
  status: string;
  staffComments: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    uniqueId: string | null;
    email: string;
    institutionDomain: string | null;
  };
}

const filterOptions = [
  { value: "All", label: "All Review Statuses" },
  { value: "SUBMITTED", label: "Submitted / Awaiting Review" },
  { value: "NEEDS_CHANGES", label: "Changes Requested" },
  { value: "ACCEPTED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function FacultyIdeaSubmissionsPage() {
  const [ideas, setIdeas] = useState<LiveIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dialog states
  const [activeIdea, setActiveIdea] = useState<LiveIdea | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REQUEST_CHANGES" | "REJECT" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadIdeas = async () => {
    const res = await getStaffIdeaQueue();
    if (res.success) {
      setIdeas((res.ideas as any[]) || []);
    } else {
      toast.error(res.error || "Failed to load student ideas.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadIdeas();
      setLoading(false);
    })();
  }, []);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      search.trim() === "" ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.student.name.toLowerCase().includes(search.toLowerCase()) ||
      (idea.student.uniqueId || "").toLowerCase().includes(search.toLowerCase()) ||
      idea.domain.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "SUBMITTED"
        ? ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED"].includes(idea.status)
        : idea.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = ideas.filter((i) =>
    ["SUBMITTED", "UNDER_REVIEW", "RESUBMITTED", "NEEDS_CHANGES"].includes(i.status)
  ).length;

  const handleOpenAction = (idea: LiveIdea, type: "APPROVE" | "REQUEST_CHANGES" | "REJECT") => {
    setActiveIdea(idea);
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!activeIdea || !actionType) return;
    setIsProcessing(true);

    try {
      const action =
        actionType === "APPROVE"
          ? "ACCEPT"
          : actionType === "REQUEST_CHANGES"
          ? "REQUEST_IMPROVEMENTS"
          : "REJECT";

      const remarks =
        actionType === "APPROVE"
          ? "Recommended by faculty mentor. Strong fit for MSME sponsorship incubation."
          : actionType === "REQUEST_CHANGES"
          ? "Please elaborate on the technical scope, feasibility, and expected impact before re-submission."
          : "Declined: scope does not align with regional MSME application requirements.";

      const res = await reviewStudentIdeaAction({
        ideaId: activeIdea.id,
        action,
        feedback: remarks,
      });

      if (res.success) {
        if (actionType === "APPROVE") {
          toast.success(`Idea "${activeIdea.title}" accepted. It is now eligible for the Sponsorship Showcase.`);
        } else if (actionType === "REQUEST_CHANGES") {
          toast.success(`Improvements requested for "${activeIdea.title}".`);
        } else {
          toast.success(`Idea "${activeIdea.title}" rejected.`);
        }
        await loadIdeas();
      } else {
        toast.error(res.error || "Failed to process idea review action.");
      }
    } catch {
      toast.error("Failed to process idea review action.");
    } finally {
      setIsProcessing(false);
      setActionType(null);
      setActiveIdea(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading student ideas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="size-4.5 text-[#14283F] dark:text-sky-400" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Student Innovation Evaluator
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Student Idea Submissions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Review independent problem pitches submitted by engineering students for MSME incubation.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-foreground self-start sm:self-auto shadow-2xs">
          {pendingCount} Pending Evaluations
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by idea title, student name, ID, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-xl border-slate-200/90 dark:border-slate-800 focus-visible:ring-[#14283F]/20"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
          <IOSSelect
            size="sm"
            options={filterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-48"
          />
        </div>
      </div>

      {/* Idea Cards List */}
      <div className="space-y-4">
        {filteredIdeas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-12 text-center text-muted-foreground text-sm">
            No student ideas match the current filter.
          </div>
        ) : (
          filteredIdeas.map((idea) => {
            const isTerminal = ["ACCEPTED", "REJECTED", "CONVERTED_TO_PROJECT", "SHOWCASE_PUBLISHED"].includes(idea.status);
            return (
              <div
                key={idea.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-5 sm:p-6 hover:border-[#14283F]/30 dark:hover:border-primary/40 hover:shadow-sm transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                      {idea.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={idea.status} />
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-muted-foreground">{idea.domain}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>Submitted: {new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Submitter & Title */}
                <div className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-full bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-semibold text-foreground text-[11px]">
                      {idea.student.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{idea.student.name}</span>
                    {idea.student.uniqueId && (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ({idea.student.uniqueId})
                      </span>
                    )}
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-muted-foreground">
                      {idea.student.institutionDomain ? `@${idea.student.institutionDomain}` : ""}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground tracking-tight">{idea.title}</h3>

                  <div className="mt-2.5 text-xs text-foreground leading-relaxed bg-black/[0.02] dark:bg-white/[0.03]/70 p-3.5 rounded-md border border-slate-100">
                    <p className="font-semibold text-foreground mb-1">Problem &amp; Proposed Solution:</p>
                    <p>
                      {idea.problemStatement || idea.description}
                      {idea.proposedSolution && (
                        <span className="block mt-2">
                          <strong>Proposed Solution:</strong> {idea.proposedSolution}
                        </span>
                      )}
                    </p>

                    {idea.expectedImpact && (
                      <>
                        <p className="font-semibold text-foreground mt-3 mb-1">Expected Impact:</p>
                        <p className="text-muted-foreground">{idea.expectedImpact}</p>
                      </>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08]/60 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Building className="size-3.5 text-muted-foreground" />
                      <span>
                        Target MSME Cluster: <strong className="text-foreground">{idea.domain}</strong>
                      </span>
                    </div>
                  </div>

                  {idea.staffComments && (
                    <div className="mt-3 p-3 rounded-md bg-blue-50/60 border border-blue-100 text-xs">
                      <span className="font-semibold text-blue-900 block mb-0.5">
                        Faculty / Admin Evaluation Note:
                      </span>
                      <span className="text-blue-800">{idea.staffComments}</span>
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-500" />
                    <span>Faculty academic recommendation (final verification governed by MSME Admin)</span>
                  </span>

                  {!isTerminal && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAction(idea, "APPROVE")}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-[0.98]"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Accept &amp; Recommend</span>
                      </button>

                      <button
                        onClick={() => handleOpenAction(idea, "REQUEST_CHANGES")}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-blue-200 text-[#007AFF] hover:bg-blue-50 transition-all active:scale-[0.98]"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Suggest Revisions</span>
                      </button>

                      <button
                        onClick={() => handleOpenAction(idea, "REJECT")}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all active:scale-[0.98]"
                      >
                        <XCircle className="size-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={actionType !== null}
        onOpenChange={(open) => !open && setActionType(null)}
        title={
          actionType === "APPROVE"
            ? "Accept Student Idea"
            : actionType === "REQUEST_CHANGES"
            ? "Request Idea Improvements"
            : "Reject Student Idea"
        }
        description={
          actionType === "APPROVE"
            ? "Are you sure you want to accept this student idea? It will be made eligible for the Sponsorship Showcase and project conversion."
            : actionType === "REQUEST_CHANGES"
            ? "Are you sure you want to request improvements from the student on this pitch? They will be able to resubmit."
            : "Are you sure you want to reject this idea? This action will mark the submission as declined."
        }
        itemName={activeIdea?.title}
        confirmText={
          actionType === "APPROVE"
            ? "Accept Idea"
            : actionType === "REQUEST_CHANGES"
            ? "Send Improvement Request"
            : "Reject Idea"
        }
        variant={actionType === "REJECT" ? "destructive" : actionType === "REQUEST_CHANGES" ? "update" : "default"}
        isLoading={isProcessing}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
