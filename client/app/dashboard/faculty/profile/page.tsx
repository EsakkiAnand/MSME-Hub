"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  User,
  BadgeCheck,
  Building,
  School,
  Edit2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import { getFacultyProfileAction, updateFacultyProfileAction } from "@/app/actions/staff";

export default function FacultyProfilePage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ cabin: "", phone: "", officeHours: "", researchDomains: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await getFacultyProfileAction();
      if (res.success) {
        setProfileData((res as any).faculty);
        setEditForm({
          cabin: (res as any).faculty.cabin || "",
          phone: (res as any).faculty.phone || "",
          officeHours: (res as any).faculty.officeHours || "",
          researchDomains: (res as any).faculty.researchDomains || "",
        });
      } else {
        toast.error(res.error || "Failed to load faculty profile.");
      }
      setLoading(false);
    };
    load();
  }, []);

  const displayName = user?.name || profileData?.name || "Faculty";
  const displayEmail = user?.email || profileData?.email || "";

  const profilePhoto = user?.image || (profileData as any)?.image || null;
  const cleanName = displayName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "").trim();
  const nameParts = cleanName.split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || displayName[0] || "F").toUpperCase();

  const handleOpenEdit = () => {
    setEditForm({
      cabin: profileData?.cabin || "",
      phone: profileData?.phone || "",
      officeHours: profileData?.officeHours || "",
      researchDomains: profileData?.researchDomains || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.cabin.trim()) {
      toast.error("Cabin location cannot be empty.");
      return;
    }
    if (!editForm.phone.trim()) {
      toast.error("Contact phone/intercom cannot be empty.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      const res: any = await updateFacultyProfileAction(editForm);
      if (res.success) {
        setProfileData((prev: any) => ({ ...prev, ...editForm }));
        setIsEditing(false);
        setShowConfirm(false);
        toast.success(res.message || "Faculty contact & office details updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading faculty profile...</span>
      </div>
    );
  }

  const pd = profileData || {};
  const title =
    displayName.includes("Dr.") || displayName.includes("Prof.")
      ? `${displayName}, Ph.D.`
      : `Prof. ${displayName}`;

  return (
    <div className="space-y-6">
      {/* 1. Profile Header */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-14 sm:size-16 rounded-full shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center select-none">
              {profilePhoto ? (
                <img src={profilePhoto} alt={displayName} className="size-full object-cover" />
              ) : (
                <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground truncate">
                  {title}
                </h1>
                <CopyIdBadge id={pd.uniqueId || pd.facultyId || "STAFF"} label="ID" />
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759]">
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                  Verified Faculty
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 break-all">
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">{pd.department || "Faculty"}</div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
            <span>
              Faculty ID: <strong className="font-semibold text-foreground">{pd.uniqueId || pd.facultyId || "—"}</strong>
            </span>
            <span>
              Projects Supervised: <strong className="font-semibold text-foreground">{pd.supervisedProjectsCount || 0}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Contact & Office Details Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Contact &amp; Office Details</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-xs font-medium text-foreground transition-all active:scale-[0.98] cursor-pointer"
            >
              <Edit2 className="size-3.5 text-muted-foreground" />
              <span>Update</span>
            </button>
          )}
        </div>
        <div className="p-6 divide-y divide-black/[0.05] dark:divide-white/[0.06] text-xs">
          {[
            { label: "Cabin / Office Location", value: pd.cabin || "—" },
            { label: "Contact Phone / Intercom", value: pd.phone || "—" },
            { label: "Office Hours", value: pd.officeHours || "—" },
            { label: "Research Domains", value: pd.researchDomains || "—" },
          ].map((row) => (
            <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
              <span className="text-foreground font-semibold text-right break-words">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancelEdit()}>
        {isEditing && (
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Update Faculty Profile</DialogTitle>
              <DialogDescription className="text-xs">Update contact & office details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
              {[
                { label: "Cabin / Office Location", key: "cabin" },
                { label: "Contact Phone / Intercom", key: "phone" },
                { label: "Office Hours", key: "officeHours" },
                { label: "Research Domains", key: "researchDomains" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={(editForm as any)[field.key]}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                  />
                </div>
              ))}
              <DialogFooter className="mt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-background hover:bg-black/[0.02] text-xs font-medium text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[12px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-xs font-semibold text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  Save Changes
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Save Profile Changes"
        description="Do you want to save your faculty contact and office details?"
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="update"
        isLoading={isSaving}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
