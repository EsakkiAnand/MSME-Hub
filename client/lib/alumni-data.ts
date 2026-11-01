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
    id: "GR-2024-003",
    projectId: "PRJ-2024-007",
    projectTitle: "Predictive Maintenance IoT Dashboard",
    projectDomain: "IoT & Analytics",
    studentName: "Santhosh G",
    studentUniqueId: "STU0002",
    studentDepartment: "CSE (Final Year)",
    tags: ["Security", "Edge Computing", "Architecture"],
    question:
      "What authentication handshake is recommended for industrial edge gateways communicating with our Next.js backend API over MQTT/WebSockets?",
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
          "Use mTLS (mutual TLS) with device-specific X.509 client certificates. If hardware constraints preclude mTLS on low-power MCUs, use rotating HMAC-SHA256 request signatures with Unix timestamps.",
        createdAt: "2026-10-28T16:45:00Z",
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
    teamLeadUniqueId: "STU0002",
    facultyMentor: "Prof. Kavitha R",
    industryPartner: "Apex Tex Machineries",
    lastActivity: "Solution submitted for admin review",
    githubUrl: "https://github.com/fxec-students/iot-predictive-maintenance",
  },
];
