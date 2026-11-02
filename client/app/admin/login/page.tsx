"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { adminLoginAction } from "@/app/actions/auth";
import { PublicHeader } from "@/components/navigation/public-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ShieldCheck,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@msmehub.gov.in");
  const [password, setPassword] = useState("Admin@123456");
  const [securityKey, setSecurityKey] = useState("MSME-ADMIN-2026");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadDemoAdmin = () => {
    setEmail("admin@msmehub.gov.in");
    setPassword("Admin@123456");
    setSecurityKey("MSME-ADMIN-2026");
    toast.success("Loaded pre-seeded root MSME Administrator credentials.");
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate via Better Auth client
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: true,
      });

      if (response.error) {
        // Fall back to server action check
        const serverRes = await adminLoginAction({
          email: email.trim().toLowerCase(),
          password,
          securityKey,
        });

        if (!serverRes.success) {
          toast.error(serverRes.error || response.error.message || "Invalid administrator credentials.");
          setIsLoading(false);
          return;
        }
      }

      // 2. Verify session role
      const sessionRes = await authClient.getSession();
      const user = sessionRes?.data?.user as any;

      if (user?.role && user.role !== "MSME_ADMIN") {
        toast.error("Access Denied: This account is not provisioned as an MSME Administrator.");
        await authClient.signOut();
        setIsLoading(false);
        return;
      }

      toast.success("MSME Administrator authenticated! Redirecting to Governance Console...");
      router.refresh();
      window.location.href = "/dashboard/admin";
    } catch (err: any) {
      console.error("Admin sign in error:", err);
      toast.error(err?.message || "An unexpected error occurred during admin authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <PublicHeader action="none" />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border shadow-lg">
            <CardHeader className="space-y-2 text-center pb-4 pt-6">
              <div className="mx-auto size-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                  MSME Admin Login
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Central Governance &amp; Administration Console
                </CardDescription>
              </div>

              {/* Policy Banner */}
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3 text-xs text-rose-800 dark:text-rose-300 text-left space-y-0.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="size-3.5 text-rose-600 shrink-0" />
                  <span>Restricted Access Portal</span>
                </div>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                  Only provisioned root administrators may access this portal. Public signups are blocked per PRD §8.1.
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              <form onSubmit={handleAdminSignIn} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-email"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <Mail className="size-3.5 text-rose-500" />
                    Administrator Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@msmehub.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-10 text-sm font-mono"
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <Lock className="size-3.5 text-rose-500" />
                    Administrator Password
                  </label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-10 text-sm pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="security-key"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <KeyRound className="size-3.5 text-rose-500" />
                    Security Verification Passcode
                  </label>
                  <Input
                    id="security-key"
                    type="text"
                    placeholder="MSME-ADMIN-2026"
                    value={securityKey}
                    onChange={(e) => setSecurityKey(e.target.value)}
                    disabled={isLoading}
                    className="h-10 text-sm font-mono uppercase"
                  />
                </div>

                {/* Quick Pre-fill Button */}
                <button
                  type="button"
                  onClick={handleLoadDemoAdmin}
                  className="w-full text-center text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-center gap-1 pt-1"
                >
                  <Sparkles className="size-3" />
                  <span>Reset / Load Seed Admin Credentials (Demo)</span>
                </button>

                <Button
                  type="submit"
                  className="w-full h-10 mt-1 font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Authenticating Administrator...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4 mr-1.5" />
                      Sign In as MSME Administrator
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-3 pb-5 border-t bg-muted/10 text-center">
              <Link
                href="/login"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="size-3" />
                <span>Return to Standard Portal (Student, Faculty, Industry, Alumni)</span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

