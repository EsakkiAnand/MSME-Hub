import { getOptionalAuth } from "@/lib/auth-server";
import { getAuthorizedUserPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { SignupFormContent } from "@/app/signup/signup-form-content";

export const instant = false;

export const metadata = {
  title: "Create Account — FXEC MSME Hub",
  description: "Create your MSME Hub account.",
};

export default async function AuthSignupPage() {
  const user = await getOptionalAuth();
  if (user) redirect(getAuthorizedUserPath(user.role, user.studentTrack));

  return <SignupFormContent />;
}
