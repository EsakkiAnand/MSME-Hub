"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  BadgeCheck,
  Building,
  School,
  GraduationCap,
  Edit2,
  Phone,
  Globe,
  GitBranch,
  Save,
  CheckCircle2,
  BookOpen,
  Hash,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";

export default function FacultyProfilePage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  const displayName = user?.name ?? "Dr. Selvaraj M";
  const displayEmail = user?.email ?? "selvaraj.cse@francisxavier.ac.in";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Profile data state
  const [profileData, setProfileData] = useState({
    facultyId: (user as any)?.uniqueId || "FAC0001",
    title: "Dr. Selvaraj M, Ph.D.",
    designation: "Associate Professor & Project Director",
    employeeId: "FXEC-FAC-1048",
    department: "Computer Science & Engineering",
    cabin: "Academic Block 2, Room 304",
    phone: "+91 94421 87654",
    officeHours: "Mon – Thu (2:30 PM – 4:30 PM)",
    advisorBatch: "B.E. CSE 2023–2027 (Section B)",
    researchDomains: "Edge AI, Industrial IoT, Micro-Services Architecture",
    googleScholar: "https://scholar.google.com/citations?user=selvaraj-fxec",
  });

  // Modal edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = () => {
    setEditForm(profileData);
    setIsEditing(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setProfileData(editForm);
      setIsEditing(false);
      toast.success("Faculty profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="size-16 rounded-xl bg-[#0f2744] border-2 border-blue-500/30 flex items-center justify-center font-bold text-white text-xl shadow-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                {profileData.title}
              </h2>
              <CopyIdBadge id={profileData.facultyId} label="Faculty ID" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <BadgeCheck className="size-3" />
                Verified Academic Faculty
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{profileData.designation}</p>
            <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{profileData.department}</span>
              <span className="text-slate-300">·</span>
              <span>FXEC Autonomous</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white transition-all shadow-xs active:scale-[0.98] self-start md:self-auto shrink-0"
        >
          <Edit2 className="size-3.5" />
          <span>Update Office &amp; Contact Info</span>
        </button>
      </div>

      {/* 2. Institutional Credentials & Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Institutional & Academic Assignment Card */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="size-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Institutional Affiliation
              </h3>
            </div>
            <span className="text-[11px] font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              {profileData.employeeId}
            </span>
          </div>

          <div className="p-6 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Permanent Faculty ID</span>
              <CopyIdBadge id={profileData.facultyId} size="xs" />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Institution</span>
              <span className="font-semibold text-slate-800 text-right">
                Francis Xavier Engineering College (Autonomous)
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-semibold text-slate-800 text-right">
                {profileData.department}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Designation / Role</span>
              <span className="font-semibold text-slate-800 text-right">
                {profileData.designation}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Faculty Advisor Cohort</span>
              <span className="font-semibold text-slate-800 text-right">
                {profileData.advisorBatch}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Specialization &amp; Research</span>
              <span className="font-medium text-slate-800 text-right max-w-[260px]">
                {profileData.researchDomains}
              </span>
            </div>
          </div>
        </div>

        {/* Office & Contact Card */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
            <Building className="size-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Campus Office &amp; Availability
            </h3>
          </div>

          <div className="p-6 divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" />
                <span>Cabin Location</span>
              </span>
              <span className="font-semibold text-slate-800">{profileData.cabin}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" />
                <span>Official Email</span>
              </span>
              <span className="font-mono font-medium text-blue-700">{displayEmail}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="size-3.5 text-slate-400" />
                <span>Intercom / Phone</span>
              </span>
              <span className="font-mono text-slate-800 font-medium">{profileData.phone}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="size-3.5 text-slate-400" />
                <span>Student Consultation Hours</span>
              </span>
              <span className="font-medium text-slate-800">{profileData.officeHours}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Globe className="size-3.5 text-slate-400" />
                <span>Google Scholar / Publications</span>
              </span>
              <a
                href={profileData.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 hover:underline truncate max-w-[200px]"
              >
                scholar.google.com/citations
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogPortal>
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Update Faculty Contact &amp; Office Details
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cabin Location
                    </label>
                    <input
                      type="text"
                      value={editForm.cabin}
                      onChange={(e) => setEditForm({ ...editForm, cabin: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Contact Intercom / Mobile
                    </label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Student Consultation Hours
                    </label>
                    <input
                      type="text"
                      value={editForm.officeHours}
                      onChange={(e) => setEditForm({ ...editForm, officeHours: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Research &amp; Domain Specialization
                    </label>
                    <input
                      type="text"
                      value={editForm.researchDomains}
                      onChange={(e) => setEditForm({ ...editForm, researchDomains: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-md bg-[#0f2744] hover:bg-[#1a385c] text-white text-xs font-semibold shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPortal>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Update Profile Details"
        description="Do you want to save your changes to your faculty contact details and office hours?"
        confirmText="Save Changes"
        variant="update"
        isLoading={isSaving}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
