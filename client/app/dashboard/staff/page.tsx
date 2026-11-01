import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function StaffRedirectPage() {
  await requireRole([UserRole.STAFF]);
  redirect("/dashboard/faculty");
}
