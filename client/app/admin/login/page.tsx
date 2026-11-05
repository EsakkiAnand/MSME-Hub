import { getOptionalAuth } from "@/lib/auth-server";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./admin-login-form";

export const instant = false;

/**
 * Server Component for /admin/login route.
 * Enforces server-side authentication check:
 * - If user is already authenticated as MSME_ADMIN, redirects to /dashboard/admin.
 * - If user is already authenticated as another role, redirects to their role dashboard.
 * - If unauthenticated, renders the admin login form.
 */
export default async function AdminLoginPage() {
  const user = await getOptionalAuth();
  if (user) {
    if (user.role === "MSME_ADMIN") {
      redirect("/dashboard/admin");
    } else {
      redirect(getRoleDashboardPath(user.role));
    }
  }

  return <AdminLoginForm />;
}
