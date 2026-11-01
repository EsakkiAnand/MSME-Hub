import * as React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  FolderKanban,
  Star,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

const navItems = [
  { href: "/dashboard/industry", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/industry/submit-problem", label: "Submit Problem", icon: PlusCircle },
  { href: "/dashboard/industry/problems", label: "My Problems", icon: FileText },
  { href: "/dashboard/industry/projects", label: "Active Projects", icon: FolderKanban },
  { href: "/dashboard/industry/ratings", label: "Ratings & Reviews", icon: Star },
  { href: "/dashboard/industry/profile", label: "Company Profile", icon: Building2 },
];

export default async function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only INDUSTRY accounts allowed
  await requireRole([UserRole.INDUSTRY]);

  return (
    <DashboardShell
      role="INDUSTRY"
      portalTitle="Industry Partner"
      portalSubtitle="MSME Enterprise Portal"
      portalIcon={Building2}
      navItems={navItems}
      defaultIdPrefix="IND"
      profileHref="/dashboard/industry/profile"
      badge={{
        label: "Verified Enterprise",
        icon: CheckCircle2,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      }}
    >
      {children}
    </DashboardShell>
  );
}
