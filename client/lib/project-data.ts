/**
 * Centralized Project Management & Audit Data Model
 * Aligned with PRD §8.2, §8.3, §8.4, and §6 (RBAC & Governance).
 */

export type ProjectStatusCategory = "ALL" | "IN_PROGRESS_LIVE" | "COMPLETED" | "REJECTED";

export type ProjectLifecycleStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "SOLUTION_SUBMITTED"
  | "REVISION_IN_PROGRESS"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED";

export interface ProjectHistoryEvent {
  id: string;
  timestamp: string; // ISO string or human-readable format
  title: string;
  category: "STATUS_CHANGE" | "MILESTONE" | "DELIVERABLE" | "GOVERNANCE" | "FEEDBACK";
  actor: {
    name: string;
    role: "STUDENT_LEAD" | "FACULTY_MENTOR" | "MSME_ADMIN" | "INDUSTRY_CLIENT" | "SYSTEM";
    roleTitle: string;
    email?: string;
  };
  description: string;
  notes?: string;
  metadata?: {
    oldStatus?: ProjectLifecycleStatus;
    newStatus?: ProjectLifecycleStatus;
    githubCommit?: string;
    rejectionReason?: string;
    ratingStars?: number;
    extensionDays?: number;
  };
}

export interface StudentTeamMember {
  id: string;
  name: string;
  regNo: string;
  role: string;
  isLead: boolean;
  email: string;
  department: string;
  phone?: string;
  activeProjectsCount: number; // Max 2 per PRD guardrail
}

export interface FacultySupervisorInfo {
  id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  cabin: string;
}

export interface IndustryPartnerInfo {
  id: string;
  companyName: string;
  companyId: string;
  udyamRegNo: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  websiteUrl?: string;
  location: string;
  isVerified: boolean;
}

export interface ProjectItem {
  id: string; // e.g. PRJ-2024-001
  problemId: string; // e.g. PRB-2024-001
  title: string;
  description: string;
  domain: string;
  status: ProjectLifecycleStatus;
  createdAt: string;
  targetDeadline: string;

  // Authorized Stakeholder Details
  industryPartner: IndustryPartnerInfo;
  facultySupervisor: FacultySupervisorInfo;
  studentTeam: StudentTeamMember[];

  // Deliverables & Public GitHub
  githubUrl: string | null;
  hasMitLicense: boolean;
  hasReadme: boolean;
  commitCount: number;
  lastCommitSha?: string;
  lastCommitDate?: string;

  // Milestones & Documents
  milestones: {
    id: string;
    label: string;
    done: boolean;
    date: string;
    verifiedBy?: string;
  }[];
  documents: {
    name: string;
    type: string;
    size: string;
    date: string;
  }[];

  // Extension request if any
  extensionRequested?: {
    requestedDate: string;
    reason: string;
    currentDeadline: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  } | null;

  // Completion Rating & Feedback
  rating?: {
    stars: number;
    feedbackText: string;
    timelinessScore: number;
    technicalQualityScore: number;
    communicationScore: number;
    createdAt: string;
    isModerated: boolean;
  } | null;

  // Rejection details if status === "REJECTED"
  rejectionInfo?: {
    reason: string;
    rejectedAt: string;
    rejectedBy: string;
    remediationAction?: string;
  };

  // Individual Project History / Audit Trail
  history: ProjectHistoryEvent[];
}

/**
 * Maps granular ProjectLifecycleStatus into the 3 canonical categories requested by user:
 * - "In Progress / Live"
 * - "Completed"
 * - "Rejected"
 */
export function getProjectStatusCategory(status: ProjectLifecycleStatus): "IN_PROGRESS_LIVE" | "COMPLETED" | "REJECTED" {
  switch (status) {
    case "ASSIGNED":
    case "IN_PROGRESS":
    case "SOLUTION_SUBMITTED":
    case "REVISION_IN_PROGRESS":
      return "IN_PROGRESS_LIVE";
    case "APPROVED":
    case "COMPLETED":
      return "COMPLETED";
    case "REJECTED":
      return "REJECTED";
    default:
      return "IN_PROGRESS_LIVE";
  }
}

