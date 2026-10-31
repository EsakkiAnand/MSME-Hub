export interface FacultyStudent {
  id: string;
  name: string;
  regNo: string;
  department: string;
  year: string;
  email: string;
  projectId: string;
  projectName: string;
  projectStatus: "IN_PROGRESS" | "SOLUTION_SUBMITTED" | "APPROVED" | "REVISION_IN_PROGRESS";
  isLead: boolean;
  role: string;
  cgpa: number;
}

export interface FacultyProject {
  id: string;
  name: string;
  status: "IN_PROGRESS" | "SOLUTION_SUBMITTED" | "APPROVED" | "REVISION_IN_PROGRESS";
  mentor: string;
  description: string;
  deadline: string;
  domain: string;
  msmeCompany: string;
  team: { name: string; regNo: string; role: string; isLead: boolean }[];
  milestones: { label: string; done: boolean; date: string }[];
  githubUrl: string | null;
  documents: { name: string; type: string }[];
  extensionRequested?: {
    requestedDate: string;
    reason: string;
    currentDeadline: string;
  } | null;
}

export interface FacultyIdeaSubmission {
  id: string;
  title: string;
  studentName: string;
  studentRegNo: string;
  department: string;
  submissionDate: string;
  domain: string;
  targetSector: string;
  description: string;
  expectedOutcome: string;
  status: "PENDING_REVIEW" | "ACCEPTED" | "REVISION_REQUESTED" | "REJECTED";
  facultyRemarks?: string;
}

export const initialStudents: FacultyStudent[] = [
  {
    id: "STU-001",
    name: "Mohamed Farhan",
    regNo: "950821104032",
    department: "CSE",
    year: "Final Year (VIII Sem)",
    email: "mohamedfarhan@francisxavier.ac.in",
    projectId: "PRJ-2024-001",
    projectName: "Smart Inventory Management for MSMEs",
    projectStatus: "IN_PROGRESS",
    isLead: true,
    role: "Full-Stack Developer",
    cgpa: 8.85,
  },
  {
    id: "STU-002",
    name: "Priya K",
    regNo: "950821104045",
    department: "CSE",
    year: "Final Year (VIII Sem)",
    email: "priya.k@francisxavier.ac.in",
    projectId: "PRJ-2024-001",
    projectName: "Smart Inventory Management for MSMEs",
    projectStatus: "IN_PROGRESS",
    isLead: false,
    role: "Frontend Developer",
    cgpa: 9.12,
  },
  {
    id: "STU-003",
    name: "Arjun R",
    regNo: "950821104011",
    department: "CSE",
    year: "Final Year (VIII Sem)",
    email: "arjun.r@francisxavier.ac.in",
    projectId: "PRJ-2024-001",
    projectName: "Smart Inventory Management for MSMEs",
    projectStatus: "IN_PROGRESS",
    isLead: false,
    role: "Backend Engineer",
    cgpa: 8.42,
  },
  {
    id: "STU-004",
    name: "Santhosh G",
    regNo: "950821104067",
    department: "CSE",
    year: "Final Year (VIII Sem)",
    email: "santhosh.g@francisxavier.ac.in",
    projectId: "PRJ-2024-007",
    projectName: "Predictive Maintenance IoT Dashboard",
    projectStatus: "SOLUTION_SUBMITTED",
    isLead: true,
    role: "IoT Systems Engineer",
    cgpa: 9.4,
  },
  {
    id: "STU-005",
    name: "Nandhini P",
    regNo: "950821104038",
    department: "CSE",
    year: "Final Year (VIII Sem)",
    email: "nandhini.p@francisxavier.ac.in",
    projectId: "PRJ-2024-007",
    projectName: "Predictive Maintenance IoT Dashboard",
    projectStatus: "SOLUTION_SUBMITTED",
    isLead: false,
    role: "Data Analyst",
    cgpa: 8.9,
  },
  {
    id: "STU-006",
    name: "Karthikeyan S",
    regNo: "950821205018",
    department: "IT",
    year: "Third Year (VI Sem)",
    email: "karthikeyan.s@francisxavier.ac.in",
    projectId: "PRJ-2024-012",
    projectName: "Cloud Micro-ERP for Tirunelveli Brassware MSMEs",
    projectStatus: "IN_PROGRESS",
    isLead: true,
    role: "System Architect",
    cgpa: 8.65,
  },
  {
    id: "STU-007",
    name: "Divya B",
    regNo: "950821205009",
    department: "IT",
    year: "Third Year (VI Sem)",
    email: "divya.b@francisxavier.ac.in",
    projectId: "PRJ-2024-012",
    projectName: "Cloud Micro-ERP for Tirunelveli Brassware MSMEs",
    projectStatus: "IN_PROGRESS",
    isLead: false,
    role: "UI/UX Designer",
    cgpa: 8.78,
  },
  {
    id: "STU-008",
    name: "Rahul M",
    regNo: "950821106024",
    department: "ECE",
    year: "Final Year (VIII Sem)",
    email: "rahul.m@francisxavier.ac.in",
    projectId: "PRJ-2023-042",
    projectName: "Digital Invoice & GST Ledger Generator",
    projectStatus: "APPROVED",
    isLead: true,
    role: "Backend & FinTech Integration",
    cgpa: 8.55,
  },
];

