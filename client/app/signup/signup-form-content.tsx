"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import {
  registerIndustryAction,
  registerAlumniAction,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOSSelect } from "@/components/ui/ios-select";
import { MsmeFullLogo } from "@/components/ui/msme-logo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface SignupFormContentProps {
  /** @deprecated — navigation is now handled by the (auth) layout */
  onSwitchToLogin?: () => void;
}

export function SignupFormContent({ onSwitchToLogin }: SignupFormContentProps) {
  const router = useRouter();
  const session = authClient.useSession();

  // If already authenticated with a valid session, navigate to the user's role dashboard
  useEffect(() => {
    if (!session.isPending && session.data?.user) {
      const userRole = (session.data.user as any)?.role || "STUDENT";
      const targetPath = getRoleDashboardPath(userRole);
      router.replace(targetPath);
    }
  }, [session.isPending, session.data?.user, router]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"academic" | "industry" | "alumni">("academic");

  // Academic State
  const [academicRole, setAcademicRole] = useState<"STUDENT" | "STAFF">("STUDENT");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Industry State - Initial Registration collects only essential details
  const [industryCompanyName, setIndustryCompanyName] = useState("");
  const [industryEmail, setIndustryEmail] = useState("");
  const [industryContactName, setIndustryContactName] = useState("");
  const [industryDesignation, setIndustryDesignation] = useState("");
  const [industryPassword, setIndustryPassword] = useState("");
  const [isIndustrySubmitting, setIsIndustrySubmitting] = useState(false);
  const [showIndustryPassword, setShowIndustryPassword] = useState(false);

  // Alumni State
  const [alumniName, setAlumniName] = useState("");
  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniPassword, setAlumniPassword] = useState("");
  const [alumniDegree, setAlumniDegree] = useState("");
  const [alumniPassoutYear, setAlumniPassoutYear] = useState<number | "">("");
  const [alumniCompany, setAlumniCompany] = useState("");
  const [alumniRole, setAlumniRole] = useState("");
  const [alumniLinkedin, setAlumniLinkedin] = useState("");
  const [isAlumniSubmitting, setIsAlumniSubmitting] = useState(false);
  const [showAlumniPassword, setShowAlumniPassword] = useState(false);

  // Handlers
  const handleGoogleAcademicSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `/auth/callback?role=${academicRole}`,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to initiate Google institutional signup.");
      setIsGoogleLoading(false);
    }
  };

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !industryCompanyName.trim() ||
      !industryEmail.trim() ||
      !industryContactName.trim() ||
      !industryDesignation.trim() ||
      !industryPassword
    ) {
      toast.error("Please fill in all essential industry registration details.");
      return;
    }

    if (industryPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsIndustrySubmitting(true);
    try {
      const res = await registerIndustryAction({
        name: industryCompanyName.trim(),
        companyName: industryCompanyName.trim(),
        contactName: industryContactName.trim(),
        designation: industryDesignation.trim(),
        email: industryEmail.trim().toLowerCase(),
        password: industryPassword,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to register industry account.");
        setIsIndustrySubmitting(false);
        return;
      }

      // Authenticate with the newly created credentials to establish a verified session
      const signInRes = await authClient.signIn.email({
        email: industryEmail.trim().toLowerCase(),
        password: industryPassword,
        rememberMe: true,
      });

      if (signInRes.error) {
        toast.success("Industry partner registered successfully. Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Industry partner registered successfully! Redirecting to workspace...");
      window.location.replace("/dashboard/industry?status=registered");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
      setIsIndustrySubmitting(false);
    }
  };

  const handleAlumniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !alumniName ||
      !alumniEmail ||
      !alumniPassword ||
      !alumniDegree ||
      !alumniCompany ||
      !alumniRole ||
      !alumniPassoutYear
    ) {
      toast.error("Please fill in all required alumni mentor fields.");
      return;
    }

    if (alumniPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsAlumniSubmitting(true);
    try {
      const res = await registerAlumniAction({
        name: alumniName,
        email: alumniEmail,
        password: alumniPassword,
        degree: alumniDegree,
        passoutYear: Number(alumniPassoutYear),
        currentCompany: alumniCompany,
        currentRole: alumniRole,
        linkedinUrl: alumniLinkedin || undefined,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to register alumni account.");
        setIsAlumniSubmitting(false);
        return;
      }

      // Authenticate with the newly created credentials to establish a verified session
      const signInRes = await authClient.signIn.email({
        email: alumniEmail.trim().toLowerCase(),
        password: alumniPassword,
        rememberMe: true,
      });

      if (signInRes.error) {
        toast.success("Alumni mentor profile submitted successfully. Please sign in.");
        router.push("/login");
        return;
      }

      toast.success("Alumni mentor registered successfully! Redirecting to workspace...");
      window.location.replace("/dashboard/alumni?status=registered");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
      setIsAlumniSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full justify-between">
      <div className="flex-1 flex flex-col">
        {/* Official Brand Logo */}
        <div className="flex justify-center mb-4">
          <MsmeFullLogo width={92} priority />
        </div>

        {/* Welcome heading and short description */}
        <div className="space-y-1 text-center">
          <div className="flex justify-center mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
              <Sparkles className="size-3 shrink-0" />
              <span>Role-Governed Innovation Portal</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select your persona to join the collaborative ecosystem
          </p>
        </div>

        {/* Role / Persona Selector Tabs */}
        <div className="my-5">
          <Tabs
            value={activeTab}
            onValueChange={(val: string) => setActiveTab(val as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full h-11 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 gap-1">
              <TabsTrigger
                value="academic"
                className="h-9 text-xs sm:text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-xs text-muted-foreground hover:text-foreground min-w-0"
              >
                <GraduationCap className="size-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Academic</span>
              </TabsTrigger>
              <TabsTrigger
                value="industry"
                className="h-9 text-xs sm:text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-xs text-muted-foreground hover:text-foreground min-w-0"
              >
                <Building2 className="size-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Industry</span>
              </TabsTrigger>
              <TabsTrigger
                value="alumni"
                className="h-9 text-xs sm:text-[13px] font-medium rounded-lg transition-all duration-150 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-[#1C1C1E] data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-xs text-muted-foreground hover:text-foreground min-w-0"
              >
                <Award className="size-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Alumni</span>
              </TabsTrigger>
            </TabsList>

            {/* ---------------- Tab 1: Academic ---------------- */}
            <TabsContent value="academic" className="space-y-4 pt-1 outline-none">
              <div className="rounded-xl border border-border/80 bg-card p-3.5 space-y-2.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Choose Academic Role
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setAcademicRole("STUDENT")}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-all select-none",
                      academicRole === "STUDENT"
                        ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-2xs"
                        : "border-border hover:border-emerald-500/40 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="size-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm">Student Builder</span>
                      </div>
                      {academicRole === "STUDENT" && (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Solve MSME challenges, build GitHub deliverables, and pitch ideas.
                    </p>
                  </div>

                  <div
                    onClick={() => setAcademicRole("STAFF")}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-all select-none",
                      academicRole === "STAFF"
                        ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500 shadow-2xs"
                        : "border-border hover:border-purple-500/40 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-4 text-purple-500 shrink-0" />
                        <span className="font-semibold text-xs sm:text-sm">Faculty / Staff</span>
                      </div>
                      {academicRole === "STAFF" && (
                        <CheckCircle2 className="size-4 text-purple-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Claim domain problems, assign multi-student teams, and direct projects.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/40 p-3 flex items-start gap-2.5">
                <Info className="size-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-medium">Institutional Domain Requirement:</strong>{" "}
                  Academic sign-up requires Google Workspace OAuth using your official institutional email
                  (e.g., <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">@college.edu</code>).
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleAcademicSignup}
                disabled={isGoogleLoading}
                className="w-full h-10 flex items-center justify-center gap-2.5 font-medium text-sm rounded-lg border border-border bg-background text-foreground hover:bg-muted/50 transition-colors shadow-xs"
              >
                {isGoogleLoading ? (
                  <Loader2 className="size-4 animate-spin shrink-0 text-muted-foreground" />
                ) : (
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
                <span>Sign up with Google as {academicRole === "STUDENT" ? "Student" : "Faculty"}</span>
              </Button>
            </TabsContent>

            {/* ---------------- Tab 2: Industry Partner ---------------- */}
            <TabsContent value="industry" className="space-y-4 pt-1 outline-none">
              <form onSubmit={handleIndustrySubmit} className="space-y-3.5">
                {/* Field 1: Name (Company / Organization Name) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="size-3.5 text-muted-foreground" />
                    Company / Organization Name *
                  </label>
                  <Input
                    placeholder="e.g. Hexaware Technologies / Apex Tex Machineries"
                    value={industryCompanyName}
                    onChange={(e) => setIndustryCompanyName(e.target.value)}
                    required
                    className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    autoComplete="organization"
                  />
                </div>

                {/* Field 2: Email Address (Allows any email address) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="name@company.com or name@gmail.com"
                    value={industryEmail}
                    onChange={(e) => setIndustryEmail(e.target.value)}
                    required
                    className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    autoComplete="email"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    You can register using any valid email address (corporate, business, or personal).
                  </p>
                </div>

                {/* Fields 3 & 4: Contact Name & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="size-3.5 text-muted-foreground" />
                      Contact Name *
                    </label>
                    <Input
                      placeholder="e.g. K. Ramanathan"
                      value={industryContactName}
                      onChange={(e) => setIndustryContactName(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                      autoComplete="name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-muted-foreground" />
                      Designation *
                    </label>
                    <Input
                      placeholder="e.g. Managing Director / Operations Head"
                      value={industryDesignation}
                      onChange={(e) => setIndustryDesignation(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>
                </div>

                {/* Field 5: Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-muted-foreground" />
                    Password (min 8 characters) *
                  </label>
                  <div className="relative">
                    <Input
                      type={showIndustryPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={industryPassword}
                      onChange={(e) => setIndustryPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-10 text-sm pr-10 rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowIndustryPassword(!showIndustryPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
                      aria-label={showIndustryPassword ? "Hide password" : "Show password"}
                    >
                      {showIndustryPassword ? (
                        <EyeOff className="size-4 shrink-0" />
                      ) : (
                        <Eye className="size-4 shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Streamlined Onboarding Notice */}
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                  <Info className="size-4 text-blue-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">
                    <strong>Streamlined MSME Onboarding:</strong> Initial registration collects only your essential entity and contact details. Secondary credentials like your Udyam PDF can be updated later from your company dashboard.
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isIndustrySubmitting}
                  className="w-full h-10 font-medium text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs mt-2"
                >
                  {isIndustrySubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                      Creating Industry Account...
                    </>
                  ) : (
                    <>
                      <span>Register Organization</span>
                      <ArrowRight className="size-4 ml-1.5 shrink-0" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* ---------------- Tab 3: Alumni Mentor ---------------- */}
            <TabsContent value="alumni" className="space-y-4 pt-1 outline-none">
              <form onSubmit={handleAlumniSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Full Name *
                    </label>
                    <Input
                      placeholder="Jane Smith"
                      value={alumniName}
                      onChange={(e) => setAlumniName(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Personal / Work Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="jane.smith@alumni.org"
                      value={alumniEmail}
                      onChange={(e) => setAlumniEmail(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Password (min 8 characters) *
                  </label>
                  <div className="relative">
                    <Input
                      type={showAlumniPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={alumniPassword}
                      onChange={(e) => setAlumniPassword(e.target.value)}
                      required
                      minLength={8}
                      className="h-10 text-sm pr-10 rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAlumniPassword(!showAlumniPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
                      aria-label={showAlumniPassword ? "Hide password" : "Show password"}
                    >
                      {showAlumniPassword ? (
                        <EyeOff className="size-4 shrink-0" />
                      ) : (
                        <Eye className="size-4 shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Degree / Discipline *
                    </label>
                    <Input
                      placeholder="B.E. Computer Science"
                      value={alumniDegree}
                      onChange={(e) => setAlumniDegree(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Graduation Year *
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 2022"
                      value={alumniPassoutYear}
                      onChange={(e) =>
                        setAlumniPassoutYear(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      required
                      min={1960}
                      max={2035}
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Current Company / Employer *
                    </label>
                    <Input
                      placeholder="Google / Tech Corp"
                      value={alumniCompany}
                      onChange={(e) => setAlumniCompany(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Current Job Title / Role *
                    </label>
                    <Input
                      placeholder="Senior Solutions Architect"
                      value={alumniRole}
                      onChange={(e) => setAlumniRole(e.target.value)}
                      required
                      className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    LinkedIn Profile URL (Optional)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/janesmith"
                    value={alumniLinkedin}
                    onChange={(e) => setAlumniLinkedin(e.target.value)}
                    className="h-10 text-sm rounded-lg border-black/[0.1] dark:border-white/[0.12] focus-visible:border-[#14283F] focus-visible:ring-[#14283F]/20"
                  />
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Info className="size-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">
                    <strong>1-Click Staff Verification:</strong> Alumni profiles are verified by academic faculty before student guidance threads and mentorship endorsements are unlocked.
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isAlumniSubmitting}
                  className="w-full h-10 font-medium text-sm rounded-lg bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs mt-2"
                >
                  {isAlumniSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                      Creating Mentor Profile...
                    </>
                  ) : (
                    <>
                      <span>Register as Alumni Mentor</span>
                      <ArrowRight className="size-4 ml-1.5 shrink-0" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* In-Card Link to Sign In */}
      <div className="mt-auto pt-4 space-y-2 text-center">
        <div className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign in
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
