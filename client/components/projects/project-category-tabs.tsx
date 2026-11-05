"use client";

import React from "react";
import { ProjectStatusCategory } from "@/lib/project-data";
import { FolderKanban, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

interface ProjectCategoryTabsProps {
  activeCategory: ProjectStatusCategory;
  onSelectCategory: (cat: ProjectStatusCategory) => void;
  counts: {
    all: number;
    inProgressLive: number;
    completed: number;
    rejected: number;
  };
}

export function ProjectCategoryTabs({
  activeCategory,
  onSelectCategory,
  counts,
}: ProjectCategoryTabsProps) {
  const tabs = [
    {
      id: "ALL" as ProjectStatusCategory,
      label: "All Projects",
      count: counts.all,
      icon: FolderKanban,
      activeColor: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
      badgeColor: "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900",
      inactiveBadge: "bg-black/[0.04] text-muted-foreground dark:bg-white/[0.06]",
    },
    {
      id: "IN_PROGRESS_LIVE" as ProjectStatusCategory,
      label: "In Progress / Live",
      count: counts.inProgressLive,
      icon: PlayCircle,
      activeColor: "bg-[#007AFF] text-white",
      badgeColor: "bg-white/20 text-white",
      inactiveBadge: "bg-blue-50 text-[#007AFF] dark:bg-blue-950/40 dark:text-blue-300",
      dot: "bg-emerald-400 animate-pulse",
    },
    {
      id: "COMPLETED" as ProjectStatusCategory,
      label: "Completed",
      count: counts.completed,
      icon: CheckCircle2,
      activeColor: "bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white",
      badgeColor: "bg-white/20 text-white",
      inactiveBadge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      id: "REJECTED" as ProjectStatusCategory,
      label: "Rejected",
      count: counts.rejected,
      icon: XCircle,
      activeColor: "bg-rose-600 text-white dark:bg-rose-600 dark:text-white",
      badgeColor: "bg-white/20 text-white",
      inactiveBadge: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-black/[0.03] dark:bg-white/[0.04] rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto scrollbar-none w-full sm:w-auto">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[9px] text-xs font-medium transition-all shrink-0 select-none ${
              isActive
                ? `${tab.activeColor} shadow-xs font-semibold`
                : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            }`}
          >
            <Icon className="size-3.5" />
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                isActive ? tab.badgeColor : tab.inactiveBadge
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
