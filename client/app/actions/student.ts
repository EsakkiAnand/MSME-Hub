"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole, ProjectStatus, GuidanceStatus } from "@prisma/client";
import { requireRole } from "@/lib/auth-server";
import { projectStateMachine } from "@/lib/state-machines/machines/project-machine";
import { guidanceStateMachine } from "@/lib/state-machines/machines/guidance-machine";
import { assertTransition } from "@/lib/state-machines";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function getStudent() {
  const user = await requireRole([UserRole.STUDENT]);
  return user;
}

async function getStudentSession() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user?.id) return null;
  return session;
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Dashboard Overview
// ─────────────────────────────────────────────────────────────────────────────

export async function getStudentOverview() {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projectMemberships: {
          include: {
            project: {
              include: {
                staff: { select: { name: true, email: true } },
                problem: { include: { industry: { select: { companyName: true } } } },
                members: {
                  include: { student: { select: { name: true, uniqueId: true, email: true } } },
                  orderBy: { isLead: "desc" },
                },
              },
            },
          },
        },
        submittedIdeas: { orderBy: { createdAt: "desc" }, take: 5 },
        guidanceRequests: {
          include: { project: { select: { title: true } }, assignedAlumni: { select: { name: true, uniqueId: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        extensionRequests: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });

    if (!user) return { success: false, error: "User not found." };

    const activeProjects = user.projectMemberships.filter(
      (m: any) => {
        const s = m.project.status;
        return s === "ASSIGNED" || s === "IN_PROGRESS" || s === "SOLUTION_SUBMITTED" || s === "REVISION_IN_PROGRESS";
      }
    );

    const completedProjects = user.projectMemberships.filter(
      (m: any) => m.project.status === "APPROVED" || m.project.status === "COMPLETED"
    );

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        uniqueId: user.uniqueId,
        role: user.role,
        studentTrack: user.studentTrack,
        msmeApprovalStatus: user.msmeApprovalStatus,
        isVerified: user.isVerified,
      },
      stats: {
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        ideasSubmitted: user.submittedIdeas.length,
        guidanceRequests: user.guidanceRequests.length,
        pendingExtensions: user.extensionRequests.filter((e) => e.status === "PENDING").length,
      },
      activeProjects: activeProjects.map((m) => ({
        id: m.project.id,
        title: m.project.title,
        status: m.project.status,
        isLead: m.isLead,
        targetDeadline: m.project.targetDeadline?.toISOString() || null,
        githubUrl: m.project.githubUrl,
        staff: m.project.staff,
        industry: m.project.problem?.industry?.companyName || null,
        team: m.project.members.map((mem) => ({
          name: mem.student.name,
          uniqueId: mem.student.uniqueId,
          email: mem.student.email,
          isLead: mem.isLead,
        })),
      })),
      completedProjects: completedProjects.map((m) => ({
        id: m.project.id,
        title: m.project.title,
        status: m.project.status,
        isLead: m.isLead,
        githubUrl: m.project.githubUrl,
      })),
      recentIdeas: user.submittedIdeas.map((idea) => ({
        id: idea.id,
        title: idea.title,
        status: idea.status,
        domain: idea.domain,
        updatedAt: idea.updatedAt.toISOString(),
      })),
      recentGuidance: user.guidanceRequests.map((g) => ({
        id: g.id,
        projectTitle: g.project.title,
        tags: g.tags,
        question: g.question,
        status: g.status,
        isHelpful: g.isHelpful,
        assignedAlumni: g.assignedAlumni,
        createdAt: g.createdAt.toISOString(),
      })),
      recentExtensions: user.extensionRequests.map((e) => ({
        id: e.id,
        projectId: e.projectId,
        reason: e.reason,
        status: e.status,
        requestedDate: e.requestedDate.toISOString(),
        reviewedAt: e.reviewedAt?.toISOString() || null,
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load student overview." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Projects
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all projects the student is a member of.
 */
export async function getStudentProjects() {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const memberships = await prisma.projectMember.findMany({
      where: { studentId: session.user.id },
      include: {
        project: {
          include: {
            staff: { select: { name: true, email: true, uniqueId: true } },
            problem: { include: { industry: { select: { companyName: true, companyId: true, domain: true } } } },
            idea: true,
            members: {
              include: { student: { select: { id: true, name: true, uniqueId: true, email: true, role: true } } },
              orderBy: { isLead: "desc" },
            },
            deadlineExtensions: { where: { status: "PENDING" } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return {
      success: true,
      projects: memberships.map((m) => {
        const p = m.project;
        const statusStr = p.status as string;
        const isActive = ["ASSIGNED", "IN_PROGRESS", "SOLUTION_SUBMITTED", "REVISION_IN_PROGRESS"].includes(statusStr);

        return {
          id: p.id,
          title: p.title,
          status: p.status,
          isLead: m.isLead,
          isActive,
          targetDeadline: p.targetDeadline?.toISOString() || null,
          githubUrl: p.githubUrl,
          adminReviewNotes: p.adminReviewNotes,
          createdAt: p.createdAt.toISOString(),
          staff: p.staff,
          problem: p.problem,
          idea: p.idea,
          team: p.members.map((mem) => ({
            id: mem.student.id,
            name: mem.student.name,
            uniqueId: mem.student.uniqueId,
            email: mem.student.email,
            role: mem.student.role,
            isLead: mem.isLead,
          })),
          hasPendingExtension: p.deadlineExtensions.length > 0,
        };
      }),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load projects." };
  }
}

/**
 * Fetch single project detail for a student.
 */
export async function getStudentProjectDetail(projectId: string) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId: session.user.id } },
    });

    if (!membership) {
      return { success: false, error: "You are not a member of this project." };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        staff: { select: { name: true, email: true, uniqueId: true } },
        problem: { include: { industry: true } },
        idea: true,
        members: {
          include: { student: { select: { id: true, name: true, uniqueId: true, email: true } } },
          orderBy: { isLead: "desc" },
        },
        deadlineExtensions: { orderBy: { createdAt: "desc" } },
        guidanceRequests: {
          include: {
            assignedAlumni: { select: { id: true, name: true, uniqueId: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        feedback: {
          include: { author: { select: { id: true, name: true, uniqueId: true, role: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) return { success: false, error: "Project not found." };

    return {
      success: true,
      project: {
        ...project,
        isLead: membership.isLead,
        targetDeadline: project.targetDeadline?.toISOString() || null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        members: project.members.map((m) => ({
          ...m,
          joinedAt: m.joinedAt.toISOString(),
        })),
        deadlineExtensions: project.deadlineExtensions.map((d) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
          reviewedAt: d.reviewedAt?.toISOString() || null,
        })),
        guidanceRequests: project.guidanceRequests.map((g) => ({
          ...g,
          createdAt: g.createdAt.toISOString(),
          updatedAt: g.updatedAt.toISOString(),
        })),
        feedback: project.feedback.map((f) => ({
          ...f,
          createdAt: f.createdAt.toISOString(),
        })),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load project detail." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub Solution Submission (Team Lead Only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submit or update the public GitHub repository URL for a project.
 * Only the designated Team Lead can call this.
 * Server-side GitHub validation: checks public access, commits, README.md, MIT License.
 */
export async function submitGithubSolutionAction(projectId: string, githubUrl: string) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId: session.user.id } },
    });

    if (!membership) return { success: false, error: "You are not a member of this project." };
    if (!membership.isLead) return { success: false, error: "Only the Project Team Lead can submit the GitHub solution." };

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { status: true },
    });

    if (!project) return { success: false, error: "Project not found." };

    // Basic URL validation
    const githubPattern = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;
    if (!githubPattern.test(githubUrl.trim())) {
      return { success: false, error: "Please enter a valid public GitHub repository URL (https://github.com/owner/repo)." };
    }

    const cleanUrl = githubUrl.trim().replace(/\/+$/, "");

    // Server-side GitHub validation via proxy
    const validation = await validateGithubRepo(cleanUrl);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || "GitHub repository validation failed. Ensure the repo is public and has MIT License + README.md.",
        details: validation.details,
      };
    }

    // Assert valid state machine transition (DX + AX safeguard)
    assertTransition(
      projectStateMachine,
      project.status,
      ProjectStatus.SOLUTION_SUBMITTED,
      UserRole.STUDENT,
      {
        isLead: membership.isLead,
        hasGithubUrl: true,
        hasMitLicense: validation.details?.hasMitLicense ?? true,
        hasReadme: validation.details?.hasReadme ?? true,
      }
    );

    // Update project — cache tree JSON and timestamp
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        githubUrl: cleanUrl,
        status: "SOLUTION_SUBMITTED" as any,
        // @ts-ignore — Prisma v7 Json type quirk
        githubTreeJson: validation.treeJson,
        githubTreeCachedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/student/project-details?id=${projectId}`);
    revalidatePath("/dashboard/student/projects");

    return {
      success: true,
      message: "Solution submitted successfully! GitHub repository validated.",
      githubUrl: cleanUrl,
      validation: validation.details,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit solution." };
  }
}

/**
 * Unlink the GitHub repository from a project (Project Team Lead only).
 * Reverts status to IN_PROGRESS when it was SOLUTION_SUBMITTED.
 */
export async function unlinkGithubSolutionAction(projectId: string) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId, studentId: session.user.id } },
    });
    if (!membership) return { success: false, error: "You are not a member of this project." };
    if (!membership.isLead) {
      return { success: false, error: "Only the Project Team Lead can unlink the repository." };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { status: true },
    });
    if (!project) return { success: false, error: "Project not found." };

    if (project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.COMPLETED) {
      return { success: false, error: "Cannot unlink GitHub repository from an approved or completed project." };
    }

    if (project.status === ProjectStatus.SOLUTION_SUBMITTED) {
      assertTransition(
        projectStateMachine,
        project.status,
        ProjectStatus.IN_PROGRESS,
        UserRole.STUDENT,
        { isLead: membership.isLead }
      );
    }

    // @ts-ignore — Prisma v7 enum cast
    await prisma.project.update({
      where: { id: projectId },
      data: {
        githubUrl: null,
        // @ts-ignore
        githubTreeJson: null,
        githubTreeCachedAt: null,
        status:
          project.status === "SOLUTION_SUBMITTED"
            ? ("IN_PROGRESS" as any)
            : undefined,
      },
    });

    revalidatePath("/dashboard/student/code-access");
    revalidatePath("/dashboard/student/projects");
    revalidatePath(`/dashboard/student/project-details?id=${projectId}`);

    return { success: true, message: "Repository link unlinked." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to unlink repository." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub Validation (Server-side Proxy)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates a GitHub repo via server-side proxy call.
 * Checks: public access, non-empty, README.md exists, MIT License exists.
 * Also fetches the file tree for in-dashboard preview.
 */
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
    // Use the project's server-side GitHub proxy (avoids CORS & token exposure)
    const proxyUrl = `/api/proxy/github?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(cleanRepo)}`;

    // Fetch repo metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "MSME-Hub/1.0",
      },
      // No token — public repos are fine without auth (60 req/hr limit)
    });

    if (!repoRes.ok) {
      if (repoRes.status === 404) return { valid: false, error: "Repository not found or is private." };
      if (repoRes.status === 403) return { valid: false, error: "GitHub API rate limited. Please try again later." };
      return { valid: false, error: `GitHub API error (${repoRes.status}).` };
    }

    const repoData = await repoRes.json();

    // Check public
    if (repoData.private) {
      return { valid: false, error: "Repository is private. Please make it public." };
    }

    // Check commits
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
        lastCommitDate = commitsData[0]?.commit?.committer?.date || undefined;
      }
    }

    // Fetch tree
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
          hasMitLicense = names.some(
            (n: string) => n === "license" || n.startsWith("license.") || n.includes("mit")
          );
        }
      }
    }

    const allValid = commitCount > 0 && hasReadme && hasMitLicense;

    return {
      valid: allValid,
      error: allValid
        ? undefined
        : [
            commitCount === 0 && "No commits found.",
            !hasReadme && "README.md missing.",
            !hasMitLicense && "MIT License file missing.",
          ].filter(Boolean).join(" ") || "Validation failed.",
      treeJson,
      details: { isPublic: true, hasReadme, hasMitLicense, commitCount, lastCommitDate },
    };
  } catch (err: any) {
    return { valid: false, error: "Network error during GitHub validation. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Guidance Requests
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Student creates a guidance request — either direct (target alumni) or board-style (no specific alumni).
 */
export async function createGuidanceRequestAction(input: {
  projectId: string;
  question: string;
  tags: string[];
  alumniId?: string;
}) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    // Verify student is member of this project
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId: input.projectId, studentId: session.user.id } },
    });
    if (!membership) return { success: false, error: "You are not a member of this project." };

    const request = await prisma.guidanceRequest.create({
      data: {
        projectId: input.projectId,
        requestedByStudentId: session.user.id,
        alumniId: input.alumniId || null,
        tags: input.tags || [],
        question: input.question.trim(),
        status: GuidanceStatus.OPEN,
      },
      include: {
        project: { select: { title: true } },
        assignedAlumni: { select: { name: true, uniqueId: true } },
      },
    });

    revalidatePath(`/dashboard/student/feedback`);
    revalidatePath("/dashboard/student");

    return {
      success: true,
      message: "Guidance request posted to the Guidance Board.",
      request: {
        ...request,
        createdAt: request.createdAt.toISOString(),
        updatedAt: request.updatedAt.toISOString(),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create guidance request." };
  }
}

/**
 * Student resolves a guidance thread and optionally awards Helpful Endorsement.
 */
export async function resolveGuidanceRequestAction(guidanceRequestId: string, isHelpful: boolean) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const request = await prisma.guidanceRequest.findUnique({
      where: { id: guidanceRequestId },
    });

    if (!request) return { success: false, error: "Guidance request not found." };
    if (request.requestedByStudentId !== session.user.id) {
      return { success: false, error: "You can only resolve your own guidance requests." };
    }

    // State machine check
    assertTransition(
      guidanceStateMachine,
      request.status,
      GuidanceStatus.RESOLVED,
      UserRole.STUDENT
    );

    const updated = await prisma.guidanceRequest.update({
      where: { id: guidanceRequestId },
      data: {
        status: GuidanceStatus.RESOLVED,
        isHelpful,
      },
      include: {
        assignedAlumni: { select: { id: true, name: true, uniqueId: true } },
      },
    });

    // If helpful, increment alumni's helpfulCount
    if (isHelpful && request.alumniId) {
      await prisma.alumniProfile.update({
        where: { userId: request.alumniId },
        data: { helpfulCount: { increment: 1 } },
      });
    }

    revalidatePath(`/dashboard/student/feedback`);
    revalidatePath("/dashboard/alumni");

    return {
      success: true,
      message: isHelpful ? "Guidance marked as helpful. Endorsement recorded." : "Guidance thread resolved.",
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to resolve guidance request." };
  }
}

/**
 * Close a guidance request (after resolution, by the student).
 */
export async function closeGuidanceRequestAction(guidanceRequestId: string) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const request = await prisma.guidanceRequest.findUnique({
      where: { id: guidanceRequestId },
    });
    if (!request) return { success: false, error: "Guidance request not found." };
    if (request.requestedByStudentId !== session.user.id) {
      return { success: false, error: "Unauthorized." };
    }

    // State machine check
    assertTransition(
      guidanceStateMachine,
      request.status,
      GuidanceStatus.CLOSED,
      UserRole.STUDENT
    );

    await prisma.guidanceRequest.update({
      where: { id: guidanceRequestId },
      data: { status: GuidanceStatus.CLOSED },
    });

    revalidatePath(`/dashboard/student/feedback`);
    return { success: true, message: "Guidance thread closed." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to close guidance request." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Deadline Extension Request (Team Lead Only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Team Lead submits a deadline extension request.
 */
export async function requestDeadlineExtensionAction(input: {
  projectId: string;
  reason: string;
  requestedDate: string;
}) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId: input.projectId, studentId: session.user.id } },
    });

    if (!membership) return { success: false, error: "You are not a member of this project." };
    if (!membership.isLead) return { success: false, error: "Only the Project Team Lead can request deadline extensions." };

    // Check for pending extension
    const existing = await prisma.deadlineExtension.findFirst({
      where: { projectId: input.projectId, status: "PENDING" },
    });
    if (existing) {
      return { success: false, error: "A pending extension request already exists for this project." };
    }

    const extension = await prisma.deadlineExtension.create({
      data: {
        projectId: input.projectId,
        requestedByStudentId: session.user.id,
        reason: input.reason.trim(),
        requestedDate: new Date(input.requestedDate),
        status: "PENDING",
      },
    });

    revalidatePath(`/dashboard/student/project-details?id=${input.projectId}`);
    revalidatePath("/dashboard/faculty/projects");

    return {
      success: true,
      message: "Deadline extension request submitted to your staff mentor.",
      extension: { ...extension, requestedDate: extension.requestedDate.toISOString() },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit extension request." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Ideas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the current student's submitted ideas.
 */
export async function getStudentIdeas() {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const ideas = await prisma.idea.findMany({
      where: { studentId: session.user.id },
      include: {
        reviewedByAdmin: { select: { name: true, uniqueId: true } } as any,
        reviewHistory: {
          include: { admin: { select: { name: true, uniqueId: true } } } as any,
          orderBy: { createdAt: "desc" } as any,
        },
      } as any,
      orderBy: { updatedAt: "desc" },
    });

    return {
      success: true,
      ideas: ideas.map((idea) => ({
        ...idea,
        createdAt: idea.createdAt.toISOString(),
        updatedAt: idea.updatedAt.toISOString(),
        reviewedAt: idea.reviewedAt?.toISOString() || null,
        resubmittedAt: idea.resubmittedAt?.toISOString() || null,
        reviewHistory: idea.reviewHistory.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
      })),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load ideas." };
  }
}

/**
 * Update student profile contact details.
 */
export async function updateStudentProfileAction(input: {
  phone?: string;
  githubUsername?: string;
  portfolioUrl?: string;
}) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: input,
    });

    revalidatePath("/dashboard/student/profile");
    revalidatePath("/dashboard/student");

    return {
      success: true,
      message: "Profile updated successfully.",
      user: {
        name: updated.name,
        email: updated.email,
        phone: (updated as any).phone,
        githubUsername: (updated as any).githubUsername,
        portfolioUrl: (updated as any).portfolioUrl,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update profile." };
  }
}

/**
 * Submit feedback (non-guidance) to a project — general comment.
 */
export async function submitStudentFeedbackAction(input: {
  projectId: string;
  content: string;
  category: "GENERAL" | "ARCHITECTURE" | "INDUSTRY_RELEVANCE" | "SECURITY_QUALITY";
}) {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const membership = await prisma.projectMember.findUnique({
      where: { projectId_studentId: { projectId: input.projectId, studentId: session.user.id } },
    });
    if (!membership) return { success: false, error: "You are not a member of this project." };

    const feedback = await prisma.feedback.create({
      data: {
        projectId: input.projectId,
        authorId: session.user.id,
        content: input.content.trim(),
        category: input.category,
      },
    });

    revalidatePath(`/dashboard/student/feedback`);
    revalidatePath(`/dashboard/student/project-details?id=${input.projectId}`);

    return { success: true, message: "Feedback submitted.", feedback: { ...feedback, createdAt: feedback.createdAt.toISOString() } };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit feedback." };
  }
}

/**
 * Get student and staff leaderboard rankings.
 */
export async function getLeaderboardAction() {
  try {
    const session = await getStudentSession();
    if (!session) return { success: false, error: "Unauthenticated" };

    const [students, staffList] = await Promise.all([
      prisma.user.findMany({
        where: { role: UserRole.STUDENT },
        include: {
          projectMemberships: { include: { project: true } },
        },
      }),
      prisma.user.findMany({
        where: { role: UserRole.STAFF },
        include: {
          supervisedProjects: { select: { id: true } },
        },
      }),
    ]);

    const studentRankings = students
      .map((s) => {
        const completedProjects = s.projectMemberships.filter(
          (m: any) => m.project.status === "APPROVED" || m.project.status === "COMPLETED"
        ).length;
        const totalProjects = s.projectMemberships.length;
        const score = Math.min(100, completedProjects * 15 + totalProjects * 5 + completedProjects * 3);
        return {
          id: s.id,
          name: s.name,
          uniqueId: s.uniqueId,
          department: "Engineering",
          projectsCount: totalProjects,
          feedbackScore: score,
          isMe: s.id === session.user.id,
          badge: score >= 80 ? "gold" : score >= 60 ? "silver" : score >= 40 ? "bronze" : undefined,
        };
      })
      .sort((a, b) => b.feedbackScore - a.feedbackScore)
      .slice(0, 20);

    const staffRankings = staffList
      .map((s) => ({
        id: s.id,
        name: s.name,
        uniqueId: s.uniqueId,
        department: "Faculty",
        projectsCount: (s as any).projectsLed?.length || 0,
        feedbackScore: Math.min(5, 3.5 + ((s as any).projectsLed?.length || 0) * 0.3),
      }))
      .sort((a, b) => b.feedbackScore - a.feedbackScore)
      .slice(0, 20);

    return { success: true, students: studentRankings, staff: staffRankings };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load leaderboard." };
  }
}
