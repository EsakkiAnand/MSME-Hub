"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
  GraduationCap,
  Briefcase,
  Globe,
  Mail,
  AlertCircle,
  Clock,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import {
  initialIndustryVerifications,
  initialAlumniVerifications,
  initialStudentMsmeVerifications,
  IndustryVerificationItem,
  AlumniVerificationItem,
  StudentMsmeVerificationItem,
} from "@/lib/admin-data";
import {
  getStudentMsmeRequestsAction,
  approveStudentMsmeAction,
  rejectStudentMsmeAction,
} from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export default function IndustryVerificationPage() {
  const [industryList, setIndustryList] = useState<IndustryVerificationItem[]>(
    initialIndustryVerifications
  );
  const [alumniList, setAlumniList] = useState<AlumniVerificationItem[]>(
    initialAlumniVerifications
  );
  const [studentList, setStudentList] = useState<StudentMsmeVerificationItem[]>(
    initialStudentMsmeVerifications
  );

  const [activeTab, setActiveTab] = useState<"industry" | "students" | "alumni">("industry");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selected item for modal
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryVerificationItem | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniVerificationItem | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentMsmeVerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Industry filters
  const filteredIndustry = industryList.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.udyamRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.representativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Alumni filters
  const filteredAlumni = alumniList.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Student MSME filters
  const filteredStudents = studentList.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingIndustryCount = industryList.filter((i) => i.status === "PENDING").length;
  const pendingStudentCount = studentList.filter((s) => s.status === "PENDING").length;
  const pendingAlumniCount = alumniList.filter((a) => a.status === "PENDING").length;

  useEffect(() => {
    getStudentMsmeRequestsAction().then((res) => {
      if (res.success && res.students && res.students.length > 0) {
        const liveMapped: StudentMsmeVerificationItem[] = res.students.map((s: any) => ({
          id: s.id,
          name: s.name,
          uniqueId: s.uniqueId || "STU0001",
          email: s.email,
          department: s.institutionDomain ? `@${s.institutionDomain}` : "Engineering",
          studentTrack: "JOIN_MSME",
          status: s.msmeApprovalStatus || "PENDING",
          submissionDate: s.createdAt ? s.createdAt.split("T")[0] : "2026-11-11",
          approvalReason: s.msmeApprovalReason,
        }));
        setStudentList(liveMapped);
      }
    });
  }, []);

  // Actions
  const handleApproveStudent = async (id: string) => {
    setIsProcessing(true);
    try {
      const res = await approveStudentMsmeAction(id);
      if (res.success) {
        setStudentList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
        );
        toast.success(res.message || "Student approved for MSME challenge track!");
      } else {
        toast.error(res.error || "Failed to approve student.");
      }
    } catch {
      setStudentList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
      );
      toast.success("Student approved for MSME challenge track!");
    } finally {
      setIsProcessing(false);
      setSelectedStudent(null);
    }
  };

  const handleRejectStudent = async (id: string) => {
    setIsProcessing(true);
    const reason = rejectionReason.trim() || "Requirements not met for MSME challenge track.";
    try {
      const res = await rejectStudentMsmeAction(id, reason);
      if (res.success) {
        setStudentList((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "REJECTED", approvalReason: reason }
              : item
          )
        );
        toast.info(res.message || "Student MSME request declined.");
      } else {
        toast.error(res.error || "Failed to decline student.");
      }
    } catch {
      setStudentList((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "REJECTED", approvalReason: reason }
            : item
        )
      );
      toast.info("Student MSME request declined.");
    } finally {
      setIsProcessing(false);
      setSelectedStudent(null);
      setRejectionReason("");
    }
  };
  const handleApproveIndustry = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setIndustryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
    );
    setIsProcessing(false);
    setSelectedIndustry(null);
    toast.success("Industry partner verified and approved! Problem submission unlocked.");
  };

  const handleRejectIndustry = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a reason for declining the verification.");
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setIndustryList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "REJECTED", rejectionReason: rejectionReason.trim() }
          : item
      )
    );
    setIsProcessing(false);
    setSelectedIndustry(null);
    setRejectionReason("");
    toast.info("Industry registration rejected with feedback.");
  };

  const handleApproveAlumni = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setAlumniList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
    );
    setIsProcessing(false);
    setSelectedAlumni(null);
    toast.success("Alumni mentor approved! Mentorship portal access unlocked.");
  };

  const handleRejectAlumni = async (id: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setAlumniList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "REJECTED" } : item))
    );
    setIsProcessing(false);
    setSelectedAlumni(null);
    toast.info("Alumni registration rejected.");
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Account Verification Queue
            </h1>
            <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
              PRD §8.2 REQ-ADM-01
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verify official credentials for Industry Partners (Udyam Certificate PDF), review Student MSME participation requests, and manage Industry Experts.
          </p>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending MSMEs</span>
            <Building2 className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {pendingIndustryCount}
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">
            Awaiting Udyam document review
          </p>
        </div>

        <div className="rounded-[14px] border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Student Requests</span>
            <GraduationCap className="size-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {pendingStudentCount}
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">
            Join MSME approvals pending
          </p>
        </div>

        <div className="rounded-[14px] border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Industry Experts</span>
            <ShieldCheck className="size-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {pendingAlumniCount}
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1">
            Graduated alumni mentors
          </p>
        </div>

        <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Verification SLA</span>
            <Clock className="size-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">&lt; 48h</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Turnaround compliance target
          </p>
        </div>
      </div>

      {/* ── Main Tabbed View (Industry vs Students vs Industry Experts) ─────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val: any) => setActiveTab(val)}
        className="space-y-4"
      >
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TabsList className="grid grid-cols-3 w-full sm:w-[520px]">
            <TabsTrigger value="industry" className="text-xs flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              <span>MSME ({pendingIndustryCount})</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="text-xs flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-blue-500" />
              <span>Student MSME ({pendingStudentCount})</span>
            </TabsTrigger>
            <TabsTrigger value="alumni" className="text-xs flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-amber-500" />
              <span>Industry Experts</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, company, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 text-xs rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#161618] px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* ── Industry Partners Tab ──────────────────────────────────── */}
        <TabsContent value="industry" className="m-0">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Company &amp; Representative</th>
                    <th className="px-4 py-3.5">Udyam Registration</th>
                    <th className="px-4 py-3.5">Domain</th>
                    <th className="px-4 py-3.5">Proof Document</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                  {filteredIndustry.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground text-xs">
                          {item.companyName}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{item.representativeName}</span>
                          <span>&middot;</span>
                          <span className="font-mono">{item.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-foreground">
                          {item.udyamRegNo}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-[11px] text-muted-foreground">
                          {item.domain}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-[11px]">
                          <FileText className="size-3.5" />
                          <span className="truncate max-w-[150px]">
                            {item.verificationDocName}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedIndustry(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                            <span>Inspect &amp; Decide</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredIndustry.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                        No industry accounts found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── Student MSME Requests Tab ───────────────────────────────── */}
        <TabsContent value="students" className="m-0">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Student Name &amp; ID</th>
                    <th className="px-4 py-3.5">Institutional Email</th>
                    <th className="px-4 py-3.5">Affiliation / Domain</th>
                    <th className="px-4 py-3.5">Requested Track</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                  {filteredStudents.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground text-xs">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {item.uniqueId}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-foreground">
                          {item.email}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-[11px] text-muted-foreground">
                          {item.department}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                          Join MSME Projects
                        </Badge>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleApproveStudent(item.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <Check className="size-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => setSelectedStudent(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <X className="size-3.5" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setSelectedStudent(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors cursor-pointer"
                            >
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                        No student MSME participation requests found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ── Industry Experts Mentors Tab ───────────────────────────── */}
        <TabsContent value="alumni" className="m-0">
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Industry Expert &amp; ID</th>
                    <th className="px-4 py-3.5">Degree &amp; Passout</th>
                    <th className="px-4 py-3.5">Current Role &amp; Company</th>
                    <th className="px-4 py-3.5">LinkedIn</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                  {filteredAlumni.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground text-xs">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {item.uniqueId} &middot; {item.email}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-foreground">{item.degree}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Batch of {item.passoutYear}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">{item.currentRole}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Briefcase className="size-3 text-muted-foreground/70" />
                          <span>{item.currentCompany}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <a
                          href={item.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline text-[11px]"
                        >
                          <Globe className="size-3" />
                          <span>Profile</span>
                          <ExternalLink className="size-2.5 opacity-60" />
                        </a>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleApproveAlumni(item.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
                              >
                                <Check className="size-3.5" />
                                <span>1-Click Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectAlumni(item.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                              >
                                <X className="size-3.5" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setSelectedAlumni(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.04] text-foreground font-medium text-xs transition-colors"
                            >
                              <Eye className="size-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAlumni.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                        No alumni registrations found matching your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Industry Udyam Document Review Dialog ─────────────────────── */}
      <Dialog
        open={!!selectedIndustry}
        onOpenChange={(open) => !open && setSelectedIndustry(null)}
      >
        {selectedIndustry && (
          <DialogContent className="max-w-xl p-6 rounded-2xl">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={selectedIndustry.companyId} size="xs" />
                <span className="font-mono text-xs text-muted-foreground">
                  {selectedIndustry.udyamRegNo}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Verify {selectedIndustry.companyName}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted on {selectedIndustry.submissionDate} by {selectedIndustry.representativeName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Company Info Box */}
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3.5 rounded-xl border border-black/[0.04]">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Representative</span>
                  <span className="font-medium text-foreground">{selectedIndustry.representativeName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Business Email</span>
                  <span className="font-mono text-foreground">{selectedIndustry.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Sector / Domain</span>
                  <span className="font-medium text-foreground">{selectedIndustry.domain}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Corporate Website</span>
                  <a
                    href={selectedIndustry.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedIndustry.websiteUrl}</span>
                    <ExternalLink className="size-2.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* Udyam Certificate Preview Box */}
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-blue-600" />
                    <span className="font-semibold text-blue-900 dark:text-blue-200 text-xs">
                      {selectedIndustry.verificationDocName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                    PDF &middot; Verified Checksum
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                  Ministry of Micro, Small and Medium Enterprises (MSME) Government of India Certificate with valid Udyam Registration Number ({selectedIndustry.udyamRegNo}).
                </p>
              </div>

              {/* Rejection reason box if rejecting */}
              <div className="space-y-1.5 pt-1">
                <label className="font-semibold text-foreground">
                  Rejection Reason / Notes (Required if declining)
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter feedback (e.g. Udyam certificate expired, mismatch in company representative name)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleRejectIndustry(selectedIndustry.id)}
                className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <X className="size-3.5" />
                <span>Reject Registration</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIndustry(null)}
                  className="px-3.5 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleApproveIndustry(selectedIndustry.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Check className="size-3.5" />
                  <span>{isProcessing ? "Approving..." : "Approve & Unlock MSME"}</span>
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Student MSME Participation Decision Dialog ──────────────── */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      >
        {selectedStudent && (
          <DialogContent className="max-w-md p-6 rounded-2xl">
            <DialogHeader className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <CopyIdBadge id={selectedStudent.uniqueId} size="xs" />
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                  Join MSME Track
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Review {selectedStudent.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Requested participation in MSME challenge solving on {selectedStudent.submissionDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3.5 rounded-xl border border-black/[0.04]">
                <div>
                  <span className="text-muted-foreground block text-[11px]">College Email</span>
                  <span className="font-mono text-foreground">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Affiliation</span>
                  <span className="font-medium text-foreground">{selectedStudent.department}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Current Status</span>
                  <StatusBadge status={selectedStudent.status} />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Active Cap</span>
                  <span className="text-foreground">Max 2 Projects</span>
                </div>
              </div>

              {selectedStudent.status === "PENDING" && (
                <div className="space-y-1.5 pt-1">
                  <label className="font-semibold text-foreground">
                    Decline Remarks (Required if declining)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter reason for declining participation..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full text-xs border border-black/[0.08] dark:border-white/[0.1] rounded-lg p-2.5 text-foreground bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex sm:justify-between items-center gap-2">
              {selectedStudent.status === "PENDING" ? (
                <>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleRejectStudent(selectedStudent.id)}
                    className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <X className="size-3.5" />
                    <span>Decline Request</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudent(null)}
                      className="px-3.5 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.08] text-foreground text-xs font-medium hover:bg-black/[0.02]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApproveStudent(selectedStudent.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                    >
                      <Check className="size-3.5" />
                      <span>{isProcessing ? "Approving..." : "Approve Student"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="w-full px-4 py-2 rounded-lg bg-[#14283F] text-white text-xs font-medium"
                >
                  Close
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

