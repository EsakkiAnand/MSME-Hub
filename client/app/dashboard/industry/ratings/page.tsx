"use client";

import { useState } from "react";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { initialIndustryProjects, IndustryProjectItem } from "@/lib/industry-data";
import { submitIndustryRatingAction } from "@/app/actions/industry";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function IndustryRatingsPage() {
  const [projects, setProjects] = useState<IndustryProjectItem[]>(initialIndustryProjects);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IndustryProjectItem | null>(null);
  const [starCount, setStarCount] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Eligible for review: SOLUTION_SUBMITTED, APPROVED, or COMPLETED
  const pendingEvaluation = projects.filter(
    (p) => !p.hasRated && ["SOLUTION_SUBMITTED", "APPROVED", "COMPLETED"].includes(p.status)
  );

  const completedReviews = projects.filter((p) => p.hasRated && p.rating);

  const openRatingModal = (project: IndustryProjectItem) => {
    setSelectedProject(project);
    setStarCount(5);
    setFeedbackText("");
    setIsRatingModalOpen(true);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (!feedbackText.trim()) {
      toast.error("Please enter written review comments.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleFinalRatingSubmit = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      const res = await submitIndustryRatingAction({
        projectId: selectedProject.id,
        stars: starCount,
        feedbackText: feedbackText.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id
              ? {
                  ...p,
                  hasRated: true,
                  rating: {
                    stars: starCount,
                    feedbackText: feedbackText.trim(),
                    createdAt: new Date().toISOString(),
                  },
                }
              : p
          )
        );
        setIsRatingModalOpen(false);
      } else {
        toast.error(res.error || "Failed to record evaluation.");
      }
    } catch {
      toast.error("An unexpected error occurred while submitting rating.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground">
              Ratings &amp; Solution Reviews
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Governance Approved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mt-0.5">
            Evaluate delivered solutions, inspect open-source GitHub codebases, and endorse student innovation.
          </p>
        </div>
      </div>

      {/* ADR 0004 Governance Alert */}
      <div className="rounded-xl border border-blue-200/90 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4.5 text-foreground dark:text-slate-200 flex items-start gap-3 shadow-xs">
        <div className="p-2 rounded-lg bg-blue-100 text-[#007AFF] dark:bg-blue-900/50 dark:text-blue-300 shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200">
            ADR 0004 Quality &amp; Rating Mediation Policy
          </p>
          <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed text-xs">
            Ratings of <strong className="text-emerald-700 dark:text-emerald-400">3 to 5 stars</strong> are published directly to the public student showcase and MSME repository gallery. In compliance with ADR 0004, evaluations of <strong className="text-amber-700 dark:text-amber-400">1 or 2 stars</strong> are routed to the MSME Admin Mediation Board for faculty consultation prior to publication.
          </p>
        </div>
      </div>

      {/* Section 1: Pending Evaluations */}
      <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-white dark:bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-border mb-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-amber-600" />
            <h2 className="text-base font-semibold text-foreground dark:text-foreground">
              Projects Awaiting Evaluation ({pendingEvaluation.length})
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Solutions delivered for review</span>
        </div>

        {pendingEvaluation.length === 0 ? (
          <div className="text-center py-10 bg-black/[0.02] dark:bg-white/[0.02] dark:bg-muted/30 rounded-lg border border-dashed border-black/[0.06] dark:border-white/[0.08] dark:border-border">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground dark:text-foreground">All delivered solutions evaluated</p>
            <p className="text-xs text-muted-foreground mt-1">
              New project reviews will appear here when student teams complete their deliverables.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingEvaluation.map((proj) => (
              <div
                key={proj.id}
                className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-black/[0.02] dark:bg-white/[0.03]/40 dark:bg-muted/20 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <CopyIdBadge id={proj.id} label="PRJ" size="xs" />
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-xs font-semibold">
                      Solution Submitted
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground dark:text-foreground text-sm line-clamp-2 mb-2">
                    {proj.problemTitle}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground dark:text-muted-foreground mb-4 bg-white dark:bg-card p-3 rounded-lg border border-slate-100 dark:border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Team Lead:</span>
                      <span className="font-medium text-foreground dark:text-foreground">
                        {proj.studentTeamLeadName} ({proj.studentTeamLeadId})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Faculty Director:</span>
                      <span className="font-medium text-foreground dark:text-foreground">{proj.facultyMentorName}</span>
                    </div>
                  </div>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#007AFF] hover:underline mb-4"
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      Inspect MIT GitHub Codebase
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openRatingModal(proj)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  Evaluate &amp; Rate Solution
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Completed Evaluations */}
      <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-white dark:bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-border mb-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-foreground dark:text-foreground">
              Published Reviews &amp; Testimonials ({completedReviews.length})
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">Historical performance records</span>
        </div>

        {completedReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No completed reviews recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {completedReviews.map((proj) => {
              const rating = proj.rating!;
              const isModerated = rating.stars <= 2;
              return (
                <div
                  key={proj.id}
                  className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-black/[0.02] dark:bg-white/[0.03]/40 dark:bg-muted/20 p-5 hover:bg-white dark:hover:bg-card transition-colors shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CopyIdBadge id={proj.id} label="PRJ" size="xs" />
                      <span className="text-xs font-medium text-muted-foreground">for</span>
                      <span className="text-xs font-semibold text-foreground dark:text-foreground">
                        {proj.problemTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isModerated ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-xs font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Under ADR 0004 Mediation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Published Showcase
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stars Display */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= rating.stars
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 dark:text-foreground fill-slate-100 dark:fill-slate-800"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-foreground dark:text-slate-300 ml-1.5">
                      {rating.stars}.0 / 5.0
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Evaluated on {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-foreground dark:text-slate-300 bg-white dark:bg-card p-3.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08]/80 dark:border-border italic">
                    &ldquo;{rating.feedbackText}&rdquo;
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Team: <strong className="text-foreground dark:text-slate-300">{proj.studentTeamLeadName}</strong>{" "}
                      lead &bull; Guided by{" "}
                      <strong className="text-foreground dark:text-slate-300">{proj.facultyMentorName}</strong>
                    </span>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#007AFF] hover:underline"
                      >
                        <GitBranch className="h-3 w-3" />
                        Code Repository
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accessible Evaluation Dialog */}
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        {selectedProject && (
          <DialogContent className="max-w-lg p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground dark:text-foreground">
                Project Evaluation
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Rating solution for {selectedProject.id}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePreSubmit} className="space-y-4 mt-2">
              {/* Problem info */}
              <div className="rounded-lg bg-black/[0.02] dark:bg-white/[0.03] dark:bg-muted/40 p-3 text-xs text-foreground dark:text-muted-foreground border border-black/[0.06] dark:border-white/[0.08]/80 dark:border-border">
                <p className="font-semibold text-foreground dark:text-foreground mb-1">{selectedProject.problemTitle}</p>
                <p className="text-muted-foreground">
                  Lead: {selectedProject.studentTeamLeadName} ({selectedProject.studentTeamLeadId}) &bull; Faculty: {selectedProject.facultyMentorName}
                </p>
              </div>

              {/* Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-slate-300 mb-2">
                  Overall Quality &amp; Delivery Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setStarCount(star)}
                      className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-hidden cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          (hoverStar || starCount) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground dark:text-slate-200 ml-2">
                    {starCount} of 5 Stars
                  </span>
                </div>
              </div>

              {/* ADR 0004 Warning for <= 2 Stars */}
              {starCount <= 2 && (
                <div className="rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <strong className="block font-semibold">ADR 0004 Governance Notice:</strong>
                    Ratings of 2 stars or below trigger the MSME Admin Mediation Board. An admin and
                    faculty advisor will follow up with you to address defects.
                  </div>
                </div>
              )}

              {/* Written Review */}
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-slate-300 mb-1.5">
                  Testimonial &amp; Technical Review Comments *
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Detail the effectiveness of the delivered solution, code quality, and operational fit for your organization..."
                  className="w-full rounded-lg border border-slate-300 dark:border-border p-3 text-xs text-foreground dark:text-foreground placeholder:text-muted-foreground bg-white dark:bg-background focus:border-[#1d4ed8] focus:outline-none focus:ring-1 focus:ring-[#1d4ed8] transition-all"
                />
              </div>

              <DialogFooter className="mt-4">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="rounded-lg border border-black/[0.06] dark:border-white/[0.08] dark:border-border px-4 py-2 text-xs font-medium text-foreground dark:text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03] dark:hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 px-4 py-2 text-xs font-semibold text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Review &amp; Sign</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* iOS-Inspired Confirmation Dialog for Review Submission */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirm Solution Rating Submission"
        description={`Are you sure you want to commit a ${starCount}-star evaluation for this project? This will be permanently recorded in the institutional archive.`}
        itemName={selectedProject?.problemTitle}
        itemType="Delivered Solution"
        confirmText="Submit Formal Evaluation"
        variant={starCount <= 2 ? "destructive" : "default"}
        isLoading={isSubmitting}
        onConfirm={handleFinalRatingSubmit}
      />
    </div>
  );
}
