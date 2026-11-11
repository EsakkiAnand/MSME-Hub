import { requireAuth } from "@/lib/auth-server";
import { getAuthorizedUserPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const user = await requireAuth();
  const targetPath = getAuthorizedUserPath(user.role, user.studentTrack);
  redirect(targetPath);
}
