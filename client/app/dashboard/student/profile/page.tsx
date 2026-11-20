"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import { getStudentOverview, updateStudentProfileAction } from "@/app/actions/student";

interface StudentProfileData {
  studentId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  degree: string;
  rollNo: string;
  registerNo: string;
  yearSemester: string;
  section: string;
  batch: string;
  cgpa: string;
  institution: string;
  campus: string;
  domain: string;
  advisor: string;
  academicStanding: string;
  phone: string;
  githubUsername: string;
  portfolioUrl: string;
}

const defaults: StudentProfileData = {
  studentId: "STU0001",
  name: "Student",
  email: "",
  role: "STUDENT",
  department: "Computer Science & Engineering",
  degree: "B.E. Computer Science & Engineering",
  rollNo: "",
  registerNo: "",
  yearSemester: "",
  section: "",
  batch: "",
  cgpa: "",
  institution: "Francis Xavier Engineering College",
  campus: "Tirunelveli, Tamil Nadu",
  domain: "francisxavier.ac.in",
  advisor: "",
  academicStanding: "",
  phone: "",
  githubUsername: "",
  portfolioUrl: "",
};

export default function ProfilePage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  const [profile, setProfile] = useState<StudentProfileData>(defaults);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editForm, setEditForm] = useState({ phone: "", githubUsername: "", portfolioUrl: "" });

  useEffect(() => {
    const load = async () => {
      const res = await getStudentOverview();
      if ((res as any).success) {
        const u = (res as any).user;
        setProfile((prev) => ({
          ...prev,
          studentId: u?.uniqueId || prev.studentId,
          name: u?.name || prev.name,
          email: u?.email || prev.email,
          phone: u?.phone || prev.phone,
          githubUsername: u?.githubUsername || prev.githubUsername,
          portfolioUrl: u?.portfolioUrl || prev.portfolioUrl,
        }));
        setEditForm({
          phone: u?.phone || "",
          githubUsername: u?.githubUsername || "",
          portfolioUrl: u?.portfolioUrl || "",
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const displayName = user?.name || profile.name || "Student";
  const initials =
    displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ST";

  const handleOpenEdit = () => {
    setEditForm({ phone: profile.phone, githubUsername: profile.githubUsername, portfolioUrl: profile.portfolioUrl });
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
      const res: any = await updateStudentProfileAction({
        phone: editForm.phone,
        githubUsername: editForm.githubUsername,
        portfolioUrl: editForm.portfolioUrl,
      });
      if (res.success) {
        setProfile((prev) => ({ ...prev, ...editForm }));
        toast.success(res.message || "Profile updated successfully.");
        setShowSaveConfirm(false);
      } else {
        toast.error(res.error || "Failed to update profile.");
        setIsEditModalOpen(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading student profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Primary Student Profile Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="size-16 sm:size-18 rounded-[16px] bg-[#007AFF] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0 shadow-sm ring-4 ring-black/[0.04] dark:ring-white/[0.06]">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {profile.name}
                </h1>
                <CopyIdBadge id={profile.studentId} label="Student ID" />
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#34C759]">
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                  Verified Student
                </span>
                {profile.email && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-mono flex items-center gap-1.5 break-all">
                <Mail className="size-3.5 text-muted-foreground shrink-0" />
                <span>{profile.email || "—"}</span>
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {profile.degree} · {profile.yearSemester || "—"} ({profile.section || "—"})
              </p>
            </div>
          </div>

          <div className="flex items-stretch gap-3 shrink-0 self-start lg:self-auto w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-foreground font-mono">
                  {profile.cgpa || "—"}
                </span>
                <span className="text-xs text-muted-foreground font-medium">/ 10.0</span>
              </div>
            </div>

            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                College Roll No
              </span>
              <span className="text-xl font-bold text-foreground font-mono block mt-0.5">
                {profile.rollNo || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <User className="size-4 text-muted-foreground shrink-0" />
              Faculty Advisor: <strong className="font-semibold text-foreground">{profile.advisor || "—"}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="size-4 text-muted-foreground shrink-0" />
              Register No: <strong className="font-mono font-semibold text-foreground">{profile.registerNo || "—"}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <School className="size-4 text-muted-foreground shrink-0" />
              Batch: <strong className="font-semibold text-foreground">{profile.batch || "—"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
            Authenticated Institutional SSO (@{profile.domain})
          </div>
        </div>
      </div>

      {/* 2. Academic & Institutional Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground tracking-tight">Academic &amp; Programme Details</h2>
            <CopyIdBadge id={profile.studentId} size="xs" />
          </div>
          <div className="p-6 divide-y divide-black/[0.05] dark:divide-white/[0.06] text-xs">
            {[
              { label: "Student Full Name", value: profile.name },
              { label: "College Roll Number", value: profile.rollNo },
              { label: "Anna University Register No", value: profile.registerNo },
              { label: "Degree & Programme", value: profile.degree },
              { label: "Academic Department", value: profile.department },
              { label: "Current Class Standing", value: profile.yearSemester },
              { label: "Contact Phone", value: profile.phone || "—" },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
                <span className="text-foreground font-semibold text-right break-words">{row.value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-[10px] bg-[#007AFF]/10 text-[#007AFF]">
                <School className="size-4" />
              </div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">Classroom &amp; Mentorship</h2>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-card hover:bg-black/[0.02] dark:hover:bg-white/[0.04] text-xs font-medium text-foreground transition-all active:scale-[0.98] cursor-pointer"
            >
              <Edit2 className="size-3.5 text-muted-foreground" />
              <span>Update Details</span>
            </button>
          </div>
          <div className="p-6 divide-y divide-black/[0.05] dark:divide-white/[0.06] text-xs">
            {[
              { label: "Classroom Section", value: profile.section },
              { label: "Graduation Batch", value: profile.batch },
              { label: "Designated Faculty Advisor", value: profile.advisor },
              { label: "Official Institutional Email", value: profile.email },
              { label: "Academic Institution", value: profile.institution },
              { label: "Academic Standing", value: profile.academicStanding || "—" },
              { label: "GitHub Profile", value: profile.githubUsername ? `@${profile.githubUsername}` : "—" },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-medium shrink-0">{row.label}</span>
                <span className="text-foreground font-semibold text-right break-all">{row.value || "—"}</span>
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
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
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
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-muted-foreground" />
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={editForm.githubUsername}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, githubUsername: e.target.value }))}
                  className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all font-mono"
                  placeholder="github-username"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Globe className="size-3.5 text-muted-foreground" />
                  Portfolio / Profile URL
                </label>
                <input
                  type="url"
                  value={editForm.portfolioUrl}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                  className="w-full text-sm border border-black/[0.06] dark:border-white/[0.08] dark:border-border rounded-[12px] px-3.5 py-2.5 text-foreground dark:text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                  placeholder="https://github.com/username"
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

      {/* Confirmation Dialog */}
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
