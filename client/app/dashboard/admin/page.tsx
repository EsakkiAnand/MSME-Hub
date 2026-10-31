"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Building2, CheckCircle2, GitBranch, Star } from "lucide-react";

export default function AdminDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">MSME Ecosystem Administration</h1>
            <Badge variant="outline" className="text-rose-600 border-rose-500/30 bg-rose-500/10">
              Super Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name || "Administrator"}. Manage industry approvals, review solution GitHub deliverables, and moderate low industry satisfaction ratings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Pending MSMEs</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Building2 className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Industry registrations needing verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Solution Gate</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <GitBranch className="size-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">GitHub solutions submitted for admin sign-off</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Rating Moderation</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Star className="size-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ratings &le; 2 stars queued for mediation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">System Health</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span className="text-emerald-500 text-xl font-bold">Optimal</span>
              <ShieldCheck className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Prisma 7 + Neon PostgreSQL connected</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-lg font-semibold">MSME-Hub Governance Active</CardTitle>
          <CardDescription className="max-w-md mx-auto text-sm mt-1">
            Root administrator accounts are provisioned via CLI seed scripts. From this console, you will verify corporate Udyam filings and supervise project solution quality.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
