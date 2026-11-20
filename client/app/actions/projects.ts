"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole, ProjectStatus, ProblemStatus } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Project Discovery (Public-ish — for Alumni)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all active public projects for alumni/industry discovery.
 */
export async function getDiscoverableProjects(filters?: {
  domain?: string;
  search?: string;
}) {
  try {
    const whereClause: any = {
      status: {
        in: [
          ProjectStatus.ASSIGNED,
          ProjectStatus.IN_PROGRESS,
          ProjectStatus.SOLUTION_SUBMITTED,
          ProjectStatus.REVISION_IN_PROGRESS,
        ],
      },
    };

    if (filters?.domain && filters.domain !== "ALL") {
      whereClause.problem = { domain: { contains: filters.domain, mode: "insensitive" } };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        staff: { select: { name: true, email: true, uniqueId: true } },
        problem: {
          include: { industry: { select: { companyName: true, companyId: true, domain: true } } },
        },
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true } } },
          orderBy: { isLead: "desc" },
        },
        guidanceRequests: { select: { id: true, status: true, tags: true, question: true } },
        feedback: { take: 3, orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true, role: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    let filtered = projects;
    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      filtered = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.problem?.industry?.companyName?.toLowerCase().includes(q) ||
          p.problem?.domain?.toLowerCase().includes(q) ||
          p.members.some((m) => m.student.name.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      projects: filtered.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        githubUrl: p.githubUrl,
        targetDeadline: p.targetDeadline?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
        staff: p.staff,
        problem: p.problem,
        team: p.members.map((m) => ({
          id: m.student.id,
          name: m.student.name,
          uniqueId: m.student.uniqueId,
          isLead: m.isLead,
        })),
        guidanceRequests: p.guidanceRequests,
        recentFeedback: p.feedback.map((f) => ({
          id: f.id,
          content: f.content,
          category: f.category,
          authorName: f.author.name,
          authorRole: f.author.role,
          createdAt: f.createdAt.toISOString(),
        })),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load projects." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub Tree Caching (5-minute TTL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the GitHub tree for a project, using the database cache if fresh (< 5 min).
 * Falls back to re-fetching from GitHub API.
 */
export async function getProjectGithubTree(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { githubUrl: true, githubTreeJson: true, githubTreeCachedAt: true },
    });

    if (!project || !project.githubUrl) {
      return { success: false, error: "Project has no GitHub URL configured." };
    }

    // Check cache freshness (5 minutes)
    const CACHE_TTL_MS = 5 * 60 * 1000;
    const now = Date.now();
    if (project.githubTreeJson && project.githubTreeCachedAt) {
      const cacheAge = now - new Date(project.githubTreeCachedAt).getTime();
      if (cacheAge < CACHE_TTL_MS) {
        return {
          success: true,
          cached: true,
          tree: project.githubTreeJson,
          githubUrl: project.githubUrl,
          cachedAt: project.githubTreeCachedAt.toISOString(),
        };
      }
    }

    // Cache miss — re-fetch from GitHub
    const validation = await validateGithubRepo(project.githubUrl);

    if (validation.valid && validation.treeJson) {
      // @ts-ignore — Prisma v7 Json type resolution
      await prisma.project.update({
        where: { id: projectId },
        data: {
          githubTreeJson: validation.treeJson,
          githubTreeCachedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      cached: false,
      tree: validation.treeJson || [],
      githubUrl: project.githubUrl,
      details: validation.details,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to fetch GitHub tree." };
  }
}

/**
 * Invalidate the GitHub tree cache for a project.
 */
export async function invalidateGithubCacheAction(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    // @ts-ignore — Prisma v7 Json null assignment quirk
    await (prisma.project as any).update({
      where: { id: projectId },
      data: { githubTreeJson: null, githubTreeCachedAt: null },
    });

    revalidatePath(`/dashboard/admin/github-review?id=${projectId}`);
    revalidatePath(`/dashboard/student/project-details?id=${projectId}`);
    revalidatePath(`/dashboard/faculty/project-details?id=${projectId}`);

    return { success: true, message: "GitHub cache invalidated. Next request will re-fetch from GitHub." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to invalidate cache." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub Validation (same logic used by student submission)
// ─────────────────────────────────────────────────────────────────────────────

async function validateGithubRepo(repoUrl: string): Promise<{
  valid: boolean;
  error?: string;
  treeJson?: any;
  details?: {
    isPublic: boolean;
    hasReadme: boolean;
    hasMitLicense: boolean;
    commitCount: number;
    lastCommitDate?: string;
  };
}> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return { valid: false, error: "Invalid GitHub URL format." };

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, "");

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "MSME-Hub/1.0" },
    });

    if (!repoRes.ok) {
      if (repoRes.status === 404) return { valid: false, error: "Repository not found or is private." };
      if (repoRes.status === 403) return { valid: false, error: "GitHub API rate limited. Please try again later." };
      return { valid: false, error: `GitHub API error (${repoRes.status}).` };
    }

    const repoData = await repoRes.json();
    if (repoData.private) return { valid: false, error: "Repository is private. Please make it public." };

    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=1`,
      { headers: { Accept: "application/vnd.github+json", "User-Agent": "MSME-Hub/1.0" } }
    );

    let commitCount = 0;
    let lastCommitDate: string | undefined;
    if (commitsRes.ok) {
      const commitsData = await commitsRes.json();
      commitCount = parseInt(commitsRes.headers.get("X-Total-Count") || "0", 10) || commitsData.length;
      if (commitsData.length > 0) {
        lastCommitDate = commitsData[0]?.commit?.committer?.date;
      }
    }

    const defaultBranch = repoData.default_branch;
    const branchRes = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/branches/${defaultBranch}`,
      { headers: { Accept: "application/vnd.github+json", "User-Agent": "MSME-Hub/1.0" } }
    );

    let treeJson = null;
    let hasReadme = false;
    let hasMitLicense = false;

    if (branchRes.ok) {
      const branchData = await branchRes.json();
      const treeSha = branchData?.commit?.commit?.tree?.sha;

      if (treeSha) {
        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${treeSha}?recursive=1`,
          { headers: { Accept: "application/vnd.github+json", "User-Agent": "MSME-Hub/1.0" } }
        );

        if (treeRes.ok) {
          const treeData = await treeRes.json();
          treeJson = treeData.tree || null;

          const files = treeData.tree || [];
          const names = files.map((f: any) => f.path.toLowerCase());
          hasReadme = names.some((n: string) => n === "readme.md" || n.startsWith("readme."));
          hasMitLicense = names.some((n: string) => n === "license" || n.startsWith("license.") || n.includes("mit"));
        }
      }
    }

    const allValid = commitCount > 0 && hasReadme && hasMitLicense;

    return {
      valid: allValid,
      error: allValid
        ? undefined
        : [commitCount === 0 && "No commits found.", !hasReadme && "README.md missing.", !hasMitLicense && "MIT License missing."]
            .filter(Boolean)
            .join(" "),
      treeJson,
      details: { isPublic: true, hasReadme, hasMitLicense, commitCount, lastCommitDate },
    };
  } catch {
    return { valid: false, error: "Network error during GitHub validation." };
  }
}
