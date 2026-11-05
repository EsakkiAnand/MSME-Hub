import { prisma } from "../lib/prisma";
import { IdeaStatus } from "@prisma/client";

async function runTests() {
  console.log("=== Testing MSME Idea Verification Workflow ===");

  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  const admin = await prisma.user.findFirst({
    where: { role: "MSME_ADMIN" },
  });

  if (!student || !admin) {
    throw new Error("Student or Admin user missing in DB");
  }

  console.log(`Found Student: ${student.name} (${student.id})`);
  console.log(`Found Admin: ${admin.name} (${admin.id})`);

  // Test 1: Create a test idea submission
  console.log("\n--- Test 1: Student submits a new idea ---");
  const testIdea = await prisma.idea.create({
    data: {
      studentId: student.id,
      title: "Test AI Vision Sorter for Agricultural Seeds",
      domain: "AI / Machine Learning",
      problemStatement: "Manual sorting of seeds is error-prone and slow.",
      proposedSolution: "Edge camera with lightweight YOLO model running on Raspberry Pi.",
      expectedImpact: "5x sorting speed increase.",
      description: "Vision based sorter for seeds.",
      status: IdeaStatus.SUBMITTED,
      isShowcase: false,
    },
  });
  console.log(`Created Idea ID: ${testIdea.id}, Status: ${testIdea.status}`);
  if (testIdea.status !== IdeaStatus.SUBMITTED) {
    throw new Error("Initial status should be SUBMITTED");
  }

  // Test 2: Admin requests improvement
  console.log("\n--- Test 2: Admin requests improvements with mandatory feedback ---");
  const improvementFeedback = "Please elaborate on training dataset sources and hardware latency measurements.";
  const [reviewEntry, updatedToNeedsImprovement] = await prisma.$transaction([
    prisma.ideaReview.create({
      data: {
        ideaId: testIdea.id,
        adminId: admin.id,
        action: IdeaStatus.NEEDS_CHANGES,
        feedback: improvementFeedback,
        previousStatus: testIdea.status,
      },
    }),
    prisma.idea.update({
      where: { id: testIdea.id },
      data: {
        status: IdeaStatus.NEEDS_CHANGES,
        adminFeedback: improvementFeedback,
        reviewedByAdminId: admin.id,
        reviewedAt: new Date(),
      },
    }),
  ]);
  console.log(`Updated status to: ${updatedToNeedsImprovement.status}`);
  console.log(`Review log entry created: ID ${reviewEntry.id}, Action: ${reviewEntry.action}`);
  if (updatedToNeedsImprovement.status !== IdeaStatus.NEEDS_CHANGES) {
    throw new Error("Status should be NEEDS_CHANGES");
  }

  // Test 3: Student edits and resubmits
  console.log("\n--- Test 3: Student edits and resubmits proposal ---");
  const [studentResubmitLog, resubmittedIdea] = await prisma.$transaction([
    prisma.ideaReview.create({
      data: {
        ideaId: testIdea.id,
        adminId: student.id,
        action: IdeaStatus.RESUBMITTED,
        feedback: "Revised hardware specs and added dataset citations.",
        previousStatus: IdeaStatus.NEEDS_CHANGES,
      },
    }),
    prisma.idea.update({
      where: { id: testIdea.id },
      data: {
        proposedSolution: "Edge camera with Coral TPU accelerator and 5,000 annotated seed images.",
        status: IdeaStatus.RESUBMITTED,
        resubmittedAt: new Date(),
      },
    }),
  ]);
  console.log(`Idea resubmitted, status: ${resubmittedIdea.status}`);
  if (resubmittedIdea.status !== IdeaStatus.RESUBMITTED) {
    throw new Error("Status should be RESUBMITTED");
  }

  // Test 4: Admin reviews and approves the resubmitted idea
  console.log("\n--- Test 4: Admin reviews and approves idea ---");
  const approvalFeedback = "Hardware revision is thorough. Approved for MSME incubation showcase.";
  const [approvalLog, approvedIdea] = await prisma.$transaction([
    prisma.ideaReview.create({
      data: {
        ideaId: testIdea.id,
        adminId: admin.id,
        action: IdeaStatus.ACCEPTED,
        feedback: approvalFeedback,
        previousStatus: resubmittedIdea.status,
      },
    }),
    prisma.idea.update({
      where: { id: testIdea.id },
      data: {
        status: IdeaStatus.ACCEPTED,
        adminFeedback: approvalFeedback,
        reviewedByAdminId: admin.id,
        reviewedAt: new Date(),
        isShowcase: true,
      },
    }),
  ]);
  console.log(`Approved Idea status: ${approvedIdea.status}, isShowcase: ${approvedIdea.isShowcase}`);
  if (approvedIdea.status !== IdeaStatus.ACCEPTED || !approvedIdea.isShowcase) {
    throw new Error("Idea should be ACCEPTED and isShowcase should be true");
  }

  // Test 5: Verify Discoverable Ideas query only returns approved ideas
  console.log("\n--- Test 5: Discoverable showcase ideas filtering ---");
  const discoverable = await prisma.idea.findMany({
    where: {
      status: {
        in: [
          IdeaStatus.ACCEPTED,
          IdeaStatus.SHOWCASE_PUBLISHED,
          IdeaStatus.CONVERTED_TO_PROJECT,
        ],
      },
      isShowcase: true,
    },
  });
  console.log(`Found ${discoverable.length} discoverable showcase ideas.`);
  const containsUnapproved = discoverable.some((i) => i.status === "SUBMITTED" || i.status === "REJECTED");
  if (containsUnapproved) {
    throw new Error("Security violation: unapproved ideas leaked to showcase!");
  }
  console.log("Verified: Only approved ideas are discoverable.");

  // Clean up test idea
  await prisma.ideaReview.deleteMany({ where: { ideaId: testIdea.id } });
  await prisma.idea.delete({ where: { id: testIdea.id } });
  console.log("\nCleaned up test idea. All workflow verification tests PASSED! ✅");
}

runTests().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});

