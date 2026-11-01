import * as React from "react";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

const navItems = [
  { href: "/dashboard/admin", label: "Administration", icon: ShieldCheck, exact: true },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only MSME_ADMIN accounts allowed
  await requireRole([UserRole.MSME_ADMIN]);

  return (
    <DashboardShell
      role="MSME_ADMIN"
      portalTitle="MSME Administrator"
      portalSubtitle="Governance & Policy Portal"
      portalIcon={ShieldCheck}
      navItems={navItems}
      defaultIdPrefix="ADM"
      badge={{
        label: "Super Admin",
        icon: ShieldCheck,
        className: "bg-rose-50 text-rose-700 border-rose-200",
      }}
    >
      {children}
    </DashboardShell>
  );
}
