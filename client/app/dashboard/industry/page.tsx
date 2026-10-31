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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <Loader2 className="size-8 animate-spin text-[#1d4ed8] mb-3" />
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
      <div className="bg-gradient-to-r from-[#0f2744] via-[#163357] to-[#1e40af] rounded-xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-400/20 text-blue-300 border border-blue-400/30">
                Verified MSME Partner
              </span>
              <CopyIdBadge id={profile?.companyId || "HTMP001"} label="Company ID" size="xs" />
              <CopyIdBadge id={data?.user?.uniqueId || "IND0001"} label="Partner ID" size="xs" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              {profile?.companyName || "MSME Enterprise"}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Udyam No: <span className="font-mono text-white font-medium">{profile?.udyamRegNo || "UDYAM-TN-01-XXXX"}</span> • Sector: {profile?.domain || "General Industry"}.
              Submit authentic engineering bottlenecks and collaborate with student project teams under faculty supervision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/dashboard/industry/submit-problem">
              <Button
                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs h-9"
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
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-slate-500">
              Submitted
            </CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center justify-between">
              <span>{stats.totalSubmitted}</span>
              <FileText className="size-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-slate-500">Total operational challenges</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-slate-500">
              In Domain Pool
            </CardDescription>
            <CardTitle className="text-2xl font-black text-blue-600 flex items-center justify-between">
              <span>{stats.availableInPool}</span>
              <Clock className="size-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-slate-500">Open for faculty claiming</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-slate-500">
              Claimed by Staff
            </CardDescription>
            <CardTitle className="text-2xl font-black text-purple-600 flex items-center justify-between">
              <span>{stats.claimedByFaculty}</span>
              <Building2 className="size-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-slate-500">Assigned into project teams</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-slate-500">
              Active Projects
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600 flex items-center justify-between">
              <span>{stats.activeProjects}</span>
              <FolderKanban className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-slate-500">Under student development</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white col-span-2 sm:col-span-1">
          <CardHeader className="pb-1.5 pt-4 px-4">
            <CardDescription className="text-[11px] uppercase font-semibold text-slate-500">
              Completed &amp; Rated
            </CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600 flex items-center justify-between">
              <span>{stats.completedProjects}</span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-[11px] text-slate-500">Approved MIT solutions</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Submitted Problems vs Active Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Submitted Problems */}
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="size-4 text-[#1d4ed8]" />
                Recent Submitted Challenges
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Problems submitted to the institutional domain pool.
              </CardDescription>
            </div>
            <Link
              href="/dashboard/industry/problems"
              className="text-xs font-semibold text-[#1d4ed8] hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {problems.slice(0, 3).map((prob) => (
              <div
                key={prob.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-white">
                    {prob.id}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      prob.status === "CLAIMED"
                        ? "bg-purple-50 text-purple-700 border-purple-200 text-[10px]"
                        : "bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                    }
                  >
                    {prob.status === "CLAIMED" ? "Claimed by Staff" : "Available in Pool"}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {prob.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
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
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="size-4 text-emerald-600" />
                Collaborative Student Projects
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Student development teams building solutions under staff supervision.
              </CardDescription>
            </div>
            <Link
              href="/dashboard/industry/projects"
              className="text-xs font-semibold text-[#1d4ed8] hover:underline flex items-center gap-1"
            >
              Track Deliverables
              <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.slice(0, 3).map((prj) => (
              <div
                key={prj.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-white">
                    {prj.id}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      prj.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                        : prj.status === "SOLUTION_SUBMITTED"
                        ? "bg-purple-50 text-purple-700 border-purple-200 text-[10px]"
                        : "bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                    }
                  >
                    {prj.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {prj.problemTitle}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
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
