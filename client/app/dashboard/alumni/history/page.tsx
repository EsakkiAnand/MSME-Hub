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
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Guidance Activity &amp; Endorsement History
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          PRD §8.6: Complete record of architectural and security feedback provided to student project teams, including student-awarded Helpful Endorsements.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Responses</span>
              <span className="text-2xl font-black text-slate-900">{historyItems.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Helpful Endorsements</span>
              <span className="text-2xl font-black text-amber-600">{totalEndorsements}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Resolved Inquiries</span>
              <span className="text-2xl font-black text-emerald-600">
                {historyItems.filter((i) => i.status === "RESOLVED").length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Card key={item.id} className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 pt-5 px-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px] bg-slate-50">
                    {item.id}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900">
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
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                        : "bg-purple-50 text-purple-700 border-purple-200 text-[10px]"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>

              <CardTitle className="text-sm font-semibold text-slate-800 leading-relaxed">
                {item.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Asked by <strong className="text-slate-700">{item.studentName}</strong> ({item.studentUniqueId})</span>
                <span>•</span>
                <span>{item.studentDepartment}</span>
              </div>

              {/* Published Responses */}
              {item.responses && item.responses.length > 0 && (
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Your Published Guidance:
                  </span>
                  {item.responses.map((resp) => (
                    <div key={resp.id} className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <Badge variant="secondary" className="text-[9px]">
                          {resp.category}
                        </Badge>
                        <span className="text-[10px]">
                          {new Date(resp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{resp.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

