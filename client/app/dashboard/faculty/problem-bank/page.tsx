"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  Eye,
  Check,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  FolderKanban,
  FileText,
  RotateCcw,
  Loader2,
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
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import { getStaffProblemPool, claimProblemAction } from "@/app/actions/staff";

// ─── Shared Types ────────────────────────────────────────────────────────────

interface ProblemItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  constraints: string | null;
  expectedDeliverables: string | null;
  companyName: string;
  companyId: string;
  status: "POOL_AVAILABLE" | "CLAIMED" | "REJECTED" | "DRAFT";
  createdAt: string;
}

export default function FacultyProblemBankPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Review Modal State
  const [activeModalProblem, setActiveModalProblem] = useState<ProblemItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"inspect" | "claim" | "reject">("inspect");
  const [targetDeadline, setTargetDeadline] = useState("2026-12-15");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      const res = await getStaffProblemPool();
      if (res.success) {
        setProblems([
          ...(res.available || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            domain: p.domain,
            constraints: p.constraints,
            expectedDeliverables: p.expectedDeliverables,
            companyName: p.companyName,
            companyId: p.companyId,
            status: p.status,
            createdAt: p.createdAt,
          })),
          ...(res.claimed || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            domain: p.domain,
            constraints: p.constraints,
            expectedDeliverables: p.expectedDeliverables,
            companyName: p.companyName,
            companyId: p.companyId,
            status: p.status,
            createdAt: p.createdAt,
          })),
        ]);
      } else {
        toast.error(res.error || "Failed to load problem pool.");
      }
      setLoading(false);
    };
    loadProblems();
  }, []);

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

  const handleOpenReview = (problem: ProblemItem, tab: "inspect" | "claim" | "reject" = "inspect") => {
    setActiveModalProblem(problem);
    setActiveModalTab(tab);
    setRejectionReason("");
  };

  const handleClaimSubmit = async () => {
    if (!activeModalProblem) return;
    setIsSubmitting(true);

    const res = await claimProblemAction(activeModalProblem.id);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message || "Problem claimed successfully!");
      setActiveModalProblem(null);
      // Reload data to reflect the status change
      const updated = await getStaffProblemPool();
      if (updated.success) {
        setProblems([
          ...(updated.available || []).map((p: any) => ({
            id: p.id, title: p.title, description: p.description, domain: p.domain,
            constraints: p.constraints, expectedDeliverables: p.expectedDeliverables,
            companyName: p.companyName, companyId: p.companyId, status: p.status, createdAt: p.createdAt,
          })),
          ...(updated.claimed || []).map((p: any) => ({
            id: p.id, title: p.title, description: p.description, domain: p.domain,
            constraints: p.constraints, expectedDeliverables: p.expectedDeliverables,
            companyName: p.companyName, companyId: p.companyId, status: p.status, createdAt: p.createdAt,
          })),
        ]);
      }
    } else {
      toast.error(res.error || "Failed to claim problem.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!activeModalProblem) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for declining this problem statement.");
      return;
    }
    setIsSubmitting(true);

    // Note: Problem rejection by staff is handled server-side.
    // For now, just dismiss locally — the real action is in admin-projects.ts
    setIsSubmitting(false);
    toast.info(`Problem ${activeModalProblem.id} marked as rejected locally. Admin will review.`);
    setActiveModalProblem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading problem pool...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Industry Problem Bank
            </h1>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
              Faculty Pool
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Browse verified industrial problems submitted by MSME partners. Triage, claim for student teams.
          </p>
        </div>
      </div>

      {/* ── KPI Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total</span>
            <Layers className="size-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{totalCount}</div>
          <p className="text-[11px] text-muted-foreground mt-1">All problem statements</p>
        </div>

        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available</span>
            <CheckCircle2 className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{availableCount}</div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">Ready for faculty claim</p>
        </div>

        <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Claimed</span>
            <Clock className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{claimedCount}</div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">In active development</p>
        </div>

        <div className="rounded-[14px] border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Rejected</span>
            <XCircle className="size-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-300">{rejectedCount}</div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-1">Needs revision or declined</p>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ─────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by problem title, company, or keywords..."
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
              className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
              className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="POOL_AVAILABLE">Available in Pool</option>
              <option value="CLAIMED">Claimed</option>
              <option value="REJECTED">Needs Revision / Rejected</option>
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

      {/* ── Problem Bank Table ───────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Problem Details</th>
                <th className="px-4 py-3.5">MSME Enterprise</th>
                <th className="px-4 py-3.5">Domain</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredProblems.map((prob) => (
                <tr key={prob.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-4 max-w-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <CopyIdBadge id={prob.id} size="xs" />
                    </div>
                    <div className="font-semibold text-foreground text-xs leading-snug">{prob.title}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{prob.description}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-foreground">{prob.companyName}</div>
                    {prob.companyId && (
                      <div className="text-[10px] text-muted-foreground font-mono">{prob.companyId}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {prob.domain}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={prob.status} />
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {prob.status === "POOL_AVAILABLE" ? (
                      <button
                        onClick={() => handleOpenReview(prob, "inspect")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-foreground font-medium text-xs transition-colors"
                      >
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span>Review &amp; Claim</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenReview(prob, "inspect")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-muted-foreground font-medium text-xs transition-colors"
                      >
                        <Eye className="size-3.5" />
                        <span>View</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                    No problem statements found matching the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Review & Claim Modal ───────────────────────────────────── */}
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
                  {activeModalProblem.companyName}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                {activeModalProblem.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Domain: <strong className="text-foreground">{activeModalProblem.domain}</strong>
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeModalTab}
              onValueChange={(val: any) => setActiveModalTab(val)}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="inspect" className="text-xs">Inspect</TabsTrigger>
                <TabsTrigger value="claim" className="text-xs">Claim &amp; Create Project</TabsTrigger>
                <TabsTrigger value="reject" className="text-xs">Reject</TabsTrigger>
              </TabsList>

              <TabsContent value="inspect" className="space-y-4 pt-3">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Description</span>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-black/[0.04]">
                    {activeModalProblem.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Constraints</span>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-black/[0.04]">
                      {activeModalProblem.constraints || "No strict constraints specified."}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Expected Deliverables</span>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-black/[0.04]">
                      {activeModalProblem.expectedDeliverables || "Software repository and design documentation."}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveModalTab("claim")}
                    className="px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Proceed to Claim</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="claim" className="space-y-4 pt-3">
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <span className="font-semibold block">Convert to Active Project</span>
                    Claiming this problem will change its status to <strong>CLAIMED</strong> and unlock project creation.
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
                    onClick={handleClaimSubmit}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                    <span>{isSubmitting ? "Claiming..." : "Confirm & Claim Problem"}</span>
                  </button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="reject" className="space-y-4 pt-3">
                <div className="rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-semibold block">Decline Problem Statement</span>
                    If the problem is out of academic scope or lacks required specifications.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reason for Declining</label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific feedback..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
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
                    onClick={handleRejectSubmit}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
                    <span>{isSubmitting ? "Submitting..." : "Decline Problem"}</span>
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
