"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
        toast.error(response.error.message || "Invalid credentials. Please check your email and password.");
        setIsLoading(false);
        return;
      }

      toast.success("Signed in successfully. Redirecting to your workspace...");

      // Fetch active session to extract user role for targeted dashboard routing
      const sessionRes = await authClient.getSession();
      const userRole = (sessionRes?.data?.user as any)?.role || "STUDENT";
      const targetPath = getRoleDashboardPath(userRole);

      router.push(targetPath);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred during sign in.");
      setIsLoading(false);
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
      {/* Top Navigation Bar */}
      <header className="w-full border-b bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              M
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">MSME-Hub</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground">
                Innovation Platform
              </span>
            </div>
          </Link>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border shadow-lg">
            <CardHeader className="space-y-1.5 text-center pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Sign in to your MSME-Hub account to access your workspace
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
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
              <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                        toast.info("Password reset instructions will be sent to your verified email address.")
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

                <div className="flex items-center space-x-2 pt-1">
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
                  className="w-full h-10 mt-2 font-semibold"
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
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2 pb-6 border-t bg-muted/10 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Building2 className="size-3 text-blue-500" />
                <span>Industry</span>
                <span>•</span>
                <GraduationCap className="size-3 text-emerald-500" />
                <span>Academic</span>
                <span>•</span>
                <ShieldCheck className="size-3 text-rose-500" />
                <span>MSME Governance</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
