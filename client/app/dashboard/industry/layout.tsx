import * as React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

export default async function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only INDUSTRY accounts allowed
  await requireRole([UserRole.INDUSTRY]);

  return <DashboardShell role="INDUSTRY">{children}</DashboardShell>;
}
