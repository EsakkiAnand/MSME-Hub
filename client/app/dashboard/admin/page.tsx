"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  ShieldCheck,
  Building2,
  GitBranch,
  Star,
  Users,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  FileText,
  ChevronRight,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-group";

// ─── Mock Metrics ─────────────────────────────────────────────────────────────
const dashboardStats = [
  {
    label: "Industry Verifications",
    sublabel: "Pending approval",
    value: 4,
    icon: Building2,
    iconColor: "text-blue-500",
    href: "/dashboard/admin/industry-verification",
    accent: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "GitHub Reviews",
    sublabel: "Solutions awaiting sign-off",
    value: 3,
    icon: GitBranch,
    iconColor: "text-violet-500",
    href: "/dashboard/admin/github-review",
    accent: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    label: "Rating Moderation",
    sublabel: "Low-star ratings in queue",
    value: 2,
    icon: Star,
    iconColor: "text-amber-500",
    href: "/dashboard/admin/rating-moderation",
    accent: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    label: "Problems in Pool",
    sublabel: "Available for student teams",
    value: 12,
    icon: FileText,
    iconColor: "text-emerald-500",
    href: "/dashboard/admin/problem-bank",
    accent: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    label: "Active Projects",
    sublabel: "Across all departments",
    value: 9,
    icon: FolderKanban,
    iconColor: "text-rose-500",
    href: "/dashboard/admin/problem-bank",
    accent: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    label: "Total Users",
    sublabel: "Registered on platform",
    value: 47,
    icon: Users,
    iconColor: "text-slate-500",
    href: "/dashboard/admin/users",
    accent: "bg-slate-100 dark:bg-slate-800/40",
  },
];

// ─── Mock Recent Activity ─────────────────────────────────────────────────────
const recentActivity = [
  {
    id: 1,
    type: "verification",
    title: "Industry Verification Request",
    description: "Hexaware Technologies submitted Udyam certificate for review.",
    time: "18 min ago",
    status: "PENDING",
    href: "/dashboard/admin/industry-verification",
    icon: Building2,
    iconColor: "text-blue-500",
    statusClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50",
  },
  {
    id: 2,
    type: "github",
    title: "GitHub Solution Submitted",
    description: "Team PRJ-2024-009 submitted repository for admin sign-off.",
    time: "1h ago",
    status: "PENDING",
    href: "/dashboard/admin/github-review",
    icon: GitBranch,
    iconColor: "text-violet-500",
    statusClass: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800/50",
  },
  {
    id: 3,
    type: "rating",
    title: "Low-Star Rating Flagged",
    description: "Nellai Precision Engineering rated project PRJ-2024-005 with 1 star.",
    time: "3h ago",
    status: "QUEUED",
    href: "/dashboard/admin/rating-moderation",
    icon: Star,
    iconColor: "text-amber-500",
    statusClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50",
  },
  {
    id: 4,
    type: "verification",
    title: "Industry Account Approved",
    description: "AgriTech Solutions Pvt. Ltd. verification approved. Problem submission unlocked.",
    time: "Yesterday",
    status: "APPROVED",
    href: "/dashboard/admin/industry-verification",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50",
  },
  {
    id: 5,
    type: "github",
    title: "GitHub Review Completed",
    description: "PRJ-2024-007 solution approved — MIT License ✓, README ✓, Commits ✓.",
    time: "Yesterday",
    status: "APPROVED",
    href: "/dashboard/admin/github-review",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50",
  },
];

// ─── Quick Action Links ───────────────────────────────────────────────────────
const quickActions = [
  {
    label: "Review Industry Verifications",
    description: "Approve or reject pending Udyam certificate submissions",
    href: "/dashboard/admin/industry-verification",
    icon: Building2,
    count: 4,
    countClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    label: "GitHub Solution Review",
    description: "Inspect submitted repositories for MIT License and README",
    href: "/dashboard/admin/github-review",
    icon: GitBranch,
    count: 3,
    countClass: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    label: "Moderate Low Ratings",
    description: "Review and approve/suppress ratings ≤ 2 stars",
    href: "/dashboard/admin/rating-moderation",
    icon: Star,
    count: 2,
    countClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    label: "Manage Problem Bank",
    description: "System-wide view of all submitted industry problems",
    href: "/dashboard/admin/problem-bank",
    icon: FileText,
    count: null,
    countClass: "",
  },
  {
    label: "User Management",
    description: "View all registered users across all roles",
    href: "/dashboard/admin/users",
    icon: Users,
    count: null,
    countClass: "",
  },
];

export default function AdminDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const adminId = (user as any)?.uniqueId || "ADM0001";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Banner ─────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              MSME Administration Console
            </h1>
            <CopyIdBadge id={adminId} label="Admin ID" size="xs" />
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] dark:bg-[#FF453A]/15 dark:text-[#FF453A]">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Welcome back, {user?.name || "Administrator"}. Review pending verifications, moderate
            ratings, and govern platform-wide deliverables from this console.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ShieldCheck className="size-8 text-rose-400 opacity-60" />
        </div>
      </div>

      {/* ── KPI Stats Grid ─────────────────────────────────────────────── */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label}>
              <Link
                href={stat.href}
                className="group rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-200 active:scale-[0.98] h-full"
              >
                <div className={`size-9 rounded-[10px] ${stat.accent} flex items-center justify-center`}>
                  <Icon className={`size-4.5 ${stat.iconColor}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold text-foreground mt-1 leading-tight">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {stat.sublabel}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Quick Actions + Activity Feed (2-col layout) ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Jump to pending tasks</p>
            </div>
            <ul className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <li key={action.label}>
                    <Link
                      href={action.href}
                      className="group flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="size-8 rounded-[8px] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                        <Icon className="size-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground leading-tight truncate">
                          {action.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {action.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {action.count !== null && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${action.countClass}`}>
                            {action.count}
                          </span>
                        )}
                        <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-3">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Latest platform events requiring attention</p>
              </div>
              <Clock className="size-4 text-muted-foreground" />
            </div>
            <ul className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3 px-5 py-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`size-3.5 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-foreground leading-tight">
                            {item.title}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${item.statusClass}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                          {item.time}
                        </span>
                      </div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0 mt-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Platform Health Notice ────────────────────────────────────── */}
      <div className="rounded-[14px] border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-3.5 flex items-center gap-3">
        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            Platform Health: Optimal
          </p>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/70 mt-0.5">
            All unique ID sequences active · Database connections healthy · Auth services operational
          </p>
        </div>
        <AlertCircle className="size-3.5 text-emerald-500 shrink-0 opacity-60" />
      </div>
    </div>
  );
}
