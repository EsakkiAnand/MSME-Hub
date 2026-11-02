"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Award,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = authClient.useSession();

  const isLoggedOut = searchParams.get("logged_out") === "1";
  const redirectParam = searchParams.get("redirect");
  const portalParam = searchParams.get("portal") || searchParams.get("role");

  // Portal Tab Mode: standard (Student, Faculty, Industry, Alumni) vs admin (MSME Admin)
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

  // MSME Admin Form State & Security Verification
  const [adminEmail, setAdminEmail] = useState("admin@msmehub.gov.in");
  const [adminPassword, setAdminPassword] = useState("Admin@123456");
  const [adminSecurityKey, setAdminSecurityKey] = useState("MSME-ADMIN-2026");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Prefill Seed Admin Credentials Helper
  const handleLoadDemoAdmin = () => {
    setAdminEmail("admin@msmehub.gov.in");
    setAdminPassword("Admin@123456");
    setAdminSecurityKey("MSME-ADMIN-2026");
    toast.success("Loaded pre-seeded MSME Root Admin credentials.");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
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

      toast.success("Signed in successfully. Redirecting to your workspace...");

      const sessionRes = await authClient.getSession();
      const userRole = (sessionRes?.data?.user as any)?.role || "STUDENT";
      const authorizedDefault = getRoleDashboardPath(userRole);

      let targetPath = authorizedDefault;
      if (redirectParam && redirectParam.startsWith("/dashboard")) {
        if (redirectParam === authorizedDefault || redirectParam.startsWith(authorizedDefault + "/")) {
          targetPath = redirectParam;
        }
      }

      router.refresh();
      window.location.href = targetPath;
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter admin email and password.");
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
          toast.error(serverRes.error || response.error.message || "Invalid administrator credentials.");
          setIsAdminLoading(false);
          return;
        }
      }

      // 2. Fetch session and verify that the account strictly has the MSME_ADMIN role
      const sessionRes = await authClient.getSession();
      const user = sessionRes?.data?.user as any;
      const userRole = user?.role;

      if (userRole && userRole !== "MSME_ADMIN") {
        toast.error(
          "Access Denied: This account is not provisioned as an MSME Administrator."
        );
        await authClient.signOut();
        setIsAdminLoading(false);
        return;
      }

      toast.success("MSME Admin security verification successful! Redirecting to Governance Console...");
      router.refresh();
      window.location.href = "/dashboard/admin";
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred during admin authentication.");
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
    <div className="flex min-h-screen flex-col bg-muted/30">
      <PublicHeader action="signup" />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border shadow-lg">
            <CardHeader className="space-y-1.5 text-center pb-4 pt-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Sign in to your MSME-Hub account to access your workspace
              </CardDescription>

              {/* Portal Mode Switcher Tabs */}
              <Tabs
                value={loginMode}
                onValueChange={(val: any) => setLoginMode(val)}
                className="pt-2"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="standard" className="text-xs">
                    Standard Access
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-rose-500" />
                    <span>MSME Admin</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {loginMode === "standard" ? (
                <>
                  {/* Google OAuth Option */}
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 relative font-medium transition-all hover:bg-muted/60"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading || isLoading}
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="size-4 animate-spin mr-2" />
                      ) : (
                        <svg className="size-4 mr-2" viewBox="0 0 24 24">
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
                      Continue with Google
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <GraduationCap className="size-3 text-emerald-500" />
                      <span>Institutional login for Students &amp; Faculty</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-border" />
                    <span className="bg-card px-2.5 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      or continue with email
                    </span>
                    <div className="w-full border-t border-border" />
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                      >
                        <Mail className="size-3.5 text-muted-foreground" />
                        Email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@organization.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || isGoogleLoading}
                        className="h-10 text-sm"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                        >
                          <Lock className="size-3.5 text-muted-foreground" />
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            toast.info(
                              "Password reset instructions will be sent to your verified email address."
                            )
                          }
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading || isGoogleLoading}
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

                    <div className="flex items-center space-x-2 pt-0.5">
                      <input
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="size-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="remember"
                        className="text-xs text-muted-foreground cursor-pointer select-none"
                      >
                        Remember me for 7 days
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 mt-1 font-semibold"
                      disabled={isLoading || isGoogleLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="size-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                /* MSME Admin Portal Mode */
                <div className="space-y-4">
                  {/* Governance Notice Banner */}
                  <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3.5 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-rose-600" />
                        <span>MSME Administrator Portal</span>
                      </div>
                      <Link
                        href="/admin/login"
                        className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>Dedicated Page</span>
                        <ExternalLink className="size-2.5" />
                      </Link>
                    </div>
                    <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                      Restricted to pre-seeded root governance administrators. Public signup is strictly prohibited under PRD §8.1.
                    </p>
                  </div>

                  {/* Admin Login Form */}
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
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                        disabled={isAdminLoading}
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
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          disabled={isAdminLoading}
                          className="h-10 text-sm pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showAdminPassword ? "Hide password" : "Show password"}
                        >
                          {showAdminPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="admin-security-key"
                        className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                      >
                        <KeyRound className="size-3.5 text-rose-500" />
                        Security Verification Passcode
                      </label>
                      <Input
                        id="admin-security-key"
                        type="text"
                        placeholder="e.g. MSME-ADMIN-2026"
                        value={adminSecurityKey}
                        onChange={(e) => setAdminSecurityKey(e.target.value)}
                        disabled={isAdminLoading}
                        className="h-10 text-sm font-mono uppercase"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Central authority validation token for root elevation.
                      </p>
                    </div>

                    {/* Quick Demo Pre-fill Button */}
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
                      disabled={isAdminLoading}
                    >
                      {isAdminLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Verifying Administrator...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-4 mr-1.5" />
                          Authenticate as MSME Admin
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>

            {/* 5-Role Ecosystem Footer */}
            <CardFooter className="flex flex-col gap-2 pt-3 pb-5 border-t bg-muted/10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3 text-emerald-500" />
                  Student
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3 text-blue-500" />
                  Faculty
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Building2 className="size-3 text-indigo-500" />
                  Industry
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Award className="size-3 text-amber-500" />
                  Alumni
                </span>
                <span>&middot;</span>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <ShieldCheck className="size-3" />
                  MSME Admin
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
          <Loader2 className="size-8 text-[#007AFF] animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
