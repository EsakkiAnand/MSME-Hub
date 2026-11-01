import * as React from "react";
import {
  LayoutDashboard,
  HelpCircle,
  FolderKanban,
  History,
  User,
  Award,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

const navItems = [
  { href: "/dashboard/alumni", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/alumni/guidance", label: "Guidance Requests", icon: HelpCircle },
  { href: "/dashboard/alumni/projects", label: "Mentored Projects", icon: FolderKanban },
  { href: "/dashboard/alumni/history", label: "Guidance History", icon: History },
  { href: "/dashboard/alumni/profile", label: "My Profile", icon: User },
];

export default async function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only ALUMNI accounts allowed
  await requireRole([UserRole.ALUMNI]);

  return (
    <DashboardShell
      role="ALUMNI"
      portalTitle="Alumni Mentor"
      portalSubtitle="Mentorship & Guidance Portal"
      portalIcon={Award}
      navItems={navItems}
      defaultIdPrefix="ALM"
      profileHref="/dashboard/alumni/profile"
      badge={{
        label: "Verified Mentor",
        icon: CheckCircle2,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      }}
    >
      {children}
    </DashboardShell>
  );
}
