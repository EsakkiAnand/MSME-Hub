"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = authClient.useSession();
  const user = session?.data?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign out.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              M
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">MSME-Hub</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
                Workspace
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2 text-xs">
                <UserCircle className="size-4 text-muted-foreground" />
                <span className="font-medium text-foreground hidden sm:inline-block">
                  {user.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase">
                  {(user as any)?.role || "USER"}
                </span>
              </div>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
