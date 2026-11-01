"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  User,
  BadgeCheck,
  Building,
  School,
  Edit2,
  ExternalLink,
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

export default function FacultyProfilePage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  const displayName = user?.name ?? "Dr. Selvaraj M";
  const displayEmail = user?.email ?? "selvaraj.cse@francisxavier.ac.in";

  // Avatar resolution:
  // 1. Existing profile photo if available
  // 2. Simple clean initials from faculty name
  // 3. Neutral fallback icon
  const profilePhoto = (user as any)?.image || (user as any)?.avatarUrl || null;

  const cleanName = displayName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "").trim();
  const nameParts = cleanName.split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || displayName[0] || "F").toUpperCase();

  // Faculty profile state
  const [profileData, setProfileData] = useState({
    facultyId: (user as any)?.uniqueId || "FAC0001",
    title: displayName.includes("Dr.") || displayName.includes("Prof.") ? `${displayName}, Ph.D.` : `Prof. ${displayName}`,
    designation: "Associate Professor & Project Director",
    employeeId: "FXEC-FAC-1048",
    department: (user as any)?.department || "Computer Science & Engineering",
    institution: "Francis Xavier Engineering College (Autonomous)",
    cabin: "Academic Block 2, Room 304",
    phone: "+91 94421 87654",
    officeHours: "Mon – Thu (2:30 PM – 4:30 PM)",
    advisorBatch: "B.E. CSE 2023–2027 (Section B)",
    researchDomains: "Edge AI, Industrial IoT, Micro-Services Architecture",
    googleScholar: "https://scholar.google.com/citations?user=selvaraj-fxec",
  });

  // Modal edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    cabin: profileData.cabin,
    phone: profileData.phone,
    officeHours: profileData.officeHours,
    researchDomains: profileData.researchDomains,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = () => {
    setEditForm({
      cabin: profileData.cabin,
      phone: profileData.phone,
      officeHours: profileData.officeHours,
      researchDomains: profileData.researchDomains,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({
      cabin: profileData.cabin,
      phone: profileData.phone,
      officeHours: profileData.officeHours,
      researchDomains: profileData.researchDomains,
    });
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
      await new Promise((r) => setTimeout(r, 600));
      setProfileData((prev) => ({
        ...prev,
        cabin: editForm.cabin.trim(),
        phone: editForm.phone.trim(),
        officeHours: editForm.officeHours.trim(),
        researchDomains: editForm.researchDomains.trim(),
      }));
      setIsEditing(false);
      setShowConfirm(false);
      toast.success("Faculty contact & office details updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. Profile Header — Compact iOS Account Interface */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Restrained Native Avatar */}
            <div className="relative size-14 sm:size-16 rounded-full shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center select-none">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={displayName}
                  className="size-full object-cover"
                />
              ) : initials ? (
                <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                  {initials}
                </span>
              ) : (
                <User className="size-6 text-muted-foreground" />
              )}
            </div>

            {/* Identity Hierarchy */}
            <div className="min-w-0 flex-1">
              {/* Primary Heading */}
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground truncate">
                {profileData.title}
              </h1>

              {/* Secondary Metadata: ID Badge & Verification */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <CopyIdBadge id={profileData.facultyId} label="Faculty ID" size="xs" />
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                  <BadgeCheck className="size-3 shrink-0" />
                  <span>Verified Faculty</span>
                </span>
              </div>

              {/* Supporting Info: Compact & Unrepeated */}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {profileData.designation} · {profileData.department}
              </p>
            </div>
          </div>

          {/* Edit Contact Details Action Button */}
          <div className="sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Edit2 className="size-3.5" />
              <span>Edit Contact Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Structured Profile Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Institutional Affiliation */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <School className="size-4 text-[#007AFF] shrink-0" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Institutional Affiliation
              </h2>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.08] px-2 py-0.5 rounded-[6px]">
              {profileData.employeeId}
            </span>
          </div>

          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05] text-xs">
            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Institution
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.institution}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Department
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.department}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Designation &amp; Role
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.designation}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Faculty Advisor Cohort
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.advisorBatch}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Research &amp; Domain
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.researchDomains}
              </span>
            </div>
          </div>
        </div>

        {/* Campus Office & Availability */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building className="size-4 text-[#007AFF] shrink-0" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Campus Office &amp; Availability
              </h2>
            </div>
          </div>

          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.05] text-xs">
            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Cabin Location
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.cabin}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Official Email
              </span>
              <a
                href={`mailto:${displayEmail}`}
                className="font-mono font-medium text-[#007AFF] hover:underline text-left sm:text-right flex-1 break-all"
              >
                {displayEmail}
              </a>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Intercom / Mobile
              </span>
              <span className="font-mono font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.phone}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Consultation Hours
              </span>
              <span className="font-medium text-foreground text-left sm:text-right flex-1 break-words">
                {profileData.officeHours}
              </span>
            </div>

            <div className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
              <span className="text-muted-foreground shrink-0 sm:w-36 font-normal">
                Research Profile
              </span>
              <a
                href={profileData.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#007AFF] hover:underline text-left sm:text-right flex-1 justify-start sm:justify-end"
              >
                <span>Google Scholar</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Refined iOS-Inspired Edit Contact Modal */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-[500px] p-6 rounded-[20px] bg-white dark:bg-[#1C1C1E] border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.18)] outline-none">
          <DialogHeader className="pb-2 border-b border-black/[0.05] dark:border-white/[0.06]">
            <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
              Edit Contact Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Synchronized with the campus directory and student consultation schedule.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-3">
            <div>
              <label
                htmlFor="cabin-input"
                className="block text-xs font-medium text-foreground tracking-tight mb-1.5"
              >
                Cabin Location
              </label>
              <input
                id="cabin-input"
                type="text"
                value={editForm.cabin}
                onChange={(e) => setEditForm({ ...editForm, cabin: e.target.value })}
                placeholder="e.g. Academic Block 2, Room 304"
                className="w-full h-10 px-3.5 text-xs sm:text-[13px] rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.03] text-foreground focus:bg-white dark:focus:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="phone-input"
                className="block text-xs font-medium text-foreground tracking-tight mb-1.5"
              >
                Contact Intercom / Mobile
              </label>
              <input
                id="phone-input"
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="e.g. +91 94421 87654 or Ext. 402"
                className="w-full h-10 px-3.5 text-xs sm:text-[13px] rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.03] text-foreground focus:bg-white dark:focus:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="office-hours-input"
                className="block text-xs font-medium text-foreground tracking-tight mb-1.5"
              >
                Student Consultation Hours
              </label>
              <input
                id="office-hours-input"
                type="text"
                value={editForm.officeHours}
                onChange={(e) => setEditForm({ ...editForm, officeHours: e.target.value })}
                placeholder="e.g. Mon – Thu (2:30 PM – 4:30 PM)"
                className="w-full h-10 px-3.5 text-xs sm:text-[13px] rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.03] text-foreground focus:bg-white dark:focus:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all duration-150"
              />
            </div>

            <div>
              <label
                htmlFor="research-domains-input"
                className="block text-xs font-medium text-foreground tracking-tight mb-1.5"
              >
                Research &amp; Domain Specialization
              </label>
              <input
                id="research-domains-input"
                type="text"
                value={editForm.researchDomains}
                onChange={(e) => setEditForm({ ...editForm, researchDomains: e.target.value })}
                placeholder="e.g. Edge AI, Industrial IoT, Micro-Services Architecture"
                className="w-full h-10 px-3.5 text-xs sm:text-[13px] rounded-[10px] border border-black/[0.1] dark:border-white/[0.12] bg-black/[0.02] dark:bg-white/[0.03] text-foreground focus:bg-white dark:focus:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all duration-150"
              />
            </div>

            {/* Modal Actions Footer */}
            <DialogFooter className="mt-6 pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 border-t border-black/[0.06] dark:border-white/[0.08]">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-[#2C2C2E] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-foreground transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-2 text-xs font-semibold rounded-[10px] bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span>Save Changes</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog Flow */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Update Contact Details"
        description="Save your updated cabin location, consultation hours, and contact details to the faculty directory?"
        confirmText="Save Changes"
        variant="update"
        isLoading={isSaving}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
