import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export default async function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only ALUMNI accounts allowed
  await requireRole([UserRole.ALUMNI]);

  return <DashboardShell role="ALUMNI">{children}</DashboardShell>;
}
