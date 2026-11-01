"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquare,
  Award,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Tag,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { IOSSelect } from "@/components/ui/ios-select";
import { toast } from "sonner";
import {
  getAlumniOverviewAction,
  respondToGuidanceRequestAction,
} from "@/app/actions/alumni";
import { GuidanceRequestItem, MentoredProject } from "@/lib/alumni-data";

export default function AlumniOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<GuidanceRequestItem | null>(null);
  const [responseCategory, setResponseCategory] = useState<string>("ARCHITECTURE");
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAlumniOverviewAction();
      if (res.success) {
        setData(res);
      } else {
        toast.error(res.error || "Failed to load overview");
      }
    } catch {
      toast.error("Network error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnswerModal = (req: GuidanceRequestItem) => {
    setSelectedRequest(req);
    setResponseCategory("ARCHITECTURE");
    setResponseText("");
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest) return;
    if (!responseText.trim()) {
      toast.error("Please enter your guidance feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await respondToGuidanceRequestAction({
        guidanceRequestId: selectedRequest.id,
        projectId: selectedRequest.projectId,
        category: responseCategory as any,
        content: responseText.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Feedback posted to student team!");
        setSelectedRequest(null);
        setResponseText("");
        await loadData();
      } else {
        toast.error(res.error || "Failed to post response");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-[#007AFF] mb-3" />
        <p className="text-sm font-medium">Loading Alumni Mentor Workspace...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    openRequestsCount: 0,
    myAnswersCount: 0,
    helpfulEndorsements: 0,
    projectsMentored: 0,
  };

  const openRequests: GuidanceRequestItem[] = data?.openRequests || [];
  const projects: MentoredProject[] = data?.recentMentoredProjects || [];
  const profile = data?.profile;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-card rounded-xl border border-black/[0.06] dark:border-white/[0.08] dark:border-border p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50">
                Alumni Expert Mentor
              </span>
              <CopyIdBadge id={data?.user?.uniqueId || "ALU0001"} label="Alumni ID" size="xs" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground dark:text-foreground">
              Welcome back, {data?.user?.name || "Mentor"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              {profile?.currentRole} at <span className="text-foreground dark:text-foreground font-semibold">{profile?.currentCompany}</span>.
              Share architectural advice, answer student queries, and help students ship production-grade open-source solutions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard/alumni/guidance">
              <Button className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9">
                <HelpCircle className="size-3.5 mr-1.5" />
                Browse Guidance Board
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Requests */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
              Open Guidance Requests
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold flex items-center justify-between text-foreground">
              <span>{stats.openRequestsCount}</span>
              <div className="p-2 bg-blue-50 text-[#007AFF] rounded-md">
                <HelpCircle className="size-4" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awaiting expert architectural guidance</p>
          </CardContent>
        </Card>

        {/* Answers Provided */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
              Mentorship Responses
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold flex items-center justify-between text-foreground">
              <span>{stats.myAnswersCount}</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                <MessageSquare className="size-4" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Architectural &amp; security answers provided</p>
          </CardContent>
        </Card>

        {/* Helpful Endorsements */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
              Helpful Endorsements
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold flex items-center justify-between text-foreground">
              <span className="text-amber-600">{stats.helpfulEndorsements}</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
                <Award className="size-4" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awarded by students for solving bottlenecks</p>
          </CardContent>
        </Card>

        {/* Projects Mentored */}
        <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium text-muted-foreground">
              Mentored Projects
            </CardDescription>
            <CardTitle className="text-2xl font-extrabold flex items-center justify-between text-foreground">
              <span>{stats.projectsMentored}</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                <FolderKanban className="size-4" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Active industry challenges supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Two Columns: Open Guidance Board + Mentored Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Open Student Guidance Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="size-4 text-[#007AFF]" />
                Open Student Guidance Requests
              </h3>
              <p className="text-xs text-muted-foreground">
                Recent questions posted by student project teams seeking architectural advice.
              </p>
            </div>
            <Link
              href="/dashboard/alumni/guidance"
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              View All Board Requests
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {openRequests.length === 0 ? (
              <Card className="border-dashed p-8 text-center text-muted-foreground">
                <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">All questions answered!</p>
                <p className="text-xs text-muted-foreground mt-1">No open student queries on the board right now.</p>
              </Card>
            ) : (
              openRequests.map((req) => (
                <Card
                  key={req.id}
                  className="border-black/[0.06] dark:border-white/[0.08] hover:border-blue-300 transition-all shadow-xs"
                >
                  <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[11px] font-mono text-foreground bg-black/[0.02] dark:bg-white/[0.03]">
                          {req.id}
                        </Badge>
                        <span className="text-xs font-semibold text-foreground">
                          {req.projectTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                      {req.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4 pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground font-medium mr-1">
                          Asked by {req.studentName} ({req.studentUniqueId}):
                        </span>
                        {req.tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-foreground"
                          >
                            <Tag className="size-2.5 mr-1 text-muted-foreground" />
                            {t}
                          </span>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleOpenAnswerModal(req)}
                        className="text-xs bg-[#007AFF] hover:bg-[#007AFF]/90 text-white h-7 px-3"
                      >
                        <MessageSquare className="size-3 mr-1.5" />
                        Provide Guidance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Mentored Projects & Endorsements */}
        <div className="space-y-6">
          {/* Alumni Reputation & Endorsements Card */}
          <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-black/[0.02] dark:bg-white/[0.02] dark:bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-amber-100 text-amber-700">
                  <Award className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Mentorship Endorsements
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    PRD §8.6 Helpful Recognition
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-white border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Total Endorsements</span>
                  <span className="text-xl font-black text-amber-600">
                    {stats.helpfulEndorsements}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Sparkles className="size-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                When student teams resolve an architectural bottleneck with your advice, they award a Helpful Endorsement to your profile.
              </p>
            </CardContent>
          </Card>

          {/* Mentored Projects Mini Tracker */}
          <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FolderKanban className="size-4 text-emerald-600" />
                  Active Projects
                </CardTitle>
                <Link
                  href="/dashboard/alumni/projects"
                  className="text-[11px] text-[#007AFF] hover:underline"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.02] dark:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                      {p.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {p.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Lead: {p.teamLeadName}</span>
                    <span className="text-[10px] text-muted-foreground">{p.domain}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Answer Modal Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="size-4 text-[#007AFF]" />
              Provide Architectural Guidance
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Your feedback is published directly to the student builder team and faculty advisor.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>{selectedRequest.projectTitle}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {selectedRequest.id}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {selectedRequest.question}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {selectedRequest.tags.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Guidance Category (PRD §8.6)
                </label>
                <IOSSelect
                  value={responseCategory}
                  onChange={setResponseCategory}
                  options={[
                    { value: "ARCHITECTURE", label: "Architecture & System Design" },
                    { value: "SECURITY_QUALITY", label: "Security & Code Quality" },
                    { value: "INDUSTRY_RELEVANCE", label: "Industry Best Practices & Deployment" },
                    { value: "GENERAL", label: "General Feedback & Troubleshooting" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Your Actionable Guidance
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Explain recommended architecture, patterns, security measures, or library choices..."
                  rows={5}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Clear, production-tested guidance helps students resolve bottlenecks quickly.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRequest(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitResponse}
              disabled={isSubmitting}
              className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="size-3.5 mr-1.5" />
                  Publish Guidance
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
