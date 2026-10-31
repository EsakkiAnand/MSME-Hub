"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StaffRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/faculty");
  }, [router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
        <Loader2 className="size-6 animate-spin text-blue-600" />
        <span>Redirecting to Faculty Dashboard...</span>
      </div>
    </div>
  );
}
