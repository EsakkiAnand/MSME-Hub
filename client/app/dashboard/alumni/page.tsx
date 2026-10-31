"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, AlertCircle, HelpCircle, GitBranch, ThumbsUp } from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

export default function AlumniDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;
  const isVerified = (user as any)?.isVerified || false;
  const alumniId = (user as any)?.uniqueId || "ALU0001";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Alumni Mentorship Hub</h1>
            <CopyIdBadge id={alumniId} label="Alumni ID" />
            <Badge
              variant="outline"
              className={
                isVerified
                  ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                  : "text-amber-600 border-amber-500/30 bg-amber-500/10"
              }
            >
              {isVerified ? "Verified Mentor" : "Verification Queue"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name || "Mentor"}. Guide engineering students, provide architectural feedback on GitHub deliverables, and earn helpful endorsements.
          </p>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {!isVerified && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="py-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-200">
                  Profile Awaiting 1-Click Faculty Approval
                </CardTitle>
                <CardDescription className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                  Your alumni credentials have been submitted to the institutional verification queue. Once verified by university faculty, you will be able to answer Guidance Board queries and critique project repositories.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Open Guidance Requests</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <HelpCircle className="size-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Questions from student builders on Guidance Board</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Projects Reviewed</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <GitBranch className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Student GitHub repositories critiqued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Helpful Endorsements</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <ThumbsUp className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Endorsements awarded by student teams</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
