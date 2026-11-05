import { prisma } from "../lib/prisma";
import { IdeaStatus } from "@prisma/client";

async function main() {
  console.log("Seeding sample student idea proposals...");

  // Find student and admin users
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  const admin = await prisma.user.findFirst({
    where: { role: "MSME_ADMIN" },
  });

  if (!student) {
    console.log("No student user found. Skipping seed.");
    return;
  }

  const existingCount = await prisma.idea.count();
  if (existingCount > 0) {
    console.log(`Ideas already exist (${existingCount}). Skipping seed.`);
    return;
  }

  // 1. Pending Idea Proposal
  const idea1 = await prisma.idea.create({
    data: {
      studentId: student.id,
      title: "Automated Yarn Quality & Defect Detection System for Power Looms",
      domain: "Manufacturing & Production",
      problemStatement:
        "Regional textile power looms in Tirunelveli face 15% fabric loss due to undetected yarn breakage and tension irregularities during high-speed winding.",
      proposedSolution:
        "An IoT edge-camera optical flow monitoring module mounted on the loom rail that detects broken threads in <200ms and issues an immediate trip signal to motor relays.",
      expectedImpact: "Estimated 80% reduction in fabric defects and savings of ₹35,000 per month per loom unit.",
      description: "Automated Yarn Quality & Defect Detection System for Power Looms using edge optical sensors.",
      attachments: "https://github.com/fxec-innovations/textile-defect-monitor",
      status: IdeaStatus.SUBMITTED,
      isShowcase: false,
    },
  });

  // 2. Needs Improvement Idea Proposal (with admin feedback and history)
  const idea2 = await prisma.idea.create({
    data: {
      studentId: student.id,
      title: "Solar-Powered Cold Storage Telemetry for Agro-Producers",
      domain: "Agriculture & AgroTech",
      problemStatement:
        "Smallholder vegetable farmers in Tenkasi lose up to 30% of perishable tomato yields during transit and off-grid pre-cooling.",
      proposedSolution:
        "Deploy modular phase-change material (PCM) cold boxes integrated with LoRaWAN telemetry to broadcast temperature and humidity logs to farmer cooperatives.",
      expectedImpact: "Extend shelf-life of perishable harvest by 7 days without requiring heavy diesel generator infrastructure.",
      description: "Solar-Powered Cold Storage Telemetry for Agro-Producers in Tenkasi district.",
      status: IdeaStatus.NEEDS_CHANGES,
      adminFeedback:
        "The PCM thermal architecture is promising, but the bill of materials (BOM) exceeds standard MSME micro-grant allocation. Please provide an itemized hardware cost breakdown and evaluate lower-cost sensor alternatives.",
      reviewedByAdminId: admin?.id || null,
      reviewedAt: new Date(Date.now() - 86400000 * 2),
      isShowcase: false,
    },
  });

  if (admin) {
    await prisma.ideaReview.create({
      data: {
        ideaId: idea2.id,
        adminId: admin.id,
        action: IdeaStatus.NEEDS_CHANGES,
        feedback:
          "The PCM thermal architecture is promising, but the bill of materials (BOM) exceeds standard MSME micro-grant allocation. Please provide an itemized hardware cost breakdown and evaluate lower-cost sensor alternatives.",
        previousStatus: IdeaStatus.SUBMITTED,
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
    });
  }

  // 3. Approved & Published Idea Proposal (with admin approval history)
  const idea3 = await prisma.idea.create({
    data: {
      studentId: student.id,
      title: "Predictive Lubrication & Bearing Vibration Monitor for Coir Mills",
      domain: "IoT & Embedded Systems",
      problemStatement:
        "Heavy de-fibering drum bearings in coir extraction mills fail catastrophically due to fiber dust ingress, causing average 3-day factory standstills.",
      proposedSolution:
        "Industrial MEMS vibration accelerometer coupled with an RS-485 Modbus transmitter that runs FFT peak spectral analysis to predict bearing wear 2 weeks prior to seizure.",
      expectedImpact: "Eliminates catastrophic bearing seizures and cuts maintenance downtime by 65%.",
      description: "Predictive Lubrication & Bearing Vibration Monitor for Coir Mills.",
      attachments: "https://github.com/fxec-innovations/coir-bearing-vibration",
      status: IdeaStatus.ACCEPTED,
      adminFeedback:
        "Excellent problem formulation with high relevance to regional coir industry. Approved for MSME sponsorship showcase and faculty mentor allocation.",
      reviewedByAdminId: admin?.id || null,
      reviewedAt: new Date(Date.now() - 86400000 * 4),
      isShowcase: true,
    },
  });

  if (admin) {
    await prisma.ideaReview.create({
      data: {
        ideaId: idea3.id,
        adminId: admin.id,
        action: IdeaStatus.ACCEPTED,
        feedback:
          "Excellent problem formulation with high relevance to regional coir industry. Approved for MSME sponsorship showcase and faculty mentor allocation.",
        previousStatus: IdeaStatus.SUBMITTED,
        createdAt: new Date(Date.now() - 86400000 * 4),
      },
    });
  }

  console.log("Seeded sample ideas successfully:", [idea1.id, idea2.id, idea3.id]);
}

main().catch(console.error);

