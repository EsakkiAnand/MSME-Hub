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
  {
    id: "COMP-003",
    name: "Apex Tex Machineries",
    companyId: "ATM001",
    prefix: "ATM",
    domain: "Textiles & Automated Looms",
    udyam: "UDYAM-TN-26-0091824",
  },
  {
    id: "COMP-004",
    name: "Vagai Cottage Crafts Collective",
    companyId: "VCC001",
    prefix: "VCC",
    domain: "Artisanal & Brassware Crafts",
    udyam: "UDYAM-TN-26-0034567",
  },
  {
    id: "COMP-005",
    name: "South Star Logistics",
    companyId: "SSL001",
    prefix: "SSL",
    domain: "Supply Chain & Road Transport",
    udyam: "UDYAM-TN-26-0078912",
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">MSME Ecosystem Administration</h1>
            <CopyIdBadge id={adminId} label="Admin ID" />
            <Badge variant="outline" className="text-rose-600 border-rose-500/30 bg-rose-500/10">
              Super Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name || "Administrator"}. Manage industry approvals, configure company unique prefixes, and govern MSME project deliverables.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Pending MSMEs</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Building2 className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Industry registrations needing verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Solution Gate</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <GitBranch className="size-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">GitHub solutions submitted for admin sign-off</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Rating Moderation</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Star className="size-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ratings &le; 2 stars queued for mediation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">System Health</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span className="text-emerald-500 text-xl font-bold">Optimal</span>
              <ShieldCheck className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Atomic unique ID sequences active</p>
          </CardContent>
        </Card>
      </div>

      {/* Company Unique ID & Prefix Configuration Management Console */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4 text-blue-600" />
              <CardTitle className="text-base font-semibold">
                Company Unique ID &amp; Prefix Registry
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Prefixes &middot; Concurrency-Safe
            </span>
          </div>
          <CardDescription className="text-xs mt-1">
            Permanent unique IDs generated for registered companies. Administrators may configure or correct company prefixes when necessary while preserving database uniqueness constraints.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Company Name</th>
                  <th className="px-3 py-3">Udyam Reg No</th>
                  <th className="px-3 py-3">Prefix</th>
                  <th className="px-4 py-3">Company Unique ID</th>
                  <th className="px-3 py-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      <div>{comp.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{comp.domain}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-600">{comp.udyam}</td>
                    <td className="px-3 py-3">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        {comp.prefix}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CopyIdBadge id={comp.companyId} label="Company ID" />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(comp)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Edit2 className="size-3 text-slate-500" />
                        <span>Configure Prefix</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Company Prefix Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">
                Configure Company Prefix
              </h3>
              <button
                onClick={() => setEditingCompany(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            <div>
              <p className="text-slate-500 mb-1">Company Name</p>
              <p className="font-semibold text-slate-900 text-sm">{editingCompany.name}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Custom Unique Prefix (2 to 5 Letters)
              </label>
              <input
                type="text"
                value={newPrefixInput}
                onChange={(e) => setNewPrefixInput(e.target.value.toUpperCase())}
                placeholder="e.g. HTMP, NPE, ATM"
                className="w-full text-xs font-mono font-bold border border-slate-200 rounded-md p-2.5 text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Example: <strong className="text-slate-700">HTMP</strong> for Hexaware Technology yields <strong className="font-mono text-slate-700">HTMP001</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCompany(null)}
                className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePreSave}
                className="px-4 py-1.5 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white font-semibold shadow-xs"
              >
                Apply Prefix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm Company Prefix Correction"
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
