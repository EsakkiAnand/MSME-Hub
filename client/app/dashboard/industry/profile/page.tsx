"use client";

import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Globe,
  FileText,
  Save,
  CheckCircle2,
  ExternalLink,
  Layers,
  Calendar,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { IOSSelect } from "@/components/ui/ios-select";
import { updateIndustryCompanyProfileAction } from "@/app/actions/industry";

export default function IndustryProfilePage() {
  // Conforms strictly to Prisma IndustryProfile + User
  const [companyName, setCompanyName] = useState("Hexaware Technology MSME Partner");
  const [companyId] = useState("HTMP001");
  const [partnerUserId] = useState("IND0001");
  const [udyamRegNo] = useState("UDYAM-TN-28-0019284");
  const [domain, setDomain] = useState("Software & Cloud");
  const [websiteUrl, setWebsiteUrl] = useState("https://hexaware.com");
  const [representativeName] = useState("K. Ramanathan");
  const [representativeEmail] = useState("industry@hexaware.com");
  const [isVerified] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const domains = [
    "Software & Cloud",
    "IoT & Analytics",
    "FinTech & Web",
    "Manufacturing & AI",
    "Renewable Energy & Embedded",
    "Automotive & Robotics",
    "Biotech & AgriTech",
  ];

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateIndustryCompanyProfileAction({
        companyName: companyName.trim(),
        websiteUrl: websiteUrl.trim(),
        domain,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch {
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Company & Partner Profile
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Verified MSME
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your organization identification, Udyam compliance credentials, and partnership details.
          </p>
        </div>
      </div>

      {/* Identifiers & Verification Overview Card */}
      <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-[16px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 ring-4 ring-black/[0.04] dark:ring-white/[0.06]">
            {companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{companyName}</h2>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Udyam Validated
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
              <span>Primary Sector: <strong className="text-foreground">{domain}</strong></span>
              <span>&bull;</span>
              <span>Registered in MSME Hub since October 2026</span>
            </p>
          </div>
        </div>

        {/* Dual ID Grid - Mandatory Distinction between Company ID and Industry User ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="rounded-lg bg-black/[0.02] dark:bg-white/[0.03] p-3.5 border border-black/[0.06] dark:border-white/[0.08]/80">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Company Organization ID</span>
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <CopyIdBadge id={companyId} label="CMP" />
            <span className="text-[10px] text-muted-foreground block mt-1.5">
              Unique MSME enterprise identifier
            </span>
          </div>

          <div className="rounded-lg bg-black/[0.02] dark:bg-white/[0.03] p-3.5 border border-black/[0.06] dark:border-white/[0.08]/80">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Partner User ID</span>
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <CopyIdBadge id={partnerUserId} label="IND" />
            <span className="text-[10px] text-muted-foreground block mt-1.5">
              Authorized representative account ID
            </span>
          </div>

          <div className="rounded-lg bg-black/[0.02] dark:bg-white/[0.03] p-3.5 border border-black/[0.06] dark:border-white/[0.08]/80 sm:col-span-2 md:col-span-1">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Udyam Reg. Number</span>
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <code className="text-xs font-mono font-bold text-foreground bg-white px-2 py-1 rounded border border-black/[0.06] dark:border-white/[0.08] inline-block">
              {udyamRegNo}
            </code>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1.5">
              &bull; Ministry of MSME Verified
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white p-6 shadow-xs">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Organization Details & Public Visibility
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          These details appear on your problem statements and student project briefs.
        </p>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Official Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Primary Industrial Vertical / Domain *
              </label>
              <IOSSelect
                value={domain}
                onChange={setDomain}
                options={domains}
                placeholder="Select industrial vertical / domain..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Official Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm text-foreground focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <Globe className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Udyam Registration Number (Immutable)
              </label>
              <input
                type="text"
                disabled
                value={udyamRegNo}
                className="w-full rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-slate-100 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Authorized Representative Section */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Authorized Representative
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Representative Name
                </label>
                <input
                  type="text"
                  disabled
                  value={representativeName}
                  className="w-full rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-slate-100 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={representativeEmail}
                  className="w-full rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-slate-100 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1e40af] active:scale-[0.98] transition-all transition-colors disabled:opacity-50 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving Changes..." : "Save Profile Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
