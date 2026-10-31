"use client";

import { useState } from "react";
import {
  ExternalLink,
  Lock,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Link2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { Dialog, DialogPortal } from "@/components/ui/dialog";

interface CodeProject {
  id: string;
  name: string;
  accessStatus: "ACCESSIBLE" | "NO_REPO" | "RESTRICTED";
  githubUrl: string | null;
  note: string;
  isLead: boolean;
}

const initialCodeProjects: CodeProject[] = [
  {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    accessStatus: "NO_REPO",
    githubUrl: null,
    note: "Solution development in progress. Repository will be committed by the designated Team Lead.",
    isLead: true,
  },
  {
    id: "PRJ-2024-007",
    name: "Predictive Maintenance IoT Dashboard",
    accessStatus: "ACCESSIBLE",
    githubUrl: "https://github.com/fxec-msme/predictive-maintenance",
    note: "Public repository — MIT Licensed. Verified and accessible.",
    isLead: false,
  },
  {
    id: "PRJ-2023-042",
    name: "Digital Invoice Generator for SME Retail",
    accessStatus: "ACCESSIBLE",
    githubUrl: "https://github.com/fxec-msme/digital-invoice-gen",
    note: "Approved project. Public repository — MIT Licensed.",
    isLead: true,
  },
];

const accessStatusConfig: Record<
  string,
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  ACCESSIBLE: {
    label: "Accessible",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  NO_REPO: {
    label: "Pending Commit",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    icon: AlertCircle,
  },
  RESTRICTED: {
    label: "Restricted",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Lock,
  },
};

export default function CodeAccessPage() {
  const [projects, setProjects] = useState<CodeProject[]>(initialCodeProjects);
  const [activeProject, setActiveProject] = useState<CodeProject | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [inputError, setInputError] = useState("");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);

  // Confirmation dialog states
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Open modal to add or edit repository
  const handleOpenLinkModal = (project: CodeProject) => {
    setActiveProject(project);
    setInputUrl(project.githubUrl || "");
    setInputError("");
    setIsUrlModalOpen(true);
  };

  // Step 1: Validate URL and open confirmation dialog
  const handlePreSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setInputError("GitHub repository URL is required.");
      return;
    }
    if (!inputUrl.includes("github.com/")) {
      setInputError("Please enter a valid GitHub URL (e.g., https://github.com/org/repo).");
      return;
    }
    setInputError("");
    setIsUrlModalOpen(false);
    setShowSaveConfirm(true);
  };

  // Step 2: Confirm save changes
  const handleConfirmSave = async () => {
    if (!activeProject) return;
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                githubUrl: inputUrl.trim(),
                accessStatus: "ACCESSIBLE",
                note: "Public repository committed by Project Team Lead. Verified and accessible.",
              }
            : p
        )
      );
      toast.success("Repository link updated successfully.");
      setShowSaveConfirm(false);
      setActiveProject(null);
    } catch {
      toast.error("Failed to update repository link.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm remove repository link (destructive)
  const handleOpenRemoveConfirm = (project: CodeProject) => {
    setActiveProject(project);
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (!activeProject) return;
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProject.id
            ? {
                ...p,
                githubUrl: null,
                accessStatus: "NO_REPO",
                note: "Repository link unlinked by Team Lead. Pending new commit.",
              }
            : p
        )
      );
      toast.success("Repository link removed.");
      setShowRemoveConfirm(false);
      setActiveProject(null);
    } catch {
      toast.error("Failed to remove repository link.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-start gap-4">
        <div className="size-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
          <GitBranch className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Code & Repository Access
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            All code solutions submitted via FXEC MSME Hub link to verified public GitHub repositories under the <strong>MIT Open Source License</strong> with README documentation.
          </p>
        </div>
      </div>

      {/* Repositories Card */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Assigned Project Repositories
          </h3>
          <span className="text-xs text-slate-500">
            {projects.length} Repositories
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {projects.map((project) => {
            const ac = accessStatusConfig[project.accessStatus];
            return (
              <div
                key={project.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {project.id}
                    </span>
                    {project.isLead && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">
                        Project Team Lead
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{project.name}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{project.note}</p>
                  {project.githubUrl && (
                    <p className="text-xs text-blue-700 font-mono mt-1 truncate">
                      {project.githubUrl}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border ${ac.badgeClass}`}
                  >
                    <ac.icon className="size-3" />
                    {ac.label}
                  </span>

                  {project.githubUrl ? (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white transition-all duration-150 active:scale-[0.98]"
                      >
                        <ExternalLink className="size-3.5" />
                        Open Repo
                      </a>

                      {/* Team Lead Edit / Remove capability */}
                      {project.isLead && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenLinkModal(project)}
                            title="Edit Repository Link"
                            className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRemoveConfirm(project)}
                            title="Remove Repository Link"
                            className="p-1.5 rounded-md border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : project.isLead ? (
                    <button
                      type="button"
                      onClick={() => handleOpenLinkModal(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-[#007AFF] hover:bg-[#0062cc] text-white transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-xs"
                    >
                      <Plus className="size-3.5" />
                      Link Repository
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 border border-slate-200 px-3 py-1.5 rounded-md bg-slate-50 cursor-not-allowed">
                      <Lock className="size-3.5" />
                      Pending Link
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Rule Callout */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-md p-4">
        <AlertCircle className="size-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Access Policy:</strong> Only the designated <strong>Project Team Lead</strong> is authorized to submit or update the official GitHub repository link. All student team members receive read and contributor access upon approval.
        </p>
      </div>

      {/* Input Modal for Repository URL */}
      <Dialog open={isUrlModalOpen} onOpenChange={setIsUrlModalOpen}>
        {isUrlModalOpen && (
          <DialogPortal>
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-150" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                    <Link2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Link Official GitHub Repository
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeProject?.name} ({activeProject?.id})
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePreSaveUrl} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Public GitHub Repository URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/fxec-msme/smart-inventory"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (inputError) setInputError("");
                      }}
                      className={`w-full text-sm border rounded-xl px-3.5 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all font-mono ${
                        inputError ? "border-red-400" : "border-slate-200"
                      }`}
                    />
                    {inputError && (
                      <p className="text-xs text-red-500 mt-1">{inputError}</p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Ensure the repository contains an open-source MIT license and README file.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsUrlModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-xs font-medium text-white transition-all cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPortal>
        )}
      </Dialog>

      {/* Confirmation Dialog 1: Update Repository Link */}
      <ConfirmationDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        title="Update Project Repository Link"
        description="Do you want to save your changes? All team members and mentors will immediately gain access to view this repository link."
        itemName={activeProject ? `${activeProject.name} (${activeProject.id})` : undefined}
        itemType="Project Repository"
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="update"
        isLoading={isProcessing}
        onConfirm={handleConfirmSave}
        onCancel={() => {
          setIsUrlModalOpen(true);
        }}
      />

      {/* Confirmation Dialog 2: Remove Repository Link (Destructive) */}
      <ConfirmationDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove Repository Access Link"
        description="Are you sure you want to remove the repository link for this project? Team members and mentors will no longer be able to open the repository until a new link is submitted."
        itemName={activeProject ? `${activeProject.name} (${activeProject.id})` : undefined}
        itemType="Project Repository"
        confirmText="Delete Link"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isProcessing}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
