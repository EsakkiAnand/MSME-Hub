"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (session.isPending) return;

    if (!session.data?.user) {
      router.replace("/login");
      return;
    }

    const role = (session.data.user as any)?.role || "STUDENT";
    const targetPath = getRoleDashboardPath(role);
    router.replace(targetPath);
  }, [session, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span>Routing to your workspace...</span>
      </div>
    </div>
  );
}
