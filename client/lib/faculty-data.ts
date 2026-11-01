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
    ],
    milestones: [
      { label: "Requirements gathering & workflow mapping", done: true, date: "2026-09-20" },
      { label: "Inventory batch tracking & stock alerts frontend", done: false, date: "2026-11-10" },
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
    ],
    milestones: [
      { label: "Telemetry ingestion pipeline & MQTT broker", done: true, date: "2026-09-15" },
      { label: "Solution submitted for Faculty & MSME review", done: true, date: "2026-11-30" },
    ],
    githubUrl: "https://github.com/fxec-msme/predictive-maintenance",
    documents: [
      { name: "Apex Tex Problem Brief.pdf", type: "Industry Brief" },
      { name: "ML Model Benchmark Report.pdf", type: "Evaluation" },
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
