"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { adminLoginAction } from "@/app/actions/auth";
import { AuthContainer } from "@/components/auth/auth-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MsmeFullLogo } from "@/components/ui/msme-logo";
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
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { toast } from "sonner";

export function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
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
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both administrator email and password.");
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

      if (!user) {
        toast.error("Failed to establish administrator session. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (user.role !== "MSME_ADMIN") {
        toast.error("Access Denied: This account is not provisioned as an MSME Administrator.");
        await authClient.signOut();
        setIsLoading(false);
        return;
      }

      toast.success("MSME Administrator authenticated! Redirecting to Governance Console...");
      router.refresh();
      // Replace /admin/login in browser history to prevent back-button loops
      window.location.replace("/dashboard/admin");
    } catch (err: any) {
      console.error("Admin sign in error:", err);
      toast.error(err?.message || "An unexpected error occurred during admin authentication.");
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer action="home">
      <div className="flex-1 flex flex-col">
        {/* Official Brand Logo */}
        <div className="flex justify-center mb-4">
          <MsmeFullLogo width={92} priority />
        </div>

        {/* Heading and description */}
        <div className="space-y-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            MSME Admin Login
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Central Governance &amp; Administration Console
          </p>
        </div>

        {/* Policy Banner */}
        <div className="my-5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3 text-xs text-rose-800 dark:text-rose-300 text-left space-y-0.5">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertCircle className="size-3.5 text-rose-600 shrink-0" />
            <span>Restricted Access Portal</span>
          </div>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
            Only provisioned root administrators may access this portal. Public signups are blocked per PRD §8.1.
          </p>
        </div>

        {/* Admin Form */}
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
              className="h-10 text-sm font-mono rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
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
                className="h-10 text-sm pr-10 rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4 shrink-0" />
                ) : (
                  <Eye className="size-4 shrink-0" />
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
              className="h-10 text-sm font-mono uppercase rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
            />
          </div>

          {/* Quick Pre-fill Button */}
          <button
            type="button"
            onClick={handleLoadDemoAdmin}
            className="w-full text-center text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-center gap-1 pt-1 cursor-pointer"
          >
            <Sparkles className="size-3 shrink-0" />
            <span>Reset / Load Seed Admin Credentials (Demo)</span>
          </button>

          <Button
            type="submit"
            className="w-full h-10 mt-1 font-semibold text-sm rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                <span>Authenticating Administrator...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="size-4 mr-1.5 shrink-0" />
                <span>Sign In as MSME Administrator</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer Return Link */}
      <div className="mt-auto pt-4 border-t border-border/80 mt-5 text-center">
        <Link
          href="/login"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="size-3 shrink-0" />
          <span>Return to Standard Portal (Student, Faculty, Industry Partner, Industry Expert)</span>
        </Link>
      </div>
    </AuthContainer>
  );
}
