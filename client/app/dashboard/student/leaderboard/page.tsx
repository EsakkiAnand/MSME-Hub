"use client";

import { Trophy, Medal, Star } from "lucide-react";

const studentRankings = [
  { rank: 1, name: "Santhosh G", department: "CSE", projects: 3, score: 97, badge: "gold" },
  { rank: 2, name: "Mohamed Farhan", department: "CSE", projects: 2, score: 91, badge: "silver", isMe: true },
];

const staffRankings = [
  { rank: 1, name: "Dr. Selvaraj M", department: "CSE", projects: 5, rating: 4.9 },
  { rank: 2, name: "Prof. Kavitha R", department: "ECE", projects: 4, rating: 4.7 },
];

const badgeColors: Record<string, { iconColor: string; bg: string }> = {
  gold: { iconColor: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  silver: { iconColor: "text-muted-foreground", bg: "bg-slate-100 border-black/[0.06] dark:border-white/[0.08]" },
  bronze: { iconColor: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

export default function LeaderboardPage() {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Student & Mentor Leaderboard
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluated on project deliverables, test validation, milestone completion, and MSME satisfaction.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-[10px] border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-foreground self-start sm:self-auto">
          Academic Term: 2026–2027
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Student Leaderboard */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Student Rankings</h3>
            <span className="text-xs text-muted-foreground">Score / 100</span>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {studentRankings.map((student) => {
              const badge = student.badge ? badgeColors[student.badge] : null;
              return (
                <div
                  key={student.rank}
                  className={`px-5 py-3.5 flex items-center gap-3 transition-colors ${
                    student.isMe
                      ? "bg-[#007AFF]/10 border-l-2 border-l-[#007AFF]"
                      : "hover:bg-black/[0.02] dark:bg-white/[0.02]"
                  }`}
                >
                  <div className="w-8 shrink-0 text-center">
                    {badge ? (
                      <span className={`inline-flex items-center justify-center size-6 rounded text-xs font-semibold ${badge.bg} ${badge.iconColor}`}>
                        #{student.rank}
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-medium text-muted-foreground">
                        #{student.rank}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm truncate ${
                          student.isMe ? "font-semibold text-foreground" : "font-medium text-foreground"
                        }`}
                      >
                        {student.name}
                      </p>
                      {student.isMe && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#007AFF]/15 text-[#007AFF] shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {student.department} · {student.projects} Project{student.projects !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-foreground font-mono">
                      {student.score}
                    </span>
                  </div>
                </div>
              );
            })}
            {studentRankings.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No student rankings recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Staff Mentor Rankings */}
        <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Staff Mentors</h3>
            <span className="text-xs text-muted-foreground">Rating / 5.0</span>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {staffRankings.map((staff) => (
              <div
                key={staff.rank}
                className="px-5 py-3.5 flex items-center gap-3 hover:bg-black/[0.02] dark:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 shrink-0 text-center">
                  <span className="text-xs font-mono font-medium text-muted-foreground">
                    #{staff.rank}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{staff.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {staff.department} · {staff.projects} Projects mentored
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <Star className="size-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-foreground font-mono">
                    {staff.rating}
                  </span>
                </div>
              </div>
            ))}
            {staffRankings.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No staff mentor rankings recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Rankings are refreshed at the end of each academic milestone cycle per institutional guidelines.
      </p>
    </div>
  );
}
