"use client";

import { useState } from "react";
import {
  HelpCircle,
  Search,
  Filter,
  Tag,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IOSSelect } from "@/components/ui/ios-select";
import { toast } from "sonner";
import { initialGuidanceRequests, GuidanceRequestItem } from "@/lib/alumni-data";
import { respondToGuidanceRequestAction } from "@/app/actions/alumni";

const allTags = ["All", "PostgreSQL", "Next.js", "IoT", "Security", "MQTT", "Concurrency", "Architecture"];

export default function GuidanceBoardPage() {
  const [requests, setRequests] = useState<GuidanceRequestItem[]>(initialGuidanceRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState<GuidanceRequestItem | null>(null);
  const [responseCategory, setResponseCategory] = useState("ARCHITECTURE");
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "All" || req.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || req.status === statusFilter;

    return matchesSearch && matchesTag && matchesStatus;
  });

  const handleOpenAnswerModal = (req: GuidanceRequestItem) => {
    setSelectedRequest(req);
    setResponseCategory("ARCHITECTURE");
    setResponseText("");
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest) return;
    if (!responseText.trim()) {
      toast.error("Please enter your guidance response.");
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
        toast.success("Guidance response published to student team!");
        // Update local state
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id
              ? {
                  ...r,
                  status: "ANSWERED",
                  responses: [
                    ...(r.responses || []),
                    {
                      id: `FB-${Date.now()}`,
                      authorName: "You (Alumni Mentor)",
                      authorRole: "Expert Mentor",
                      category: responseCategory as any,
                      content: responseText.trim(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : r
          )
        );
        setSelectedRequest(null);
        setResponseText("");
      } else {
        toast.error(res.error || "Failed to publish response.");
      }
    } catch {
      toast.error("Network error while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Open Guidance Board
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          PRD §8.6 Hybrid Guidance Engine: Discover technical bottlenecks submitted by student project teams and post architectural advice.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, projects, student..."
            className="pl-9 text-xs h-9 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="w-36">
            <IOSSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: "OPEN", label: "Open (Unanswered)" },
                { value: "ANSWERED", label: "Answered" },
                { value: "RESOLVED", label: "Resolved" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Tags Filter Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
              selectedTag === tag
                ? "bg-[#1d4ed8] text-white shadow-xs"
                : "bg-white text-muted-foreground hover:bg-slate-100 border border-black/[0.06] dark:border-white/[0.08]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Guidance Questions List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="border-dashed p-10 text-center text-muted-foreground bg-white">
            <HelpCircle className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No matching guidance requests</p>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your search query or tag filter.</p>
          </Card>
        ) : (
          filteredRequests.map((req) => (
            <Card
              key={req.id}
              className="border-black/[0.06] dark:border-white/[0.08] shadow-xs hover:border-slate-300 transition-all bg-white"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[11px] bg-black/[0.02] dark:bg-white/[0.03]">
                      {req.id}
                    </Badge>
                    <span className="text-xs font-bold text-foreground">
                      {req.projectTitle}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {req.projectDomain}
                    </Badge>
                  </div>

                  {req.status === "OPEN" ? (
                    <Badge className="bg-blue-50 text-[#007AFF] border border-blue-200 text-[10px] font-semibold flex items-center gap-1">
                      <Clock className="size-2.5" /> Open
                    </Badge>
                  ) : req.status === "RESOLVED" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-2.5" /> Resolved
                    </Badge>
                  ) : (
                    <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold flex items-center gap-1">
                      <MessageSquare className="size-2.5" /> Answered
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-sm font-semibold text-foreground leading-relaxed">
                  {req.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0 space-y-3">
                {/* Tags and Author info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      Asked by <span className="text-foreground font-semibold">{req.studentName}</span> ({req.studentUniqueId}):
                    </span>
                    {req.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-foreground"
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
                    {req.status === "OPEN" ? "Provide Guidance" : "Add Further Feedback"}
                  </Button>
                </div>

                {/* Existing Mentorship Responses Thread */}
                {req.responses && req.responses.length > 0 && (
                  <div className="mt-3 p-3.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]/80 space-y-2">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                      Published Mentor Advice:
                    </span>
                    {req.responses.map((resp) => (
                      <div key={resp.id} className="text-xs space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="font-semibold text-foreground">{resp.authorName}</span>
                          <Badge variant="outline" className="text-[9px] bg-white">
                            {resp.category}
                          </Badge>
                        </div>
                        <p className="text-foreground leading-relaxed">{resp.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Answer Modal Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="size-4 text-[#007AFF]" />
              Respond to Guidance Request
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Guidance will be posted to the student team and recorded on your mentorship portfolio.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  {selectedRequest.projectTitle}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {selectedRequest.question}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Feedback Category (PRD §8.6)
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Your Actionable Guidance
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Provide concrete architectural recommendations, security safeguards, or implementation hints..."
                  rows={5}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter>
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
                  Publish Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

