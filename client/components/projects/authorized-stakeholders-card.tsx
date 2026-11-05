"use client";

import React, { useState } from "react";
import {
  StudentTeamMember,
  FacultySupervisorInfo,
  IndustryPartnerInfo,
} from "@/lib/project-data";
import {
  Users,
  Crown,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
} from "lucide-react";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";

interface AuthorizedStakeholdersCardProps {
  studentTeam: StudentTeamMember[];
  facultySupervisor: FacultySupervisorInfo;
  industryPartner: IndustryPartnerInfo;
  projectId: string;
}

export function AuthorizedStakeholdersCard({
  studentTeam,
  facultySupervisor,
  industryPartner,
  projectId,
}: AuthorizedStakeholdersCardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "students" | "faculty" | "industry">("all");

  return (
    <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Authorized Stakeholders &amp; Personnel Directory
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  Authorized Access
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verified contact details for project {projectId} stakeholders. Visible strictly to assigned participants and administration.
              </p>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 bg-black/[0.02] dark:bg-white/[0.03] p-1 rounded-lg border border-black/[0.04] dark:border-white/[0.05] text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-[#2C2C2E] text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Stakeholders
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "students"
                  ? "bg-white dark:bg-[#2C2C2E] text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Students ({studentTeam.length})
            </button>
            <button
              onClick={() => setActiveTab("faculty")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "faculty"
                  ? "bg-white dark:bg-[#2C2C2E] text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Supervisor
            </button>
            <button
              onClick={() => setActiveTab("industry")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activeTab === "industry"
                  ? "bg-white dark:bg-[#2C2C2E] text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Industry Client
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 1. Student Engineering Roster */}
        {(activeTab === "all" || activeTab === "students") && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[#007AFF]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assigned Student Engineering Roster
                </h4>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {studentTeam.length} Assigned (Max 2 Active Projects Concurrency Rule)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentTeam.map((member) => (
                <div
                  key={member.id}
                  className={`p-3.5 rounded-[12px] border transition-all ${
                    member.isLead
                      ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-xs"
                      : "bg-black/[0.01] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground truncate">
                          {member.name}
                        </span>
                        {member.isLead && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            <Crown className="size-3 text-amber-600 fill-amber-500" />
                            Lead
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                        {member.role}
                      </p>
                    </div>
                    <CopyIdBadge id={member.regNo} label="Reg" />
                  </div>

                  <div className="space-y-1.5 text-[11px] border-t border-black/[0.04] dark:border-white/[0.06] pt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="size-3 text-[#007AFF] shrink-0" />
                      <a
                        href={`mailto:${member.email}`}
                        className="truncate text-foreground hover:underline"
                      >
                        {member.email}
                      </a>
                    </div>

                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="size-3 text-emerald-600 shrink-0" />
                        <span className="font-mono text-foreground">{member.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                      <span>{member.department}</span>
                      <span className="font-mono bg-black/[0.03] dark:bg-white/[0.05] px-1.5 py-0.2 rounded">
                        Active: {member.activeProjectsCount}/2 Projects
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Faculty Supervisor & Academic Mentor */}
        {(activeTab === "all" || activeTab === "faculty") && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="size-4 text-purple-600" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Faculty Project Director &amp; Academic Mentor
              </h4>
            </div>

            <div className="p-4 rounded-[12px] border border-purple-200 dark:border-purple-900/50 bg-purple-50/30 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-foreground">
                    {facultySupervisor.name}
                  </h5>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                    Faculty Supervisor
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {facultySupervisor.designation} · {facultySupervisor.department}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3 text-purple-600" />
                  {facultySupervisor.cabin}
                </p>
              </div>

              <div className="space-y-1.5 text-xs sm:text-right shrink-0">
                <div className="flex sm:justify-end items-center gap-1.5 text-muted-foreground">
                  <Mail className="size-3.5 text-purple-600" />
                  <a
                    href={`mailto:${facultySupervisor.email}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {facultySupervisor.email}
                  </a>
                </div>
                <div className="flex sm:justify-end items-center gap-1.5 text-muted-foreground">
                  <Phone className="size-3.5 text-emerald-600" />
                  <span className="font-mono font-medium text-foreground">
                    {facultySupervisor.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Industry Client Partner Details */}
        {(activeTab === "all" || activeTab === "industry") && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-amber-600" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Industry Enterprise Client Details
                </h4>
              </div>
              {industryPartner.isVerified && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <FileCheck className="size-3" />
                  Udyam Document Verified
                </span>
              )}
            </div>

            <div className="p-4 rounded-[12px] border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-800/40">
                <div>
                  <h5 className="text-sm font-bold text-foreground">
                    {industryPartner.companyName}
                  </h5>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground">
                      {industryPartner.udyamRegNo}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-amber-600" />
                      {industryPartner.location}
                    </span>
                  </div>
                </div>

                {industryPartner.websiteUrl && (
                  <a
                    href={industryPartner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#007AFF] hover:underline"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>

              {/* Point of Contact Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Designated Enterprise Representative: </span>
                  <strong className="text-foreground">{industryPartner.representativeName}</strong>
                  <span className="text-muted-foreground"> ({industryPartner.designation})</span>
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={`mailto:${industryPartner.email}`}
                    className="inline-flex items-center gap-1 text-[#007AFF] hover:underline"
                  >
                    <Mail className="size-3" />
                    <span>{industryPartner.email}</span>
                  </a>
                  <span className="inline-flex items-center gap-1 font-mono text-foreground">
                    <Phone className="size-3 text-emerald-600" />
                    <span>{industryPartner.phone}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security & Access Guardrail Note */}
        <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex items-center gap-2 text-[11px] text-muted-foreground">
          <Lock className="size-3.5 text-muted-foreground shrink-0" />
          <span>
            <strong>Confidentiality Notice:</strong> Stakeholder telephone numbers and direct credentials are encrypted at rest and presented exclusively to authenticated project associates.
          </span>
        </div>
      </div>
    </div>
  );
}
