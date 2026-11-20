"use client";

import { useState, useEffect } from "react";
import {
  FolderKanban,
  Search,
  Building2,
  GraduationCap,
  ShieldCheck,
  Clock,
  XCircle,
  GitBranch,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  Check,
  X,
  RotateCcw,
  Star,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IOSSelect } from "@/components/ui/ios-select";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getProjectStatusCategory,
  ProjectStatusCategory,
} from "@/lib/project-data";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import {
  getAdminAllProjects,
  adminReviewSolutionAction,
  adminOverrideProjectStatusAction,
} from "@/app/actions/admin-projects";
import { toast } from "sonner";

interface AdminProject {
  id: string;
  problemId: string | null;
  ideaId: string | null;
  title: string;
  domain: string;
  status: string;
  githubUrl: string | null;
  adminReviewNotes: string | null;
  targetDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  industry: { companyName: string; companyId: string; isIdea?: boolean };
  facultySupervisor: { name: string; email: string; uniqueId: string | null } | null;
  studentTeam: {
    id: string;
    name: string;
    uniqueId: string | null;
    email: string;
    isLead: boolean;
  }[];
  rating: {
    stars: number;
    feedbackText: string;
    isModerated: boolean;
    createdAt: string;
  } | null;
}

export default function AdminProjectsGovernancePage() {
  const [projectsList, setProjectsList] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");

  // Selected project for detailed inspection dialog
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProjects = async () => {
    const res = await getAdminAllProjects();
    if (res.success) {
      setProjectsList((res.projects as any[]) || []);
    } else {
      toast.error(res.error || "Failed to load project registry.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadProjects();
      setLoading(false);
    })();
  }, []);

  const domains = Array.from(new Set(projectsList.map((p) => p.domain)));

  // Compute category counts
  const counts = {
    all: projectsList.length,
    inProgressLive: projectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "IN_PROGRESS_LIVE"
    ).length,
    completed: projectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "COMPLETED"
    ).length,
    rejected: projectsList.filter(
      (p) => getProjectStatusCategory(p.status as any) === "REJECTED"
    ).length,
  };

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.facultySupervisor?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentTeam.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const projCategory = getProjectStatusCategory(p.status as any);
    const matchesCategory = activeCategory === "ALL" || projCategory === activeCategory;
    const matchesDomain =
      domainFilter === "ALL" || p.domain.toLowerCase().includes(domainFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesDomain;
  });

  // Approval gate actions
  const handleApprove = async () => {
    if (!selectedProject) return;
    setIsSubmitting(true);
    const res = await adminReviewSolutionAction({
      projectId: selectedProject.id,
      decision: "APPROVE",
      reviewNotes: adminNote.trim() || "Deliverable approved by MSME Admin governance review.",
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success(res.message || "Solution approved.");
      await loadProjects();
      setSelectedProject(null);
      setAdminNote("");
    } else {
      toast.error(res.error || "Failed to approve solution.");
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedProject) return;
    if (!adminNote.trim()) {
      toast.error("Structured revision notes are mandatory when requesting revisions.");
      return;
    }
    setIsSubmitting(true);
    const res = await adminReviewSolutionAction({
      projectId: selectedProject.id,
      decision: "REQUEST_REVISION",
      reviewNotes: adminNote.trim(),
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.info(res.message || "Revision requested. Student team notified.");
      await loadProjects();
      setSelectedProject(null);
      setAdminNote("");
    } else {
      toast.error(res.error || "Failed to request revision.");
    }
  };

  const handleRejectAndClose = async () => {
    if (!selectedProject) return;
    if (!adminNote.trim()) {
      toast.error("A rejection justification is mandatory when closing a project.");
      return;
    }
    setIsSubmitting(true);
    const res = await adminOverrideProjectStatusAction({
      projectId: selectedProject.id,
      status: "REJECTED",
      note: adminNote.trim(),
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.error(res.message || "Project rejected and closed.");
      await loadProjects();
      setSelectedProject(null);
      setAdminNote("");
    } else {
      toast.error(res.error || "Failed to reject project.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading institutional project registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="size-4 text-rose-600" />
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Central Project Governance &amp; History
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Institution-Wide Project Management
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            PRD §8.2: Oversee all collaborative MSME engineering projects, filter across lifecycle categories, and inspect deliverables.
          </p>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg border border-black/[0.06] bg-black/[0.02] text-foreground font-mono">
            <span className="text-muted-foreground">Total:</span> <strong>{counts.all}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-mono">
            <span>Live:</span> <strong>{counts.inProgressLive}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-mono">
            <span>Completed:</span> <strong>{counts.completed}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-mono">
            <span>Rejected:</span> <strong>{counts.rejected}</strong>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <ProjectCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by project name, ID, company, faculty, student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-white rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
            />
          </div>

          <IOSSelect
            size="sm"
            options={[
              { value: "ALL", label: "All Tech Domains" },
              ...domains.map((d) => ({ value: d, label: d })),
            ]}
            value={domainFilter}
            onChange={setDomainFilter}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Projects Table Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Institutional Projects Registry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Displaying {filteredProjects.length} of {projectsList.length} monitored projects
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]/75">
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-36">
                  Project ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Project Title &amp; Partner
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48">
                  Status Category
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-44">
                  Faculty Supervisor
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-44">
                  Student Team Lead
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">
                  Deadline
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-36">
                  Governance Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredProjects.map((project) => {
                const leadStudent =
                  project.studentTeam.find((m) => m.isLead) || project.studentTeam[0];

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-medium">
                      <CopyIdBadge id={project.id} label="ID" />
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        Ref: {project.industry.isIdea ? "Idea-Originated" : project.problemId?.slice(0, 8) || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-sm">
                      <p className="font-semibold text-foreground text-xs">{project.title}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">{project.industry.companyName}</span>
                        <span>·</span>
                        <span>{project.domain}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <ProjectStatusCategoryBadge status={project.status as any} size="sm" />
                    </td>

                    <td className="px-4 py-4 text-xs">
                      {project.facultySupervisor ? (
                        <p className="font-medium text-foreground">{project.facultySupervisor.name}</p>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs">
                      {leadStudent ? (
                        <>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            <GraduationCap className="size-3 text-emerald-600" />
                            {leadStudent.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {project.studentTeam.length} member team
                          </p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No team assigned</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs font-mono text-muted-foreground">
                      {project.targetDeadline ? new Date(project.targetDeadline).toLocaleDateString() : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project);
                          setAdminNote("");
                        }}
                        className="bg-[#0f2744] hover:bg-[#1a385c] text-white text-xs h-8 px-3 inline-flex items-center gap-1.5 rounded-md"
                      >
                        <Eye className="size-3.5" />
                        <span>Govern</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No projects found matching the category and search criteria.
          </div>
        )}
      </div>

      {/* Detailed Inspection & Governance Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        {selectedProject && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="space-y-6">
              <DialogHeader className="border-b border-black/[0.06] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <CopyIdBadge id={selectedProject.id} label="Project ID" />
                  </div>
                  <ProjectStatusCategoryBadge status={selectedProject.status as any} size="md" />
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Domain: {selectedProject.domain} · Partner: {selectedProject.industry.companyName} ·
                  Mentor: {selectedProject.facultySupervisor?.name || "Unassigned"}
                </DialogDescription>
              </DialogHeader>

              {/* Team Roster */}
              <div className="p-4 rounded-xl border border-black/[0.06] bg-black/[0.02] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Authorized Student Team
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.studentTeam.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-black/[0.06] text-xs font-medium"
                    >
                      {m.isLead && <Star className="size-3 text-amber-500 fill-amber-500" />}
                      {m.name}
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {m.uniqueId || m.id.slice(0, 6)}
                      </span>
                    </span>
                  ))}
                  {selectedProject.studentTeam.length === 0 && (
                    <span className="text-xs text-muted-foreground">No team members assigned.</span>
                  )}
                </div>
              </div>

              {/* GitHub Deliverable */}
              <div className="p-4 rounded-xl border border-black/[0.06] bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="size-4 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Public GitHub Deliverable
                  </span>
                </div>
                {selectedProject.githubUrl ? (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline break-all"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>{selectedProject.githubUrl}</span>
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No repository URL submitted yet by the Project Team Lead.
                  </p>
                )}
                {selectedProject.adminReviewNotes && (
                  <div className="mt-2 p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-900">
                    <span className="font-semibold flex items-center gap-1.5 mb-1">
                      <FileText className="size-3.5" /> Admin Review Notes
                    </span>
                    <p className="leading-relaxed">{selectedProject.adminReviewNotes}</p>
                  </div>
                )}
              </div>

              {/* Industry Rating */}
              {selectedProject.rating && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold">
                      Industry Rating: {selectedProject.rating.stars}/5
                    </span>
                    {selectedProject.rating.isModerated && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                        Under Moderation
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-900 italic leading-relaxed">
                    &ldquo;{selectedProject.rating.feedbackText}&rdquo;
                  </p>
                </div>
              )}

              {/* Governance Decision Console */}
              <div className="p-4 rounded-xl border border-black/[0.08] bg-black/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-rose-600" />
                    Admin Governance Decision Controls
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Current: <strong>{selectedProject.status}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleApprove}
                    disabled={
                      isSubmitting ||
                      selectedProject.status === "APPROVED" ||
                      selectedProject.status === "COMPLETED"
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                  >
                    <Check className="size-3.5 mr-1" />
                    Approve Deliverable
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRequestRevision}
                    disabled={
                      isSubmitting ||
                      selectedProject.status === "REVISION_IN_PROGRESS" ||
                      selectedProject.status === "COMPLETED" ||
                      selectedProject.status === "REJECTED"
                    }
                    className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs h-8"
                  >
                    <RotateCcw className="size-3.5 mr-1" />
                    Request Revisions
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRejectAndClose}
                    disabled={
                      isSubmitting ||
                      selectedProject.status === "REJECTED" ||
                      selectedProject.status === "COMPLETED"
                    }
                    className="text-xs h-8"
                  >
                    <X className="size-3.5 mr-1" />
                    Reject &amp; Close Project
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-[#007AFF]" />
                    Structured Governance Notes (mandatory for revision / rejection)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Enter audit remarks or administrative directive..."
                      className="text-xs h-9 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
