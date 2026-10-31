"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Lightbulb,
  Share2,
  MessageSquare,
  User,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

const navItems = [
  { href: "/dashboard/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/faculty/students", label: "My Students", icon: Users },
  { href: "/dashboard/faculty/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/faculty/project-details", label: "Project Details", icon: FileText },
  { href: "/dashboard/faculty/idea-submissions", label: "Idea Submissions", icon: Lightbulb },
  { href: "/dashboard/faculty/shared-projects", label: "Shared Projects", icon: Share2 },
  { href: "/dashboard/faculty/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/dashboard/faculty/profile", label: "My Profile", icon: User },
];

const pageTitles: Record<string, string> = {
  "/dashboard/faculty": "Faculty Dashboard",
  "/dashboard/faculty/students": "My Students",
  "/dashboard/faculty/projects": "Assigned Projects",
  "/dashboard/faculty/project-details": "Project Details & Supervision",
  "/dashboard/faculty/idea-submissions": "Student Idea Submissions",
  "/dashboard/faculty/shared-projects": "Shared Projects & Benchmarks",
  "/dashboard/faculty/feedback": "Project Feedback & Evaluation",
  "/dashboard/faculty/profile": "Faculty Profile",
};

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Role-Based Access Control (RBAC) Guard
  useEffect(() => {
    if (session.isPending) return;

    if (!session.data?.user) {
      router.replace("/login");
      return;
    }

    const role = (session.data.user as any)?.role;
    // Allow STAFF or FACULTY roles. In dev mode without assigned role, default to allowed for inspection.
    if (role && role !== "STAFF" && role !== "FACULTY") {
      setIsAuthorized(false);
      toast.error("Access Denied: Faculty credentials required.");
      const redirectPath = getRoleDashboardPath(role);
      router.replace(redirectPath);
      return;
    }

    setIsAuthorized(true);
  }, [session, router]);

  const currentTitle = pageTitles[pathname] ?? "Faculty Portal";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FC";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out successfully.");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out.");
    } finally {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
    }
  };

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  // Render loading state while checking session
  if (session.isPending || isAuthorized === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <Loader2 className="size-6 animate-spin text-blue-600" />
          <span>Verifying faculty credentials...</span>
        </div>
      </div>
    );
  }

  // Unauthorized fallback (handled by router redirect)
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3 text-slate-600 text-sm p-6 max-w-sm text-center">
          <ShieldAlert className="size-8 text-amber-500" />
          <span className="font-semibold text-slate-800">Access Restricted</span>
          <span className="text-xs text-slate-500">Redirecting to your authorized workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enterprise Dark Navy Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-[#0f2744] text-slate-100 flex flex-col shrink-0 transition-transform duration-200 ease-in-out border-r border-[#1a385c]",
          "lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Institutional Text Brand Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-[#1a385c] bg-[#0c2038]">
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-white leading-tight">
              FXEC MSME Hub
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-tight">
              Faculty Portal
            </span>
          </div>
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Faculty Navigation
          </div>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
                      active
                        ? "bg-[#1d4ed8] text-white shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-[#1a385c]"
                    )}
                  >
                    <item.icon
                      className={cn("size-4 shrink-0", active ? "text-white" : "text-slate-400")}
                    />
                    <span className="truncate flex-1">{item.label}</span>
                    {active && <ChevronRight className="size-3.5 text-white/70 shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Institutional Faculty Profile Footer */}
        <div className="p-3 border-t border-[#1a385c] bg-[#0c2038]">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md">
            <Avatar className="size-8 rounded-md shrink-0 bg-blue-900 border border-blue-700/50">
              <AvatarFallback className="bg-blue-900 text-blue-200 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Dr. Selvaraj M"}
              </p>
              <div className="mt-0.5">
                <CopyIdBadge id={(user as any)?.uniqueId || "FAC0001"} size="xs" className="bg-[#1a385c] border-[#254d7e] text-slate-200" />
              </div>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="p-1.5 rounded hover:bg-[#1a385c] text-slate-400 hover:text-rose-300 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-base font-semibold text-slate-900 tracking-tight truncate">
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="size-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1 right-1 size-2 bg-blue-600 rounded-full" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 pl-2">
                  <Avatar className="size-8 rounded-md bg-slate-100 border border-slate-200">
                    <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-900 max-w-[130px] truncate">
                      {user?.name || "Dr. Selvaraj M"}
                    </span>
                    <span className="text-[10px] text-slate-500">Faculty Advisor</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {user?.name || "Dr. Selvaraj M"}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user?.email || "selvaraj.cse@francisxavier.ac.in"}
                    </p>
                  </div>
                  <CopyIdBadge id={(user as any)?.uniqueId || "FAC0001"} size="xs" />
                </div>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/faculty/profile")}
                  className="cursor-pointer text-xs flex items-center gap-2 py-2"
                >
                  <User className="size-3.5 text-slate-500" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/faculty/feedback")}
                  className="cursor-pointer text-xs flex items-center gap-2 py-2"
                >
                  <MessageSquare className="size-3.5 text-slate-500" />
                  <span>Evaluations & Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowSignOutConfirm(true)}
                  className="cursor-pointer text-xs text-rose-600 focus:text-rose-600 flex items-center gap-2 py-2"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <ConfirmationDialog
        open={showSignOutConfirm}
        onOpenChange={setShowSignOutConfirm}
        title="Sign Out of Faculty Portal"
        description="Are you sure you want to sign out of your faculty account? You will need your FXEC Google Workspace credentials to log back in."
        confirmText="Sign Out"
        variant="destructive"
        isLoading={isSigningOut}
        onConfirm={handleSignOut}
      />
    </div>
  );
}
