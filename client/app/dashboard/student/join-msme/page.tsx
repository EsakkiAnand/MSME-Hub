"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getStudentTrackStatusAction, selectStudentTrackAction } from "@/app/actions/auth";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Building2,
  FolderKanban,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Mail,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StudentJoinMsmePage() {
  const session = authClient.useSession();
  const sessionUser = session?.data?.user;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isReapplying, setIsReapplying] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await getStudentTrackStatusAction();
      if (res.success && res.user) {
        setUserData(res.user);
      }
    } catch (err: any) {
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleReapply = async () => {
    setIsReapplying(true);
    try {
      const res = await selectStudentTrackAction("JOIN_MSME");
      if (res.success) {
        toast.success("Request re-submitted to MSME Admin.");
        await fetchStatus();
      } else {
        toast.error(res.error || "Failed to re-apply.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsReapplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Checking MSME track status...</p>
      </div>
    );
  }

  const studentName = userData?.name || sessionUser?.name || "Student";
  const studentEmail = userData?.email || sessionUser?.email || "student@college.edu";
  const uniqueId = userData?.uniqueId || (sessionUser as any)?.uniqueId || "STU0001";
  const msmeStatus = userData?.msmeApprovalStatus || "PENDING";
  const approvalReason = userData?.msmeApprovalReason;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Navigation Return */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/student"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Student Dashboard</span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchStatus}
          className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
        >
          <RefreshCw className="size-3" />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* Main Status Hero Card */}
      {msmeStatus === "PENDING" && (
        <Card className="rounded-[20px] border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/10 shadow-xs overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <Badge
                variant="outline"
                className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
              >
                <Clock className="size-3.5" />
                <span>Pending MSME Admin Verification</span>
              </Badge>
              <CopyIdBadge id={uniqueId} label="Student ID" size="xs" />
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="size-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>MSME Project Participation Request</span>
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
              Your request to join MSME industry challenge teams has been submitted to the MSME Administrator. Once approved, academic faculty will be able to assign you to active projects.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Student Submission Summary Box */}
            <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Student Name
                </span>
                <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-4 text-emerald-500 shrink-0" />
                  {studentName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  College Email
                </span>
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 truncate">
                  <Mail className="size-4 text-blue-500 shrink-0" />
                  <span className="truncate">{studentEmail}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Application Status
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <Clock className="size-3.5" />
                  <span>Awaiting Review</span>
                </span>
              </div>
            </div>

            {/* Info callout on what happens next */}
            <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
                <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                <span>What Happens During Admin Verification?</span>
              </div>
              <ul className="text-xs text-blue-800/80 dark:text-blue-300/80 space-y-1.5 list-disc pl-5">
                <li>The MSME Administrator verifies your student registration and institutional affiliation.</li>
                <li>Upon approval, your account is marked as a <strong>Verified MSME Builder</strong>.</li>
                <li>Faculty project directors can then add you to multi-student teams (up to 2 active projects concurrently).</li>
              </ul>
            </div>

            {/* Action options */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Want to innovate right away? You can submit your own project ideas in the meantime.
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/dashboard/student/submit-idea" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-xs font-semibold h-9 rounded-lg border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 gap-1.5"
                  >
                    <Lightbulb className="size-3.5 text-emerald-500" />
                    <span>Submit an Idea</span>
                  </Button>
                </Link>
                <Link href="/dashboard/student" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto text-xs font-semibold h-9 rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white gap-1.5"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {msmeStatus === "APPROVED" && (
        <Card className="rounded-[20px] border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-500/10 shadow-xs overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <Badge
                variant="outline"
                className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Verified MSME Builder</span>
              </Badge>
              <CopyIdBadge id={uniqueId} label="Student ID" size="xs" />
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>MSME Project Participation Approved!</span>
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
              Your account has been officially verified by the MSME Administrator. Academic faculty can now assign you to active MSME projects (capped at 2 active projects concurrently).
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="pt-2 flex items-center gap-3">
              <Link href="/dashboard/student/projects">
                <Button className="h-10 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <FolderKanban className="size-4" />
                  <span>View My Assigned Projects</span>
                </Button>
              </Link>
              <Link href="/dashboard/student">
                <Button variant="outline" className="h-10 text-xs font-medium rounded-xl">
                  <span>Student Workspace</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {msmeStatus === "REJECTED" && (
        <Card className="rounded-[20px] border-destructive/30 bg-destructive/5 shadow-xs overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/30 px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
              >
                <XCircle className="size-3.5" />
                <span>Request Declined</span>
              </Badge>
            </div>

            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              MSME Project Participation Not Approved
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground mt-1">
              The MSME Administrator was unable to verify your participation request.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {approvalReason && (
              <div className="rounded-xl border border-destructive/20 bg-card p-4 space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Administrator Remarks
                </span>
                <p className="text-sm text-foreground">{approvalReason}</p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Button
                onClick={handleReapply}
                disabled={isReapplying}
                className="h-10 text-xs font-semibold rounded-xl bg-[#14283F] hover:bg-[#14283F]/90 text-white gap-2"
              >
                {isReapplying ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                <span>Re-Apply for MSME Access</span>
              </Button>
              <Link href="/dashboard/student/submit-idea">
                <Button variant="outline" className="h-10 text-xs font-medium rounded-xl">
                  <span>Explore Idea Submissions</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

