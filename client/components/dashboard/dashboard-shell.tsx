"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  LayoutDashboard,
  FolderKanban,
  FileText,
  Lightbulb,
  Code2,
  Trophy,
  Share2,
  MessageSquare,
  GraduationCap,
  BookOpen,
  Users,
  PlusCircle,
  Star,
  Building2,
  Award,
  HelpCircle,
  History,
  Loader2,
  GitBranch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { SidebarProfileCard } from "@/components/dashboard/sidebar-profile-card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { PageTransition } from "@/components/motion/page-transition";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { signOutAction } from "@/app/actions/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

export interface RoleConfig {
  portalTitle: string;
  portalSubtitle: string;
  portalIcon: React.ElementType;
  navItems: NavItem[];
  defaultIdPrefix: string;
  profileHref?: string;
  badge?: {
    label: string;
    icon?: React.ElementType;
    className?: string;
  };
}

export const ROLE_DASHBOARD_CONFIG: Record<string, RoleConfig> = {
  STUDENT: {
    portalTitle: "Student Workspace",
    portalSubtitle: "Academic Project Portal",
    portalIcon: GraduationCap,
    defaultIdPrefix: "STU",
    profileHref: "/dashboard/student/profile",
    badge: {
      label: "Active Scholar",
      icon: CheckCircle2,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    navItems: [
      { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/student/projects", label: "My Projects", icon: FolderKanban },
      { href: "/dashboard/student/project-details", label: "Project Details", icon: FileText },
      { href: "/dashboard/student/submit-idea", label: "Submit Idea", icon: Lightbulb },
      { href: "/dashboard/student/code-access", label: "Code & Project Access", icon: Code2 },
      { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
      { href: "/dashboard/student/shared-projects", label: "Shared Projects", icon: Share2 },
      { href: "/dashboard/student/feedback", label: "Feedback", icon: MessageSquare },
      { href: "/dashboard/student/profile", label: "My Profile", icon: UserIcon },
    ],
  },
  FACULTY: {
    portalTitle: "Faculty Supervisor",
    portalSubtitle: "Academic Project Supervisor",
    portalIcon: BookOpen,
    defaultIdPrefix: "FAC",
    profileHref: "/dashboard/faculty/profile",
    badge: {
      label: "Verified Supervisor",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    navItems: [
      { href: "/dashboard/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/faculty/problem-bank", label: "Problem Bank", icon: Building2 },
      { href: "/dashboard/faculty/students", label: "My Students", icon: Users },
      { href: "/dashboard/faculty/projects", label: "Projects", icon: FolderKanban },
      { href: "/dashboard/faculty/project-details", label: "Project Details", icon: FileText },
      { href: "/dashboard/faculty/idea-submissions", label: "Idea Submissions", icon: Lightbulb },
      { href: "/dashboard/faculty/shared-projects", label: "Shared Projects", icon: Share2 },
      { href: "/dashboard/faculty/feedback", label: "Feedback", icon: MessageSquare },
      { href: "/dashboard/faculty/profile", label: "My Profile", icon: UserIcon },
    ],
  },
  INDUSTRY: {
    portalTitle: "Industry Partner",
    portalSubtitle: "MSME Enterprise Portal",
    portalIcon: Building2,
    defaultIdPrefix: "IND",
    profileHref: "/dashboard/industry/profile",
    badge: {
      label: "Verified Enterprise",
      icon: CheckCircle2,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    navItems: [
      { href: "/dashboard/industry", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/industry/submit-problem", label: "Submit Problem", icon: PlusCircle },
      { href: "/dashboard/industry/problems", label: "My Problems", icon: FileText },
      { href: "/dashboard/industry/projects", label: "Active Projects", icon: FolderKanban },
      { href: "/dashboard/industry/ratings", label: "Ratings & Reviews", icon: Star },
      { href: "/dashboard/industry/profile", label: "Company Profile", icon: Building2 },
    ],
  },
  ALUMNI: {
    portalTitle: "Alumni Mentor",
    portalSubtitle: "Mentorship & Guidance Portal",
    portalIcon: Award,
    defaultIdPrefix: "ALM",
    profileHref: "/dashboard/alumni/profile",
    badge: {
      label: "Verified Mentor",
      icon: CheckCircle2,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    navItems: [
      { href: "/dashboard/alumni", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/alumni/guidance", label: "Guidance Requests", icon: HelpCircle },
      { href: "/dashboard/alumni/projects", label: "Mentored Projects", icon: FolderKanban },
      { href: "/dashboard/alumni/history", label: "Guidance History", icon: History },
      { href: "/dashboard/alumni/profile", label: "My Profile", icon: UserIcon },
    ],
  },
  MSME_ADMIN: {
    portalTitle: "MSME Administrator",
    portalSubtitle: "Governance & Policy Portal",
    portalIcon: ShieldCheck,
    defaultIdPrefix: "ADM",
    profileHref: "/dashboard/admin/profile",
    badge: {
      label: "Super Admin",
      icon: ShieldCheck,
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
    navItems: [
      { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/admin/problem-bank", label: "Problem Bank", icon: Building2 },
      { href: "/dashboard/admin/industry-verification", label: "Industry Verification", icon: ShieldCheck },
      { href: "/dashboard/admin/github-review", label: "GitHub Review", icon: GitBranch },
      { href: "/dashboard/admin/rating-moderation", label: "Rating Moderation", icon: Star },
      { href: "/dashboard/admin/users", label: "User Management", icon: Users },
    ],
  },
};

export interface DashboardShellProps {
  children: React.ReactNode;
  role: "STUDENT" | "FACULTY" | "INDUSTRY" | "ALUMNI" | "MSME_ADMIN";
  portalTitle?: string;
  portalSubtitle?: string;
  portalIcon?: React.ElementType;
  navItems?: NavItem[];
  badge?: {
    label: string;
    icon?: React.ElementType;
    className?: string;
  };
  profileHref?: string;
  defaultIdPrefix?: string;
}

export function DashboardShell({
  children,
  role,
  portalTitle,
  portalSubtitle,
  portalIcon,
  navItems,
  badge,
  profileHref,
  defaultIdPrefix,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const config = ROLE_DASHBOARD_CONFIG[role] || ROLE_DASHBOARD_CONFIG.STUDENT;
  const activePortalTitle = portalTitle || config.portalTitle;
  const activePortalSubtitle = portalSubtitle || config.portalSubtitle;
  const activeDefaultIdPrefix = defaultIdPrefix || config.defaultIdPrefix;
  const activeProfileHref = profileHref !== undefined ? profileHref : config.profileHref;
  const activeNavItems = navItems || config.navItems;
  const activeBadge = badge || config.badge;
  const PortalIcon = portalIcon || config.portalIcon;

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Route Protection & Role Verification
  React.useEffect(() => {
    if (session.isPending) return;

    if (!session.data?.user) {
      window.location.href = "/login";
      return;
    }

    const userRole = (session.data.user as any)?.role;
    if (userRole && userRole !== role) {
      const isStaffFacultyMatch =
        role === "FACULTY" && (userRole === "FACULTY" || userRole === "STAFF");
      if (!isStaffFacultyMatch) {
        const correctPath = getRoleDashboardPath(userRole);
        router.replace(correctPath);
      }
    }
  }, [session.isPending, session.data?.user, router, role]);

  // Close sidebar on ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Prevent bfcache restoration on browser Back button
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const userUniqueId = (user as any)?.uniqueId || `${activeDefaultIdPrefix}0001`;

  const initials = React.useMemo(() => {
    if (!user?.name) return activePortalTitle.slice(0, 2).toUpperCase();
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user?.name, activePortalTitle]);

  const currentTitle = React.useMemo(() => {
    const matched = activeNavItems.find((item) => isActive(item));
    if (matched) return matched.label;
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "Dashboard";
    return last
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [pathname, activeNavItems, activePortalTitle]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutAction();
      await authClient.signOut();

      if (typeof window !== "undefined") {
        try {
          sessionStorage.clear();
          localStorage.removeItem("better-auth.session_data");
        } catch {}
      }

      toast.success("Signed out successfully.");
      window.location.replace("/");
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Failed to sign out. Please try again.");
      window.location.replace("/");
    } finally {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
    }
  };

  if (session.isPending || !session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <Loader2 className="size-8 text-[#1d4ed8] animate-spin" />
          <p className="font-medium text-xs tracking-wide text-slate-600">
            Verifying authorized session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f2f2f7] dark:bg-[#000000] text-foreground antialiased ios-theme">
      {/* Mobile Backdrop with AnimatePresence */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Standardized Sidebar (260px) */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-[260px] bg-[#f8f9fb] dark:bg-[#151516] text-foreground flex flex-col shrink-0 border-r border-black/[0.06] dark:border-white/[0.08] transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header with Institutional Branding */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-[10px] bg-[#007AFF] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm select-none">
              M
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                FXEC MSME Hub
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight truncate">
                {activePortalSubtitle}
              </span>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-[8px] hover:bg-black/[0.04] transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-1 select-none flex flex-col justify-between">
          <div>
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-1 mt-0.5">
              {activeNavItems.map((item) => {
                const active = isActive(item);
                const ItemIcon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]",
                        active
                          ? "bg-[#007AFF] text-white font-medium shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        )}
                      />
                      <span className="truncate flex-1">{item.label}</span>
                      {active && (
                        <ChevronRight className="size-3 text-white/90 shrink-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Sidebar Actions: Dedicated Logout Option */}
          <div className="pt-3 mt-auto border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowSignOutConfirm(true);
              }}
              className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-medium text-[#FF3B30] dark:text-[#FF453A] hover:bg-red-500/10 dark:hover:bg-red-500/15 transition-all duration-150 cursor-pointer select-none active:scale-[0.98] text-left"
            >
              <LogOut className="size-4 shrink-0 transition-colors" />
              <span className="truncate flex-1">Log Out</span>
            </button>
          </div>
        </nav>

        {/* iOS-Inspired User Profile Footer with Popup Menu */}
        <SidebarProfileCard
          user={user}
          role={role}
          userUniqueId={userUniqueId}
          profileHref={activeProfileHref}
          onSignOutClick={() => setShowSignOutConfirm(true)}
        />
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        {/* Standardized Apple iOS Style Header (h-14) */}
        <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-[#161618]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-[8px] hover:bg-black/[0.04] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 hidden sm:inline-block">
                {activePortalTitle}
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-600 hidden sm:inline-block">/</span>
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate tracking-tight">
                {currentTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role / Institutional Badge */}
            {activeBadge && (
              <div
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 border-slate-200 text-slate-700",
                  activeBadge.className
                )}
              >
                {activeBadge.icon && <activeBadge.icon className="size-3 shrink-0" />}
                <span>{activeBadge.label}</span>
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => toast.info("No unread notifications at this time.")}
              className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-[10px] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 bg-[#007AFF] rounded-full ring-2 ring-white dark:ring-black" />
            </button>

            {/* iOS-Inspired Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none cursor-pointer rounded-[10px] active:scale-95 transition-transform">
                <div className="flex items-center gap-2 p-0.5 rounded-[10px]">
                  <Avatar className="size-8 rounded-[10px] bg-blue-100 text-[#007AFF] dark:bg-blue-950 dark:text-blue-300 border border-black/[0.08] dark:border-white/[0.1]">
                    <AvatarFallback className="text-xs font-semibold rounded-[10px] bg-blue-100 text-[#007AFF] dark:bg-blue-950 dark:text-blue-300">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 mt-2 p-1.5 rounded-[16px] border border-black/[0.08] dark:border-white/[0.1] bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                <div className="px-3 py-2.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight">
                      {user?.name || activePortalTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user?.email || "institutional.user@fxec.ac.in"}
                    </p>
                  </div>
                  <CopyIdBadge id={userUniqueId} size="xs" />
                </div>
                <div className="p-1 space-y-0.5">
                  {activeProfileHref && (
                    <DropdownMenuItem
                      onClick={() => router.push(activeProfileHref)}
                      className="cursor-pointer text-xs rounded-[10px] flex items-center gap-2 py-2 text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      <UserIcon className="size-3.5 text-slate-400" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setShowSignOutConfirm(true)}
                    className="cursor-pointer text-xs rounded-[10px] text-[#FF3B30] dark:text-[#FF453A] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 py-2"
                  >
                    <LogOut className="size-3.5" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area - Standardized Layout Wrapper */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <PageTransition className="w-full max-w-7xl mx-auto space-y-6">
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Unified iOS-Inspired Sign Out Confirmation Dialog */}
      <ConfirmationDialog
        open={showSignOutConfirm}
        onOpenChange={setShowSignOutConfirm}
        title="Log out?"
        description="You will need to sign in again to access your workspace."
        confirmText={isSigningOut ? "Logging out..." : "Log Out"}
        cancelText="Cancel"
        variant="destructive"
        isLoading={isSigningOut}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
