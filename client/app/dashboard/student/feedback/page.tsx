"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle2, Star, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IOSSelect } from "@/components/ui/ios-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

const accessibleProjects = [
  { id: "PRJ-2024-007", name: "Predictive Maintenance IoT Dashboard" },
  { id: "PRJ-2023-042", name: "Digital Invoice Generator for SME Retail" },
];

const categoryOptions = [
  { value: "collaboration", label: "Team Collaboration & Communication" },
  { value: "technical", label: "Technical Quality & Code Deliverables" },
  { value: "mentor", label: "Staff Mentorship & Guidance" },
  { value: "platform", label: "Platform Tools & Infrastructure" },
  { value: "other", label: "General Feedback" },
];

type FeedbackState = "idle" | "submitting" | "success";

export default function FeedbackPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedProject) e.project = "Please select a project.";
    if (!category) e.category = "Please select a category.";
    if (rating === 0) e.rating = "Please provide an evaluation rating.";
    if (!content.trim()) e.content = "Detailed feedback comments are required.";
    return e;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setFeedbackState("submitting");
    try {
      await new Promise((r) => setTimeout(r, 650));
      setShowSubmitConfirm(false);
      setFeedbackState("success");
    } catch (err) {
      setFeedbackState("idle");
    }
  };

  const handleClearClick = () => {
    if (selectedProject || category || rating > 0 || content.trim()) {
      setShowClearConfirm(true);
    } else {
      setSelectedProject("");
      setCategory("");
      setRating(0);
      setContent("");
      setErrors({});
    }
  };

  const handleConfirmClear = () => {
    setSelectedProject("");
    setCategory("");
    setRating(0);
    setContent("");
    setErrors({});
    setShowClearConfirm(false);
  };

  if (feedbackState === "success") {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-slate-200 p-10 text-center">
          <div className="size-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Evaluation Feedback Recorded
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            Thank you for providing structured feedback. Your evaluation has been submitted to the academic mentorship committee for quality auditing.
          </p>
          <Button
            onClick={() => {
              setSelectedProject("");
              setCategory("");
              setRating(0);
              setContent("");
              setFeedbackState("idle");
            }}
            className="rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white text-sm font-medium px-4 py-2 transition-all duration-150 active:scale-[0.98]"
          >
            Submit Another Evaluation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-start gap-4">
        <div className="size-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
          <MessageSquare className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Project Feedback & Review
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Submit formal evaluations regarding project technical milestones, sprint team communication, and staff mentorship. Feedback is analyzed at end-of-term reviews.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Form on Left, Guidelines on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Card (2 Columns) */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Evaluation Form
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Project selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Project <span className="text-red-500">*</span>
                </label>
                <IOSSelect
                  value={selectedProject}
                  onChange={(val) => {
                    setSelectedProject(val);
                    setErrors((prev) => ({ ...prev, project: "" }));
                  }}
                  options={accessibleProjects.map((p) => ({
                    value: p.id,
                    label: `${p.id} — ${p.name}`,
                    badge: p.id,
                  }))}
                  placeholder="Choose an enrolled project..."
                  headerLabel="CHOOSE PROJECT"
                  error={!!errors.project}
                />
                {errors.project && <p className="text-xs text-red-500 mt-1">{errors.project}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Evaluation Category <span className="text-red-500">*</span>
                </label>
                <IOSSelect
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  options={categoryOptions}
                  placeholder="Select category..."
                  headerLabel="SELECT CATEGORY"
                  error={!!errors.category}
                />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>

              {/* Star rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Performance Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setErrors((prev) => ({ ...prev, rating: "" }));
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-105 transition-transform"
                    >
                      <Star
                        className={`size-5 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-xs font-medium text-slate-600">
                      {["", "Needs Improvement", "Fair", "Satisfactory", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>

              {/* Details textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Notes & Observations <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide constructive feedback regarding project milestones, sprint velocity, technical blockers, or mentor interactions..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrors((prev) => ({ ...prev, content: "" }));
                  }}
                  className={`w-full text-sm border rounded-md p-3 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-y transition-colors ${
                    errors.content ? "border-red-400" : "border-slate-300"
                  }`}
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-slate-50/75 border-t border-slate-200 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearClick}
                className="rounded-md border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-all duration-150 active:scale-[0.98]"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={feedbackState === "submitting"}
                className="rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white text-xs font-medium px-4 py-2 transition-all duration-150 active:scale-[0.98]"
              >
                {feedbackState === "submitting" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Evaluation"
                )}
              </Button>
            </div>
          </form>

          {/* Confirmation Dialogs */}
          <ConfirmationDialog
            open={showSubmitConfirm}
            onOpenChange={setShowSubmitConfirm}
            title="Submit Project Evaluation"
            description="Are you sure you want to submit this evaluation feedback? Your assessment will be permanently logged for the academic review committee and staff mentor evaluation."
            itemName={accessibleProjects.find((p) => p.id === selectedProject)?.name}
            itemType={selectedProject ? `Project ID: ${selectedProject}` : "Project Review"}
            confirmText="Submit Evaluation"
            cancelText="Cancel"
            isLoading={feedbackState === "submitting"}
            onConfirm={handleConfirmSubmit}
          />

          <ConfirmationDialog
            open={showClearConfirm}
            onOpenChange={setShowClearConfirm}
            title="Discard Evaluation Draft"
            description="Are you sure you want to clear this evaluation form? All entered ratings and comments will be lost. This action cannot be undone."
            confirmText="Clear Form"
            cancelText="Keep Editing"
            variant="destructive"
            onConfirm={handleConfirmClear}
          />
        </div>

        {/* Right Column: Institutional Guidelines & Rubric */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <HelpCircle className="size-4 text-slate-500" />
              <span>Evaluation Rubric</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student reviews are evaluated alongside staff assessments. Ratings are based on the following standard:
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 pt-1">
              <li><strong className="text-slate-700">5 Stars:</strong> Deliverables meet industrial standards ahead of schedule.</li>
              <li><strong className="text-slate-700">4 Stars:</strong> Consistent sprint progress with timely mentor feedback.</li>
              <li><strong className="text-slate-700">3 Stars:</strong> Core objectives met; minor technical revisions requested.</li>
              <li><strong className="text-slate-700">1–2 Stars:</strong> Substantial scope blockers or communication gaps.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <ShieldCheck className="size-4 text-slate-500" />
              <span>Confidentiality & Quality</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Feedback is reviewed by the FXEC Academic Project Evaluation Committee. Individual reviews are treated constructively to improve project outcomes and team workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
