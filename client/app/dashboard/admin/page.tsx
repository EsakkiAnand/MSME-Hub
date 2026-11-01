"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  GitBranch,
  Star,
  Settings2,
  Edit2,
  Check,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ManagedCompany {
  id: string;
  name: string;
  companyId: string;
  prefix: string;
  domain: string;
  udyam: string;
}

const initialCompanies: ManagedCompany[] = [
  {
    id: "COMP-001",
    name: "Hexaware Technology",
    companyId: "HTMP001",
    prefix: "HTMP",
    domain: "Software & Cloud Services",
    udyam: "UDYAM-TN-26-0012948",
  },
  {
    id: "COMP-002",
    name: "Nellai Precision Engineering Ltd.",
    companyId: "NPE001",
    prefix: "NPE",
    domain: "Manufacturing & Heavy Engineering",
    udyam: "UDYAM-TN-26-0048123",
  },
];

export default function AdminDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const adminId = (user as any)?.uniqueId || "ADM0001";

  const [companies, setCompanies] = useState<ManagedCompany[]>(initialCompanies);
  const [editingCompany, setEditingCompany] = useState<ManagedCompany | null>(null);
  const [newPrefixInput, setNewPrefixInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenEdit = (comp: ManagedCompany) => {
    setEditingCompany(comp);
    setNewPrefixInput(comp.prefix);
  };

  const handlePreSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrefixInput.trim() || newPrefixInput.trim().length < 2) {
      toast.error("Prefix must be at least 2 alphanumeric characters.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    if (!editingCompany) return;
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 600));
      const cleanPrefix = newPrefixInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
      const updatedId = `${cleanPrefix}001`;

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id
            ? { ...c, prefix: cleanPrefix, companyId: updatedId }
            : c
        )
      );

      toast.success(
        `Company prefix updated to "${cleanPrefix}". New ID: ${updatedId}`
      );
      setEditingCompany(null);
    } catch {
      toast.error("Failed to update company prefix.");
    } finally {
      setIsProcessing(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Institutional Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground">
              MSME Ecosystem Administration
            </h1>
            <CopyIdBadge id={adminId} label="Admin ID" size="xs" />
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] dark:bg-[#FF453A]/15 dark:text-[#FF453A] border-transparent">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mt-0.5">
            Welcome, {user?.name || "Administrator"}. Manage industry approvals, configure company unique prefixes, and govern MSME project deliverables.
          </p>
        </div>
      </div>

      {/* Standardized Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between h-full transition-all duration-150">
          <div className="flex items-center justify-between text-muted-foreground dark:text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending MSMEs</span>
            <Building2 className="size-4 text-[#007AFF] dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-foreground dark:text-foreground">0</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
            Industry registrations needing verification
          </p>
        </div>

        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between h-full transition-all duration-150">
          <div className="flex items-center justify-between text-muted-foreground dark:text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Solution Gate</span>
            <GitBranch className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-foreground dark:text-foreground">0</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
            GitHub solutions submitted for admin sign-off
          </p>
        </div>

        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between h-full transition-all duration-150">
          <div className="flex items-center justify-between text-muted-foreground dark:text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Rating Moderation</span>
            <Star className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground dark:text-foreground">0</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
            Ratings &le; 2 stars queued for mediation
          </p>
        </div>

        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between h-full transition-all duration-150">
          <div className="flex items-center justify-between text-muted-foreground dark:text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>System Health</span>
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Optimal</div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
            Atomic unique ID sequences active
          </p>
        </div>
      </div>

      {/* Company Unique ID & Prefix Configuration Management Console */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden shadow-xs">
        <div className="p-5 sm:px-6 border-b border-black/[0.06] dark:border-white/[0.08] dark:border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Settings2 className="size-4 text-[#007AFF]" />
              <h2 className="text-base font-semibold text-foreground dark:text-foreground">
                Company Unique ID &amp; Prefix Registry
              </h2>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
              Permanent unique IDs generated for registered companies. Administrators may configure or correct company prefixes when necessary while preserving database uniqueness constraints.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-slate-100 dark:bg-muted px-2.5 py-1 rounded-md self-start sm:self-auto">
            Prefixes &middot; Concurrency-Safe
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] dark:bg-muted/40 border-b border-black/[0.06] dark:border-white/[0.08] dark:border-border text-muted-foreground dark:text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3">Company &amp; Industry</th>
                <th className="px-4 sm:px-6 py-3">Udyam Registration</th>
                <th className="px-4 sm:px-6 py-3">Assigned Unique ID</th>
                <th className="px-4 sm:px-6 py-3">Current Prefix</th>
                <th className="px-4 sm:px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06] dark:divide-border/60">
              {companies.map((comp) => (
                <tr key={comp.id} className="hover:bg-black/[0.02] dark:bg-white/[0.03]/70 dark:hover:bg-muted/30 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-foreground dark:text-foreground">
                    <div>{comp.name}</div>
                    <div className="text-[11px] text-muted-foreground font-normal">{comp.domain}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 font-mono text-muted-foreground dark:text-muted-foreground">
                    {comp.udyam}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <CopyIdBadge id={comp.companyId} label="Company ID" size="xs" />
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#007AFF] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 text-[11px]">
                      {comp.prefix}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleOpenEdit(comp)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] dark:border-border hover:bg-black/[0.02] dark:bg-white/[0.03] dark:hover:bg-muted text-foreground dark:text-foreground transition-all duration-150 cursor-pointer active:scale-[0.98]">
                      <Edit2 className="size-3 text-muted-foreground" />
                      <span>Configure Prefix</span>
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                    No registered companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Company Prefix Accessible Dialog */}
      <Dialog open={!!editingCompany} onOpenChange={(open) => !open && setEditingCompany(null)}>
        {editingCompany && (
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground dark:text-foreground">
                Configure Company Prefix
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground dark:text-muted-foreground">
                Update the prefix for <strong>{editingCompany.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePreSave} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-muted-foreground mb-1.5">
                  Custom Unique Prefix (2 to 5 Letters)
                </label>
                <input
                  type="text"
                  value={newPrefixInput}
                  onChange={(e) => setNewPrefixInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HTMP, NPE, ATM"
                  className="w-full text-xs font-mono font-bold border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-lg p-2.5 text-foreground dark:text-foreground bg-white dark:bg-background uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Example: <strong className="text-foreground dark:text-slate-300">HTMP</strong> yields unique ID <strong className="font-mono text-foreground dark:text-slate-300">HTMP001</strong>.
                </p>
              </div>

              <DialogFooter className="mt-4">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="px-4 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] dark:border-border text-foreground dark:text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03] dark:hover:bg-muted text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium text-xs shadow-xs transition-all active:scale-[0.98]"
                >
                  Apply Prefix
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* iOS-Inspired Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Company Prefix Update"
        description={`Do you want to apply the prefix "${newPrefixInput}" to ${editingCompany?.name}? This will allocate a new unique ID while maintaining database uniqueness.`}
        itemName={editingCompany?.name}
        confirmText="Confirm Prefix"
        variant="update"
        isLoading={isProcessing}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  );
}
