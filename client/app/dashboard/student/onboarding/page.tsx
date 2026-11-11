"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { selectStudentTrackAction } from "@/app/actions/auth";
import { MsmeFullLogo } from "@/components/ui/msme-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Users,
  Code2,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StudentOnboardingPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const studentName = session?.data?.user?.name || "Student";

  const [selectedTrack, setSelectedTrack] = useState<"SUBMIT_IDEA" | "JOIN_MSME" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectTrack = async (track: "SUBMIT_IDEA" | "JOIN_MSME") => {
    setSelectedTrack(track);
    setIsSubmitting(true);

    try {
      const res = await selectStudentTrackAction(track);
      if (!res.success) {
        toast.error(res.error || "Failed to save track selection.");
        setIsSubmitting(false);
        return;
      }

      if (track === "SUBMIT_IDEA") {
        toast.success("Welcome to Idea Incubation! Redirecting to submission desk...");
      } else {
        toast.success("Application to Join MSME submitted! Awaiting administrator approval.");
      }

      router.replace(res.redirectUrl || "/dashboard/student");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <MsmeFullLogo width={100} priority />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="size-3.5" />
            <span>Welcome, {studentName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Choose Your Innovation Pathway
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Before proceeding to your student workspace, select how you want to participate in the MSME-Hub ecosystem. You can explore both tracks as you progress.
          </p>
        </div>

        {/* 2 Track Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Track 1: Submit Idea */}
          <div
            className={cn(
              "relative rounded-[20px] border p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 bg-white dark:bg-[#1C1C1E]",
              selectedTrack === "SUBMIT_IDEA"
                ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/5"
                : "border-black/[0.08] dark:border-white/[0.1] hover:border-emerald-500/50 hover:shadow-md"
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Lightbulb className="size-6" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-medium"
                >
                  Direct Submission
                </Badge>
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Submit an Idea
                </h2>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                  Student Innovation Incubation
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Have an innovative research concept, software project, or startup idea? Pitch your independent proposal directly for faculty evaluation, structured feedback iteration, and promotion to the Industry Sponsorship Showcase.
              </p>

              <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Retain guaranteed Project Team Lead status if sponsored</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Receive direct feedback from academic staff mentors</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Showcase to verified MSME industrial partners</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <Button
                type="button"
                onClick={() => handleSelectTrack("SUBMIT_IDEA")}
                disabled={isSubmitting}
                className="w-full h-11 font-semibold text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting && selectedTrack === "SUBMIT_IDEA" ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                    <span>Opening Submission Desk...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Idea</span>
                    <ArrowRight className="size-4 ml-1.5 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Track 2: Join MSME */}
          <div
            className={cn(
              "relative rounded-[20px] border p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 bg-white dark:bg-[#1C1C1E]",
              selectedTrack === "JOIN_MSME"
                ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/5"
                : "border-black/[0.08] dark:border-white/[0.1] hover:border-blue-500/50 hover:shadow-md"
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Building2 className="size-6" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[11px] font-medium flex items-center gap-1"
                >
                  <ShieldCheck className="size-3" />
                  <span>Admin Approval Required</span>
                </Badge>
              </div>

              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Join MSME Projects
                </h2>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">
                  Industry Problem-Solving Track
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Work on live, verified technical bottlenecks submitted by real-world MSMEs. Collaborate in faculty-led multi-student engineering teams to produce production-grade, MIT-licensed open-source GitHub solutions.
              </p>

              <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="size-4 text-blue-500 shrink-0" />
                  <span>Direct faculty team assignment (max 2 active projects)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Code2 className="size-4 text-blue-500 shrink-0" />
                  <span>Build verified public GitHub portfolio with MIT License</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Award className="size-4 text-blue-500 shrink-0" />
                  <span>Earn official moderated Industry Partner ratings & testimonials</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <Button
                type="button"
                onClick={() => handleSelectTrack("JOIN_MSME")}
                disabled={isSubmitting}
                className="w-full h-11 font-semibold text-sm rounded-xl bg-[#14283F] hover:bg-[#14283F]/90 text-white transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting && selectedTrack === "JOIN_MSME" ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2 shrink-0" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Join MSME</span>
                    <ArrowRight className="size-4 ml-1.5 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-center text-xs text-muted-foreground">
          Francis Xavier Engineering College · Academic &amp; Industry Collaboration Gateway
        </p>
      </div>
    </div>
  );
}

