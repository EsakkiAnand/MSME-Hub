"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, GitBranch, Lightbulb, CheckCircle2, Clock } from "lucide-react";

export default function StudentDashboardPage() {
  const session = authClient.useSession();
  const user = session?.data?.user;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Student Builder Workspace</h1>
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
              Verified Student
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name || "Student"}. Collaborate on active industry problems (capped at 2 active projects) and submit open-source solutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Active Projects</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0 / 2</span>
              <GitBranch className="size-5 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Max 2 concurrent active projects strictly enforced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Submitted Ideas</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <Lightbulb className="size-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Independent innovation ideas for staff review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Guidance Threads</CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-center justify-between">
              <span>0</span>
              <GraduationCap className="size-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Alumni mentor queries and endorsements</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-lg font-semibold">Your Student Portfolio is Active</CardTitle>
          <CardDescription className="max-w-md mx-auto text-sm mt-1">
            Faculty members directly assign student teams from claimed industry problems. Once assigned, you will receive an invitation here to collaborate.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
