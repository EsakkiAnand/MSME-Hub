import * as React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Lightbulb,
  Share2,
  MessageSquare,
  User,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

const navItems = [
  { href: "/dashboard/faculty", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/faculty/students", label: "My Students", icon: Users },
  { href: "/dashboard/faculty/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/faculty/project-details", label: "Project Details", icon: FileText },
  { href: "/dashboard/faculty/idea-submissions", label: "Idea Submissions", icon: Lightbulb },
  { href: "/dashboard/faculty/shared-projects", label: "Shared Projects", icon: Share2 },
  { href: "/dashboard/faculty/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/dashboard/faculty/profile", label: "My Profile", icon: User },
];

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only FACULTY and STAFF accounts allowed
  await requireRole([UserRole.STAFF]);

  return (
    <DashboardShell
      role="FACULTY"
      portalTitle="Faculty Supervisor"
      portalSubtitle="Academic Project Supervisor"
      portalIcon={BookOpen}
      navItems={navItems}
      defaultIdPrefix="FAC"
      profileHref="/dashboard/faculty/profile"
      badge={{
        label: "Verified Supervisor",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      }}
    >
      {children}
    </DashboardShell>
  );
}
