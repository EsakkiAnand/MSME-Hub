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

export default function IndustryRatingsPage() {
  const [projects, setProjects] = useState<IndustryProjectItem[]>(initialIndustryProjects);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IndustryProjectItem | null>(null);
  const [starCount, setStarCount] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (!feedbackText.trim()) {
      toast.error("Please enter written review comments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitIndustryRatingAction({
        projectId: selectedProject.id,
        stars: starCount,
        feedbackText: feedbackText.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        // Update local state
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
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Ratings & Solution Reviews
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              PRD §8.3
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Evaluate delivered solutions, inspect open-source GitHub codebases, and endorse student innovation.
          </p>
        </div>
      </div>

      {/* ADR 0004 Governance Alert */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/70 to-slate-50 p-4.5 text-slate-800 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-blue-900">
            ADR 0004 Quality & Rating Mediation Policy
          </p>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            Ratings of <strong className="text-emerald-700">3 to 5 stars</strong> are published directly to the public student showcase and MSME repository gallery. In compliance with ADR 0004, evaluations of <strong className="text-amber-700">1 or 2 stars</strong> are routed to the MSME Admin Mediation Board for faculty consultation prior to publication.
          </p>
        </div>
      </div>

      {/* Section 1: Pending Evaluations */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Projects Awaiting Evaluation ({pendingEvaluation.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Solutions delivered for review</span>
        </div>

        {pendingEvaluation.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/60 rounded-lg border border-dashed border-slate-200">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-800">All delivered solutions evaluated</p>
            <p className="text-xs text-slate-500 mt-1">
              New project reviews will appear here when student teams complete their deliverables.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingEvaluation.map((proj) => (
              <div
                key={proj.id}
                className="rounded-lg border border-slate-200 bg-slate-50/40 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <CopyIdBadge id={proj.id} label="PRJ" />
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
                      Solution Submitted
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-2">
                    {proj.problemTitle}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-white p-3 rounded-md border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Team Lead:</span>
                      <span className="font-medium text-slate-800">
                        {proj.studentTeamLeadName} ({proj.studentTeamLeadId})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Faculty Director:</span>
                      <span className="font-medium text-slate-800">{proj.facultyMentorName}</span>
                    </div>
                  </div>

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 mb-4 hover:underline"
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      Inspect MIT GitHub Codebase
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openRatingModal(proj)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f2744] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16365c] transition-colors shadow-xs"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  Evaluate & Rate Solution
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Completed Evaluations */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Published Reviews & Testimonials ({completedReviews.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Historical performance records</span>
        </div>

        {completedReviews.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
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
                  className="rounded-lg border border-slate-200 bg-slate-50/30 p-5 hover:bg-white transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CopyIdBadge id={proj.id} label="PRJ" />
                      <span className="text-xs font-medium text-slate-500">for</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {proj.problemTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isModerated ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          <AlertTriangle className="h-3 w-3" />
                          Under ADR 0004 Mediation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
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
                            : "text-slate-200 fill-slate-100"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-1.5">
                      {rating.stars}.0 / 5.0
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      Evaluated on {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200/80 italic">
                    &ldquo;{rating.feedbackText}&rdquo;
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Team: <strong className="text-slate-700">{proj.studentTeamLeadName}</strong>{" "}
                      lead &bull; Guided by{" "}
                      <strong className="text-slate-700">{proj.facultyMentorName}</strong>
                    </span>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
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

      {/* Interactive Rating Modal */}
      {isRatingModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Project Evaluation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rating solution for {selectedProject.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRatingModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              {/* Problem info */}
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
                <p className="font-semibold text-slate-900 mb-1">{selectedProject.problemTitle}</p>
                <p className="text-slate-500">
                  Lead: {selectedProject.studentTeamLeadName} ({selectedProject.studentTeamLeadId})
                  &bull; Faculty: {selectedProject.facultyMentorName}
                </p>
              </div>

              {/* Star Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Overall Quality & Delivery Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setStarCount(star)}
                      className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-hidden"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          (hoverStar || starCount) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-800 ml-2">
                    {starCount} of 5 Stars
                  </span>
                </div>
              </div>

              {/* ADR 0004 Warning for <= 2 Stars */}
              {starCount <= 2 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Testimonial & Technical Review Comments *
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Detail the effectiveness of the delivered solution, code quality, and operational fit for your organization..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f2744] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16365c] transition-colors disabled:opacity-50 shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  {isSubmitting ? "Recording..." : "Submit Formal Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
