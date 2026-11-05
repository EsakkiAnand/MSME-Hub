"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  Filter,
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  GitBranch,
  ExternalLink,
  ChevronRight,
  Eye,
  FileText,
  Plus,
  MessageSquare,
  Check,
  X,
  RotateCcw,
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
} from "@/components/ui/dialog";
import {
  initialProjectsMaster,
  ProjectItem,
  ProjectStatusCategory,
  getProjectStatusCategory,
  ProjectLifecycleStatus,
} from "@/lib/project-data";
import { ProjectCategoryTabs } from "@/components/projects/project-category-tabs";
import { ProjectStatusCategoryBadge } from "@/components/projects/project-status-category-badge";
import { ProjectHistoryTimeline } from "@/components/projects/project-history-timeline";
import { AuthorizedStakeholdersCard } from "@/components/projects/authorized-stakeholders-card";
import { toast } from "sonner";

export default function AdminProjectsGovernancePage() {
  const [projects, setProjects] = useState<Record<string, ProjectItem>>(initialProjectsMaster);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectStatusCategory>("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");

  // Selected project for detailed inspection dialog
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const projectsList = Object.values(projects);

  // Compute category counts
  const counts = {
    all: projectsList.length,
    inProgressLive: projectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "IN_PROGRESS_LIVE"
    ).length,
    completed: projectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "COMPLETED"
    ).length,
    rejected: projectsList.filter(
      (p) => getProjectStatusCategory(p.status) === "REJECTED"
    ).length,
  };

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.problemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industryPartner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facultySupervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentTeam.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const projCategory = getProjectStatusCategory(p.status);
    const matchesCategory = activeCategory === "ALL" || projCategory === activeCategory;
    const matchesDomain = domainFilter === "ALL" || p.domain.toLowerCase().includes(domainFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesDomain;
  });

  // Handler to log an Admin audit note to the individual project history
  const handleLogAdminNote = async () => {
    if (!selectedProject || !adminNote.trim()) return;

    setIsSubmittingNote(true);
    await new Promise((r) => setTimeout(r, 500));

    const newHistoryEvent = {
      id: `H-${Date.now()}`,
      timestamp: "Just now",
      title: "MSME Admin Governance Note Logged",
      category: "GOVERNANCE" as const,
      actor: {
        name: "Central MSME Admin Cell",
        role: "MSME_ADMIN" as const,
        roleTitle: "Central Administrator",
      },
      description: adminNote.trim(),
    };

    setProjects((prev) => {
      const updated = {
        ...prev,
        [selectedProject.id]: {
          ...prev[selectedProject.id],
          history: [newHistoryEvent, ...prev[selectedProject.id].history],
        },
      };
      setSelectedProject(updated[selectedProject.id]);
      return updated;
    });

    setAdminNote("");
    setIsSubmittingNote(false);
    toast.success("Governance note appended to individual project history audit trail.");
  };

  // Quick State Transition Handler by MSME Admin
  const handleAdminStatusChange = async (newStatus: ProjectLifecycleStatus, actionTitle: string, note?: string) => {
    if (!selectedProject) return;

    const newHistoryEvent = {
      id: `H-${Date.now()}`,
      timestamp: "Just now",
      title: actionTitle,
      category: "GOVERNANCE" as const,
      actor: {
        name: "Central MSME Admin Cell",
        role: "MSME_ADMIN" as const,
        roleTitle: "Governance Administrator",
      },
      description: `MSME Admin updated lifecycle status to ${newStatus}.`,
      notes: note,
      metadata: {
        oldStatus: selectedProject.status,
        newStatus,
      },
    };

    setProjects((prev) => {
      const updated = {
        ...prev,
        [selectedProject.id]: {
          ...prev[selectedProject.id],
          status: newStatus,
          history: [newHistoryEvent, ...prev[selectedProject.id].history],
          ...(newStatus === "REJECTED" && {
            rejectionInfo: {
              reason: note || "Administrative governance review flagged compliance failure.",
              rejectedAt: new Date().toISOString(),
              rejectedBy: "Central MSME Admin Cell",
              remediationAction: "Problem statement re-queued for institutional reassessment.",
            },
          }),
        },
      };
      setSelectedProject(updated[selectedProject.id]);
      return updated;
    });

    toast.success(`Project ${selectedProject.id} status updated to ${newStatus}.`);
  };

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
            PRD §8.2: Oversee all collaborative MSME engineering projects, filter across lifecycle categories (In Progress / Live, Completed, Rejected), inspect individual project history audit trails, and review authorized stakeholder credentials.
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
              placeholder="Search by project name, ID, problem ID, company, faculty, student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-white rounded-md border-black/[0.06] dark:border-white/[0.08] focus-visible:ring-blue-600"
            />
          </div>

          <IOSSelect
            size="sm"
            options={[
              { value: "ALL", label: "All Tech Domains" },
              { value: "Software", label: "Software / Web" },
              { value: "IoT", label: "IoT & Analytics" },
              { value: "Manufacturing", label: "Manufacturing & AI" },
              { value: "Acoustics", label: "Signal Processing" },
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
                const leadStudent = project.studentTeam.find((m) => m.isLead) || project.studentTeam[0];

                return (
                  <tr
                    key={project.id}
                    className="hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-medium">
                      <CopyIdBadge id={project.id} label="ID" />
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        Ref: {project.problemId}
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-sm">
                      <p className="font-semibold text-foreground text-xs">{project.title}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">{project.industryPartner.companyName}</span>
                        <span>·</span>
                        <span>{project.domain}</span>
                      </div>
                      {project.status === "REJECTED" && project.rejectionInfo && (
                        <p className="text-[11px] text-rose-600 mt-1 line-clamp-1 flex items-center gap-1">
                          <XCircle className="size-3 shrink-0" />
                          <span>{project.rejectionInfo.reason}</span>
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <ProjectStatusCategoryBadge status={project.status} size="sm" />
                    </td>

                    <td className="px-4 py-4 text-xs">
                      <p className="font-medium text-foreground">{project.facultySupervisor.name}</p>
                      <p className="text-[10px] text-muted-foreground">{project.facultySupervisor.department}</p>
                    </td>

                    <td className="px-4 py-4 text-xs">
                      {leadStudent && (
                        <>
                          <p className="font-medium text-foreground flex items-center gap-1">
                            <GraduationCap className="size-3 text-emerald-600" />
                            {leadStudent.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {leadStudent.regNo} ({project.studentTeam.length} members)
                          </p>
                        </>
                      )}
                    </td>

                    <td className="px-4 py-4 text-xs font-mono text-muted-foreground">
                      {project.targetDeadline}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                        className="bg-[#0f2744] hover:bg-[#1a385c] text-white text-xs h-8 px-3 inline-flex items-center gap-1.5 rounded-md"
                      >
                        <Eye className="size-3.5" />
                        <span>Audit &amp; History</span>
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

      {/* Detailed Inspection & Audit Trail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          {selectedProject && (
            <div className="space-y-6">
              <DialogHeader className="border-b border-black/[0.06] pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <CopyIdBadge id={selectedProject.id} label="Project ID" />
                    <span className="text-xs font-mono text-muted-foreground">
                      Ref: {selectedProject.problemId}
                    </span>
                  </div>
                  <ProjectStatusCategoryBadge status={selectedProject.status} size="md" />
                </div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Domain: {selectedProject.domain} · Target Deadline: {selectedProject.targetDeadline}
                </DialogDescription>
              </DialogHeader>

              {/* Admin Governance State Machine Actions */}
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
                    onClick={() =>
                      handleAdminStatusChange("APPROVED", "Admin Governance Sign-Off Approved", "Approved following central code deliverable inspection.")
                    }
                    disabled={selectedProject.status === "APPROVED" || selectedProject.status === "COMPLETED"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                  >
                    <Check className="size-3.5 mr-1" />
                    Approve Deliverable
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleAdminStatusChange("REVISION_IN_PROGRESS", "Admin Itemized Revision Requested", "Compliance notes dispatched to student lead & faculty mentor.")
                    }
                    disabled={selectedProject.status === "REVISION_IN_PROGRESS" || selectedProject.status === "COMPLETED" || selectedProject.status === "REJECTED"}
                    className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs h-8"
                  >
                    <RotateCcw className="size-3.5 mr-1" />
                    Request Revisions
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleAdminStatusChange("REJECTED", "Project Formally Rejected by Central Admin", "Deliverable failed technical compliance and open-source standards.")
                    }
                    disabled={selectedProject.status === "REJECTED" || selectedProject.status === "COMPLETED"}
                    className="text-xs h-8"
                  >
                    <X className="size-3.5 mr-1" />
                    Reject &amp; Close Project
                  </Button>
                </div>
              </div>

              {/* Authorized Personnel Directory */}
              <AuthorizedStakeholdersCard
                studentTeam={selectedProject.studentTeam}
                facultySupervisor={selectedProject.facultySupervisor}
                industryPartner={selectedProject.industryPartner}
                projectId={selectedProject.id}
              />

              {/* Individual Project History & Audit Trail */}
              <ProjectHistoryTimeline
                history={selectedProject.history}
                projectId={selectedProject.id}
              />

              {/* Append Admin Audit Note */}
              <div className="p-4 rounded-xl border border-black/[0.06] bg-white space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-[#007AFF]" />
                  Append Official Governance Note to Audit History
                </label>
                <div className="flex gap-2">
                  <Input
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter audit remarks or administrative directive..."
                    className="text-xs h-9 bg-white"
                  />
                  <Button
                    size="sm"
                    onClick={handleLogAdminNote}
                    disabled={isSubmittingNote || !adminNote.trim()}
                    className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9 px-4 shrink-0"
                  >
                    Append Note
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
