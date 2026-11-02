"use client";

import { useState } from "react";
import {
  Star,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  Search,
  MessageSquare,
  Building2,
  GraduationCap,
  Scale,
  Clock,
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
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import { initialRatingModerations, RatingModerationItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  RatingModerationItem["status"],
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  QUEUED: {
    label: "Under Moderation",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
    icon: Clock,
  },
  APPROVED_PUBLISHED: {
    label: "Published to Portfolio",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    icon: CheckCircle2,
  },
  MEDIATION_REQUESTED: {
    label: "Mediation Active",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    icon: Scale,
  },
  SUPPRESSED: {
    label: "Suppressed / Hidden",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    icon: XCircle,
  },
};

export default function RatingModerationPage() {
  const [moderations, setModerations] = useState<RatingModerationItem[]>(
    initialRatingModerations
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [activeItem, setActiveItem] = useState<RatingModerationItem | null>(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredItems = moderations.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.msmeCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentTeamLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const queuedCount = moderations.filter((m) => m.status === "QUEUED").length;
  const publishedCount = moderations.filter((m) => m.status === "APPROVED_PUBLISHED").length;
  const mediatedCount = moderations.filter((m) => m.status === "MEDIATION_REQUESTED").length;

  const handleOpenModeration = (item: RatingModerationItem) => {
    setActiveItem(item);
    setAdminRemarks(item.adminRemarks || "");
  };

  const handlePublish = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setModerations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "APPROVED_PUBLISHED", adminRemarks: adminRemarks.trim() }
          : item
      )
    );
    setIsProcessing(false);
    setActiveItem(null);
    toast.success("Rating approved and published to student portfolio.");
  };

  const handleMediate = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setModerations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "MEDIATION_REQUESTED", adminRemarks: adminRemarks.trim() }
          : item
      )
    );
    setIsProcessing(false);
    setActiveItem(null);
    toast.info("Mediation session initiated between Faculty Supervisor and MSME partner.");
  };

  const handleSuppress = async (id: string) => {
    if (!adminRemarks.trim()) {
      toast.error("Please provide justification for suppressing this industry rating.");
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setModerations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "SUPPRESSED", adminRemarks: adminRemarks.trim() }
          : item
      )
    );
    setIsProcessing(false);
    setActiveItem(null);
    toast.warning("Rating suppressed from student portfolio.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Industry Rating Moderation Desk
            </h1>
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
              PRD §8.2 REQ-ADM-03
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Automatic moderation quarantine for industry partner ratings &le; 2 stars. Review written testimonials, verify constraint validity, and mediate revisions before public portfolio display.
          </p>
        </div>
      </div>

      {/* ── KPI Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[14px] border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>In Moderation Queue</span>
            <Clock className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{queuedCount}</div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1">Ratings &le; 2 stars</p>
        </div>

        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Mediations</span>
            <Scale className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{mediatedCount}</div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">Faculty &amp; Industry sync</p>
        </div>

        <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Published</span>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{publishedCount}</div>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">Visible on portfolios</p>
        </div>

        <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Protection Rule</span>
            <ShieldCheck className="size-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">Automatic</div>
          <p className="text-[11px] text-muted-foreground mt-1">Shields student portfolios</p>
        </div>
      </div>

      {/* ── Filter Toolbar ───────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search project title, ID, company, or team lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <option value="ALL">All Moderation States</option>
          <option value="QUEUED">Under Moderation</option>
          <option value="MEDIATION_REQUESTED">Mediation Active</option>
          <option value="APPROVED_PUBLISHED">Published</option>
          <option value="SUPPRESSED">Suppressed</option>
        </select>
      </div>

      {/* ── Moderation Table ─────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Project &amp; Team</th>
                <th className="px-4 py-3.5">MSME Enterprise</th>
                <th className="px-4 py-3.5">Score</th>
                <th className="px-4 py-3.5">Partner Feedback Preview</th>
                <th className="px-4 py-3.5">Moderation State</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredItems.map((item) => {
                const statusMeta = statusConfig[item.status];
                const StatusIcon = statusMeta.icon;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <CopyIdBadge id={item.projectId} size="xs" />
                        <span className="text-[10px] text-muted-foreground">
                          {item.submittedDate}
                        </span>
                      </div>
                      <div className="font-semibold text-foreground text-xs leading-snug">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Lead: {item.studentTeamLead}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">{item.msmeCompany}</div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="size-4 fill-amber-500 text-amber-500" />
                        <span>{item.ratingStars} / 5</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Q:{item.technicalQualityScore} &middot; T:{item.timelinessScore} &middot; C:{item.communicationScore}
                      </div>
                    </td>

                    <td className="px-4 py-4 max-w-sm">
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        &ldquo;{item.writtenFeedback}&rdquo;
                      </p>
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
                        onClick={() => handleOpenModeration(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                      >
                        <ShieldCheck className="size-3.5 text-amber-500" />
                        <span>Moderate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No rating moderation cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Moderation Action Dialog ─────────────────────────────────── */}
      <Dialog
        open={!!activeItem}
        onOpenChange={(open) => !open && setActiveItem(null)}
      >
        {activeItem && (
          <DialogContent className="max-w-xl p-6 rounded-2xl">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={activeItem.projectId} size="xs" />
                <span className="text-xs text-muted-foreground">
                  Partner: {activeItem.msmeCompany}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Moderate Review for {activeItem.projectTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Student Team Lead: {activeItem.studentTeamLead} &middot; Rating: {activeItem.ratingStars} Stars
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Detailed Scorecard */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-black/[0.04]">
                  <span className="text-[10px] text-muted-foreground block">Timeliness</span>
                  <span className="font-bold text-foreground text-sm">{activeItem.timelinessScore} / 5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-black/[0.04]">
                  <span className="text-[10px] text-muted-foreground block">Technical Quality</span>
                  <span className="font-bold text-foreground text-sm">{activeItem.technicalQualityScore} / 5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-black/[0.04]">
                  <span className="text-[10px] text-muted-foreground block">Communication</span>
                  <span className="font-bold text-foreground text-sm">{activeItem.communicationScore} / 5</span>
                </div>
              </div>

              {/* Written Review */}
              <div className="space-y-1">
                <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                  Written Testimonial / Critical Feedback:
                </span>
                <p className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-3 rounded-lg text-foreground leading-relaxed">
                  &ldquo;{activeItem.writtenFeedback}&rdquo;
                </p>
              </div>

              {/* Administrative Remarks */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  Administrative Moderation Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record justification, mediation steps taken with MSME representative, or reasons for suppressing this review..."
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSuppress(activeItem.id)}
                className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="size-3.5" />
                <span>Suppress from Portfolio</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleMediate(activeItem.id)}
                  className="px-3.5 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Scale className="size-3.5" />
                  <span>Initiate Mediation</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePublish(activeItem.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Check className="size-3.5" />
                  <span>Publish Rating</span>
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

