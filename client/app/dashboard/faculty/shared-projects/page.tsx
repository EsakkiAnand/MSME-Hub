"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Share2, Users, GitBranch, Calendar, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSharedReferenceProjectsAction } from "@/app/actions/staff";
import { toast } from "sonner";

interface SharedProject {
  id: string;
  name: string;
  status: string;
  githubUrl: string | null;
  sharedBy: string;
  sharedOn: string;
  domain: string;
  team: string[];
  note: string;
  industry?: string;
}

export default function FacultySharedProjectsPage() {
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getSharedReferenceProjectsAction();
      if (res.success) {
        setSharedProjects((res as any).projects || []);
      } else {
        toast.error((res as any).error || "Failed to load shared reference projects.");
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-xs text-muted-foreground">Loading institutional benchmark repositories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Information Header Card */}
      <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex items-start gap-4">
        <div className="size-10 rounded-md bg-slate-100 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-foreground shrink-0">
          <Share2 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            Institutional Benchmark &amp; Shared Repositories
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Curated repository reference architectures shared among academic faculty and student project leads for cross-departmental technical benchmarking, standardizing code quality, and peer review.
          </p>
        </div>
      </div>

      {/* Standardized Project Cards List */}
      <div className="space-y-4">
        {sharedProjects.map((project) => {
          
          return (
            <div
              key={project.id}
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden hover:border-slate-300 hover:shadow-xs transition-all duration-150"
            >
              {/* Card Header: Metas on Left, Action on Right */}
              <div className="px-6 py-3.5 border-b border-slate-100 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-white border border-black/[0.06] dark:border-white/[0.08] px-2 py-0.5 rounded">
                    {project.id.slice(0, 8)}
                  </span>
                  <StatusBadge status={project.status} />
                  <span className="text-xs text-muted-foreground">
                    Domain: <span className="font-medium text-foreground">{project.domain}</span>
                  </span>
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-all duration-150 active:scale-[0.98] self-start sm:self-auto shrink-0"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Open GitHub Code</span>
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  {project.name}
                </h3>
                {project.industry && (
                  <p className="text-xs text-muted-foreground mt-1">Client: {project.industry}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Shared by:</span>
                    <strong className="text-foreground font-medium">{project.sharedBy}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    <span>Shared on: {new Date(project.sharedOn).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Architecture Note */}
                <div className="mt-4 p-3.5 rounded-md bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">Faculty Benchmark Note:</span>
                  <span>{project.note}</span>
                </div>

                {/* Team & Github URL */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-3.5 text-muted-foreground" />
                    <span>Student Team:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.team.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 font-medium text-foreground text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground font-mono text-[11px]">
                    <GitBranch className="size-3" />
                    <span className="truncate max-w-[260px]">{project.githubUrl}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sharedProjects.length === 0 && (
          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1C1C1E] p-8 text-center text-xs text-muted-foreground">
            No shared reference projects available.
          </div>
        )}
      </div>
    </div>
  );
}
