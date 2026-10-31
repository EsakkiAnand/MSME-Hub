/**
 * Alumni Dashboard Reference Data & Types
 * Conforms to Prisma models (AlumniProfile, GuidanceRequest, Feedback, Project)
 * and PRD §8.6 (Alumni Expert Mentor Module).
 */

export interface AlumniStats {
  openRequestsCount: number;
  myAnswersCount: number;
  helpfulEndorsements: number;
  projectsMentored: number;
}

export interface GuidanceRequestItem {
  id: string; // e.g. GR-2024-001
  projectId: string; // e.g. PRJ-2024-001
  projectTitle: string;
  projectDomain: string;
  studentName: string;
  studentUniqueId: string;
  studentDepartment: string;
  tags: string[];
  question: string;
  status: "OPEN" | "ANSWERED" | "RESOLVED" | "CLOSED";
  isHelpful?: boolean;
  createdAt: string;
  assignedAlumniId?: string | null;
  assignedAlumniName?: string | null;
  responses?: {
    id: string;
    authorName: string;
    authorRole: string;
    category: "ARCHITECTURE" | "INDUSTRY_RELEVANCE" | "SECURITY_QUALITY" | "GENERAL";
    content: string;
    createdAt: string;
  }[];
}

export interface MentoredProject {
  id: string;
  title: string;
  domain: string;
  status: "IN_PROGRESS" | "SOLUTION_SUBMITTED" | "APPROVED" | "REVISION_IN_PROGRESS";
  teamLeadName: string;
  teamLeadUniqueId: string;
  facultyMentor: string;
  industryPartner: string;
  lastActivity: string;
  githubUrl?: string | null;
}

export const initialGuidanceRequests: GuidanceRequestItem[] = [
  {
    id: "GR-2024-001",
    projectId: "PRJ-2024-001",
    projectTitle: "Smart Inventory Management for MSMEs",
    projectDomain: "Software & Cloud",
    studentName: "Mohamed Farhan",
    studentUniqueId: "STU0001",
    studentDepartment: "CSE (Final Year)",
    tags: ["PostgreSQL", "Next.js", "Concurrency", "Prisma"],
    question:
      "We are building real-time stock deductions for multiple concurrent warehouse checkouts. In PostgreSQL, should we use row-level locking (SELECT FOR UPDATE) via Prisma or rely on optimistic concurrency with a version column?",
    status: "OPEN",
    createdAt: "2026-10-31T14:30:00Z",
    responses: [],
  },
  {
    id: "GR-2024-002",
    projectId: "PRJ-2024-007",
    projectTitle: "Predictive Maintenance IoT Dashboard",
    projectDomain: "IoT & Analytics",
    studentName: "Santhosh G",
    studentUniqueId: "STU0007",
    studentDepartment: "ECE (Final Year)",
    tags: ["MQTT", "TimescaleDB", "Architecture", "IoT"],
    question:
      "Our vibration sensor stream transmits telemetry at 100Hz from factory CNC lathes. We are experiencing edge buffer bloat. How should we batch and aggregate telemetry before pushing it to the cloud endpoint?",
    status: "OPEN",
    createdAt: "2026-10-31T11:15:00Z",
    responses: [],
  },
  {
    id: "GR-2024-003",
    projectId: "PRJ-2023-042",
    projectTitle: "Digital Invoice Generator for SME Retail",
    projectDomain: "FinTech & Web",
    studentName: "Deepika S",
    studentUniqueId: "STU0012",
    studentDepartment: "IT (Third Year)",
    tags: ["Security", "PDF Generation", "GST Compliance", "Architecture"],
    question:
      "For GST-compliant e-invoices, how should we securely store signed PDF invoices on cloud object storage (e.g. S3/Vercel Blob) without exposing sensitive MSME buyer data via public URLs?",
    status: "ANSWERED",
    isHelpful: true,
    createdAt: "2026-10-28T09:00:00Z",
    assignedAlumniId: "ALU0001",
    assignedAlumniName: "Venkatesh R",
    responses: [
      {
        id: "FB-001",
        authorName: "Venkatesh R",
        authorRole: "Principal Architect @ Zoho",
        category: "SECURITY_QUALITY",
        content:
          "Never generate publicly accessible URLs for tax invoices. Keep the bucket completely private, and issue cryptographically signed time-limited URLs (TTL 15 minutes) on-demand through an authenticated server endpoint that checks the user's tenant permission first.",
        createdAt: "2026-10-28T16:45:00Z",
      },
    ],
  },
  {
    id: "GR-2024-004",
    projectId: "PRJ-2024-007",
    projectTitle: "Predictive Maintenance IoT Dashboard",
    projectDomain: "IoT & Analytics",
    studentName: "Kavitha M",
    studentUniqueId: "STU0019",
    studentDepartment: "ECE (Final Year)",
    tags: ["WebSocket", "Edge Computing", "Security"],
    question:
      "What authentication handshake is recommended for industrial edge gateways communicating with our Next.js backend API?",
    status: "RESOLVED",
    isHelpful: true,
    createdAt: "2026-10-25T10:00:00Z",
    assignedAlumniId: "ALU0001",
    assignedAlumniName: "Venkatesh R",
    responses: [
      {
        id: "FB-002",
        authorName: "Venkatesh R",
        authorRole: "Principal Architect @ Zoho",
        category: "SECURITY_QUALITY",
        content:
          "Use mTLS (mutual TLS) with device-specific X.509 client certificates issued by your internal CA. If mTLS is not possible due to hardware constraints, use rotating HMAC-SHA256 request signatures with timestamps.",
        createdAt: "2026-10-25T18:20:00Z",
      },
    ],
  },
];

export const initialMentoredProjects: MentoredProject[] = [
  {
    id: "PRJ-2024-001",
    title: "Smart Inventory Management for MSMEs",
    domain: "Software & Cloud",
    status: "IN_PROGRESS",
    teamLeadName: "Mohamed Farhan",
    teamLeadUniqueId: "STU0001",
    facultyMentor: "Dr. Selvaraj M",
    industryPartner: "Nellai Precision Engineering Ltd",
    lastActivity: "Guidance question asked 2 hours ago",
    githubUrl: "https://github.com/fxec-students/smart-inventory-msme",
  },
  {
    id: "PRJ-2024-007",
    title: "Predictive Maintenance IoT Dashboard",
    domain: "IoT & Analytics",
    status: "SOLUTION_SUBMITTED",
    teamLeadName: "Santhosh G",
    teamLeadUniqueId: "STU0007",
    facultyMentor: "Prof. Kavitha R",
    industryPartner: "Apex Tex Machineries",
    lastActivity: "Solution submitted for admin review",
    githubUrl: "https://github.com/fxec-students/iot-predictive-maintenance",
  },
  {
    id: "PRJ-2023-042",
    title: "Digital Invoice Generator for SME Retail",
    domain: "FinTech & Web",
    status: "APPROVED",
    teamLeadName: "Deepika S",
    teamLeadUniqueId: "STU0012",
    facultyMentor: "Dr. Anand V",
    industryPartner: "Hexaware Technologies",
    lastActivity: "Helpful endorsement awarded",
    githubUrl: "https://github.com/fxec-students/sme-digital-invoice",
  },
];

