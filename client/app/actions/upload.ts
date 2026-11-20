"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth-server";

// ─────────────────────────────────────────────────────────────────────────────
// Vercel Blob Upload Handler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload an industry verification document (Udyam certificate PDF).
 */
export async function uploadIndustryDocumentAction(formData: FormData) {
  try {
    const session = await getAuthenticatedUser();

    if (session?.user?.role !== UserRole.INDUSTRY) {
      return { success: false, error: "Only Industry Partners can upload verification documents." };
    }

    const file = formData.get("document") as File | null;
    if (!file) return { success: false, error: "No file uploaded." };

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are accepted for verification documents." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must not exceed 10 MB." };
    }

    // Dynamic import — @vercel/blob is a production-only dependency
    let blobUrl: string;
    try {
      // @ts-ignore
      const { put } = await import("@vercel/blob");
      const filename = `verification/${session.user.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/pdf",
      });
      blobUrl = blob.url;
    } catch {
      // Local dev fallback — no @vercel/blob available
      console.warn("@vercel/blob not available — using placeholder URL.");
      blobUrl = "local-dev-placeholder";
    }

    await prisma.industryProfile.update({
      where: { userId: session.user.id },
      data: { verificationDocUrl: blobUrl },
    });

    revalidatePath("/dashboard/industry/profile");
    revalidatePath("/dashboard/admin/industry-verification");

    return { success: true, message: "Verification document uploaded successfully.", url: blobUrl };
  } catch (err: any) {
    console.error("Error in uploadIndustryDocumentAction:", err);
    return { success: false, error: err?.message || "Failed to upload document." };
  }
}

/**
 * Upload a profile photo for any authenticated user.
 */
export async function uploadProfilePhotoAction(formData: FormData) {
  try {
    const session = await getAuthenticatedUser();
    if (!session?.user?.id) return { success: false, error: "Unauthenticated" };

    const file = formData.get("photo") as File | null;
    if (!file) return { success: false, error: "No file uploaded." };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Only JPEG, PNG, or WebP images are allowed." };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Image must not exceed 2 MB." };
    }

    let blobUrl: string;
    try {
      // @ts-ignore
      const { put } = await import("@vercel/blob");
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `avatars/${session.user.id}_${Date.now()}.${ext}`;
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      });
      blobUrl = blob.url;
    } catch {
      blobUrl = "local-dev-placeholder";
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blobUrl },
    });

    revalidatePath("/dashboard/student/profile");
    revalidatePath("/dashboard/faculty/profile");
    revalidatePath("/dashboard/alumni/profile");
    revalidatePath("/dashboard/industry/profile");

    return { success: true, message: "Profile photo updated.", url: blobUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to upload photo." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Auth Helper
// ─────────────────────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  return session;
}
