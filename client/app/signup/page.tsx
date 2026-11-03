"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getRoleDashboardPath } from "@/lib/auth-utils";
import { PublicHeader } from "@/components/navigation/public-header";
import {
  registerIndustryAction,
  registerAlumniAction,
} from "@/app/actions/auth";
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
  Building2,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Globe,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
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

      toast.success("Industry partner registered successfully! Redirecting to workspace...");
      router.push(res.redirectUrl || "/dashboard/industry");
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

      toast.success("Alumni mentor profile submitted successfully! Redirecting...");
      router.push(res.redirectUrl || "/dashboard/alumni");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
      setIsAlumniSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <PublicHeader action="login" />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl">
          <Card className="border shadow-lg">
            <CardHeader className="text-center pb-4 pt-4">
              <div className="flex justify-center mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Sparkles className="size-3.5" />
                  Role-Governed Innovation Portal
                </span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create your MSME-Hub account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Select your persona to join the collaborative ecosystem
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={(val: string) => setActiveTab(val as any)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full h-11 p-1 bg-muted">
                  <TabsTrigger
                    value="academic"
                    className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <GraduationCap className="size-3.5 text-emerald-500" />
                    <span>Academic</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="industry"
                    className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Building2 className="size-3.5 text-blue-500" />
                    <span>Industry</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="alumni"
                    className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Award className="size-3.5 text-amber-500" />
                    <span>Alumni</span>
                  </TabsTrigger>
                </TabsList>

                {/* ---------------- Tab 1: Academic (Students & Faculty) ---------------- */}
                <TabsContent value="academic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">
                      Select your institutional academic role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAcademicRole("STUDENT")}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          academicRole === "STUDENT"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Student Builder</span>
                          <GraduationCap className="size-4 text-emerald-500" />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Solve industrial problems &amp; build portfolio
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAcademicRole("STAFF")}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          academicRole === "STAFF"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Faculty Supervisor</span>
                          <Users className="size-4 text-emerald-500" />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Direct student teams &amp; claim problem pool
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/60 p-3.5 border text-xs text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      Institutional Whitelist Verification
                    </div>
                    <div>
                      Academic sign-up requires Google Workspace OAuth using your official institutional email
                      (e.g., <code className="text-[11px] bg-muted px-1 py-0.5 rounded">@college.edu</code>).
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleAcademicSignup}
                    disabled={isGoogleLoading}
                    className="w-full h-11 font-medium bg-background border border-input text-foreground hover:bg-muted text-sm shadow-xs"
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
                    Sign up with Google as {academicRole === "STUDENT" ? "Student" : "Faculty"}
                  </Button>
                </TabsContent>

                {/* ---------------- Tab 2: Industry Partner (Streamlined Essential Details) ---------------- */}
                <TabsContent value="industry" className="space-y-4 pt-4">
                  <form onSubmit={handleIndustrySubmit} className="space-y-3.5">
                    {/* Field 1: Name (Company / Organization Name) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        Company / Organization Name *
                      </label>
                      <Input
                        placeholder="e.g. Hexaware Technologies / Apex Tex Machineries"
                        value={industryCompanyName}
                        onChange={(e) => setIndustryCompanyName(e.target.value)}
                        required
                        className="h-10 text-sm"
                        autoComplete="organization"
                      />
                    </div>

                    {/* Field 2: Email Address (Allows any email address) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Mail className="size-3.5 text-muted-foreground" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="name@company.com or name@gmail.com"
                        value={industryEmail}
                        onChange={(e) => setIndustryEmail(e.target.value)}
                        required
                        className="h-10 text-sm"
                        autoComplete="email"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        You can register using any valid email address (corporate, business, or personal).
                      </p>
                    </div>

                    {/* Fields 3 & 4: Contact Name & Designation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Users className="size-3.5 text-muted-foreground" />
                          Contact Name *
                        </label>
                        <Input
                          placeholder="e.g. K. Ramanathan"
                          value={industryContactName}
                          onChange={(e) => setIndustryContactName(e.target.value)}
                          required
                          className="h-10 text-sm"
                          autoComplete="name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-muted-foreground" />
                          Designation *
                        </label>
                        <Input
                          placeholder="e.g. Managing Director / Operations Head"
                          value={industryDesignation}
                          onChange={(e) => setIndustryDesignation(e.target.value)}
                          required
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>

                    {/* Field 5: Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
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
                          className="h-10 text-sm pr-10"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowIndustryPassword(!showIndustryPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showIndustryPassword ? "Hide password" : "Show password"}
                        >
                          {showIndustryPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Streamlined Onboarding Notice */}
                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                      <Info className="size-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>
                        <strong>Streamlined MSME Onboarding:</strong> Initial registration collects only your essential entity and contact details. Secondary credentials like your Udyam PDF can be updated later from your company dashboard.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isIndustrySubmitting}
                      className="w-full h-10 font-semibold mt-2"
                    >
                      {isIndustrySubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Creating Industry Account...
                        </>
                      ) : (
                        <>
                          Register Organization
                          <ArrowRight className="size-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* ---------------- Tab 3: Alumni Mentor ---------------- */}
                <TabsContent value="alumni" className="space-y-4 pt-4">
                  <form onSubmit={handleAlumniSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Users className="size-3.5 text-muted-foreground" />
                          Full Name *
                        </label>
                        <Input
                          placeholder="Jane Smith"
                          value={alumniName}
                          onChange={(e) => setAlumniName(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Mail className="size-3.5 text-muted-foreground" />
                          Personal / Work Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="jane.smith@alumni.org"
                          value={alumniEmail}
                          onChange={(e) => setAlumniEmail(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Lock className="size-3.5 text-muted-foreground" />
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
                          className="h-9 text-sm pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAlumniPassword(!showAlumniPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showAlumniPassword ? (
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <GraduationCap className="size-3.5 text-muted-foreground" />
                          Degree / Discipline *
                        </label>
                        <Input
                          placeholder="B.E. Computer Science"
                          value={alumniDegree}
                          onChange={(e) => setAlumniDegree(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-muted-foreground" />
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
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          Current Company / Employer *
                        </label>
                        <Input
                          placeholder="Google / Tech Corp"
                          value={alumniCompany}
                          onChange={(e) => setAlumniCompany(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Award className="size-3.5 text-muted-foreground" />
                          Current Job Title / Role *
                        </label>
                        <Input
                          placeholder="Senior Solutions Architect"
                          value={alumniRole}
                          onChange={(e) => setAlumniRole(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Globe className="size-3.5 text-muted-foreground" />
                        LinkedIn Profile URL (Optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/janesmith"
                        value={alumniLinkedin}
                        onChange={(e) => setAlumniLinkedin(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>

                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <Info className="size-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>
                        <strong>1-Click Staff Verification:</strong> Alumni profiles are verified by academic faculty before student guidance threads and mentorship endorsements are unlocked.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isAlumniSubmitting}
                      className="w-full h-10 font-semibold mt-2"
                    >
                      {isAlumniSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Creating Mentor Profile...
                        </>
                      ) : (
                        <>
                          Register as Alumni Mentor
                          <ArrowRight className="size-4 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-3 pb-5 border-t bg-muted/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-rose-500" />
                <span>
                  Admin accounts are provisioned exclusively via CLI database seed.
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
