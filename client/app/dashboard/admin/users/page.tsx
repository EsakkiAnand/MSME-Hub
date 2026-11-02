"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  Eye,
  RotateCcw,
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
import { initialPlatformUsers, PlatformUserItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const roleConfig: Record<
  PlatformUserItem["role"],
  { label: string; badgeClass: string; icon: React.ElementType }
> = {
  MSME_ADMIN: {
    label: "MSME Admin",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    icon: ShieldCheck,
  },
  STAFF: {
    label: "Faculty Supervisor",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    icon: BookOpen,
  },
  STUDENT: {
    label: "Student Scholar",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    icon: GraduationCap,
  },
  INDUSTRY: {
    label: "Industry Partner",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50",
    icon: Building2,
  },
  ALUMNI: {
    label: "Alumni Mentor",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
    icon: Award,
  },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUserItem[]>(initialPlatformUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<PlatformUserItem | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.departmentOrCompany.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              User Directory &amp; RBAC Governance
            </h1>
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
              5-Role Registry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Central repository of all platform accounts across Students, Faculty, Industry Partners, Alumni Mentors, and Administrators.
          </p>
        </div>
      </div>

      {/* ── Role Counts Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["STUDENT", "STAFF", "INDUSTRY", "ALUMNI", "MSME_ADMIN"] as const).map(
          (roleKey) => {
            const count = users.filter((u) => u.role === roleKey).length;
            const meta = roleConfig[roleKey];
            const Icon = meta.icon;
            return (
              <div
                key={roleKey}
                onClick={() => setRoleFilter(roleFilter === roleKey ? "ALL" : roleKey)}
                className={cn(
                  "rounded-[14px] border p-4 flex flex-col justify-between cursor-pointer transition-all duration-150 active:scale-[0.98]",
                  roleFilter === roleKey
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs"
                    : "border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] hover:border-black/[0.12]"
                )}
              >
                <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="truncate">{meta.label}</span>
                  <Icon className="size-4 shrink-0" />
                </div>
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {roleFilter === roleKey ? "Filtering active" : "Click to filter"}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, permanent unique ID (STU, FAC, IND, ALU, ADM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="STUDENT">Students</option>
            <option value="STAFF">Faculty / Staff</option>
            <option value="INDUSTRY">Industry Partners</option>
            <option value="ALUMNI">Alumni Mentors</option>
            <option value="MSME_ADMIN">MSME Administrators</option>
          </select>

          {(searchQuery || roleFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("ALL");
              }}
              className="h-9 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-lg hover:bg-black/[0.04] transition-colors"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── User Table ───────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-4 py-3.5">Permanent Unique ID</th>
                <th className="px-4 py-3.5">Assigned Role</th>
                <th className="px-4 py-3.5">Department / Organization</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredUsers.map((user) => {
                const roleMeta = roleConfig[user.role];
                const RoleIcon = roleMeta.icon;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground text-xs">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {user.email}
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <CopyIdBadge id={user.uniqueId} size="xs" />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                          roleMeta.badgeClass
                        )}
                      >
                        <RoleIcon className="size-3" />
                        <span>{roleMeta.label}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground">
                      {user.departmentOrCompany}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="size-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          <XCircle className="size-3.5" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                      >
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span>View User</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── User Detail Dialog ───────────────────────────────────────── */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        {selectedUser && (
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={selectedUser.uniqueId} size="xs" />
                <span className="text-xs text-muted-foreground">
                  Joined: {selectedUser.joinedDate}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                {selectedUser.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedUser.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-black/[0.04]">
                <span className="text-muted-foreground">Platform Role</span>
                <span className="font-semibold text-foreground">{selectedUser.role}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-black/[0.04]">
                <span className="text-muted-foreground">Affiliation / Entity</span>
                <span className="font-semibold text-foreground">{selectedUser.departmentOrCompany}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-black/[0.04]">
                <span className="text-muted-foreground">Verification State</span>
                <span className="font-semibold text-emerald-600">
                  {selectedUser.isVerified ? "Authorized & Active" : "Pending Verification"}
                </span>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-medium hover:opacity-90"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

