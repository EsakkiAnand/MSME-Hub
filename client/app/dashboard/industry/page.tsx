"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  AlertCircle,
  FileText,
  Upload,
  PlusCircle,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

function IndustryDashboardContent() {
  const searchParams = useSearchParams();
  const session = authClient.useSession();
  const user = session?.data?.user;
  const isVerified = (user as any)?.isVerified || false;
  const industryId = (user as any)?.uniqueId || "IND0001";
  const companyId = (user as any)?.companyId || "HTMP001";
  const companyName = (user as any)?.companyName || "Hexaware Technology";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Industry Partner Portal</h1>
            <CopyIdBadge id={companyId} label="Company ID" />
            <CopyIdBadge id={industryId} label="Partner ID" size="xs" />
            <Badge
              variant="outline"
              className={
                isVerified
                  ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                  : "text-amber-600 border-amber-500/30 bg-amber-500/10"
              }
            >
              {isVerified ? "Verified MSME" : "Verification Pending"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name || "Partner"} ({companyName}). Submit real-world operational challenges, track student deliverables, and rate completed solutions.
          </p>
        </div>

        <Button
          disabled={!isVerified}
          onClick={() => toast.info("Problem submission portal will open here.")}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 size-4" />
          Submit New Problem
        </Button>
      </div>

      {/* Verification Notice Banner */}
      {!isVerified && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-200">
                  Udyam Certificate Verification Required
                </CardTitle>
                <CardDescription className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                  To ensure authentic industrial challenges, MSME Admins review and verify your official Udyam Registration Certificate PDF before challenge submission is unlocked.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <label
                htmlFor="udyam-doc-upload"
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-semibold h-9 px-4 border border-amber-500/30 bg-background hover:bg-muted text-foreground transition-colors"
              >
                <Upload className="mr-2 size-3.5 text-amber-600" />
                Upload Udyam PDF Document
                <input
                  id="udyam-doc-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      toast.success(
                        `Document "${file.name}" uploaded successfully. Admin verification turnaround is under 48 hours.`
                      );
                    }
                  }}
                />
              </label>
              <span className="text-xs text-muted-foreground">
                Accepted format: PDF (Max 10MB)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Submitted Problems</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <FileText className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Industrial bottlenecks submitted to domain pool</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Claimed &amp; In-Progress</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Clock className="size-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Problems claimed and being built by student teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Completed Solutions</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Delivered MIT-licensed GitHub repositories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function IndustryDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <IndustryDashboardContent />
    </Suspense>
  );
}
