import { requireAuth } from "@/lib/auth-server";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side authentication for all /dashboard routes
  await requireAuth();

  return <>{children}</>;
}
