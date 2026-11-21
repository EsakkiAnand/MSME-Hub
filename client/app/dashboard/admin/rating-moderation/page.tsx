"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
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
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import {
  getAdminRatingModerationQueue,
  approveRatingAction,
  suppressRatingAction,
} from "@/app/actions/admin-projects";

interface ModerationItem {
  id: string;
  projectId: string;
  projectTitle: string;
  msmeCompany: string;
  studentTeamLead: string;
  ratingStars: number;
  writtenFeedback: string;
  submittedDate: string;
  isModerated: boolean;
}

export default function RatingModerationPage() {
  const [moderations, setModerations] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeItem, setActiveItem] = useState<ModerationItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadQueue = async () => {
    const res = await getAdminRatingModerationQueue();
    if (res.success) {
      setModerations(
        (res.ratings as any[]).map((r) => ({
          id: r.id,
          projectId: r.project.id,
          projectTitle: r.project.title,
          msmeCompany: r.industry?.companyName || "—",
          studentTeamLead: r.project.team?.find((m: any) => m.isLead)?.name || "Unassigned",
          ratingStars: r.stars,
          writtenFeedback: r.feedbackText,
          submittedDate: r.createdAt,
          isModerated: r.isModerated,
        }))
      );
    } else {
      toast.error(res.error || "Failed to load rating moderation queue.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadQueue();
      setLoading(false);
    })();
  }, []);

  const filteredItems = moderations.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.msmeCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentTeamLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    const res = await approveRatingAction(id);
    setIsProcessing(false);

    if (res.success) {
      toast.success(res.message || "Rating published to student portfolio.");
      await loadQueue();
    } else {
      toast.error(res.error || "Failed to approve rating.");
    }
    setActiveItem(null);
  };

  const handleSuppress = async (id: string) => {
    setIsProcessing(true);
    const res = await suppressRatingAction(id);
    setIsProcessing(false);

    if (res.success) {
      toast.info(res.message || "Rating suppressed.");
      await loadQueue();
    } else {
      toast.error(res.error || "Failed to suppress rating.");
    }
    setActiveItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading rating moderation desk...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Industry Rating Moderation Desk
            </h1>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
              PRD §8.2 REQ-ADM-03
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Ratings of 2 stars or below are routed here for admin mediation before appearing on
            student portfolios (ADR 0004).
          </p>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by project, company, team lead, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 rounded-xl"
          />
        </div>
      </div>

      {/* ── Moderation Queue Table ──────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">Project</th>
                <th className="px-4 py-3.5">Team Lead</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Industry Feedback</th>
                <th className="px-5 py-3.5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-4 max-w-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <CopyIdBadge id={item.projectId} size="xs" />
                    </div>
                    <div className="font-semibold text-foreground text-xs leading-snug">
                      {item.projectTitle}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {item.msmeCompany}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-foreground">{item.studentTeamLead}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(item.submittedDate).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3.5 ${
                            s <= item.ratingStars
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-[11px] text-muted-foreground line-clamp-3">
                      {item.writtenFeedback}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setActiveItem(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                    >
                      <ShieldCheck className="size-3.5 text-amber-500" />
                      <span>Moderate</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                    No ratings are currently in the moderation queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Moderation Dialog ───────────────────────────────────────── */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        {activeItem && (
          <DialogContent className="max-w-2xl p-6 rounded-2xl">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={activeItem.projectId} size="xs" />
                <span className="text-xs text-muted-foreground">
                  {activeItem.msmeCompany}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                {activeItem.projectTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {activeItem.ratingStars}-star rating submitted by industry partner
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-4">
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block mb-1">
                  Industry Partner Written Feedback:
                </span>
                <span className="text-amber-700 dark:text-amber-400 leading-relaxed">
                  {activeItem.writtenFeedback}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose whether to publish this rating to the student portfolio or keep it
                suppressed after mediation. Suppressed ratings remain visible only to
                administrators.
              </p>
            </div>

            <DialogFooter className="mt-5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSuppress(activeItem.id)}
                className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="size-3.5" />
                <span>Keep Suppressed</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-3.5 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApprove(activeItem.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  <span>{isProcessing ? "Publishing..." : "Publish to Portfolio"}</span>
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
