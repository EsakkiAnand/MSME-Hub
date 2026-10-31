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
import { Dialog, DialogPortal } from "@/components/ui/dialog";
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
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Avatar and Identity Details */}
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="size-16 sm:size-18 rounded-2xl bg-[#0f2744] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0 shadow-xs ring-4 ring-slate-100">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {studentData.name}
                </h1>
                <CopyIdBadge id={studentData.studentId} label="Student ID" />
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <BadgeCheck className="size-3.5 text-emerald-600" />
                  Verified Student
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Project Team Lead
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-mono flex items-center gap-1.5 break-all">
                <Mail className="size-3.5 text-slate-400 shrink-0" />
                <span>{studentData.email}</span>
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {studentData.degree} · {studentData.yearSemester} ({studentData.section})
              </p>
            </div>
          </div>

          {/* Quick Academic Metrics (CGPA & Roll Number) */}
          <div className="flex items-stretch gap-3 shrink-0 self-start lg:self-auto w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {studentData.cgpa}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ 10.0</span>
              </div>
            </div>

            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left sm:min-w-32">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                College Roll No
              </span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-0.5">
                {studentData.rollNo}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-bar: Mentorship, Registration & SSO */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <User className="size-4 text-slate-400 shrink-0" />
              <span>Faculty Advisor: <strong className="font-semibold text-slate-800">{studentData.advisor}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="size-4 text-slate-400 shrink-0" />
              <span>Register No: <strong className="font-mono font-semibold text-slate-800">{studentData.registerNo}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <School className="size-4 text-slate-400 shrink-0" />
              <span>Batch: <strong className="font-semibold text-slate-800">{studentData.batch}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
            <span>Authenticated Institutional SSO (@{studentData.domain})</span>
          </div>
        </div>
      </div>

      {/* 2. Official Academic Information (Clean 2-Column Records Card) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <BookOpen className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Official Academic & Enrollment Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Synchronized with Francis Xavier Engineering College administrative database
              </p>
            </div>
          </div>

          {/* Edit / Update Contact Action */}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs"
          >
            <Edit2 className="size-3.5 text-slate-500" />
            <span>Update Details</span>
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {/* Column 1 */}
            <div className="divide-y divide-slate-100">
              <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs">
                <dt className="text-slate-500 font-medium shrink-0">Permanent Student ID</dt>
                <dd className="sm:text-right">
                  <CopyIdBadge id={studentData.studentId} size="xs" />
                </dd>
              </div>
              {[
                { label: "Student Full Name", value: studentData.name },
                { label: "College Roll Number", value: studentData.rollNo },
                { label: "Anna University Register No", value: studentData.registerNo },
                { label: "Degree & Programme", value: studentData.degree },
                { label: "Academic Department", value: studentData.department },
                { label: "Current Class Standing", value: studentData.yearSemester },
                { label: "Contact Phone", value: studentData.phone },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs"
                >
                  <dt className="text-slate-500 font-medium shrink-0">{row.label}</dt>
                  <dd className="text-slate-900 font-semibold sm:text-right break-words">{row.value}</dd>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="divide-y divide-slate-100">
              {[
                { label: "Classroom Section", value: studentData.section },
                { label: "Graduation Batch", value: studentData.batch },
                { label: "Designated Faculty Advisor", value: studentData.advisor },
                { label: "Official Institutional Email", value: studentData.email },
                { label: "Academic Institution", value: studentData.institution },
                { label: "Academic Standing", value: studentData.academicStanding },
                { label: "GitHub Profile", value: `@${studentData.githubUsername}` },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs"
                >
                  <dt className="text-slate-500 font-medium shrink-0">{row.label}</dt>
                  <dd className="text-slate-900 font-semibold sm:text-right break-all">{row.value}</dd>
                </div>
              ))}
            </div>
          </dl>
        </div>
      </div>

      {/* Edit Profile Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {isEditModalOpen && (
          <DialogPortal>
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs animate-in fade-in-0 duration-150" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                    <User className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Update Student Contact & Profiles
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synchronized with project collaboration profiles
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePreSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="size-3.5 text-slate-400" />
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                      placeholder="+91 98401 23456"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <GitBranch className="size-3.5 text-slate-400" />
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={editForm.githubUsername}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, githubUsername: e.target.value }))}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all font-mono"
                      placeholder="mohamed-farhan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Globe className="size-3.5 text-slate-400" />
                      Portfolio / Profile URL
                    </label>
                    <input
                      type="url"
                      value={editForm.portfolioUrl}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
                      placeholder="https://github.com/mohamed-farhan"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-xs font-medium text-white transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPortal>
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
