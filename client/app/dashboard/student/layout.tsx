"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Lightbulb,
  Code2,
  Trophy,
  Share2,
  MessageSquare,
  User,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
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
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student/projects", label: "My Projects", icon: FolderKanban },
  { href: "/dashboard/student/project-details", label: "Project Details", icon: FileText },
  { href: "/dashboard/student/submit-idea", label: "Submit Idea", icon: Lightbulb },
  { href: "/dashboard/student/code-access", label: "Code & Project Access", icon: Code2 },
  { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/student/shared-projects", label: "Shared Projects", icon: Share2 },
  { href: "/dashboard/student/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/dashboard/student/profile", label: "My Profile", icon: User },
];

const pageTitles: Record<string, string> = {
  "/dashboard/student": "Student Dashboard",
  "/dashboard/student/projects": "My Projects",
  "/dashboard/student/project-details": "Project Details",
  "/dashboard/student/submit-idea": "Submit Idea",
  "/dashboard/student/code-access": "Code & Project Access",
  "/dashboard/student/leaderboard": "Leaderboard",
  "/dashboard/student/shared-projects": "Shared Projects",
  "/dashboard/student/feedback": "Feedback",
  "/dashboard/student/profile": "My Profile",
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const currentTitle = pageTitles[pathname] ?? "Student Portal";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

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
        {/* Simple Institutional Text Brand Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-[#1a385c] bg-[#0c2038]">
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-white leading-tight">
              FXEC MSME Hub
            </span>
            <span className="text-[11px] font-medium text-slate-400 leading-tight">
              Student Portal
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
            Navigation
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

        {/* Institutional Student Profile Footer */}
        <div className="p-3 border-t border-[#1a385c] bg-[#0c2038]">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md">
            <Avatar className="size-8 rounded-md shrink-0 bg-slate-700">
              <AvatarFallback className="bg-slate-700 text-slate-100 text-xs font-semibold rounded-md">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name ?? "Student"}
              </p>
              <div className="mt-0.5">
                <CopyIdBadge id={(user as any)?.uniqueId || "STU0001"} size="xs" className="bg-[#1a385c] border-[#254d7e] text-slate-200" />
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 z-10">
          <button
            className="text-slate-600 hover:text-slate-900 p-1 rounded transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Page Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate tracking-tight">
              {currentTitle}
            </h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="relative p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-4.5" />
              <span className="absolute top-1.5 right-1.5 size-1.5 bg-blue-600 rounded-full" />
            </button>

            <div className="h-4 w-px bg-slate-200" />

            {/* Redesigned Institutional Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 border border-slate-200/90 bg-white/95 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-[0.98] cursor-pointer text-left shadow-2xs" />
                }
              >
                <div className="relative">
                  <Avatar className="size-7.5 rounded-lg bg-[#0f2744] text-white">
                    <AvatarFallback className="bg-[#0f2744] text-white text-xs font-semibold rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name?.split(" ")[0] ?? "Student"}
                    </span>
                    <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-200/60">
                      Student
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight font-mono mt-0.5">
                    22CSB041
                  </span>
                </div>
                <ChevronRight className="size-3.5 text-slate-400 rotate-90 hidden sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-68 p-1.5">
                {/* User Identity Header Card */}
                <div className="px-3.5 py-2.5 bg-slate-50/80 rounded-xl mb-1 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name ?? "Mohamed Farhan A"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                    {user?.email ?? "mohamed.farhan@francisxavier.ac.in"}
                  </p>
                  <div className="flex items-center justify-between gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-800">
                      B.E. CSE
                    </span>
                    <CopyIdBadge id={(user as any)?.uniqueId || "STU0001"} size="xs" />
                  </div>
                </div>

                {/* Navigation Links */}
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/student/profile")}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="size-4 text-slate-500" />
                    <span>My Profile</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">22CSB041</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/student/projects")}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderKanban className="size-4 text-slate-500" />
                    <span>My Projects</span>
                  </div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    2 Active
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/student/submit-idea")}
                  className="flex items-center gap-2.5"
                >
                  <Lightbulb className="size-4 text-slate-500" />
                  <span>Submit Idea</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Institutional Tag */}
                <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="truncate">SSO: francisxavier.ac.in</span>
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                </div>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign Out Confirmation Dialog */}
            <ConfirmationDialog
              open={showSignOutConfirm}
              onOpenChange={setShowSignOutConfirm}
              title="Sign Out of FXEC MSME Hub"
              description="Are you sure you want to sign out of your institutional student portal? You will need to re-authenticate with your Google Workspace SSO credentials to access your projects."
              confirmText="Sign Out"
              cancelText="Stay Signed In"
              variant="destructive"
              isLoading={isSigningOut}
              onConfirm={handleSignOut}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
          <div key={pathname} className="w-full max-w-6xl mx-auto animate-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
