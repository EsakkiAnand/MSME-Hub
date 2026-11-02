"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Check,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  UserCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import { initialProblemBank, ProblemBankItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProblemBankItem["status"],
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  POOL_AVAILABLE: {
    label: "In Department Pool",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    icon: CheckCircle2,
  },
  CLAIMED: {
    label: "Claimed & Staffed",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected / Withdrawn",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    icon: XCircle,
  },
};

export default function AdminProblemBankPage() {
  const [problems, setProblems] = useState<ProblemBankItem[]>(initialProblemBank);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Review Modal State
  const [activeModalProblem, setActiveModalProblem] = useState<ProblemBankItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"inspect" | "assign" | "clarify" | "override">("inspect");
  const [assignFaculty, setAssignFaculty] = useState("Dr. Selvaraj M (CSE)");
  const [targetDept, setTargetDept] = useState("Computer Science & Engineering");
  const [overrideStatus, setOverrideStatus] = useState<ProblemBankItem["status"]>("POOL_AVAILABLE");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract unique domains
  const domains = useMemo(() => {
    const set = new Set(problems.map((p) => p.domain));
    return ["ALL", ...Array.from(set)];
  }, [problems]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = selectedDomain === "ALL" || p.domain === selectedDomain;
      const matchesStatus = selectedStatus === "ALL" || p.status === selectedStatus;

      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [problems, searchQuery, selectedDomain, selectedStatus]);

  // KPI Counts
  const totalCount = problems.length;
  const availableCount = problems.filter((p) => p.status === "POOL_AVAILABLE").length;
  const claimedCount = problems.filter((p) => p.status === "CLAIMED").length;
  const rejectedCount = problems.filter((p) => p.status === "REJECTED").length;

  const handleOpenReview = (problem: ProblemBankItem, tab: "inspect" | "assign" | "clarify" | "override" = "inspect") => {
    setActiveModalProblem(problem);
    setActiveModalTab(tab);
    setAdminNotes("");
    setOverrideStatus(problem.status);
  };

  const handleAssignSubmit = async () => {
    if (!activeModalProblem) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    setProblems((prev) =>
      prev.map((item) =>
        item.id === activeModalProblem.id
          ? {
              ...item,
              status: "CLAIMED",
              claimedByFaculty: assignFaculty,
              assignedDepartment: targetDept,
            }
          : item
      )
    );

    setIsSubmitting(false);
    toast.success(`Problem ${activeModalProblem.id} assigned to ${assignFaculty} (${targetDept}).`);
    setActiveModalProblem(null);
  };

  const handleOverrideSubmit = async () => {
    if (!activeModalProblem) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    setProblems((prev) =>
      prev.map((item) =>
        item.id === activeModalProblem.id
          ? {
              ...item,
              status: overrideStatus,
              clarificationNotes: adminNotes.trim() || item.clarificationNotes,
            }
          : item
      )
    );

    setIsSubmitting(false);
    toast.success(`Problem ${activeModalProblem.id} status overridden to ${overrideStatus}.`);
    setActiveModalProblem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Central Problem Bank Governance
            </h1>
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
              Admin Console
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            System-wide registry of all industrial challenges submitted across all partner MSMEs. Triage, assign to academic faculties, and govern status lifecycles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-rose-500/70" />
        </div>
      </div>

      {/* ── KPI Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Submissions</span>
            <Layers className="size-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">From registered MSMEs</p>
        </div>

        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>In Faculty Pool</span>
            <CheckCircle2 className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{availableCount}</div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">Available for claim</p>
        </div>

        <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Claimed &amp; Staffed</span>
            <Clock className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{claimedCount}</div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">Under active development</p>
        </div>

        <div className="rounded-[14px] border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Withdrawn / Rejected</span>
            <XCircle className="size-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{rejectedCount}</div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-1">Clarification/Scope issues</p>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ─────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by problem title, company name, ID, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="size-3.5" />
              <span>Domain:</span>
            </div>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d === "ALL" ? "All Domains" : d}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="POOL_AVAILABLE">Available in Pool</option>
              <option value="CLAIMED">Claimed</option>
              <option value="REJECTED">Rejected / Withdrawn</option>
            </select>

            {(searchQuery || selectedDomain !== "ALL" || selectedStatus !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDomain("ALL");
                  setSelectedStatus("ALL");
                }}
                className="h-9 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-lg hover:bg-black/[0.04] transition-colors"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Admin Problem Table ──────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Problem Details</th>
                <th className="px-4 py-3.5">MSME Enterprise</th>
                <th className="px-4 py-3.5">Domain</th>
                <th className="px-4 py-3.5">Assigned Department</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredProblems.map((prob) => {
                const statusMeta = statusConfig[prob.status];
                const StatusIcon = statusMeta.icon;
                return (
                  <tr
                    key={prob.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <CopyIdBadge id={prob.id} size="xs" />
                        <span className="text-[10px] text-muted-foreground">
                          {prob.submissionDate}
                        </span>
                      </div>
                      <div className="font-semibold text-foreground text-xs leading-snug">
                        {prob.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {prob.description}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{prob.companyName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {prob.companyId}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                        {prob.domain}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      <div>{prob.assignedDepartment || "Unassigned"}</div>
                      {prob.claimedByFaculty && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                          {prob.claimedByFaculty}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
                          statusMeta.badgeClass
                        )}
                      >
                        <StatusIcon className="size-3" />
                        <span>{statusMeta.label}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(prob, "inspect")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-foreground font-medium text-xs transition-colors"
                      >
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span>Manage Problem</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No problem records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Admin Problem Action Dialog ──────────────────────────────── */}
      <Dialog
        open={!!activeModalProblem}
        onOpenChange={(open) => !open && setActiveModalProblem(null)}
      >
        {activeModalProblem && (
          <DialogContent className="max-w-2xl p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={activeModalProblem.id} size="xs" />
                <span className="text-xs text-muted-foreground">
                  MSME Partner: {activeModalProblem.companyName} ({activeModalProblem.companyId})
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                {activeModalProblem.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Central Administrative Review &amp; Departmental Routing Desk
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeModalTab}
              onValueChange={(val: any) => setActiveModalTab(val)}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="inspect" className="text-xs">
                  Inspect Details
                </TabsTrigger>
                <TabsTrigger value="assign" className="text-xs">
                  Direct Assign Faculty
                </TabsTrigger>
                <TabsTrigger value="override" className="text-xs">
                  Governance Override
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Inspect */}
              <TabsContent value="inspect" className="space-y-4 pt-3">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Problem Summary
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-black/[0.04]">
                    {activeModalProblem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 border border-black/[0.04]">
                    <span className="font-semibold block text-foreground mb-1">Constraints:</span>
                    <span className="text-muted-foreground">{activeModalProblem.constraints}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-black/[0.04]">
                    <span className="font-semibold block text-foreground mb-1">Deliverables:</span>
                    <span className="text-muted-foreground">{activeModalProblem.expectedDeliverables}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveModalTab("assign")}
                    className="px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Direct Assign to Faculty</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </TabsContent>

              {/* Tab 2: Assign */}
              <TabsContent value="assign" className="space-y-4 pt-3">
                <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2.5">
                  <UserCheck className="size-4 shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span className="font-semibold block">Admin Direct Assignment Override</span>
                    Assign this problem directly to a Department and Faculty Supervisor, bypassing open pool triage.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Target Academic Department
                    </label>
                    <select
                      value={targetDept}
                      onChange={(e) => setTargetDept(e.target.value)}
                      className="w-full h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                      <option value="Electronics & Communication">Electronics &amp; Communication</option>
                      <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Assigned Faculty Supervisor
                    </label>
                    <select
                      value={assignFaculty}
                      onChange={(e) => setAssignFaculty(e.target.value)}
                      className="w-full h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Dr. Selvaraj M (CSE)">Dr. Selvaraj M (CSE)</option>
                      <option value="Dr. K. Annamalai (EEE)">Dr. K. Annamalai (EEE)</option>
                      <option value="Prof. S. Muralidharan (ECE)">Prof. S. Muralidharan (ECE)</option>
                      <option value="Dr. V. Gomathi (IT)">Dr. V. Gomathi (IT)</option>
                    </select>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModalProblem(null)}
                    className="px-4 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAssignSubmit}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Check className="size-3.5" />
                    <span>{isSubmitting ? "Assigning..." : "Confirm Assignment"}</span>
                  </button>
                </DialogFooter>
              </TabsContent>

              {/* Tab 3: Override */}
              <TabsContent value="override" className="space-y-4 pt-3">
                <div className="rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-semibold block">Administrative Status Override</span>
                    Directly modify the lifecycle state of this problem in the database.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    New Target Status
                  </label>
                  <select
                    value={overrideStatus}
                    onChange={(e: any) => setOverrideStatus(e.target.value)}
                    className="w-full h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  >
                    <option value="POOL_AVAILABLE">POOL_AVAILABLE (Release to Open Pool)</option>
                    <option value="CLAIMED">CLAIMED (Active Project)</option>
                    <option value="REJECTED">REJECTED (Decline / Archive)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Administrative Justification Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter reason for administrative status adjustment..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <DialogFooter className="mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModalProblem(null)}
                    className="px-4 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleOverrideSubmit}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Check className="size-3.5" />
                    <span>{isSubmitting ? "Applying..." : "Apply Status Override"}</span>
                  </button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

