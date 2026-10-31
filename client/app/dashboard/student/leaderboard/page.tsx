"use client";

import { Trophy, Medal, Star } from "lucide-react";

const studentRankings = [
  { rank: 1, name: "Santhosh G", department: "CSE", projects: 3, score: 97, badge: "gold" },
  { rank: 2, name: "Priya Dharshini K", department: "ECE", projects: 2, score: 91, badge: "silver" },
  { rank: 3, name: "Arjun Ramachandran", department: "MECH", projects: 2, score: 88, badge: "bronze" },
  { rank: 4, name: "Mohamed Farhan", department: "CSE", projects: 2, score: 84, badge: null, isMe: true },
  { rank: 5, name: "Nandhini Priya", department: "CSE", projects: 2, score: 79, badge: null },
  { rank: 6, name: "Karthikeyan S", department: "IT", projects: 1, score: 71, badge: null },
  { rank: 7, name: "Divya Bharathi", department: "EEE", projects: 1, score: 65, badge: null },
  { rank: 8, name: "Vishnu Vardhan", department: "MECH", projects: 1, score: 60, badge: null },
];

const staffRankings = [
  { rank: 1, name: "Dr. Selvaraj M", department: "CSE", projects: 5, rating: 4.9 },
  { rank: 2, name: "Prof. Kavitha R", department: "ECE", projects: 4, rating: 4.7 },
  { rank: 3, name: "Dr. Anand V", department: "MECH", projects: 4, rating: 4.6 },
  { rank: 4, name: "Prof. Meenakshi S", department: "IT", projects: 3, rating: 4.4 },
  { rank: 5, name: "Dr. Suresh P", department: "EEE", projects: 2, rating: 4.2 },
];

const badgeColors: Record<string, { iconColor: string; bg: string }> = {
  gold: { iconColor: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  silver: { iconColor: "text-slate-500", bg: "bg-slate-100 border-slate-200" },
  bronze: { iconColor: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Student & Mentor Leaderboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated on project deliverables, test validation, milestone completion, and MSME satisfaction.
          </p>
        </div>
        <div className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 self-start sm:self-auto">
          Academic Term: 2026–2027
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Student Leaderboard */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Student Rankings</h3>
            <span className="text-xs text-slate-400">Score / 100</span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentRankings.map((student) => {
              const badge = student.badge ? badgeColors[student.badge] : null;
              return (
                <div
                  key={student.rank}
                  className={`px-5 py-3.5 flex items-center gap-3 transition-colors ${
                    student.isMe
                      ? "bg-blue-50/70 border-l-2 border-l-blue-600"
                      : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className="w-8 shrink-0 text-center">
                    {badge ? (
                      <span className={`inline-flex items-center justify-center size-6 rounded text-xs font-semibold ${badge.bg} ${badge.iconColor}`}>
                        #{student.rank}
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-medium text-slate-500">
                        #{student.rank}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm truncate ${
                          student.isMe ? "font-semibold text-slate-900" : "font-medium text-slate-800"
                        }`}
                      >
                        {student.name}
                      </p>
                      {student.isMe && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {student.department} · {student.projects} Project{student.projects !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-slate-800 font-mono">
                      {student.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Mentor Rankings */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Staff Mentors</h3>
            <span className="text-xs text-slate-400">Rating / 5.0</span>
          </div>

          <div className="divide-y divide-slate-100">
            {staffRankings.map((staff) => (
              <div
                key={staff.rank}
                className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="w-8 shrink-0 text-center">
                  <span className="text-xs font-mono font-medium text-slate-500">
                    #{staff.rank}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{staff.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {staff.department} · {staff.projects} Projects mentored
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <Star className="size-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-slate-800 font-mono">
                    {staff.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Rankings are refreshed at the end of each academic milestone cycle per institutional guidelines.
      </p>
    </div>
  );
}
