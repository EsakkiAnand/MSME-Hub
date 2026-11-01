"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  BadgeCheck,
  Calendar,
  Hash,
  School,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Edit2,
  Phone,
  Globe,
  GitBranch,
  Save,
  CheckCircle2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  const displayName = user?.name ?? "MOHAMED";
  const displayEmail = user?.email ?? "mohamedmydeen.ug.23.cb@francisxavier.ac.in";

  const initials =
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "M";

  const [studentData, setStudentData] = useState({
    studentId: (user as any)?.uniqueId || "STU0001",
    name: displayName,
    email: displayEmail,
    role: "STUDENT",
    department: "Computer Science & Engineering",
    degree: "B.E. Computer Science & Engineering",
    rollNo: "22CSB041",
    registerNo: "950722104041",
    yearSemester: "3rd Year · 6th Semester",
    section: "Section B",
    batch: "2022–2026",
    cgpa: "8.74",
    institution: "Francis Xavier Engineering College (Autonomous)",
    campus: "Tirunelveli, Tamil Nadu",
    domain: "francisxavier.ac.in",
    advisor: "Dr. Selvaraj M, M.E., Ph.D.",
    academicStanding: "Regular · Good Standing (No Backlogs)",
    phone: "+91 98401 23456",
    githubUsername: "mohamed-farhan",
    portfolioUrl: "https://github.com/mohamed-farhan",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [editForm, setEditForm] = useState({
    phone: studentData.phone,
    githubUsername: studentData.githubUsername,
    portfolioUrl: studentData.portfolioUrl,
  });

  const handleOpenEdit = () => {
    setEditForm({
      phone: studentData.phone,
      githubUsername: studentData.githubUsername,
      portfolioUrl: studentData.portfolioUrl,
    });
    setIsEditModalOpen(true);
  };

  const handlePreSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStudentData((prev) => ({
        ...prev,
        phone: editForm.phone,
        githubUsername: editForm.githubUsername,
        portfolioUrl: editForm.portfolioUrl,
      }));
      toast.success("Profile contact details updated successfully.");
      setShowSaveConfirm(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Primary Student Profile Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Avatar and Identity Details */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="size-16 sm:size-18 rounded-[16px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0 shadow-sm ring-4 ring-black/[0.04] dark:ring-white/[0.06]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {studentData.name}
                </h1>
                <CopyIdBadge id={studentData.studentId} label="Student ID" />
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759] border-transparent">
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                  Verified Student
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] border-transparent">
                  Project Team Lead
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-mono flex items-center gap-1.5 break-all">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span>{studentData.email}</span>
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {studentData.degree} · {studentData.yearSemester} ({studentData.section})
              </p>
            </div>
          </div>

          {/* Quick Academic Metrics (CGPA & Roll Number) */}
          <div className="flex items-stretch gap-3 shrink-0 self-start lg:self-auto w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-foreground font-mono">
                  {studentData.cgpa}
                </span>
                <span className="text-xs text-muted-foreground font-medium">/ 10.0</span>
              </div>
            </div>

            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                College Roll No
              </span>
              <span className="text-xl font-bold text-foreground font-mono block mt-0.5">
                {studentData.rollNo}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-bar: Mentorship, Registration & SSO */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <User className="size-4 text-muted-foreground shrink-0" />
              <span>Faculty Advisor: <strong className="font-semibold text-foreground">{studentData.advisor}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="size-4 text-muted-foreground shrink-0" />
              <span>Register No: <strong className="font-mono font-semibold text-foreground">{studentData.registerNo}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <School className="size-4 text-muted-foreground shrink-0" />
              <span>Batch: <strong className="font-semibold text-foreground">{studentData.batch}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
            <span>Authenticated Institutional SSO (@{studentData.domain})</span>
          </div>
        </div>
      </div>

      {/* 2. Standardized 2-Column Academic & Institutional Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: Academic Affiliation */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-[10px] bg-[#007AFF]/10 text-[#007AFF]">
                <BookOpen className="size-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Academic &amp; Programme Details
              </h2>
            </div>
            <CopyIdBadge id={studentData.studentId} size="xs" />
          </div>

          <div className="p-6 divide-y divide-black/[0.05] dark:divide-white/[0.06] text-xs">
            {[
              { label: "Student Full Name", value: studentData.name },
              { label: "College Roll Number", value: studentData.rollNo },
              { label: "Anna University Register No", value: studentData.registerNo },
              { label: "Degree & Programme", value: studentData.degree },
              { label: "Academic Department", value: studentData.department },
              { label: "Current Class Standing", value: studentData.yearSemester },
              { label: "Contact Phone", value: studentData.phone },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
                <span className="text-foreground font-semibold text-right break-words">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Institutional Credentials & Advisor */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-[10px] bg-[#007AFF]/10 text-[#007AFF]">
                <School className="size-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">
                Classroom &amp; Mentorship
              </h2>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-xs font-medium text-foreground transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <Edit2 className="size-3.5 text-muted-foreground" />
              <span>Update Details</span>
            </button>
          </div>

          <div className="p-6 divide-y divide-black/[0.05] dark:divide-white/[0.06] text-xs">
            {[
              { label: "Classroom Section", value: studentData.section },
              { label: "Graduation Batch", value: studentData.batch },
              { label: "Designated Faculty Advisor", value: studentData.advisor },
              { label: "Official Institutional Email", value: studentData.email },
              { label: "Academic Institution", value: studentData.institution },
              { label: "Academic Standing", value: studentData.academicStanding },
              { label: "GitHub Profile", value: `@${studentData.githubUsername}` },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
                <span className="text-foreground font-semibold text-right break-all">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {isEditModalOpen && (
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="size-10 rounded-xl bg-blue-50 text-[#007AFF] dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                  <User className="size-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground dark:text-foreground">
                    Update Student Contact &amp; Profiles
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Synchronized with project collaboration profiles
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handlePreSave} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-muted-foreground" />
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                  placeholder="+91 98401 23456"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-muted-foreground" />
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={editForm.githubUsername}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, githubUsername: e.target.value }))}
                  className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all font-mono"
                  placeholder="mohamed-farhan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground dark:text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-muted-foreground" />
                  Portfolio / Profile URL
                </label>
                <input
                  type="url"
                  value={editForm.portfolioUrl}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                  className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                  placeholder="https://github.com/mohamed-farhan"
                />
              </div>

              <DialogFooter className="mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-[12px] border border-black/[0.06] dark:border-white/[0.08] dark:border-border bg-white dark:bg-background hover:bg-black/[0.02] dark:bg-white/[0.03] dark:hover:bg-muted text-xs font-medium text-foreground dark:text-foreground transition-all cursor-pointer"
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

      {/* Confirmation Dialog: Update Profile Information */}
      <ConfirmationDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        title="Save Profile Changes"
        description="Do you want to save your changes? Your updated contact details and developer portfolio link will be saved across the MSME Hub system."
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="update"
        isLoading={isProcessing}
        onConfirm={handleConfirmSave}
        onCancel={() => setIsEditModalOpen(true)}
      />
    </div>
  );
}