export const PROJECT_STATUS_CATEGORY_CONFIG = {
  IN_PROGRESS_LIVE: {
    label: "In Progress / Live",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    dotClass: "bg-[#007AFF] animate-pulse",
    description: "Active engineering sprints, prototype development, or deliverables undergoing verification.",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
    dotClass: "bg-emerald-500",
    description: "Deliverables verified, academic and administrative sign-off granted, client evaluation recorded.",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
    dotClass: "bg-rose-500",
    description: "Solution failed compliance checks, fell below quality thresholds, or dropped by client.",
  },
};

export const LIFECYCLE_STATUS_CONFIG: Record<
  ProjectLifecycleStatus,
  { label: string; badgeClass: string; category: "IN_PROGRESS_LIVE" | "COMPLETED" | "REJECTED" }
> = {
  ASSIGNED: {
    label: "Team Assigned",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300",
    category: "IN_PROGRESS_LIVE",
  },
  IN_PROGRESS: {
    label: "Under Active Development",
    badgeClass: "bg-blue-50 text-[#007AFF] border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
    category: "IN_PROGRESS_LIVE",
  },
  SOLUTION_SUBMITTED: {
    label: "Under Faculty & Admin Review",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
    category: "IN_PROGRESS_LIVE",
  },
  REVISION_IN_PROGRESS: {
    label: "Itemized Revision Requested",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
    category: "IN_PROGRESS_LIVE",
  },
  APPROVED: {
    label: "Admin & Faculty Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    category: "COMPLETED",
  },
  COMPLETED: {
    label: "Project Closed & Rated",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200",
    category: "COMPLETED",
  },
  REJECTED: {
    label: "Deliverable Rejected / Closed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    category: "REJECTED",
  },
};

// ─── Initial Comprehensive Projects Dataset ─────────────────────────────────────

