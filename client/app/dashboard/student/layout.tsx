import * as React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Lightbulb,
  Code2,
  Trophy,
  Share2,
  MessageSquare,
  User,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/auth-server";
import { UserRole } from "@prisma/client";

const navItems = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/student/projects", label: "My Projects", icon: FolderKanban },
  { href: "/dashboard/student/project-details", label: "Project Details", icon: FileText },
  { href: "/dashboard/student/submit-idea", label: "Submit Idea", icon: Lightbulb },
  { href: "/dashboard/student/code-access", label: "Code & Project Access", icon: Code2 },
  { href: "/dashboard/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/student/shared-projects", label: "Shared Projects", icon: Share2 },
  { href: "/dashboard/student/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/dashboard/student/profile", label: "My Profile", icon: User },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side role authorization: Only STUDENT accounts allowed
  await requireRole([UserRole.STUDENT]);

  return (
    <DashboardShell
      role="STUDENT"
      portalTitle="Student Workspace"
      portalSubtitle="Academic Project Portal"
      portalIcon={GraduationCap}
      navItems={navItems}
      defaultIdPrefix="STU"
      profileHref="/dashboard/student/profile"
      badge={{
        label: "Active Scholar",
        icon: CheckCircle2,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      }}
    >
      {children}
    </DashboardShell>
  );
}
