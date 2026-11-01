"use client";

import { useState } from "react";
import { Lightbulb, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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

type FormState = "idle" | "submitting" | "success" | "error";

export default function SubmitIdeaPage() {
  const [form, setForm] = useState({
    title: "",
    problemStatement: "",
    proposedSolution: "",
    expectedImpact: "",
    domain: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.title.trim()) e.title = "Idea title is required.";
    if (!form.problemStatement.trim()) e.problemStatement = "Problem statement is required.";
    if (!form.proposedSolution.trim()) e.proposedSolution = "Proposed solution is required.";
    if (!form.expectedImpact.trim()) e.expectedImpact = "Expected impact is required.";
    if (!form.domain) e.domain = "Please select an industry domain.";
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
    setFormState("submitting");
    try {
      await new Promise((r) => setTimeout(r, 700));
      setShowSubmitConfirm(false);
      setFormState("success");
    } catch (err) {
      setFormState("idle");
    }
  };

  const handleClearClick = () => {
    const hasData = Object.values(form).some((v) => v.trim() !== "");
    if (hasData) {
      setShowClearConfirm(true);
    } else {
      setForm({ title: "", problemStatement: "", proposedSolution: "", expectedImpact: "", domain: "" });
      setErrors({});
    }
  };

  const handleConfirmClear = () => {
    setForm({ title: "", problemStatement: "", proposedSolution: "", expectedImpact: "", domain: "" });
    setErrors({});
    setShowClearConfirm(false);
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (formState === "success") {
    return (
      <div className="space-y-6">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-10 text-center">
          <div className="size-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Idea Proposal Submitted
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
            Your project proposal has been submitted to the department Staff Mentors for academic review and industry feasibility screening.
          </p>
          <Button
            onClick={() => {
              setForm({ title: "", problemStatement: "", proposedSolution: "", expectedImpact: "", domain: "" });
              setFormState("idle");
            }}
            className="rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-sm font-medium px-4 py-2 transition-all duration-150 active:scale-[0.98]"
          >
            Submit Another Proposal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex items-start gap-4">
        <div className="size-10 rounded-[10px] bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 text-foreground">
          <Lightbulb className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Submit Project Idea
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Propose an innovative problem-solution concept for review by FXEC staff mentors and industrial partners. Approved proposals are eligible for the Sponsorship Showcase.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Form on Left, Guidelines on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Card (2 Cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleFormSubmit} className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-base font-semibold text-foreground">
                Project Proposal Information
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Idea Title */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Idea Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Predictive Energy Optimization Model for Small-Scale Foundries"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`rounded-[10px] border-black/[0.08] dark:border-white/[0.1] focus-visible:ring-[#007AFF]/25 ${
                    errors.title ? "border-red-400" : ""
                  }`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Domain */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Industry Domain <span className="text-red-500">*</span>
                </label>
                <IOSSelect
                  value={form.domain}
                  onChange={(val) => handleChange("domain", val)}
                  options={domains}
                  placeholder="Select industry domain..."
                  headerLabel="SELECT INDUSTRY DOMAIN"
                  error={!!errors.domain}
                />
                {errors.domain && <p className="text-xs text-red-500 mt-1">{errors.domain}</p>}
              </div>

              {/* Problem Statement */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the operational challenge or engineering problem experienced by local MSMEs."
                  value={form.problemStatement}
                  onChange={(e) => handleChange("problemStatement", e.target.value)}
                  className={`w-full text-sm border rounded-[10px] p-3 text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-y transition-colors ${
                    errors.problemStatement ? "border-red-400" : "border-slate-300"
                  }`}
                />
                {errors.problemStatement && (
                  <p className="text-xs text-red-500 mt-1">{errors.problemStatement}</p>
                )}
              </div>

              {/* Proposed Solution */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Proposed Solution & Methodology <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline the technical architecture, proposed stack, algorithms, hardware, or framework."
                  value={form.proposedSolution}
                  onChange={(e) => handleChange("proposedSolution", e.target.value)}
                  className={`w-full text-sm border rounded-[10px] p-3 text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-y transition-colors ${
                    errors.proposedSolution ? "border-red-400" : "border-slate-300"
                  }`}
                />
                {errors.proposedSolution && (
                  <p className="text-xs text-red-500 mt-1">{errors.proposedSolution}</p>
                )}
              </div>

              {/* Expected Impact */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Target Impact & Outcome <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Expected measurable metrics (e.g., cost reduction percentage, speed improvements, reliability gains)."
                  value={form.expectedImpact}
                  onChange={(e) => handleChange("expectedImpact", e.target.value)}
                  className={`w-full text-sm border rounded-[10px] p-3 text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-y transition-colors ${
                    errors.expectedImpact ? "border-red-400" : "border-slate-300"
                  }`}
                />
                {errors.expectedImpact && (
                  <p className="text-xs text-red-500 mt-1">{errors.expectedImpact}</p>
                )}
              </div>

              {/* Institutional Policy Notice */}
              <div className="flex items-start gap-3 bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] rounded-[10px] p-3.5">
                <AlertCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Approved student proposals are published to the <strong>Sponsorship Showcase</strong> for review by verified MSME industry partners. When an industry partner sponsors your idea, you will be designated as the <strong>Project Team Lead</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-black/[0.02] dark:bg-white/[0.03]/75 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearClick}
                className="rounded-[10px] border-slate-300 text-foreground hover:bg-slate-100 text-xs font-medium transition-all duration-150 active:scale-[0.98]"
              >
                Clear Fields
              </Button>
              <Button
                type="submit"
                disabled={formState === "submitting"}
                className="rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs font-medium px-4 py-2 transition-all duration-150 active:scale-[0.98]"
              >
                {formState === "submitting" ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Proposal"
                )}
              </Button>
            </div>
          </form>

          {/* Confirmation Dialogs */}
          <ConfirmationDialog
            open={showSubmitConfirm}
            onOpenChange={setShowSubmitConfirm}
            title="Submit Project Idea Proposal"
            description="Are you sure you want to submit this project idea proposal? Your concept will be reviewed by FXEC faculty mentors and industrial partners for academic screening and sponsorship."
            itemName={form.title}
            itemType={form.domain || "Project Idea"}
            confirmText="Submit Proposal"
            cancelText="Cancel"
            isLoading={formState === "submitting"}
            onConfirm={handleConfirmSubmit}
          />

          <ConfirmationDialog
            open={showClearConfirm}
            onOpenChange={setShowClearConfirm}
            title="Discard Proposal Draft"
            description="Are you sure you want to clear all entered fields? All entered details will be lost. This action cannot be undone."
            confirmText="Discard Draft"
            cancelText="Keep Editing"
            variant="destructive"
            onConfirm={handleConfirmClear}
          />
        </div>

        {/* Right Column: Proposal Guidelines & Review Process */}
        <div className="space-y-6">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <HelpCircle className="size-4 text-muted-foreground" />
              <span>Submission Guidelines</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To expedite approval by faculty and department chairs:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 pt-1">
              <li><strong className="text-foreground">Specificity:</strong> Address an actual bottleneck in manufacturing, retail, or operations.</li>
              <li><strong className="text-foreground">Feasibility:</strong> Ensure the project scope can be executed within a single term.</li>
              <li><strong className="text-foreground">Open Source:</strong> Solutions are published under the MIT License for public auditing.</li>
            </ul>
          </div>

          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <span>Showcase Lock-In Policy</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once an industry partner commits funding or sponsorship to an approved idea, the submitting student is permanently designated as the <strong>Project Team Lead</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