export const initialProjects: Record<string, FacultyProject> = {
  "PRJ-2024-001": {
    id: "PRJ-2024-001",
    name: "Smart Inventory Management for MSMEs",
    status: "IN_PROGRESS",
    mentor: "Dr. Selvaraj M",
    msmeCompany: "Nellai Precision Engineering Ltd.",
    description:
      "Develop a robust, web-based inventory management system tailored for micro and small precision manufacturing units. Key capabilities include batch tracking, reorder alert thresholds, automated vendor PO generation, and monthly tally exports.",
    deadline: "2026-12-15",
    domain: "Software / Web Development",
    team: [
      { name: "Mohamed Farhan", regNo: "950821104032", role: "Full-Stack Developer", isLead: true },
      { name: "Priya K", regNo: "950821104045", role: "Frontend Developer", isLead: false },
      { name: "Arjun R", regNo: "950821104011", role: "Backend Engineer", isLead: false },
    ],
    milestones: [
      { label: "Requirements gathering & industrial workflow mapping", done: true, date: "2026-09-20" },
      { label: "Database schema normalization & REST API architecture", done: true, date: "2026-10-05" },
      { label: "Inventory batch tracking & stock alerts frontend", done: false, date: "2026-11-10" },
      { label: "Supplier ledger integration & load testing", done: false, date: "2026-12-01" },
      { label: "Solution deployment & user acceptance sign-off", done: false, date: "2026-12-15" },
    ],
    githubUrl: null,
    documents: [
      { name: "Problem Brief - Nellai Precision.pdf", type: "Industry Brief" },
      { name: "Database Schema V1.2.pdf", type: "Architecture" },
    ],
    extensionRequested: null,
  },
  "PRJ-2024-007": {
    id: "PRJ-2024-007",
    name: "Predictive Maintenance IoT Dashboard",
    status: "SOLUTION_SUBMITTED",
    mentor: "Dr. Selvaraj M",
    msmeCompany: "Apex Tex Machineries",
    description:
      "Design an edge IoT telemetry logger and dashboard that monitors vibration and temperature sensors on textile looms to forecast bearing failures 48 hours in advance, reducing downtime.",
    deadline: "2026-11-30",
    domain: "IoT / Machine Learning",
    team: [
      { name: "Santhosh G", regNo: "950821104067", role: "IoT Systems Engineer", isLead: true },
      { name: "Nandhini P", regNo: "950821104038", role: "Data Analyst", isLead: false },
      { name: "Mohamed Farhan", regNo: "950821104032", role: "ML Pipeline Engineer", isLead: false },
    ],
    milestones: [
      { label: "Telemetry ingestion pipeline & MQTT broker", done: true, date: "2026-09-15" },
      { label: "Anomaly detection model training with PyTorch", done: true, date: "2026-10-20" },
      { label: "Real-time dashboard with alert webhook", done: true, date: "2026-11-10" },
      { label: "Factory floor stress test on active loom", done: true, date: "2026-11-25" },
      { label: "Solution submitted for Faculty & MSME review", done: true, date: "2026-11-30" },
    ],
    githubUrl: "https://github.com/fxec-msme/predictive-maintenance",
    documents: [
      { name: "Apex Tex Problem Brief.pdf", type: "Industry Brief" },
      { name: "ML Model Benchmark Report.pdf", type: "Evaluation" },
      { name: "Hardware Schematic V2.pdf", type: "Schematic" },
    ],
    extensionRequested: null,
  },
  "PRJ-2024-012": {
    id: "PRJ-2024-012",
    name: "Cloud Micro-ERP for Tirunelveli Brassware MSMEs",
    status: "IN_PROGRESS",
    mentor: "Dr. Selvaraj M",
    msmeCompany: "Vagai Cottage Crafts Collective",
    description:
      "A lightweight, vernacular-supported (Tamil/English) cloud inventory and invoicing system created for traditional artisanal brassware units without dedicated IT infrastructure.",
    deadline: "2026-12-20",
    domain: "Enterprise Software",
    team: [
      { name: "Karthikeyan S", regNo: "950821205018", role: "System Architect", isLead: true },
      { name: "Divya B", regNo: "950821205009", role: "UI/UX Designer", isLead: false },
    ],
    milestones: [
      { label: "Artisan interview & requirement analysis", done: true, date: "2026-10-01" },
      { label: "Bilingual UI prototype & voice-assist demo", done: true, date: "2026-10-25" },
      { label: "Offline-first PWA sync mechanism", done: false, date: "2026-11-18" },
      { label: "GST-compliant receipt generation", done: false, date: "2026-12-10" },
    ],
    githubUrl: null,
    documents: [{ name: "Artisanal Cluster Needs Assessment.pdf", type: "Field Study" }],
    extensionRequested: {
      requestedDate: "2027-01-10",
      reason: "Artisan field trials were delayed due to regional festive orders. Need 3 additional weeks for real-world validation.",
      currentDeadline: "2026-12-20",
    },
  },
  "PRJ-2023-042": {
    id: "PRJ-2023-042",
    name: "Digital Invoice & GST Ledger Generator",
    status: "APPROVED",
    mentor: "Dr. Selvaraj M",
    msmeCompany: "South Star Logistics",
    description:
      "Automated PDF invoice generation system with instant E-Way bill reconciliation and WhatsApp delivery for SME transport operators.",
    deadline: "2025-09-10",
    domain: "FinTech & Web",
    team: [
      { name: "Rahul M", regNo: "950821106024", role: "Backend & FinTech Integration", isLead: true },
      { name: "Mohamed Farhan", regNo: "950821104032", role: "Full-Stack Dev", isLead: false },
    ],
    milestones: [
      { label: "Tax API integration", done: true, date: "2025-07-15" },
      { label: "PDF rendering engine & audit logging", done: true, date: "2025-08-10" },
      { label: "Production rollout & MSME sign-off", done: true, date: "2025-09-10" },
    ],
    githubUrl: "https://github.com/fxec-msme/digital-invoice-generator",
    documents: [
      { name: "Final Acceptance Certificate.pdf", type: "Sign-Off" },
      { name: "Security Audit Report.pdf", type: "Audit" },
    ],
    extensionRequested: null,
  },
};