export const initialProjectsMaster: Record<string, ProjectItem> = {
  "PRJ-2024-001": {
    id: "PRJ-2024-001",
    problemId: "PRB-2024-001",
    title: "Smart Inventory Management for MSMEs",
    description:
      "Develop a robust, web-based inventory management system tailored for micro and small precision manufacturing units. Key capabilities include batch tracking, reorder alert thresholds, automated vendor PO generation, and monthly tally exports with multi-user isolation.",
    domain: "Software / Web Development",
    status: "IN_PROGRESS",
    createdAt: "2026-09-01T10:00:00Z",
    targetDeadline: "2026-12-15",

    industryPartner: {
      id: "IND-001",
      companyName: "Nellai Precision Engineering Ltd.",
      companyId: "CMP-001",
      udyamRegNo: "UDYAM-TN-29-0018472",
      representativeName: "K. Sundaram",
      designation: "Managing Director",
      email: "ksundaram@nellaiprecision.co.in",
      phone: "+91 94431 82910",
      websiteUrl: "https://nellaiprecision.co.in",
      location: "Phase II, SIPCOT Industrial Complex, Tirunelveli, Tamil Nadu",
      isVerified: true,
    },

    facultySupervisor: {
      id: "FAC-001",
      name: "Dr. Selvaraj M",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & Lab Director",
      email: "selvaraj.m@francisxavier.ac.in",
      phone: "+91 98421 55670",
      cabin: "CS Block, Room 304, Third Floor",
    },

    studentTeam: [
      {
        id: "STU-001",
        name: "Mohamed Farhan",
        regNo: "950821104032",
        role: "Project Team Lead / Full-Stack",
        isLead: true,
        email: "mohamedfarhan@francisxavier.ac.in",
        department: "Computer Science & Engineering",
        phone: "+91 91234 56789",
        activeProjectsCount: 1,
      },
      {
        id: "STU-003",
        name: "Priya K",
        regNo: "950821104045",
        role: "Frontend UI/UX Specialist",
        isLead: false,
        email: "priya.k@francisxavier.ac.in",
        department: "Computer Science & Engineering",
        phone: "+91 98765 43210",
        activeProjectsCount: 1,
      },
      {
        id: "STU-004",
        name: "Arjun R",
        regNo: "950821104011",
        role: "Database & API Engineer",
        isLead: false,
        email: "arjun.r@francisxavier.ac.in",
        department: "Computer Science & Engineering",
        phone: "+91 94421 11223",
        activeProjectsCount: 1,
      },
    ],

    githubUrl: "https://github.com/fxec-students/smart-inventory-msme",
    hasMitLicense: true,
    hasReadme: true,
    commitCount: 42,
    lastCommitSha: "a9d7c4f",
    lastCommitDate: "2026-11-03T16:45:00Z",

    milestones: [
      {
        id: "M1",
        label: "Requirements gathering & workflow mapping with industry partner",
        done: true,
        date: "2026-09-20",
        verifiedBy: "Dr. Selvaraj M",
      },
      {
        id: "M2",
        label: "Database schema (PostgreSQL) & stock deduction ACID transactions",
        done: true,
        date: "2026-10-15",
        verifiedBy: "Dr. Selvaraj M",
      },
      {
        id: "M3",
        label: "Inventory batch tracking & low-stock alert thresholds frontend",
        done: false,
        date: "2026-11-10",
      },
      {
        id: "M4",
        label: "Automated vendor PO generation & Monthly Tally PDF exports",
        done: false,
        date: "2026-12-01",
      },
      {
        id: "M5",
        label: "Final client UAT deployment & public MIT GitHub sign-off",
        done: false,
        date: "2026-12-15",
      },
    ],

    documents: [
      { name: "Problem Brief - Nellai Precision.pdf", type: "Industry Brief", size: "1.4 MB", date: "2026-09-01" },
      { name: "Database Schema V1.2.pdf", type: "Architecture Spec", size: "820 KB", date: "2026-10-12" },
      { name: "Udyam Verification Proof.pdf", type: "Legal Certificate", size: "540 KB", date: "2026-08-28" },
    ],

    extensionRequested: null,
    rating: null,

    history: [
      {
        id: "H-001",
        timestamp: "2026-09-01 10:15",
        title: "Project Initialized & Faculty Director Assigned",
        category: "GOVERNANCE",
        actor: {
          name: "Dr. Selvaraj M",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
          email: "selvaraj.m@francisxavier.ac.in",
        },
        description: "Problem statement PRB-2024-001 claimed from the institutional pool and provisioned as PRJ-2024-001.",
      },
      {
        id: "H-002",
        timestamp: "2026-09-03 14:00",
        title: "Student Team Formed & Team Lead Designated",
        category: "GOVERNANCE",
        actor: {
          name: "Dr. Selvaraj M",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
          email: "selvaraj.m@francisxavier.ac.in",
        },
        description: "Assigned Mohamed Farhan as Project Team Lead with Priya K and Arjun R as developers. Checked 2-project concurrency limit.",
      },
      {
        id: "H-003",
        timestamp: "2026-09-20 16:30",
        title: "Milestone 1 Verified: Requirements Mapping",
        category: "MILESTONE",
        actor: {
          name: "Dr. Selvaraj M",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
        },
        description: "Completed stakeholder interview with Mr. K. Sundaram (Nellai Precision). Requirements frozen.",
      },
      {
        id: "H-004",
        timestamp: "2026-10-15 11:20",
        title: "Milestone 2 Verified: Schema & ACID Deduction Engine",
        category: "MILESTONE",
        actor: {
          name: "Dr. Selvaraj M",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
        },
        description: "Schema review passed. Batch tracking transactions verified against race condition simulations.",
      },
      {
        id: "H-005",
        timestamp: "2026-11-03 16:50",
        title: "Code Repository Connected & Sync Validated",
        category: "DELIVERABLE",
        actor: {
          name: "Mohamed Farhan",
          role: "STUDENT_LEAD",
          roleTitle: "Student Team Lead",
          email: "mohamedfarhan@francisxavier.ac.in",
        },
        description: "Connected public GitHub repo. Server tree proxy confirmed MIT License and README.md presence (commit a9d7c4f).",
      },
    ],
  },

  "PRJ-2024-003": {
    id: "PRJ-2024-003",
    problemId: "PRB-2024-003",
    title: "Solar Pump Telemetry & Cloud Controller for Micro-Irrigation",
    description:
      "Design an edge IoT telemetry controller with GSM/GPRS fallback that captures solar photovoltaic water pump telemetry (flow rate, panel voltage, motor RPM) and feeds predictive irrigation scheduling alerts to smallholder farmers.",
    domain: "IoT & Analytics",
    status: "SOLUTION_SUBMITTED",
    createdAt: "2026-08-15T09:00:00Z",
    targetDeadline: "2026-11-15",

    industryPartner: {
      id: "IND-003",
      companyName: "SunAgro Solar Technologies",
      companyId: "CMP-003",
      udyamRegNo: "UDYAM-TN-29-0049102",
      representativeName: "Ananya Sharma",
      designation: "Head of Operations & Field Deployment",
      email: "ananya@sunagrotech.com",
      phone: "+91 97890 23412",
      websiteUrl: "https://sunagrotech.com",
      location: "SIDCO Industrial Area, Tenkasi Road, Tirunelveli",
      isVerified: true,
    },

    facultySupervisor: {
      id: "FAC-003",
      name: "Dr. Arulalan V",
      department: "Electrical & Electronics Engineering",
      designation: "Professor & Solar Energy Fellow",
      email: "arulalan.v@francisxavier.ac.in",
      phone: "+91 94432 78190",
      cabin: "EEE Block, Room 202, Second Floor",
    },

    studentTeam: [
      {
        id: "STU-005",
        name: "Karthik S",
        regNo: "950821105022",
        role: "Project Team Lead / Embedded Firmware",
        isLead: true,
        email: "karthik.s@francisxavier.ac.in",
        department: "Electrical & Electronics Engineering",
        phone: "+91 93456 78120",
        activeProjectsCount: 1,
      },
      {
        id: "STU-006",
        name: "Dharani M",
        regNo: "950821105014",
        role: "IoT Cloud Ingestion Engineer",
        isLead: false,
        email: "dharani.m@francisxavier.ac.in",
        department: "Electrical & Electronics Engineering",
        phone: "+91 97861 54321",
        activeProjectsCount: 1,
      },
    ],

    githubUrl: "https://github.com/fxec-students/solar-pump-telemetry",
    hasMitLicense: true,
    hasReadme: true,
    commitCount: 68,
    lastCommitSha: "c4b189e",
    lastCommitDate: "2026-11-04T12:30:00Z",

    milestones: [
      { id: "M1", label: "Sensor bench testing & analog calibration", done: true, date: "2026-09-05", verifiedBy: "Dr. Arulalan V" },
      { id: "M2", label: "ESP32 firmware & MQTT SSL telemetry payload", done: true, date: "2026-10-01", verifiedBy: "Dr. Arulalan V" },
      { id: "M3", label: "Cloud dashboard with low-flow anomaly detection", done: true, date: "2026-10-25", verifiedBy: "Dr. Arulalan V" },
      { id: "M4", label: "Deliverable package submission for Admin review", done: true, date: "2026-11-04", verifiedBy: "Dr. Arulalan V" },
    ],

    documents: [
      { name: "Field Sensor Wiring Schematics.pdf", type: "Hardware Spec", size: "3.2 MB", date: "2026-08-20" },
      { name: "MQTT Broker Security & Certs.pdf", type: "Security Brief", size: "680 KB", date: "2026-09-18" },
      { name: "SunAgro Partnership Agreement.pdf", type: "MOU", size: "1.1 MB", date: "2026-08-15" },
    ],

    extensionRequested: null,
    rating: null,

    history: [
      {
        id: "H-101",
        timestamp: "2026-08-15 11:00",
        title: "Project Claimed & Kickoff",
        category: "GOVERNANCE",
        actor: {
          name: "Dr. Arulalan V",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
          email: "arulalan.v@francisxavier.ac.in",
        },
        description: "Problem claimed from SunAgro Solar Technologies. Assigned team lead Karthik S.",
      },
      {
        id: "H-102",
        timestamp: "2026-10-01 15:45",
        title: "Milestone 2 Verified: MQTT Payload Encryption",
        category: "MILESTONE",
        actor: {
          name: "Dr. Arulalan V",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
        },
        description: "Cellular drop resilience and payload buffering verified on bench simulator.",
      },
      {
        id: "H-103",
        timestamp: "2026-11-04 12:40",
        title: "Deliverable Submitted for Final Governance Review",
        category: "DELIVERABLE",
        actor: {
          name: "Karthik S",
          role: "STUDENT_LEAD",
          roleTitle: "Student Team Lead",
          email: "karthik.s@francisxavier.ac.in",
        },
        description: "Final solution submitted. Faculty mentor approved academic readiness; routed to MSME Admin for GitHub compliance review.",
        metadata: {
          oldStatus: "IN_PROGRESS",
          newStatus: "SOLUTION_SUBMITTED",
          githubCommit: "c4b189e",
        },
      },
    ],
  },

  "PRJ-2024-007": {
    id: "PRJ-2024-007",
    problemId: "PRB-2024-002",
    title: "Automated Yarn Defect Vision Inspection System for Powerlooms",
    description:
      "Design an edge IoT telemetry logger and computer vision defect detector on a camera-mounted loom shuttle to flag warp yarn breakage in powerloom textile factories, reducing weaving defects by over 40%.",
    domain: "Manufacturing & AI",
    status: "COMPLETED",
    createdAt: "2026-07-10T09:30:00Z",
    targetDeadline: "2026-10-30",

    industryPartner: {
      id: "IND-002",
      companyName: "Apex Tex Machineries",
      companyId: "CMP-002",
      udyamRegNo: "UDYAM-TN-29-0034190",
      representativeName: "R. Muthuraman",
      designation: "Vice President - Manufacturing & Modernization",
      email: "rmuthuraman@apextex.in",
      phone: "+91 94422 66780",
      websiteUrl: "https://apextex.in",
      location: "Textile Machinery Park, Sankarankovil Road, Tirunelveli",
      isVerified: true,
    },

    facultySupervisor: {
      id: "FAC-002",
      name: "Prof. Kavitha R",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor (Senior Grade)",
      email: "kavitha.r@francisxavier.ac.in",
      phone: "+91 98940 33210",
      cabin: "CS Block, Room 218, Second Floor",
    },

    studentTeam: [
      {
        id: "STU-002",
        name: "Santhosh G",
        regNo: "950821104067",
        role: "Project Team Lead / Edge AI Engineer",
        isLead: true,
        email: "santhosh.g@francisxavier.ac.in",
        department: "Computer Science & Engineering",
        phone: "+91 90034 88712",
        activeProjectsCount: 0,
      },
      {
        id: "STU-007",
        name: "Nandhini P",
        regNo: "950821104038",
        role: "Data Analyst & Model Benchmarking",
        isLead: false,
        email: "nandhini.p@francisxavier.ac.in",
        department: "Computer Science & Engineering",
        phone: "+91 91590 66432",
        activeProjectsCount: 0,
      },
    ],

    githubUrl: "https://github.com/fxec-students/iot-predictive-maintenance",
    hasMitLicense: true,
    hasReadme: true,
    commitCount: 114,
    lastCommitSha: "f83b211",
    lastCommitDate: "2026-10-28T18:00:00Z",

    milestones: [
      { id: "M1", label: "Dataset collection under high vibration lighting", done: true, date: "2026-08-10", verifiedBy: "Prof. Kavitha R" },
      { id: "M2", label: "YOLOv8-Nano quantization and ONNX edge runtime", done: true, date: "2026-09-15", verifiedBy: "Prof. Kavitha R" },
      { id: "M3", label: "Audible buzzer trigger & industrial relay interface", done: true, date: "2026-10-10", verifiedBy: "Prof. Kavitha R" },
      { id: "M4", label: "Full mill deployment & MIT License audit sign-off", done: true, date: "2026-10-28", verifiedBy: "MSME Admin" },
    ],

    documents: [
      { name: "Apex Tex Problem Brief.pdf", type: "Industry Brief", size: "2.1 MB", date: "2026-07-10" },
      { name: "ML Model Benchmark Report.pdf", type: "Evaluation Report", size: "1.8 MB", date: "2026-10-20" },
      { name: "Admin Sign-Off Certificate.pdf", type: "Audit Certificate", size: "430 KB", date: "2026-10-29" },
    ],

    extensionRequested: null,

    rating: {
      stars: 5,
      feedbackText:
        "Outstanding delivery by the student team! The defect identification algorithm works reliably under mill vibrations and reduced our manual inspection downtime significantly.",
      timelinessScore: 5,
      technicalQualityScore: 5,
      communicationScore: 5,
      createdAt: "2026-10-30T11:20:00Z",
      isModerated: true,
    },

    history: [
      {
        id: "H-201",
        timestamp: "2026-07-10 10:00",
        title: "Project Provisioned",
        category: "GOVERNANCE",
        actor: {
          name: "Prof. Kavitha R",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
          email: "kavitha.r@francisxavier.ac.in",
        },
        description: "Problem statement PRB-2024-002 claimed and student team mobilized.",
      },
      {
        id: "H-202",
        timestamp: "2026-09-15 14:00",
        title: "Milestone 2 Verified: Edge AI Inference",
        category: "MILESTONE",
        actor: {
          name: "Prof. Kavitha R",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
        },
        description: "Inference latency clocked at 24ms per frame, well within the 30ms requirement.",
      },
      {
        id: "H-203",
        timestamp: "2026-10-28 17:30",
        title: "Solution Deliverables Submitted",
        category: "DELIVERABLE",
        actor: {
          name: "Santhosh G",
          role: "STUDENT_LEAD",
          roleTitle: "Student Team Lead",
        },
        description: "Solution submitted with complete MIT License and README.md.",
      },
      {
        id: "H-204",
        timestamp: "2026-10-29 11:15",
        title: "MSME Admin Governance Approval Granted",
        category: "GOVERNANCE",
        actor: {
          name: "Central MSME Admin Cell",
          role: "MSME_ADMIN",
          roleTitle: "Governance Administrator",
        },
        description: "Deliverables passed public GitHub inspection and MIT licensing compliance checks.",
        metadata: {
          oldStatus: "SOLUTION_SUBMITTED",
          newStatus: "APPROVED",
        },
      },
      {
        id: "H-205",
        timestamp: "2026-10-30 11:20",
        title: "Industry Partner Evaluation Completed (5 Stars)",
        category: "FEEDBACK",
        actor: {
          name: "R. Muthuraman",
          role: "INDUSTRY_CLIENT",
          roleTitle: "VP Manufacturing, Apex Tex",
          email: "rmuthuraman@apextex.in",
        },
        description: "Industry partner rated the solution 5 stars with commendation for industrial durability.",
        metadata: {
          oldStatus: "APPROVED",
          newStatus: "COMPLETED",
          ratingStars: 5,
        },
      },
    ],
  },

  "PRJ-2024-009": {
    id: "PRJ-2024-009",
    problemId: "PRB-2024-005",
    title: "High-Frequency Acoustic Crack Detection for Foundries",
    description:
      "Implement a acoustic emission spectral analyzer to detect micro-cracks in heavy ductile iron castings immediately upon demolding before machining operations begin.",
    domain: "Acoustics & Signal Processing",
    status: "REJECTED",
    createdAt: "2026-06-01T08:30:00Z",
    targetDeadline: "2026-09-30",

    industryPartner: {
      id: "IND-005",
      companyName: "South Castings & Alloys",
      companyId: "CMP-005",
      udyamRegNo: "UDYAM-TN-29-0061245",
      representativeName: "V. Ganesh",
      designation: "Quality Assurance Lead",
      email: "vganesh@southcastings.in",
      phone: "+91 94435 99012",
      websiteUrl: "https://southcastings.in",
      location: "Foundry Cluster, Pettai Industrial Estate, Tirunelveli",
      isVerified: true,
    },

    facultySupervisor: {
      id: "FAC-005",
      name: "Dr. S. Ramanathan",
      department: "Mechanical Engineering",
      designation: "Associate Professor & NDT Specialist",
      email: "ramanathan.s@francisxavier.ac.in",
      phone: "+91 94431 12345",
      cabin: "Mech Block, Room 104, Ground Floor",
    },

    studentTeam: [
      {
        id: "STU-009",
        name: "Vigneshwaran R",
        regNo: "950821114055",
        role: "Project Team Lead / Signal Processing",
        isLead: true,
        email: "vigneshwaran.r@francisxavier.ac.in",
        department: "Mechanical Engineering",
        phone: "+91 94420 88123",
        activeProjectsCount: 0,
      },
      {
        id: "STU-010",
        name: "Manoj Kumar P",
        regNo: "950821114032",
        role: "Data Acquisition Specialist",
        isLead: false,
        email: "manojkumar.p@francisxavier.ac.in",
        department: "Mechanical Engineering",
        phone: "+91 97891 22334",
        activeProjectsCount: 0,
      },
    ],

    githubUrl: "https://github.com/fxec-students/acoustic-crack-detection",
    hasMitLicense: false,
    hasReadme: false,
    commitCount: 8,
    lastCommitSha: "e3a1029",
    lastCommitDate: "2026-09-28T14:15:00Z",

    milestones: [
      { id: "M1", label: "Piezoelectric transducer calibration", done: true, date: "2026-06-25", verifiedBy: "Dr. S. Ramanathan" },
      { id: "M2", label: "Fast Fourier Transform pipeline in C++", done: true, date: "2026-07-30", verifiedBy: "Dr. S. Ramanathan" },
      { id: "M3", label: "Foundry floor ambient noise isolation", done: false, date: "2026-08-30" },
      { id: "M4", label: "Deliverables inspection and safety verification", done: false, date: "2026-09-30" },
    ],

    documents: [
      { name: "Foundry Problem Brief.pdf", type: "Industry Brief", size: "1.2 MB", date: "2026-06-01" },
      { name: "Rejection Audit Notice.pdf", type: "Governance Decision", size: "380 KB", date: "2026-10-02" },
    ],

    extensionRequested: null,
    rating: null,

    rejectionInfo: {
      reason:
        "The project deliverables failed safety standards and open-source licensing criteria. Ambient noise filtering failed to isolate foundry furnace rumble, yielding a 65% false positive rate. Deliverable repository lacked mandatory MIT license and reproducible documentation.",
      rejectedAt: "2026-10-02T15:30:00Z",
      rejectedBy: "Central MSME Admin Cell & Dr. S. Ramanathan",
      remediationAction:
        "Problem statement PRB-2024-005 returned to the institutional pool for re-scoping. Student team debriefed and cleared for alternative capstone projects.",
    },

    history: [
      {
        id: "H-301",
        timestamp: "2026-06-01 09:00",
        title: "Project Provisioned",
        category: "GOVERNANCE",
        actor: {
          name: "Dr. S. Ramanathan",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
          email: "ramanathan.s@francisxavier.ac.in",
        },
        description: "Problem statement PRB-2024-005 claimed from South Castings & Alloys. Team assigned.",
      },
      {
        id: "H-302",
        timestamp: "2026-08-30 17:00",
        title: "Milestone 3 Failed: Foundry Floor Noise Interference",
        category: "MILESTONE",
        actor: {
          name: "Dr. S. Ramanathan",
          role: "FACULTY_MENTOR",
          roleTitle: "Faculty Project Director",
        },
        description: "Testing at Pettai Foundry revealed severe background noise coupling. High false alarm rate.",
      },
      {
        id: "H-303",
        timestamp: "2026-09-28 14:30",
        title: "Deliverable Audit Failed",
        category: "DELIVERABLE",
        actor: {
          name: "Vigneshwaran R",
          role: "STUDENT_LEAD",
          roleTitle: "Student Team Lead",
        },
        description: "Repository submitted without MIT license and missing reproducible signal processing pipeline.",
      },
      {
        id: "H-304",
        timestamp: "2026-10-02 15:30",
        title: "Project Formally Rejected & Closed",
        category: "GOVERNANCE",
        actor: {
          name: "Central MSME Admin Cell",
          role: "MSME_ADMIN",
          roleTitle: "Governance Administrator",
        },
        description:
          "Project rejected due to unresolvable physical sensor constraints and non-compliance with PRD open-source deliverable requirements.",
        notes: "Problem statement PRB-2024-005 re-queued for future re-scoping. Project closed as REJECTED.",
        metadata: {
          oldStatus: "IN_PROGRESS",
          newStatus: "REJECTED",
          rejectionReason: "Sensor noise threshold failure and missing MIT license",
        },
      },
    ],
  },
};

