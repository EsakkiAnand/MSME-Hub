"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { adminLoginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MsmeFullLogo } from "@/components/ui/msme-logo";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface LoginFormContentProps {
  /** @deprecated — navigation is now handled by the (auth) layout */
  onSwitchToSignup?: () => void;
}

export function LoginFormContent({ onSwitchToSignup }: LoginFormContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoggedOut = searchParams.get("logged_out") === "1";
  const redirectParam = searchParams.get("redirect");
  const portalParam = searchParams.get("portal") || searchParams.get("role");

  // Portal Mode: standard (Student, Faculty, Industry, Alumni) vs admin (MSME Admin)
  const [loginMode, setLoginMode] = useState<"standard" | "admin">(
    portalParam === "admin" ? "admin" : "standard"
  );

  useEffect(() => {
    if (portalParam === "admin") {
      setLoginMode("admin");
    }
  }, [portalParam]);

  // Standard Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // MSME Admin Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminSecurityKey, setAdminSecurityKey] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const handleLoadDemoAdmin = () => {
    setAdminEmail("admin@msmehub.gov.in");
    setAdminPassword("Admin@123456");
    setAdminSecurityKey("MSME-ADMIN-2026");
    toast.success("Loaded pre-seeded root MSME Administrator credentials.");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (response.error) {
        toast.error(
          response.error.message ||
            "Invalid credentials. Please check your email and password."
        );
        setIsLoading(false);
        return;
      }

      const sessionRes = await authClient.getSession();
      const user = sessionRes?.data?.user as any;

      if (!user) {
        toast.error("Failed to establish authenticated session. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Signed in successfully. Redirecting to your workspace...");

      const userRole = user.role || "STUDENT";
      const authorizedDefault = getRoleDashboardPath(userRole);

      let targetPath = authorizedDefault;
      if (redirectParam && redirectParam.startsWith("/dashboard")) {
        if (
          redirectParam === authorizedDefault ||
          redirectParam.startsWith(authorizedDefault + "/")
        ) {
          targetPath = redirectParam;
        }
      }

      router.refresh();
      // Replace /login in browser history to prevent Back navigation loops
      window.location.replace(targetPath);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      toast.error("Please enter administrator email and password.");
      return;
    }

    setIsAdminLoading(true);
    try {
      // 1. Authenticate with credentials via Better Auth
      const response = await authClient.signIn.email({
        email: adminEmail.trim().toLowerCase(),
        password: adminPassword,
        rememberMe: true,
      });

      if (response.error) {
        // Fall back to server action
        const serverRes = await adminLoginAction({
          email: adminEmail.trim().toLowerCase(),
          password: adminPassword,
          securityKey: adminSecurityKey,
        });

        if (!serverRes.success) {
          toast.error(
            serverRes.error ||
              response.error.message ||
              "Invalid administrator credentials."
          );
          setIsAdminLoading(false);
          return;
        }
      }

      // 2. Verify account strictly holds MSME_ADMIN role
      const sessionRes = await authClient.getSession();
      const user = sessionRes?.data?.user as any;

      if (!user) {
        toast.error(
          "Failed to establish administrator session. Please check your credentials."
        );
        setIsAdminLoading(false);
        return;
      }

      if (user.role !== "MSME_ADMIN") {
        toast.error(
          "Access Denied: This account is not provisioned as an MSME Administrator."
        );
        await authClient.signOut();
        setIsAdminLoading(false);
        return;
      }

      toast.success(
        "MSME Admin security verification successful! Redirecting..."
      );
      router.refresh();
      // Replace /login in browser history so Back button doesn't trap on login
      window.location.replace("/dashboard/admin");
    } catch (err: any) {
      toast.error(
        err?.message || "An unexpected error occurred during admin authentication."
      );
      setIsAdminLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to initiate Google sign in.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full justify-between">
      <div className="flex-1 flex flex-col">
        {/* Official Brand Logo */}
        <div className="flex justify-center mb-4">
          <MsmeFullLogo width={92} priority />
        </div>

        {/* 1. Welcome heading and short description */}
        <div className="space-y-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sign in to your MSME-Hub account to access your workspace
          </p>
        </div>

        {/* 2. Standard Access / MSME Admin access selector */}
        <div
          className="w-full p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-1 my-5"
          role="tablist"
          aria-label="Sign in access type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={loginMode === "standard"}
            onClick={() => setLoginMode("standard")}
            className={cn(
              "h-9 text-xs sm:text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer",
              loginMode === "standard"
                ? "bg-white dark:bg-[#1C1C1E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Standard Access
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={loginMode === "admin"}
            onClick={() => setLoginMode("admin")}
            className={cn(
              "h-9 text-xs sm:text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer",
              loginMode === "admin"
                ? "bg-white dark:bg-[#1C1C1E] text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShieldCheck
              className={cn(
                "size-3.5 shrink-0",
                loginMode === "admin"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              )}
            />
            <span>MSME Admin</span>
          </button>
        </div>

        {loginMode === "standard" ? (
          <>
            {/* Standard Authentication Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {/* 3. Email address field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com or name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                  autoComplete="email"
                />
              </div>

              {/* 4. Password field with show/hide functionality */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || isGoogleLoading}
                    className="h-10 text-sm pr-10 rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
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

              {/* 5. Remember me and Forgot password options */}
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 pt-0.5 text-xs">
                <label
                  htmlFor="remember"
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-border text-[#14283F] focus:ring-[#14283F] accent-[#14283F]"
                  />
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    Remember me for 7 days
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Password reset instructions will be sent to your verified email address."
                    )
                  }
                  className="text-muted-foreground hover:text-foreground font-medium underline-offset-4 hover:underline transition-colors ml-auto cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* 6. Primary Sign In button */}
              <Button
                type="submit"
                className="w-full h-10 font-medium text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="size-4 ml-1.5 shrink-0" />
                  </>
                )}
              </Button>
            </form>

            {/* 7. Clean horizontal divider with "OR" */}
            <div
              className="flex items-center gap-3 my-5"
              aria-hidden="true"
            >
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 select-none">
                OR
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* 8. Continue with Google button */}
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 flex items-center justify-center gap-2.5 font-medium text-sm rounded-lg border-border hover:bg-muted/50 transition-colors"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />
                ) : (
                  <svg
                    className="size-4 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </Button>

              {/* 9. Institutional login option for Students and Faculty */}
              <div className="pt-0.5 text-center">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
                >
                  <GraduationCap className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Institutional SSO for Students &amp; Faculty</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* MSME Admin Portal Mode */
          <div className="space-y-4">
            {/* Admin Login Form */}
            <form onSubmit={handleAdminSignIn} className="space-y-3.5">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-foreground"
                >
                  Administrator Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@msmehub.gov.in"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  disabled={isAdminLoading}
                  className="h-10 text-sm font-mono rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-foreground"
                >
                  Administrator Password
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showAdminPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    disabled={isAdminLoading}
                    className="h-10 text-sm pr-10 rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
                    aria-label={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? (
                      <EyeOff className="size-4 shrink-0" />
                    ) : (
                      <Eye className="size-4 shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-security-key"
                  className="block text-xs font-semibold text-foreground"
                >
                  Security Verification Passcode
                </label>
                <Input
                  id="admin-security-key"
                  type="text"
                  placeholder="e.g. MSME-ADMIN-2026"
                  value={adminSecurityKey}
                  onChange={(e) => setAdminSecurityKey(e.target.value)}
                  disabled={isAdminLoading}
                  className="h-10 text-sm font-mono uppercase rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                />
                <p className="text-[10px] text-muted-foreground">
                  Central authority validation token for root elevation.
                </p>
              </div>

              {/* Quick Demo Pre-fill Button */}
              <button
                type="button"
                onClick={handleLoadDemoAdmin}
                className="w-full text-center text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-center gap-1 pt-1 cursor-pointer"
              >
                <Sparkles className="size-3" />
                <span>Reset / Load Seed Admin Credentials (Demo)</span>
              </button>

              <Button
                type="submit"
                className="w-full h-10 mt-1 font-semibold text-sm rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                disabled={isAdminLoading}
              >
                {isAdminLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                    <span>Verifying Administrator...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4 mr-1.5 shrink-0" />
                    <span>Authenticate as MSME Admin</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Footer Block */}
      <div className="mt-auto pt-4 space-y-2 text-center">
        <div className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2.5 rounded-md hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
          >
            <ArrowLeft className="size-3" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
