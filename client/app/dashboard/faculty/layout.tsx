import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only FACULTY and STAFF accounts allowed
  await requireRole([UserRole.STAFF]);

  return <DashboardShell role="FACULTY">{children}</DashboardShell>;
}
