"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User as UserIcon, LogOut, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface SidebarProfileCardProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    uniqueId?: string;
  } | null;
  role: string;
  userUniqueId: string;
  profileHref?: string;
  onSignOutClick: () => void;
  className?: string;
}

export function SidebarProfileCard({
  user,
  role,
  userUniqueId,
  profileHref,
  onSignOutClick,
  className,
}: SidebarProfileCardProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  // Derive 2-letter uppercase initials
  const initials = React.useMemo(() => {
    if (!user?.name) return role.slice(0, 2).toUpperCase();
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user?.name, role]);

  // Clean role display label: e.g. Student, Faculty, Industry, Alumni, Admin
  const formattedRole = React.useMemo(() => {
    const rawRole = (user as any)?.role || role;
    if (!rawRole) return "Member";
    const up = rawRole.toUpperCase();
    if (up.includes("STUDENT")) return "Student";
    if (up.includes("FACULTY") || up.includes("STAFF")) return "Faculty";
    if (up.includes("INDUSTRY")) return "Industry";
    if (up.includes("ALUMNI")) return "Alumni";
    if (up.includes("ADMIN")) return "Admin";
    return rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
  }, [user, role]);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userUniqueId) return;
    navigator.clipboard.writeText(userUniqueId);
    setCopied(true);
    toast.success(`Copied ID: ${userUniqueId}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("p-3 border-t border-black/[0.06] dark:border-white/[0.08] shrink-0", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group relative flex w-full items-center justify-between gap-2.5 px-3 py-2.5 rounded-[12px]",
            "bg-black/[0.025] hover:bg-black/[0.05] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
            "border border-black/[0.05] hover:border-black/[0.08] dark:border-white/[0.06] dark:hover:border-white/[0.1]",
            "transition-all duration-150 outline-none select-none text-left active:scale-[0.99] cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-[#007AFF]/30"
          )}
          aria-label="Open user profile menu"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* iOS Avatar */}
            <Avatar className="size-8.5 rounded-[10px] shrink-0 bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF] border border-black/[0.06] dark:border-white/[0.08]">
              <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
              <AvatarFallback className="bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF] text-xs font-semibold rounded-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* User Name & Subtle Secondary: Student · STU0003 */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate tracking-tight leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-normal flex items-center gap-1.5 leading-none">
                <span>{formattedRole}</span>
                <span className="text-muted-foreground/40 text-[9px]">·</span>
                <span className="font-mono text-[10.5px] text-muted-foreground/90">{userUniqueId}</span>
              </p>
            </div>
          </div>

          {/* iOS Action Dots [⋯] */}
          <div className="shrink-0 p-1 text-muted-foreground/60 group-hover:text-foreground transition-colors rounded-[6px]">
            <MoreHorizontal className="size-4" />
          </div>
        </DropdownMenuTrigger>

        {/* iOS Native Popover Action Menu */}
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-56 p-1.5 rounded-[16px] border border-black/[0.08] dark:border-white/[0.1] bg-white/98 dark:bg-[#1C1C1E]/98 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] z-50 animate-in fade-in-0 zoom-in-95"
        >
          {/* Header detail */}
          <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-xs font-semibold text-foreground truncate leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5 font-normal">
              {user?.email || "institutional.user@fxec.ac.in"}
            </p>
          </div>

          <div className="p-1 space-y-0.5">
            {/* View Profile */}
            {profileHref && (
              <DropdownMenuItem
                onClick={() => router.push(profileHref)}
                className="cursor-pointer text-xs rounded-[10px] flex items-center gap-2 py-2 text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <UserIcon className="size-3.5 text-muted-foreground" />
                <span>View Profile</span>
              </DropdownMenuItem>
            )}

            {/* Copy Unique ID */}
            <DropdownMenuItem
              onClick={handleCopyId}
              className="cursor-pointer text-xs rounded-[10px] flex items-center justify-between py-2 text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2">
                {copied ? (
                  <Check className="size-3.5 text-[#34C759]" />
                ) : (
                  <Copy className="size-3.5 text-muted-foreground" />
                )}
                <span>Copy ID ({userUniqueId})</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="-mx-1 my-1 h-[0.5px] bg-black/[0.06] dark:border-white/[0.08]" />

            {/* Log Out */}
            <DropdownMenuItem
              onClick={onSignOutClick}
              className="cursor-pointer text-xs rounded-[10px] text-[#FF3B30] dark:text-[#FF453A] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 py-2 font-medium"
            >
              <LogOut className="size-3.5" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
