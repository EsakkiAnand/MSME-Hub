import { requireAuth } from "@/lib/auth-server";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const user = await requireAuth();
  const targetPath = getRoleDashboardPath(user.role);
  redirect(targetPath);
}
