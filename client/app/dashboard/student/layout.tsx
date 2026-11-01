import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only STUDENT accounts allowed
  await requireRole([UserRole.STUDENT]);

  return <DashboardShell role="STUDENT">{children}</DashboardShell>;
}
