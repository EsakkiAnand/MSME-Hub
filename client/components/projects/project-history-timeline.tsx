"use client";

import React, { useState } from "react";
import { ProjectHistoryEvent } from "@/lib/project-data";
import {
  History,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Star,
  AlertCircle,
  XCircle,
  User,
  Clock,
  ArrowRight,
  Filter,
  Info,
} from "lucide-react";

interface ProjectHistoryTimelineProps {
  history: ProjectHistoryEvent[];
  projectId: string;
}

export function ProjectHistoryTimeline({ history, projectId }: ProjectHistoryTimelineProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredHistory = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.category === filter;
  });

  const getCategoryIcon = (category: ProjectHistoryEvent["category"], isReject = false) => {
    if (isReject) {
      return <XCircle className="size-4 text-rose-600 dark:text-rose-400" />;
    }
    switch (category) {
      case "MILESTONE":
        return <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400" />;
      case "DELIVERABLE":
        return <GitBranch className="size-4 text-purple-600 dark:text-purple-400" />;
      case "GOVERNANCE":
        return <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />;
      case "FEEDBACK":
        return <Star className="size-4 text-amber-500 fill-amber-500" />;
      case "STATUS_CHANGE":
      default:
        return <Clock className="size-4 text-[#007AFF]" />;
    }
  };

  const getActorBadgeColor = (role: ProjectHistoryEvent["actor"]["role"]) => {
    switch (role) {
      case "MSME_ADMIN":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
      case "FACULTY_MENTOR":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
      case "STUDENT_LEAD":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
      case "INDUSTRY_CLIENT":
        return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
            <History className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Individual Project History &amp; Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Chronological log of state transitions, milestones, and governance reviews for {projectId}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: "ALL", label: "All Events" },
            { id: "MILESTONE", label: "Milestones" },
            { id: "DELIVERABLE", label: "Code Submissions" },
            { id: "GOVERNANCE", label: "Governance" },
            { id: "FEEDBACK", label: "Ratings" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filter === btn.id
                  ? "bg-[#007AFF] text-white font-semibold"
                  : "bg-black/[0.02] dark:bg-white/[0.03] text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No history events match the selected category filter.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200 dark:before:bg-zinc-800">
            {filteredHistory.map((item, idx) => {
              const isReject =
                item.title.toLowerCase().includes("rejected") ||
                item.metadata?.newStatus === "REJECTED";

              return (
                <div key={item.id || idx} className="relative group">
                  {/* Bullet Node */}
                  <div
                    className={`absolute -left-[27px] top-1 size-5 rounded-full border-2 bg-white dark:bg-[#1C1C1E] flex items-center justify-center ${
                      isReject
                        ? "border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.15)]"
                        : "border-[#007AFF] shadow-[0_0_0_3px_rgba(0,122,255,0.15)]"
                    }`}
                  >
                    {getCategoryIcon(item.category, isReject)}
                  </div>

                  {/* Event Content Card */}
                  <div className="rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] p-4 transition-all hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getActorBadgeColor(
                            item.actor.role
                          )}`}
                        >
                          {item.actor.roleTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                        <Clock className="size-3" />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>

                    {/* Actor Details */}
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="size-3 text-muted-foreground" />
                      <span>Action by: <strong>{item.actor.name}</strong></span>
                      {item.actor.email && (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          ({item.actor.email})
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Rejection / Special Notes Callout */}
                    {item.notes && (
                      <div
                        className={`mt-2.5 p-2.5 rounded-lg text-xs border ${
                          isReject
                            ? "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800/60 dark:text-rose-200"
                            : "bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-200"
                        }`}
                      >
                        <p className="font-semibold text-[11px] flex items-center gap-1 mb-0.5">
                          <Info className="size-3" />
                          Audit Note / Resolution:
                        </p>
                        <p className="text-xs">{item.notes}</p>
                      </div>
                    )}

                    {/* Status Change Transition / Metadata */}
                    {item.metadata && (
                      <div className="mt-3 pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center gap-2 text-[11px]">
                        {item.metadata.oldStatus && item.metadata.newStatus && (
                          <div className="inline-flex items-center gap-1.5 font-mono bg-black/[0.03] dark:bg-white/[0.04] px-2 py-0.5 rounded text-muted-foreground">
                            <span>{item.metadata.oldStatus}</span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span className="font-semibold text-foreground">
                              {item.metadata.newStatus}
                            </span>
                          </div>
                        )}

                        {item.metadata.githubCommit && (
                          <div className="inline-flex items-center gap-1 font-mono text-[#007AFF] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                            <GitBranch className="size-3" />
                            <span>Commit: {item.metadata.githubCommit}</span>
                          </div>
                        )}

                        {item.metadata.ratingStars && (
                          <div className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                            <span>{item.metadata.ratingStars} / 5 Stars Awarded</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
