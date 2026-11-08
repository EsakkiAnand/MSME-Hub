"use client";

import React from "react";
import {
  ProjectLifecycleStatus,
  ProjectStatusCategory,
  getProjectStatusCategory,
  PROJECT_STATUS_CATEGORY_CONFIG,
  LIFECYCLE_STATUS_CONFIG,
} from "@/lib/project-data";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

interface ProjectStatusCategoryBadgeProps {
  status: ProjectLifecycleStatus;
  showLifecycleBadge?: boolean;
  size?: "sm" | "md";
}

export function ProjectStatusCategoryBadge({
  status,
  showLifecycleBadge = true,
  size = "sm",
}: ProjectStatusCategoryBadgeProps) {
  const category = getProjectStatusCategory(status);
  const catConfig = PROJECT_STATUS_CATEGORY_CONFIG[category];
  const lifeConfig = LIFECYCLE_STATUS_CONFIG[status];

  const getCategoryIcon = () => {
    switch (category) {
      case "IN_PROGRESS_LIVE":
        return <span className={`size-2 rounded-full ${catConfig.dotClass}`} />;
      case "COMPLETED":
        return <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />;
      case "REJECTED":
        return <XCircle className="size-3 text-rose-600 dark:text-rose-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      {/* Category Pill */}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${catConfig.badgeClass} ${
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
        }`}
      >
        {getCategoryIcon()}
        <span>{catConfig.label}</span>
      </span>

      {/* Optional Granular Sub-Status */}
      {showLifecycleBadge && (
        <span
          className={`inline-flex items-center gap-1 rounded-md font-medium border ${lifeConfig.badgeClass} ${
            size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
          }`}
        >
          <span>{lifeConfig.label}</span>
        </span>
      )}
    </div>
  );
}