export const initialIdeaSubmissions: FacultyIdeaSubmission[] = [
  {
    id: "IDEA-2024-001",
    title: "AI-Powered Micro-Cold Storage Automation for Agro MSMEs",
    studentName: "Mohamed Farhan",
    studentRegNo: "950821104032",
    department: "Computer Science & Engineering",
    submissionDate: "2026-10-25",
    domain: "IoT / Embedded AI",
    targetSector: "Food Processing & Agro-Enterprises",
    description:
      "A low-cost solar-hybrid refrigeration controller utilizing ESP32 microcontrollers and TinyML models to forecast solar generation and dynamically modulate compressor power, reducing spoilage for small vegetable and dairy vendors by up to 35%.",
    expectedOutcome:
      "Production-ready PCB design, firmware codebase, and companion mobile telemetry app for Android/iOS.",
    status: "PENDING_REVIEW",
  },
  {
    id: "IDEA-2024-002",
    title: "Computer Vision Automated Yarn Defect Identification System",
    studentName: "Nandhini P",
    studentRegNo: "950821104038",
    department: "Computer Science & Engineering",
    submissionDate: "2026-10-22",
    domain: "Computer Vision",
    targetSector: "Textile & Weaving Mills",
    description:
      "Real-time visual inspection camera mount that fits standard power-looms and flags warp breaks, slubs, and knots under 100 milliseconds using edge-optimized YOLOv8 models.",
    expectedOutcome:
      "Edge TPU prototype unit with live optical feed and defect audio-visual buzzer.",
    status: "PENDING_REVIEW",
  },
  {
    id: "IDEA-2024-003",
    title: "Bio-Degradable Packaging Material Sourcing & B2B Matchmaking",
    studentName: "Arjun R",
    studentRegNo: "950821104011",
    department: "Computer Science & Engineering",
    submissionDate: "2026-10-15",
    domain: "Web & Supply Chain",
    targetSector: "Retail & Packaging MSMEs",
    description:
      "A platform connecting rural banana fiber and areca palm leaf plate manufacturers directly with eco-conscious FMCG brands in Tier-1 cities, eliminating middleman cuts.",
    expectedOutcome:
      "Multi-tenant marketplace portal with escrow payment milestones.",
    status: "ACCEPTED",
    facultyRemarks: "Strong commercial relevance for regional green entrepreneurship. Forwarded to MSME Incubation cell.",
  },
];
