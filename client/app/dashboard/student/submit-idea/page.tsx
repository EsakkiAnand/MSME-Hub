"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Loader2,
  RotateCcw,
  History,
  MessageSquare,
  ExternalLink,
  Edit3,
  Calendar,
  Clock,
  Send,
  PlusCircle,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  submitStudentIdea,
  resubmitStudentIdea,
  getStudentIdeas,
} from "@/app/actions/ideas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const domains = [
  "Manufacturing & Production",
  "Supply Chain & Logistics",
  "FinTech & Payments",
  "Healthcare & MedTech",
  "Agriculture & AgroTech",
  "Retail & E-Commerce",
  "Energy & Sustainability",
  "Education & EdTech",
  "IoT & Embedded Systems",
  "AI / Machine Learning",
  "Software & Web Platforms",
  "Other",
];

export default function SubmitIdeaPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [loadingList, setLoadingList] = useState(false);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);

  // Submission Form State
  const [form, setForm] = useState({
    title: "",
    problemStatement: "",
    proposedSolution: "",
    expectedImpact: "",
    domain: "",
    attachments: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Edit / Resubmit State
  const [editingIdea, setEditingIdea] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    problemStatement: "",
    proposedSolution: "",
    expectedImpact: "",
    domain: "",
    attachments: "",
  });
  const [showResubmitConfirm, setShowResubmitConfirm] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Load student submitted ideas
  const fetchIdeas = async () => {
    try {
      setLoadingList(true);
      const list = await getStudentIdeas();
      setMyIdeas(list);
    } catch (err: any) {
      console.error("Failed to load student ideas:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const validate = (data: typeof form) => {
    const e: Partial<typeof form> = {};
    if (!data.title.trim()) e.title = "Idea title is required.";
    if (!data.problemStatement.trim()) e.problemStatement = "Problem statement is required.";
    if (!data.proposedSolution.trim()) e.proposedSolution = "Proposed solution is required.";
    if (!data.domain) e.domain = "Please select an industry domain.";
    return e;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitStudentIdea(form);
      if (res.success) {
        toast.success("Project proposal submitted for MSME Admin verification!");
        setShowSubmitConfirm(false);
        setForm({
          title: "",
          problemStatement: "",
          proposedSolution: "",
          expectedImpact: "",
          domain: "",
          attachments: "",
        });
        await fetchIdeas();
        setActiveTab("history");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit and Resubmit modal for ideas marked Needs Improvement
  const handleOpenEdit = (idea: any) => {
    setEditingIdea(idea);
    setEditForm({
      title: idea.title,
      problemStatement: idea.problemStatement || idea.description || "",
      proposedSolution: idea.proposedSolution || "",
      expectedImpact: idea.expectedImpact || "",
      domain: idea.domain || "",
      attachments: idea.attachments || "",
    });
  };

  const handleConfirmResubmit = async () => {
    if (!editingIdea) return;
    setIsResubmitting(true);
    try {
      const res = await resubmitStudentIdea({
        ideaId: editingIdea.id,
        ...editForm,
      });
      if (res.success) {
        toast.success("Updated proposal resubmitted to MSME Admin for review!");
        setShowResubmitConfirm(false);
        setEditingIdea(null);
        await fetchIdeas();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resubmit proposal");
    } finally {
      setIsResubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-[10px] bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0">
            <Lightbulb className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              Student Idea Incubation &amp; Verification
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Submit independent technology solutions for regional MSME challenges. Proposals are screened and verified exclusively by MSME Admin for sponsorship and faculty allocation.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-[10px] self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("submit")}
            className={cn(
              "px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5",
              activeTab === "submit"
                ? "bg-white dark:bg-[#2C2C2E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PlusCircle className="size-3.5" />
            <span>Submit Proposal</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-3 py-1.5 rounded-[8px] text-xs font-medium transition-all active:scale-[0.98] flex items-center gap-1.5",
              activeTab === "history"
                ? "bg-white dark:bg-[#2C2C2E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <History className="size-3.5" />
            <span>My Submissions ({myIdeas.length})</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: SUBMIT NEW PROPOSAL ──────────────────────────────── */}
      {activeTab === "submit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form
              onSubmit={handleFormSubmit}
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    Project Concept Pitch
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Provide detailed technical and problem information for review.
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">Step 1 of 1</span>
              </div>

              <div className="p-6 space-y-5">
                {/* Proposal Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Project Proposal Title *</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Max 120 chars</span>
                  </label>
                  <Input
                    placeholder="e.g., Automated Fabric Defect Detection using Edge AI"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    maxLength={120}
                    className="h-9 text-xs rounded-[10px]"
                  />
                  {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                </div>

                {/* Industry Domain */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Target Industry Domain *
                  </label>
                  <IOSSelect
                    value={form.domain}
                    onChange={(v) => handleChange("domain", v)}
                    options={domains.map((d) => ({ value: d, label: d }))}
                    placeholder="Select target MSME industry vertical"
                  />
                  {errors.domain && <p className="text-[11px] text-rose-500">{errors.domain}</p>}
                </div>

                {/* Problem Statement */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Problem Statement &amp; Regional MSME Context *</span>
                    <span className="text-[11px] text-muted-foreground font-normal">Min 50 words</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Clearly define the specific operational bottleneck, equipment inefficiency, or business challenge faced by local micro or small enterprises..."
                    value={form.problemStatement}
                    onChange={(e) => handleChange("problemStatement", e.target.value)}
                    className="w-full rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] resize-none"
                  />
                  {errors.problemStatement && (
                    <p className="text-[11px] text-rose-500">{errors.problemStatement}</p>
                  )}
                </div>

                {/* Proposed Solution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Proposed Solution Architecture &amp; Methodology *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detail the technical approach, hardware/software stack, algorithms, and practical implementation strategy you plan to employ..."
                    value={form.proposedSolution}
                    onChange={(e) => handleChange("proposedSolution", e.target.value)}
                    className="w-full rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] resize-none"
                  />
                  {errors.proposedSolution && (
                    <p className="text-[11px] text-rose-500">{errors.proposedSolution}</p>
                  )}
                </div>

                {/* Expected Impact & Deliverables */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Expected Quantifiable Impact &amp; Deliverables
                  </label>
                  <Input
                    placeholder="e.g., 40% reduction in manual inspection time; working PCB prototype; web dashboard"
                    value={form.expectedImpact}
                    onChange={(e) => handleChange("expectedImpact", e.target.value)}
                    className="h-9 text-xs rounded-[10px]"
                  />
                </div>

                {/* Documentation / Repository Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>Repository or Documentation Link (Optional)</span>
                  </label>
                  <Input
                    placeholder="e.g., https://github.com/student/idea-draft or Google Drive URL"
                    value={form.attachments}
                    onChange={(e) => handleChange("attachments", e.target.value)}
                    className="h-9 text-xs rounded-[10px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Provide a public repository, block diagram URL, or whitepaper link if available.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-black/[0.02] dark:bg-white/[0.03]/75 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowClearConfirm(true)}
                  className="rounded-[10px] text-xs h-9"
                >
                  Clear Fields
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs font-medium h-9 px-4 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send className="size-3.5" />
                      Submit to MSME Admin
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <div className="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Verification Workflow</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 pt-1 leading-relaxed">
                <li>
                  <strong className="text-foreground">1. Admin Screening:</strong> MSME Admin reviews all student proposals for industrial relevance and feasibility.
                </li>
                <li>
                  <strong className="text-foreground">2. Improvement Requests:</strong> If your proposal requires technical refinement, MSME Admin will return it with detailed feedback for revision.
                </li>
                <li>
                  <strong className="text-foreground">3. Showcase Publication:</strong> Approved ideas are published directly to the MSME Industry Showcase for sponsorship.
                </li>
              </ul>
            </div>

            <div className="rounded-[16px] border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-semibold text-xs">
                <HelpCircle className="size-4" />
                <span>Need Guidance?</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300/80 leading-relaxed">
                Connect with FXEC Industry Experts through your dashboard Guidance tab for technical advice before pitching.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MY SUBMISSIONS & VERIFICATION STATUS ────────────── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {loadingList ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span>Loading your submissions...</span>
            </div>
          ) : myIdeas.length === 0 ? (
            <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <Lightbulb className="size-8 mx-auto text-muted-foreground/40" />
              <h4 className="text-sm font-semibold text-foreground">No Submitted Ideas Yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have not submitted any project ideas yet. Click the button below to draft your first proposal.
              </p>
              <Button
                onClick={() => setActiveTab("submit")}
                className="rounded-[10px] bg-[#007AFF] text-white text-xs h-9 px-4"
              >
                Submit Proposal
              </Button>
            </div>
          ) : (
            myIdeas.map((idea) => {
              const needsImprovement = idea.status === "NEEDS_CHANGES";
              const isApproved =
                idea.status === "ACCEPTED" ||
                idea.status === "SHOWCASE_PUBLISHED" ||
                idea.status === "CONVERTED_TO_PROJECT";
              const isRejected = idea.status === "REJECTED";
              const isResubmitted = idea.status === "RESUBMITTED";

              return (
                <div
                  key={idea.id}
                  className={cn(
                    "rounded-[16px] border bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-150",
                    needsImprovement
                      ? "border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-300/40"
                      : "border-black/[0.06] dark:border-white/[0.08]"
                  )}
                >
                  {/* Top Bar */}
                  <div className="px-6 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={idea.status} />
                      <span className="text-xs font-medium text-foreground bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {idea.domain}
                      </span>
                      {isResubmitted && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                          Resubmitted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        Submitted: {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                      {idea.reviewedAt && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-muted-foreground" />
                          Reviewed: {new Date(idea.reviewedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {idea.problemStatement || idea.description}
                      </p>
                    </div>

                    {/* Proposed Solution */}
                    {idea.proposedSolution && (
                      <div className="p-3 rounded-[10px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] text-xs">
                        <span className="font-semibold text-foreground block mb-0.5">
                          Proposed Solution Architecture:
                        </span>
                        <span className="text-muted-foreground">{idea.proposedSolution}</span>
                      </div>
                    )}

                    {/* Admin Feedback Box (Prominent for Needs Improvement or Rejection) */}
                    {idea.adminFeedback && (
                      <div
                        className={cn(
                          "p-4 rounded-[12px] border text-xs space-y-1.5",
                          needsImprovement
                            ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
                            : isRejected
                            ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
                            : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                        )}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-xs">
                          {needsImprovement ? (
                            <RotateCcw className="size-4 text-amber-600" />
                          ) : isRejected ? (
                            <XCircle className="size-4 text-rose-600" />
                          ) : (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          )}
                          <span>
                            {needsImprovement
                              ? "MSME Admin Feedback — Action Required"
                              : isRejected
                              ? "MSME Admin Rejection Reason"
                              : "MSME Admin Verification Note"}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{idea.adminFeedback}</p>
                      </div>
                    )}

                    {/* Review History Logs */}
                    {idea.reviewHistory && idea.reviewHistory.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-black/[0.04]">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          Submission &amp; Review History
                        </span>
                        <div className="space-y-1.5">
                          {idea.reviewHistory.map((rev: any) => (
                            <div
                              key={rev.id}
                              className="text-xs p-2.5 rounded-[8px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] flex items-start justify-between gap-3"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <StatusBadge status={rev.action} />
                                  <span className="text-[11px] text-muted-foreground">
                                    {new Date(rev.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-foreground text-xs mt-1">{rev.feedback}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar for Needs Improvement */}
                    {needsImprovement && (
                      <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-3">
                        <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                          Please edit your proposal to address the admin feedback above, then resubmit for review.
                        </span>
                        <Button
                          onClick={() => handleOpenEdit(idea)}
                          className="rounded-[10px] bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3.5 transition-all active:scale-[0.98] shrink-0"
                        >
                          <Edit3 className="size-3.5 mr-1.5" />
                          Edit &amp; Resubmit Proposal
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── EDIT & RESUBMIT MODAL ────────────────────────────────────── */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[20px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#1C1C1E] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <RotateCcw className="size-4 text-amber-600" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Revise &amp; Resubmit Proposal
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    In response to MSME Admin feedback
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingIdea(null)}
                className="size-7 rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.1] flex items-center justify-center text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Show original admin feedback for reference */}
              {editingIdea.adminFeedback && (
                <div className="p-3.5 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <span className="font-semibold block mb-1">Feedback to address:</span>
                  <p>{editingIdea.adminFeedback}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Project Title</label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-9 text-xs rounded-[10px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Industry Domain</label>
                <IOSSelect
                  value={editForm.domain}
                  onChange={(v) => setEditForm((p) => ({ ...p, domain: v }))}
                  options={domains.map((d) => ({ value: d, label: d }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Problem Statement (Updated)
                </label>
                <textarea
                  rows={4}
                  value={editForm.problemStatement}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, problemStatement: e.target.value }))
                  }
                  className="w-full rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Proposed Solution Architecture (Updated)
                </label>
                <textarea
                  rows={4}
                  value={editForm.proposedSolution}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, proposedSolution: e.target.value }))
                  }
                  className="w-full rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-transparent p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-[#007AFF] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Repository or Documentation URL
                </label>
                <Input
                  value={editForm.attachments}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, attachments: e.target.value }))
                  }
                  placeholder="https://github.com/..."
                  className="h-9 text-xs rounded-[10px]"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.03] flex items-center justify-end gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={() => setEditingIdea(null)}
                className="rounded-[10px] text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowResubmitConfirm(true)}
                className="rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9 px-4 transition-all active:scale-[0.98]"
              >
                Resubmit to MSME Admin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={showSubmitConfirm}
        onOpenChange={setShowSubmitConfirm}
        title="Submit Project Proposal for Admin Review?"
        description="Are you sure you want to submit this idea proposal? It will be screened exclusively by the MSME Administrator for academic feasibility and industry sponsorship."
        itemName={form.title}
        confirmText="Confirm &amp; Submit"
        cancelText="Keep Editing"
        isLoading={isSubmitting}
        onConfirm={handleConfirmSubmit}
      />

      <ConfirmationDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Discard Proposal Draft?"
        description="Are you sure you want to clear all entered fields? All unsubmitted data will be permanently cleared."
        confirmText="Discard Draft"
        cancelText="Continue Editing"
        variant="destructive"
        onConfirm={() => {
          setForm({
            title: "",
            problemStatement: "",
            proposedSolution: "",
            expectedImpact: "",
            domain: "",
            attachments: "",
          });
          setErrors({});
          setShowClearConfirm(false);
        }}
      />

      <ConfirmationDialog
        open={showResubmitConfirm}
        onOpenChange={setShowResubmitConfirm}
        title="Resubmit Revised Proposal to MSME Admin?"
        description="Your updated technical solution and problem details will be submitted back to the MSME Administrator for verification. The verification status will change to Resubmitted."
        itemName={editForm.title}
        confirmText="Resubmit Proposal"
        cancelText="Cancel"
        variant="update"
        isLoading={isResubmitting}
        onConfirm={handleConfirmResubmit}
      />
    </div>
  );
}
