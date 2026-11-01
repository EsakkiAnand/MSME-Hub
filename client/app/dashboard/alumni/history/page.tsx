"use client";

import { useState } from "react";
import {
  History,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Tag,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initialGuidanceRequests, GuidanceRequestItem } from "@/lib/alumni-data";

export default function GuidanceHistoryPage() {
  // Filter for answered or resolved queries
  const [historyItems] = useState<GuidanceRequestItem[]>(
    initialGuidanceRequests.filter((r) => r.status === "ANSWERED" || r.status === "RESOLVED")
  );

  const totalEndorsements = historyItems.filter((i) => i.isHelpful).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Guidance Activity &amp; Endorsement History
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          PRD §8.6: Complete record of architectural and security feedback provided to student project teams, including student-awarded Helpful Endorsements.
        </p>
      </div>

      {/* Standardized Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Responses
            </span>
            <MessageSquare className="size-4 text-[#007AFF]" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {historyItems.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Guidance answers contributed</p>
          </div>
        </div>

        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Helpful Endorsements
            </span>
            <Award className="size-4 text-[#FF9500]" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[#FF9500]">
              {totalEndorsements}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Student validated architectural solutions</p>
          </div>
        </div>

        <div className="h-full rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Resolved Inquiries
            </span>
            <CheckCircle2 className="size-4 text-[#34C759]" />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[#34C759]">
              {historyItems.filter((i) => i.status === "RESOLVED").length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Tickets marked resolved by team leads</p>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Card key={item.id} className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px] bg-black/[0.02] dark:bg-white/[0.03]">
                    {item.id}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {item.projectTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.isHelpful && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 border border-amber-300 text-amber-700 shadow-2xs">
                      <Sparkles className="size-3 text-amber-500" />
                      Helpful Endorsement Awarded
                    </span>
                  )}

                  <Badge
                    variant="outline"
                    className={
                      item.status === "RESOLVED"
                        ? "bg-[#34C759]/10 text-[#34C759] border-transparent text-[10px]"
                        : "bg-[#007AFF]/10 text-[#007AFF] border-transparent text-[10px]"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>

              <CardTitle className="text-sm font-semibold text-foreground leading-relaxed">
                {item.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Asked by <strong className="text-foreground">{item.studentName}</strong> ({item.studentUniqueId})</span>
                <span>•</span>
                <span>{item.studentDepartment}</span>
              </div>

              {/* Published Responses */}
              {item.responses && item.responses.length > 0 && (
                <div className="p-3.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Your Published Guidance:
                  </span>
                  {item.responses.map((resp) => (
                    <div key={resp.id} className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <Badge variant="secondary" className="text-[9px]">
                          {resp.category}
                        </Badge>
                        <span className="text-[10px]">
                          {new Date(resp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed">{resp.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {historyItems.length === 0 && (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-8 text-center text-xs text-muted-foreground">
            No resolved mentorship history recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}

