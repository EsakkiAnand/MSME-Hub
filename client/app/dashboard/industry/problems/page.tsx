"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IOSSelect } from "@/components/ui/ios-select";
import { initialIndustryProblems, IndustryProblemItem } from "@/lib/industry-data";

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ElementType }> = {
  DRAFT: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-foreground border-black/[0.06] dark:border-white/[0.08]",
    icon: Clock,
  },
  POOL_AVAILABLE: {
    label: "In Domain Pool",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200",
    icon: Clock,
  },
  CLAIMED: {
    label: "Claimed by Staff",
    badgeClass: "bg-[#007AFF]/10 text-[#007AFF] border-transparent",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected / Scope Revision",
    badgeClass: "bg-[#FF3B30]/10 text-[#FF3B30] border-transparent",
    icon: AlertCircle,
  },
};

export default function MySubmittedProblemsPage() {
  const [problems] = useState<IndustryProblemItem[]>(initialIndustryProblems);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [selectedProblem, setSelectedProblem] = useState<IndustryProblemItem | null>(null);

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || prob.status === statusFilter;
    const matchesDomain = domainFilter === "ALL" || prob.domain === domainFilter;

    return matchesSearch && matchesStatus && matchesDomain;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            My Submitted Challenges
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            PRD §8.3: Review operational challenges submitted by your company, monitor faculty claiming status, and inspect assigned student projects.
          </p>
        </div>

        <Link href="/dashboard/industry/submit-problem">
          <Button size="sm" className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9">
            <PlusCircle className="size-3.5 mr-1.5" />
            Submit New Challenge
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title, ID, or keywords..."
            className="pl-9 text-xs h-9 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="w-36">
            <IOSSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: "POOL_AVAILABLE", label: "Available in Pool" },
                { value: "CLAIMED", label: "Claimed by Staff" },
              ]}
            />
          </div>

          <div className="w-44">
            <IOSSelect
              value={domainFilter}
              onChange={setDomainFilter}
              options={[
                { value: "ALL", label: "All Tech Domains" },
                { value: "Software & Cloud", label: "Software & Cloud" },
                { value: "IoT & Analytics", label: "IoT & Analytics" },
                { value: "FinTech & Web", label: "FinTech & Web" },
                { value: "Manufacturing & AI", label: "Manufacturing & AI" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Problems Data Table */}
      <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.08] text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Problem ID</th>
                <th className="py-3 px-4">Challenge Title</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06] text-foreground">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No matching industrial challenges found.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const cfg = statusConfig[prob.status] || statusConfig.POOL_AVAILABLE;
                  const StatusIcon = cfg.icon;

                  return (
                    <tr key={prob.id} className="hover:bg-black/[0.02] dark:bg-white/[0.03]/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-foreground whitespace-nowrap">
                        {prob.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground max-w-sm truncate">
                        {prob.title}
                        {prob.claimedByFacultyName && (
                          <span className="block text-[11px] font-normal text-purple-700">
                            Claimed by: {prob.claimedByFacultyName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] bg-black/[0.02] dark:bg-white/[0.03]">
                          {prob.domain}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-muted-foreground">
                        {new Date(prob.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badgeClass}`}>
                          <StatusIcon className="size-2.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProblem(prob)}
                          className="h-7 px-2.5 text-xs text-[#007AFF] hover:text-[#1e40af] hover:bg-blue-50"
                        >
                          <Eye className="size-3.5 mr-1" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Problem Details Modal */}
      <Dialog open={!!selectedProblem} onOpenChange={(open) => !open && setSelectedProblem(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>{selectedProblem?.title}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedProblem?.id}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Submitted on {selectedProblem && new Date(selectedProblem.createdAt).toLocaleDateString()} • Sector: {selectedProblem?.domain}
            </DialogDescription>
          </DialogHeader>

          {selectedProblem && (
            <div className="space-y-4 py-2 text-xs">
              {/* Lifecycle Progress Banner */}
              <div className="p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Current Lifecycle State</span>
                  <span className="font-bold text-foreground text-sm">
                    {selectedProblem.status === "CLAIMED"
                      ? "Claimed by Faculty (Project Assigned)"
                      : "Available in Academic Pool"}
                  </span>
                </div>
                {selectedProblem.claimedByFacultyName && (
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Project Director</span>
                    <span className="font-semibold text-purple-700">
                      {selectedProblem.claimedByFacultyName}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="font-bold text-foreground block">Problem Statement &amp; Context:</span>
                <p className="text-foreground leading-relaxed bg-white p-3 rounded-md border border-slate-100">
                  {selectedProblem.description}
                </p>
              </div>

              {/* Constraints */}
              {selectedProblem.constraints && (
                <div className="space-y-1">
                  <span className="font-bold text-foreground block">Technical Constraints:</span>
                  <p className="text-muted-foreground leading-relaxed bg-white p-3 rounded-md border border-slate-100">
                    {selectedProblem.constraints}
                  </p>
                </div>
              )}

              {/* Expected Deliverables */}
              {selectedProblem.expectedDeliverables && (
                <div className="space-y-1">
                  <span className="font-bold text-foreground block">Expected Deliverables:</span>
                  <p className="text-muted-foreground leading-relaxed bg-white p-3 rounded-md border border-slate-100">
                    {selectedProblem.expectedDeliverables}
                  </p>
                </div>
              )}

              {/* Connected Project Link */}
              {selectedProblem.assignedProjectId && (
                <div className="p-3 rounded-md bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <span className="text-foreground font-medium">
                    Formal Collaborative Project Active: <strong>{selectedProblem.assignedProjectId}</strong>
                  </span>
                  <Link href="/dashboard/industry/projects">
                    <Button size="sm" className="bg-[#1d4ed8] text-white text-xs h-7">
                      Track Deliverables
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProblem(null)}
              className="text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

