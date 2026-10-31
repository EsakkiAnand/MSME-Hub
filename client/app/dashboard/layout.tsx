export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Role-specific sub-layouts (student, staff, industry, alumni, admin)
  // manage their own full-page UI shell (sidebar + header).
  // This parent layout is a transparent pass-through.
  return <>{children}</>;
}
