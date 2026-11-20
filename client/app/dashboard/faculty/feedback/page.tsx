"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  Send,
  FileCheck,
  Loader2,
} from "lucide-react";
import { IOSSelect } from "@/components/ui/ios-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getStaffProjects, submitStaffProjectFeedbackAction, getProjectFeedbackAction } from "@/app/actions/staff";
import { toast } from "sonner";

interface ProjectOption {
  id: string;
  name: string;
  leadName: string;
  clientName: string;
}

interface LogEntry {
  id: string;
  projectId: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function FacultyFeedbackPage() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [rubricScores, setRubricScores] = useState({
    architecture: 4,
    execution: 4,
    msmeFit: 5,
    timeliness: 4,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState<LogEntry[]>([]);

  // Dialog state
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getStaffProjects();
    if (res.success) {
      const mapped = (res.projects as any[]).map((p) => ({
        id: p.id,
        name: p.title,
        leadName: p.members?.find((m: any) => m.isLead)?.name || "Unassigned",
        clientName: p.problem?.industry?.companyName || "Student-Originated Idea",
      }));
      setProjects(mapped);
      if (mapped.length > 0) {
        setSelectedProjectId((prev) => prev || mapped[0].id);
      }
    } else {
      toast.error(res.error || "Failed to load supervised projects.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const loadFeedback = async (projectId: string) => {
    const res = await getProjectFeedbackAction(projectId);
    if (res.success) {
      setFeedbacks(
        ((res as any).feedbacks || []).map((f: any) => ({
          id: f.id,
          projectId,
          content: f.content,
          category: f.category,
          createdAt: f.createdAt,
        }))
      );
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadFeedback(selectedProjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleScoreChange = (dimension: keyof typeof rubricScores, score: number) => {
    setRubricScores((prev) => ({ ...prev, [dimension]: score }));
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    try {
      const res: any = await submitStaffProjectFeedbackAction({
        projectId: selectedProject.id,
        category: "GENERAL",
        content: feedbackText.trim() || "Milestone deliverable verified against MSME requirements.",
        rubric: { ...rubricScores },
      });
      if (res.success) {
        toast.success(res.message || `Evaluation recorded for ${selectedProject.name}!`);
        setFeedbackText("");
        loadFeedback(selectedProject.id);
      } else {
        toast.error(res.error || "Failed to submit faculty feedback.");
      }
    } catch {
      toast.error("Failed to submit faculty feedback.");
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading your supervised projects...</span>
      </div>
    );
  }

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: `${p.id.slice(0, 8)} - ${p.name.slice(0, 32)}...`,
  }));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="size-4 text-[#007AFF]" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Academic Supervision &amp; Grading
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Project Feedback &amp; Evaluation
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Log formative milestone feedback, evaluate code deliverables, and grade student teams.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto">
          Logged Evaluations: {feedbacks.length} Entries
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Submit Formative Milestone Evaluation</span>
              <span className="text-xs text-muted-foreground font-normal">All fields required</span>
            </h3>

            {projects.length === 0 ? (
              <div className="text-xs text-muted-foreground py-8 text-center">
                No supervised projects available yet. Claim a problem from the industry pool to begin mentoring.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Select Supervised Project
                  </label>
                  <IOSSelect
                    options={projectOptions}
                    value={selectedProjectId}
                    onChange={setSelectedProjectId}
                    className="w-full"
                  />
                </div>

                {/* Project Quick Overview */}
                {selectedProject && (
                  <div className="p-3.5 bg-black/[0.02] dark:bg-white/[0.03] rounded-md border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{selectedProject.name}</span>
                      <span className="font-mono text-muted-foreground font-medium">{selectedProject.id.slice(0, 8)}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <span>Client: {selectedProject.clientName}</span>
                      <span>·</span>
                      <span>Lead: {selectedProject.leadName}</span>
                    </div>
                  </div>
                )}

                {/* 4 Rubric Metrics */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">
                    Rubric Assessment (1 to 5 Stars)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "architecture" as const, label: "Technical Architecture & Code Quality" },
                      { key: "execution" as const, label: "Implementation & Milestone Progress" },
                      { key: "msmeFit" as const, label: "MSME Problem Alignment & Practicality" },
                      { key: "timeliness" as const, label: "Deliverable Timeliness & Communication" },
                    ].map((dim) => (
                      <div
                        key={dim.key}
                        className="p-3 bg-white border border-black/[0.06] dark:border-white/[0.08] rounded-md flex items-center justify-between"
                      >
                        <span className="text-xs text-foreground font-medium pr-2">{dim.label}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleScoreChange(dim.key, val)}
                              className="p-0.5 text-slate-300 hover:text-amber-400 focus:outline-none"
                              aria-label={`${dim.label} ${val} stars`}
                            >
                              <Star
                                className={`size-4 ${
                                  val <= rubricScores[dim.key]
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formative Feedback Text */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Detailed Faculty Critique &amp; Technical Recommendations
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Provide concrete academic and engineering guidance for the student team (e.g., test cases to add, performance bottlenecks, architecture advice)..."
                    className="w-full text-xs sm:text-sm border border-black/[0.06] dark:border-white/[0.08] rounded-md p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-y"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackText("")}
                    className="px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-black/[0.06] dark:border-white/[0.08] rounded-md bg-white hover:bg-black/[0.02] dark:bg-white/[0.03] transition-all"
                  >
                    Clear Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#007AFF]/90 rounded-md transition-all shadow-xs active:scale-[0.98]"
                  >
                    <Send className="size-3.5" />
                    <span>Submit Evaluation</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Historical Feedback Stream */}
        <div className="space-y-4">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <FileCheck className="size-4 text-emerald-600" />
              <span>Logged Evaluations</span>
            </h3>

            <div className="space-y-3.5">
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-black/[0.02] dark:bg-white/[0.03]/70 border border-black/[0.06] dark:border-white/[0.08]/80 rounded-md space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-white border border-black/[0.06] dark:border-white/[0.08] px-1.5 py-0.2 rounded">
                        {item.projectId.slice(0, 8)}
                      </span>
                      <h4 className="font-semibold text-foreground mt-1 line-clamp-1">
                        {selectedProject?.name || "Project"}
                      </h4>
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-muted-foreground">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-4">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-black/[0.06] dark:border-white/[0.08]/50">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {feedbacks.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No logged evaluations recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Submit Project Evaluation"
        description="Are you sure you want to submit this evaluation? This assessment will be permanently logged on the project record."
        itemName={`${selectedProject?.id?.slice(0, 8) || ""} - ${selectedProject?.name || ""}`}
        confirmText="Confirm & Submit"
        variant="default"
        isLoading={isSubmitting}
        onConfirm={handleSubmitEvaluation}
      />
    </div>
  );
}
