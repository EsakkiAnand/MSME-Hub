import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only MSME_ADMIN accounts allowed
  await requireRole([UserRole.MSME_ADMIN]);

  return <DashboardShell role="MSME_ADMIN">{children}</DashboardShell>;
}
