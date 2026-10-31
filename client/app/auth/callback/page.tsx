"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { syncOAuthRoleAction } from "@/app/actions/auth";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleSync() {
      const errorParam = searchParams.get("error");
      if (errorParam) {
        if (isMounted) setError(errorParam);
        return;
      }

      const roleParam = searchParams.get("role") as "STUDENT" | "STAFF" | null;

      try {
        const result = await syncOAuthRoleAction(roleParam || undefined);
        if (!result.success) {
          if (isMounted) setError(result.error || "Authentication verification failed.");
          return;
        }

        if (result.redirectUrl) {
          router.replace(result.redirectUrl);
        } else {
          router.replace("/dashboard");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to process session callback.");
        }
      }
    }

    handleSync();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md border-destructive/30 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-6" />
            </div>
            <CardTitle className="text-xl font-bold">Authentication Notice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="size-8 animate-spin" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Authenticating with MSME-Hub</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verifying your institutional credentials and preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
