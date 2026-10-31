"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Briefcase, CheckCircle2 } from "lucide-react";

export default function StaffDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Faculty &amp; Staff Workbench</h1>
            <Badge variant="outline" className="text-purple-600 border-purple-500/30 bg-purple-500/10">
              Project Director
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name || "Professor"}. Triage industry problems from the pool, directly assign multi-student teams, and oversee deliverables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Domain Problem Pool</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Building2 className="size-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Verified MSME challenges available to claim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Supervised Projects</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Briefcase className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active multi-student collaborative projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Idea Submissions</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Users className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Student innovation pitches awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-lg font-semibold">Faculty Director Console Active</CardTitle>
          <CardDescription className="max-w-md mx-auto text-sm mt-1">
            As verified academic faculty, you have authority to triage industry problems from the pool, assign multi-student rosters (designating a Team Lead), and manage extension requests.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
