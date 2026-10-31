/**
 * Industry Dashboard Reference Data & Types
 * Conforms to Prisma models (IndustryProfile, Problem, Project, IndustryRating)
 * and PRD §8.3 (Industry Partner Module).
 */

export interface IndustryStats {
  totalSubmitted: number;
  availableInPool: number;
  claimedByFaculty: number;
  activeProjects: number;
  completedProjects: number;
}

export interface IndustryProblemItem {
  id: string; // e.g. PRB-2024-001
  title: string;
  domain: string;
  description: string;
  constraints?: string | null;
  expectedDeliverables?: string | null;
  targetTimeline?: string | null;
  status: "DRAFT" | "POOL_AVAILABLE" | "CLAIMED" | "REJECTED";
  createdAt: string;
  claimedByFacultyName?: string | null;
  assignedProjectId?: string | null;
}

export interface IndustryProjectItem {
  id: string; // e.g. PRJ-2024-001
  problemId: string;
  problemTitle: string;
  domain: string;
  status: "ASSIGNED" | "IN_PROGRESS" | "SOLUTION_SUBMITTED" | "REVISION_IN_PROGRESS" | "APPROVED" | "COMPLETED";
  facultyMentorName: string;
  studentTeamLeadName: string;
  studentTeamLeadId: string;
  studentTeamCount: number;
  targetDeadline: string;
  githubUrl?: string | null;
  hasRated?: boolean;
  rating?: {
    stars: number;
    feedbackText: string;
    createdAt: string;
  } | null;
}

export const initialIndustryProblems: IndustryProblemItem[] = [
  {
    id: "PRB-2024-001",
    title: "Smart Inventory & Stock Deduction Engine for MSME Retail",
    domain: "Software & Cloud",
    description:
      "Design a resilient, low-latency stock tracking system that eliminates overselling across online and in-store retail points-of-sale for small regional distributors.",
    constraints:
      "Must run on low-cost serverless infrastructure with offline POS sync tolerance and zero external ERP licensing costs.",
    expectedDeliverables:
      "Full Next.js responsive web application, PostgreSQL schema with ACID transaction isolation, and MIT-licensed public GitHub repo.",
    targetTimeline: "12 Weeks",
    status: "CLAIMED",
    createdAt: "2026-10-15T09:30:00Z",
    claimedByFacultyName: "Dr. Selvaraj M (CSE)",
    assignedProjectId: "PRJ-2024-001",
  },
  {
    id: "PRB-2024-002",
    title: "Vibration Anomaly Detection Edge Gateway for CNC Machinery",
    domain: "IoT & Analytics",
    description:
      "Develop an ESP32/Raspberry Pi gateway with edge FFT analysis to detect bearing wear in high-speed spinning CNC lathe machinery prior to catastrophic spindle failure.",
    constraints:
      "Sampling frequency >= 100Hz, local alert trigger < 50ms, MQTT telemetry transmission to dashboard.",
    expectedDeliverables:
      "C++/Python edge firmware, dashboard visualization widget, circuit schematic, and GitHub documentation.",
    targetTimeline: "14 Weeks",
    status: "CLAIMED",
    createdAt: "2026-10-18T11:00:00Z",
    claimedByFacultyName: "Prof. Kavitha R (ECE)",
    assignedProjectId: "PRJ-2024-007",
  },
  {
    id: "PRB-2024-003",
    title: "GST-Compliant Automated E-Invoice & Credit Ledger Generator",
    domain: "FinTech & Web",
    description:
      "Automate monthly e-invoice generation and customer credit reconciliation for small engineering machine-tool vendors.",
    constraints:
      "Must support Indian GST format, secure PDF generation, and export to tally-compatible formats.",
    expectedDeliverables:
      "Web interface, encrypted PDF export engine, verified MIT open source repository.",
    targetTimeline: "8 Weeks",
    status: "CLAIMED",
    createdAt: "2026-09-01T10:15:00Z",
    claimedByFacultyName: "Dr. Anand V (IT)",
    assignedProjectId: "PRJ-2023-042",
  },
  {
    id: "PRB-2024-004",
    title: "Automated Yarn Defect Vision Inspection System for Powerlooms",
    domain: "Manufacturing & AI",
    description:
      "Develop computer vision defect detection using OpenCV / lightweight neural network on a camera-mounted loom shuttle to flag warp yarn breakage.",
    constraints:
      "Inference time < 30ms per frame, optical illumination resistant, audible buzzer trigger.",
    expectedDeliverables:
      "Trained model weights, Python runtime script, mounting CAD file, and deployment guide.",
    targetTimeline: "16 Weeks",
    status: "POOL_AVAILABLE",
    createdAt: "2026-10-29T14:20:00Z",
    claimedByFacultyName: null,
    assignedProjectId: null,
  },
];

export const initialIndustryProjects: IndustryProjectItem[] = [
  {
    id: "PRJ-2024-001",
    problemId: "PRB-2024-001",
    problemTitle: "Smart Inventory & Stock Deduction Engine for MSME Retail",
    domain: "Software & Cloud",
    status: "IN_PROGRESS",
    facultyMentorName: "Dr. Selvaraj M",
    studentTeamLeadName: "Mohamed Farhan",
    studentTeamLeadId: "STU0001",
    studentTeamCount: 3,
    targetDeadline: "2026-12-15",
    githubUrl: "https://github.com/fxec-students/smart-inventory-msme",
    hasRated: false,
    rating: null,
  },
  {
    id: "PRJ-2024-007",
    problemId: "PRB-2024-002",
    problemTitle: "Vibration Anomaly Detection Edge Gateway for CNC Machinery",
    domain: "IoT & Analytics",
    status: "SOLUTION_SUBMITTED",
    facultyMentorName: "Prof. Kavitha R",
    studentTeamLeadName: "Santhosh G",
    studentTeamLeadId: "STU0007",
    studentTeamCount: 4,
    targetDeadline: "2026-11-30",
    githubUrl: "https://github.com/fxec-students/iot-predictive-maintenance",
    hasRated: false,
    rating: null,
  },
  {
    id: "PRJ-2023-042",
    problemId: "PRB-2024-003",
    problemTitle: "GST-Compliant Automated E-Invoice & Credit Ledger Generator",
    domain: "FinTech & Web",
    status: "APPROVED",
    facultyMentorName: "Dr. Anand V",
    studentTeamLeadName: "Deepika S",
    studentTeamLeadId: "STU0012",
    studentTeamCount: 2,
    targetDeadline: "2025-09-10",
    githubUrl: "https://github.com/fxec-students/sme-digital-invoice",
    hasRated: true,
    rating: {
      stars: 5,
      feedbackText:
        "Outstanding delivery by the student team! The GST PDF invoice generation works seamlessly and reduced our billing time from 15 minutes to under 30 seconds. Code is cleanly documented with MIT license.",
      createdAt: "2025-09-14T11:20:00Z",
    },
  },
];