/**
 * Helper to fetch a project by ID or fallback to first
 */
export function getProjectById(id: string | null | undefined): ProjectItem | undefined {
  if (!id) return Object.values(initialProjectsMaster)[0];
  return initialProjectsMaster[id] ?? Object.values(initialProjectsMaster).find((p) => p.id === id);
}

/**
 * Filter projects by search, category, and domain
 */
export function filterProjects(
  projects: ProjectItem[],
  query: string,
  category: ProjectStatusCategory = "ALL",
  domain: string = "ALL"
): ProjectItem[] {
  const cleanQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    // Category match
    const projCategory = getProjectStatusCategory(project.status);
    const matchesCategory = category === "ALL" || projCategory === category;

    // Domain match
    const matchesDomain = domain === "ALL" || project.domain.toLowerCase().includes(domain.toLowerCase());

    // Search query match
    const matchesQuery =
      cleanQuery === "" ||
      project.title.toLowerCase().includes(cleanQuery) ||
      project.id.toLowerCase().includes(cleanQuery) ||
      project.problemId.toLowerCase().includes(cleanQuery) ||
      project.industryPartner.companyName.toLowerCase().includes(cleanQuery) ||
      project.facultySupervisor.name.toLowerCase().includes(cleanQuery) ||
      project.studentTeam.some((m) => m.name.toLowerCase().includes(cleanQuery) || m.regNo.toLowerCase().includes(cleanQuery));

    return matchesCategory && matchesDomain && matchesQuery;
  });
}
