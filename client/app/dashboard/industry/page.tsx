"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  FolderKanban,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { toast } from "sonner";
import { getIndustryOverviewAction } from "@/app/actions/industry";
import { IndustryProblemItem, IndustryProjectItem } from "@/lib/industry-data";

export default function IndustryOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await getIndustryOverviewAction();
      if (res.success) {
        setData(res);
      } else {
        toast.error(res.error || "Failed to load overview");
      }
    } catch {
      toast.error("Network error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-[#007AFF] mb-3" />
        <p className="text-sm font-medium">Loading Industry Partner Portal...</p>
      </div>
    );
  }

  const profile = data?.profile;
  const isVerified = data?.user?.isVerified ?? false;
  const stats = data?.stats || {
    totalSubmitted: 0,
    availableInPool: 0,
    claimedByFaculty: 0,
    activeProjects: 0,
    completedProjects: 0,
  };
  const problems: IndustryProblemItem[] = data?.recentProblems || [];
  const projects: IndustryProjectItem[] = data?.recentProjects || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome & Identity Banner */}
      <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#007AFF] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50">
                Verified MSME Partner
              </span>
              <CopyIdBadge id={profile?.companyId || "HTMP001"} label="Company ID" size="xs" />
              <CopyIdBadge id={data?.user?.uniqueId || "IND0001"} label="Partner ID" size="xs" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground">
              {profile?.companyName || "MSME Enterprise"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Udyam No: <span className="font-mono text-foreground dark:text-foreground font-semibold">{profile?.udyamRegNo || "UDYAM-TN-01-XXXX"}</span> • Sector: {profile?.domain || "General Industry"}.
              Submit authentic engineering bottlenecks and collaborate with student project teams under faculty supervision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/dashboard/industry/submit-problem">
              <Button
                className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9 shadow-xs transition-all active:scale-[0.98]"
              >
                <PlusCircle className="size-3.5 mr-1.5" />
                Submit New Challenge
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Udyam Verification Callout (if unverified) */}
      {!isVerified && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardHeader className="py-3 px-4 flex flex-row items-center gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <CardTitle className="text-xs font-bold text-amber-900">
                Business Proof Verification Pending
              </CardTitle>
              <CardDescription className="text-xs text-amber-700">
                Your Udyam Registration Certificate is under review by MSME Administrators. Challenge submissions will be visible in the open academic pool once verified.
              </CardDescription>
            </div>
            <Link href="/dashboard/industry/profile">
              <Button size="sm" variant="outline" className="text-xs h-7 border-amber-300 text-amber-900">
                View Certificate
              </Button>
            </Link>
          </CardHeader>
        </Card>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-muted-foreground">
              Submitted
            </CardDescription>
            <CardTitle className="text-2xl font-black text-foreground flex items-center justify-between">
              <span>{stats.totalSubmitted}</span>
              <FileText className="size-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-muted-foreground">Total operational challenges</p>
          </CardContent>
        </Card>

        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-muted-foreground">
              In Domain Pool
            </CardDescription>
            <CardTitle className="text-2xl font-black text-[#007AFF] flex items-center justify-between">
              <span>{stats.availableInPool}</span>
              <Clock className="size-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-muted-foreground">Open for faculty claiming</p>
          </CardContent>
        </Card>

        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-muted-foreground">
              Claimed by Staff
            </CardDescription>
            <CardTitle className="text-2xl font-black text-purple-600 flex items-center justify-between">
              <span>{stats.claimedByFaculty}</span>
              <Building2 className="size-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-muted-foreground">Assigned into project teams</p>
          </CardContent>
        </Card>

        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-muted-foreground">
              Active Projects
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600 flex items-center justify-between">
              <span>{stats.activeProjects}</span>
              <FolderKanban className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-muted-foreground">Under student development</p>
          </CardContent>
        </Card>

        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white col-span-2 sm:col-span-1">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-muted-foreground">
              Completed &amp; Rated
            </CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600 flex items-center justify-between">
              <span>{stats.completedProjects}</span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-muted-foreground">Approved MIT solutions</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Submitted Problems vs Active Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Submitted Problems */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-[#007AFF]" />
                Recent Submitted Challenges
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Problems submitted to the institutional domain pool.
              </CardDescription>
            </div>
            <Link
              href="/dashboard/industry/problems"
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {problems.slice(0, 3).map((prob) => (
              <div
                key={prob.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:bg-white/[0.03] transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-white">
                    {prob.id}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      prob.status === "CLAIMED"
                        ? "bg-[#007AFF]/10 text-[#007AFF] border-transparent text-[10px]"
                        : "bg-blue-50 text-[#007AFF] border-blue-200 text-[10px]"
                    }
                  >
                    {prob.status === "CLAIMED" ? "Claimed by Staff" : "Available in Pool"}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground leading-snug">
                  {prob.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Domain: {prob.domain}</span>
                  {prob.claimedByFacultyName && (
                    <span className="text-purple-700 font-medium">
                      Director: {prob.claimedByFacultyName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: Active Projects & Deliverables */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FolderKanban className="size-4 text-emerald-600" />
                Collaborative Student Projects
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Student development teams building solutions under staff supervision.
              </CardDescription>
            </div>
            <Link
              href="/dashboard/industry/projects"
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              Track Deliverables
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.slice(0, 3).map((prj) => (
              <div
                key={prj.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:bg-white/[0.03] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-white">
                    {prj.id}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      prj.status === "APPROVED"
                        ? "bg-[#34C759]/10 text-[#34C759] border-transparent text-[10px]"
                        : prj.status === "SOLUTION_SUBMITTED"
                        ? "bg-[#007AFF]/10 text-[#007AFF] border-transparent text-[10px]"
                        : "bg-blue-50 text-[#007AFF] border-blue-200 text-[10px]"
                    }
                  >
                    {prj.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground leading-snug">
                  {prj.problemTitle}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Lead: {prj.studentTeamLeadName} ({prj.studentTeamLeadId})</span>
                  <span>Target: {prj.targetDeadline}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
