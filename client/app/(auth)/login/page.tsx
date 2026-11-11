import { getOptionalAuth } from "@/lib/auth-server";
import { getAuthorizedUserPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginFormContent } from "@/app/login/login-form-content";
import { Loader2 } from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Sign In — FXEC MSME Hub",
  description: "Sign in to your MSME Hub workspace.",
};

export default async function AuthLoginPage() {
  const user = await getOptionalAuth();
  if (user) redirect(getAuthorizedUserPath(user.role, user.studentTrack));

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
