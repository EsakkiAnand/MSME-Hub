"use client";

import { useState } from "react";
import {
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Building,
  GraduationCap,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialIdeaSubmissions, FacultyIdeaSubmission } from "@/lib/faculty-data";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  PENDING_REVIEW: {
    label: "Awaiting Faculty Review",
    badgeClass: "bg-[#FF9500]/10 text-[#FF9500] border-transparent",
  },
  ACCEPTED: {
    label: "Approved & Recommended",
    badgeClass: "bg-[#34C759]/10 text-[#34C759] border-transparent",
  },
  REVISION_REQUESTED: {
    label: "Changes Requested",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-[#FF3B30]/10 text-[#FF3B30] border-transparent",
  },
};

const filterOptions = [
  { value: "All", label: "All Review Statuses" },
  { value: "PENDING_REVIEW", label: "Awaiting Review" },
  { value: "ACCEPTED", label: "Approved" },
  { value: "REVISION_REQUESTED", label: "Changes Requested" },
  { value: "REJECTED", label: "Rejected" },
];

export default function FacultyIdeaSubmissionsPage() {
  const [ideas, setIdeas] = useState<FacultyIdeaSubmission[]>(initialIdeaSubmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dialog states
  const [activeIdea, setActiveIdea] = useState<FacultyIdeaSubmission | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REQUEST_CHANGES" | "REJECT" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.studentName.toLowerCase().includes(search.toLowerCase()) ||
      idea.studentRegNo.toLowerCase().includes(search.toLowerCase()) ||
      idea.domain.toLowerCase().includes(search.toLowerCase()) ||
      idea.targetSector.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAction = (idea: FacultyIdeaSubmission, type: "APPROVE" | "REQUEST_CHANGES" | "REJECT") => {
    setActiveIdea(idea);
    setActionType(type);
  };

  const handleConfirmAction = async () => {
    if (!activeIdea || !actionType) return;
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 600));

      const newStatus =
        actionType === "APPROVE"
          ? "ACCEPTED"
          : actionType === "REQUEST_CHANGES"
          ? "REVISION_REQUESTED"
          : "REJECTED";

      const remarks =
        actionType === "APPROVE"
          ? "Approved by Faculty Mentor. Recommended for conversion into MSME sponsored challenge."
          : actionType === "REQUEST_CHANGES"
          ? "Scope needs refinement. Please elaborate on hardware BOM and feasibility."
          : "Declined due to duplicate research scope or lack of regional MSME application.";

      setIdeas((prev) =>
        prev.map((item) =>
          item.id === activeIdea.id
            ? { ...item, status: newStatus as any, facultyRemarks: remarks }
            : item
        )
      );

      if (actionType === "APPROVE") {
        toast.success(`Idea "${activeIdea.title}" approved!`);
      } else if (actionType === "REQUEST_CHANGES") {
        toast.success(`Requested improvements for "${activeIdea.title}".`);
      } else {
        toast.success(`Idea "${activeIdea.title}" rejected.`);
      }
    } catch {
      toast.error("Failed to process idea review action.");
    } finally {
      setIsProcessing(false);
      setActionType(null);
      setActiveIdea(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="size-4 text-[#007AFF]" />
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
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto">
          {ideas.filter((i) => i.status === "PENDING_REVIEW").length} Pending Evaluations
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by idea title, student name, register number, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
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
      <div className="space-y-5">
        {filteredIdeas.length === 0 ? (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 text-center text-muted-foreground text-sm">
            No student ideas match the current filter.
          </div>
        ) : (
          filteredIdeas.map((idea) => {
            const st = statusConfig[idea.status] ?? statusConfig.PENDING_REVIEW;

            return (
              <div
                key={idea.id}
                className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 hover:border-slate-300 hover:shadow-xs transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                      {idea.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${st.badgeClass}`}
                    >
                      {st.label}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs font-medium text-muted-foreground">{idea.domain}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>Submitted: {idea.submissionDate}</span>
                  </div>
                </div>

                {/* Submitter & Title */}
                <div className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-6 rounded-full bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center font-semibold text-foreground text-[11px]">
                      {idea.studentName.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {idea.studentName}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      ({idea.studentRegNo})
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-muted-foreground">{idea.department}</span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {idea.title}
                  </h3>

                  <div className="mt-2.5 text-xs text-foreground leading-relaxed bg-black/[0.02] dark:bg-white/[0.03]/70 p-3.5 rounded-md border border-slate-100">
                    <p className="font-semibold text-foreground mb-1">Problem &amp; Proposed Solution:</p>
                    <p>{idea.description}</p>

                    <p className="font-semibold text-foreground mt-3 mb-1">Expected Deliverables:</p>
                    <p className="text-muted-foreground">{idea.expectedOutcome}</p>

                    <div className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08]/60 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Building className="size-3.5 text-muted-foreground" />
                      <span>Target MSME Cluster: <strong className="text-foreground">{idea.targetSector}</strong></span>
                    </div>
                  </div>

                  {idea.facultyRemarks && (
                    <div className="mt-3 p-3 rounded-md bg-blue-50/60 border border-blue-100 text-xs">
                      <span className="font-semibold text-blue-900 block mb-0.5">Faculty Evaluation Note:</span>
                      <span className="text-blue-800">{idea.facultyRemarks}</span>
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    Faculty authority: Accept for MSME sponsorship, request improvements, or reject
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAction(idea, "APPROVE")}
                      disabled={idea.status === "ACCEPTED"}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Approve Idea</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(idea, "REQUEST_CHANGES")}
                      disabled={idea.status === "REVISION_REQUESTED"}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-blue-200 text-[#007AFF] hover:bg-blue-50 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(idea, "REJECT")}
                      disabled={idea.status === "REJECTED"}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                      <XCircle className="size-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
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
            ? "Approve Student Idea"
            : actionType === "REQUEST_CHANGES"
            ? "Request Idea Improvements"
            : "Reject Student Idea"
        }
        description={
          actionType === "APPROVE"
            ? "Are you sure you want to approve this student idea? It will be forwarded to the MSME Incubation & Sponsorship pool."
            : actionType === "REQUEST_CHANGES"
            ? "Are you sure you want to request improvements from the student on this pitch?"
            : "Are you sure you want to reject this idea? This action will mark the submission as declined."
        }
        itemName={activeIdea?.title}
        confirmText={
          actionType === "APPROVE"
            ? "Approve Idea"
            : actionType === "REQUEST_CHANGES"
            ? "Send Improvement"
            : "Reject Idea"
        }
        variant={actionType === "REJECT" ? "destructive" : actionType === "REQUEST_CHANGES" ? "update" : "default"}
        isLoading={isProcessing}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
