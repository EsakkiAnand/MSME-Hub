"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  HelpCircle,
  FolderKanban,
  History,
  User,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Award,
  CheckCircle2,
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
  { href: "/dashboard/alumni", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/alumni/guidance", label: "Guidance Requests", icon: HelpCircle },
  { href: "/dashboard/alumni/projects", label: "Mentored Projects", icon: FolderKanban },
  { href: "/dashboard/alumni/history", label: "Guidance History", icon: History },
  { href: "/dashboard/alumni/profile", label: "My Profile", icon: User },
];

const pageTitles: Record<string, string> = {
  "/dashboard/alumni": "Alumni Mentor Workspace",
  "/dashboard/alumni/guidance": "Student Guidance Requests",
  "/dashboard/alumni/projects": "Mentored Projects & Tech Reviews",
  "/dashboard/alumni/history": "Guidance Activity & Endorsements",
  "/dashboard/alumni/profile": "Alumni Profile & Expertise",
};

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const currentTitle = pageTitles[pathname] ?? "Alumni Mentor Portal";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AL";

  const alumniUniqueId = (user as any)?.uniqueId || "ALU0001";

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
        {/* Institutional Brand Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-[#1a385c] bg-[#0c2038]">
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold tracking-tight text-white leading-tight">
              FXEC MSME Hub
            </span>
            <span className="text-[11px] font-medium text-amber-400 leading-tight flex items-center gap-1">
              <Award className="size-3 text-amber-400" />
              Alumni Mentor Portal
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

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Mentorship Portal
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

        {/* Alumni Profile Footer with CopyIdBadge */}
        <div className="p-3 border-t border-[#1a385c] bg-[#0c2038]">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md">
            <Avatar className="size-8 rounded-md shrink-0 bg-amber-600/30 text-amber-300 border border-amber-500/30">
              <AvatarFallback className="bg-amber-600/30 text-amber-300 text-xs font-semibold rounded-md">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name ?? "Alumni Mentor"}
              </p>
              <div className="mt-0.5">
                <CopyIdBadge id={alumniUniqueId} label="Alumni ID" size="xs" />
              </div>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#1a385c] rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-slate-900 truncate">
                {currentTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Verified Mentor
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => toast.info("No unread mentorship notifications.")}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 bg-[#1d4ed8] rounded-full" />
            </button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 transition-colors">
                  <Avatar className="size-7 rounded-md bg-amber-500/20 text-amber-700">
                    <AvatarFallback className="text-[11px] font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || "Alumni Mentor"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <CopyIdBadge id={alumniUniqueId} size="xs" />
                </div>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/alumni/profile")}
                  className="cursor-pointer text-xs flex items-center gap-2 py-2"
                >
                  <User className="size-3.5 text-slate-500" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/alumni/history")}
                  className="cursor-pointer text-xs flex items-center gap-2 py-2"
                >
                  <History className="size-3.5 text-slate-500" />
                  <span>Guidance History</span>
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

        {/* Scrollable Page View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-page-enter">
          {children}
        </main>
      </div>

      {/* Reusable Confirmation Dialog for Sign Out */}
      <ConfirmationDialog
        open={showSignOutConfirm}
        onOpenChange={setShowSignOutConfirm}
        title="Sign Out of MSME Hub"
        description="Are you sure you want to end your alumni mentoring session?"
        confirmText={isSigningOut ? "Signing Out..." : "Sign Out"}
        cancelText="Stay Signed In"
        variant="destructive"
        onConfirm={handleSignOut}
      />
    </div>
  );
}
