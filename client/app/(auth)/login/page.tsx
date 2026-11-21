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

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isLoggedOut = params.logged_out === "1";
  const forceSwitch = params.switch === "1" || params.switch === "true";

  let user = null;
  if (!isLoggedOut && !forceSwitch) {
    user = await getOptionalAuth();
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginFormContent
        currentUser={
          user
            ? {
                name: user.name,
                email: user.email,
                role: user.role,
                studentTrack: user.studentTrack,
              }
            : null
        }
      />
    </Suspense>
  );
}
