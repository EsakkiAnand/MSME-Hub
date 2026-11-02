/**
 * MSME Admin Central Data Store & Domain Types
 * Based on PRD.md §8.2 (MSME Admin Module) and §6 (RBAC Matrix)
 */

export interface ProblemBankItem {
  id: string; // e.g. PRB-2024-001
  title: string;
  companyName: string;
  companyId: string;
  domain: string;
  description: string;
  constraints: string;
  expectedDeliverables: string;
  targetTimeline: string;
  submissionDate: string;
  status: "POOL_AVAILABLE" | "CLAIMED" | "REJECTED";
  claimedByFaculty?: string | null;
  assignedDepartment?: string;
  clarificationNotes?: string;
}

export interface IndustryVerificationItem {
  id: string;
  companyName: string;
  companyId: string;
  udyamRegNo: string;
  representativeName: string;
  email: string;
  domain: string;
  websiteUrl: string;
  submissionDate: string;
  verificationDocName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface AlumniVerificationItem {
  id: string;
  name: string;
  uniqueId: string;
  email: string;
  degree: string;
  passoutYear: number;
  currentCompany: string;
  currentRole: string;
  linkedinUrl: string;
  submissionDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface GitHubReviewItem {
  id: string;
  projectId: string; // e.g. PRJ-2024-007
  projectTitle: string;
  msmeCompany: string;
  domain: string;
  studentTeamLead: string;
  studentTeamLeadRegNo: string;
  facultyMentor: string;
  githubUrl: string;
  hasMitLicense: boolean;
  hasReadme: boolean;
  commitCount: number;
  lastCommitDate: string;
  status: "SOLUTION_SUBMITTED" | "APPROVED" | "REVISION_IN_PROGRESS";
  submittedDate: string;
  revisionNotes?: string;
}

export interface RatingModerationItem {
  id: string;
  projectId: string;
  projectTitle: string;
  msmeCompany: string;
  studentTeamLead: string;
  ratingStars: number;
  timelinessScore: number;
  technicalQualityScore: number;
  communicationScore: number;
  writtenFeedback: string;
  submittedDate: string;
  status: "QUEUED" | "APPROVED_PUBLISHED" | "MEDIATION_REQUESTED" | "SUPPRESSED";
  adminRemarks?: string;
}

export interface PlatformUserItem {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  role: "STUDENT" | "STAFF" | "INDUSTRY" | "ALUMNI" | "MSME_ADMIN";
  departmentOrCompany: string;
  isVerified: boolean;
  joinedDate: string;
}

// ─── Initial Problem Bank Data ────────────────────────────────────────────────
export const initialProblemBank: ProblemBankItem[] = [
  {
    id: "PRB-2024-001",
    title: "IoT Telemetry Logger for High-Speed Textile Power Looms",
    companyName: "Apex Tex Machineries",
    companyId: "ATM001",
    domain: "IoT / Embedded Systems",
    description:
      "Design an edge telemetry logger collecting RPM, vibration patterns, and ambient thermal levels on 24 industrial rapier looms, transmitting MQTT payloads over low-latency Wi-Fi to a local server.",
    constraints:
      "Must operate in high ambient temperatures (up to 55°C) and continuous vibration. Hardware budget cap: ₹4,500 per loom.",
    expectedDeliverables:
      "Production-ready PCB design files, firmware binary with OTA update support, and a responsive web telemetry dashboard.",
    targetTimeline: "12 Weeks",
    submissionDate: "2026-10-12",
    status: "CLAIMED",
    claimedByFaculty: "Dr. Selvaraj M (CSE)",
    assignedDepartment: "Computer Science & Engineering",
  },
  {
    id: "PRB-2024-002",
    title: "Computer Vision Surface Crack Inspector for Automotive Gaskets",
    companyName: "Nellai Precision Engineering Ltd.",
    companyId: "NPE001",
    domain: "Computer Vision / AI",
    description:
      "Develop an automated inline optical inspection rig using Raspberry Pi Camera and TensorRT/YOLO to detect sub-millimeter cracks and porosity defects on rubber gaskets moving at 1.2 m/s on a conveyor belt.",
    constraints:
      "Latency per frame must be ≤ 45ms. False rejection rate must remain below 1.5% across varying ambient factory illumination.",
    expectedDeliverables:
      "Trained ONNX/TensorRT model weights, high-speed camera trigger script, and rejection pneumatic actuator control logic.",
    targetTimeline: "10 Weeks",
    submissionDate: "2026-10-18",
    status: "POOL_AVAILABLE",
    assignedDepartment: "Electronics & Communication",
  },
  {
    id: "PRB-2024-003",
    title: "Predictive Maintenance Vibration Sensor for CNC Spindles",
    companyName: "Hexaware Technology",
    companyId: "HTMP001",
    domain: "Machine Learning / Mechanical",
    description:
      "Develop an anomaly detection system using 3-axis accelerometer data to predict bearing wear and spindle misalignment on 5-axis CNC vertical milling centres 72 hours prior to catastrophic failure.",
    constraints:
      "Sampling frequency must be minimum 10 kHz. Zero cloud connectivity allowed due to enterprise IP security policies; edge inferencing required.",
    expectedDeliverables:
      "Edge inferencing Docker container, vibration FFT diagnostic visualization UI, and audible alert relay interface.",
    targetTimeline: "14 Weeks",
    submissionDate: "2026-10-22",
    status: "POOL_AVAILABLE",
    assignedDepartment: "Mechanical Engineering",
  },
  {
    id: "PRB-2024-004",
    title: "ERP & Automated Material Inward Barcode Pipeline",
    companyName: "Kovai Metal Castings Pvt Ltd",
    companyId: "KMC001",
    domain: "Web & Enterprise Systems",
    description:
      "Replace manual ledger entries with an industrial handheld 2D barcode scanner integration that syncs raw pig iron ingot lots with PostgreSQL ERP database in real-time.",
    constraints:
      "Must run on low-spec terminal hardware with offline batching queue during factory network dropouts.",
    expectedDeliverables:
      "Progressive Web App, RESTful ingestion microservice, and batch inventory reconciler.",
    targetTimeline: "8 Weeks",
    submissionDate: "2026-10-25",
    status: "POOL_AVAILABLE",
    assignedDepartment: "Information Technology",
  },
  {
    id: "PRB-2024-005",
    title: "Solar Water Pump MPPT Inverter Firmware Optimization",
    companyName: "SunRay Agro Electrics",
    companyId: "SRA001",
    domain: "Renewable Energy / Electrical",
    description:
      "Formulate modified Perturb & Observe MPPT control algorithms for agricultural solar submersible pumps to maintain 98%+ efficiency under fluctuating monsoon cloud cover conditions.",
    constraints:
      "Algorithm must execute on STM32G4 microcontrollers with execution time < 25 microseconds per PWM cycle.",
    expectedDeliverables:
      "MATLAB/Simulink models, optimized C firmware library, and dynamometer test validation log.",
    targetTimeline: "16 Weeks",
    submissionDate: "2026-10-27",
    status: "CLAIMED",
    claimedByFaculty: "Dr. K. Annamalai (EEE)",
    assignedDepartment: "Electrical & Electronics",
  },
  {
    id: "PRB-2024-006",
    title: "Automated Packaging Defect Rejector for Spices",
    companyName: "Nellai Spices & Oils",
    companyId: "NSO001",
    domain: "Robotics & Automation",
    description:
      "High-speed pouch heat-seal integrity tester with automated pneumatic blow-off sorter for retail 100g chilli and turmeric powder packaging lines.",
    constraints:
      "Cannot use optical cameras due to powder dust; requires pneumatic pressure differential transducer.",
    expectedDeliverables:
      "CAD models for 3D-printed sorting manifold, PLC ladder logic, and electrical wiring schematic.",
    targetTimeline: "6 Weeks",
    submissionDate: "2026-10-05",
    status: "REJECTED",
    clarificationNotes:
      "Problem statement lacks quantitative air-leak rate tolerance and pneumatic operating pressure specs. Industry invited to re-submit.",
    assignedDepartment: "Mechanical Engineering",
  },
];

// ─── Initial Industry Verifications ───────────────────────────────────────────
export const initialIndustryVerifications: IndustryVerificationItem[] = [
  {
    id: "IV-2024-001",
    companyName: "Hexaware Technology",
    companyId: "HTMP001",
    udyamRegNo: "UDYAM-TN-26-0012948",
    representativeName: "Senthil Kumar R",
    email: "senthil.k@hexaware.com",
    domain: "Software & Cloud Services",
    websiteUrl: "https://hexaware.com",
    submissionDate: "2026-10-31",
    verificationDocName: "Udyam_Registration_Certificate_Hexaware.pdf",
    status: "PENDING",
  },
  {
    id: "IV-2024-002",
    companyName: "Nellai Precision Engineering Ltd.",
    companyId: "NPE001",
    udyamRegNo: "UDYAM-TN-26-0048123",
    representativeName: "Venkatesh Narayanan",
    email: "v.narayan@nellaiprecision.in",
    domain: "Manufacturing & Heavy Engineering",
    websiteUrl: "https://nellaiprecision.in",
    submissionDate: "2026-10-30",
    verificationDocName: "Udyam_Registration_NPE_Manufacturing.pdf",
    status: "PENDING",
  },
  {
    id: "IV-2024-003",
    companyName: "AgriTech Agro Solutions",
    companyId: "AAS001",
    udyamRegNo: "UDYAM-TN-26-0091834",
    representativeName: "Meenakshi Sundaram",
    email: "contact@agritechagro.org",
    domain: "Renewable Energy & Cleantech",
    websiteUrl: "https://agritechagro.org",
    submissionDate: "2026-10-28",
    verificationDocName: "MSME_AgriTech_Udyam_Proof.pdf",
    status: "PENDING",
  },
  {
    id: "IV-2024-004",
    companyName: "Apex Tex Machineries",
    companyId: "ATM001",
    udyamRegNo: "UDYAM-TN-26-0076219",
    representativeName: "P. R. Muthusamy",
    email: "muthu@apextex.com",
    domain: "Textiles & Heavy Machinery",
    websiteUrl: "https://apextex.com",
    submissionDate: "2026-10-10",
    verificationDocName: "Udyam_Apex_Textile_Certified.pdf",
    status: "APPROVED",
  },
];

// ─── Initial Alumni Verifications ─────────────────────────────────────────────
export const initialAlumniVerifications: AlumniVerificationItem[] = [
  {
    id: "AV-2024-001",
    name: "Karthik Subramanian",
    uniqueId: "ALU0001",
    email: "karthik.subramanian@google.com",
    degree: "B.E. Computer Science & Engineering",
    passoutYear: 2021,
    currentCompany: "Google",
    currentRole: "Staff Software Engineer",
    linkedinUrl: "https://linkedin.com/in/karthiksubramanian-demo",
    submissionDate: "2026-10-31",
    status: "PENDING",
  },
  {
    id: "AV-2024-002",
    name: "Deepa Ramakrishnan",
    uniqueId: "ALU0002",
    email: "deepa.r@tcs.com",
    degree: "B.E. Electronics & Communication",
    passoutYear: 2022,
    currentCompany: "Tata Consultancy Services",
    currentRole: "IoT Systems Architect",
    linkedinUrl: "https://linkedin.com/in/deeparamakrishnan-demo",
    submissionDate: "2026-10-29",
    status: "PENDING",
  },
];

// ─── Initial GitHub Review Gate Items ─────────────────────────────────────────
export const initialGitHubReviews: GitHubReviewItem[] = [
  {
    id: "REV-2024-001",
    projectId: "PRJ-2024-007",
    projectTitle: "Predictive Maintenance IoT Telemetry Dashboard",
    msmeCompany: "Apex Tex Machineries",
    domain: "IoT / Machine Learning",
    studentTeamLead: "Santhosh G",
    studentTeamLeadRegNo: "950821104067",
    facultyMentor: "Dr. Selvaraj M",
    githubUrl: "https://github.com/fxec-msme/predictive-maintenance",
    hasMitLicense: true,
    hasReadme: true,
    commitCount: 42,
    lastCommitDate: "2026-10-31",
    status: "SOLUTION_SUBMITTED",
    submittedDate: "2026-10-31",
  },
  {
    id: "REV-2024-002",
    projectId: "PRJ-2024-009",
    projectTitle: "Solar Inverter Dual-Axis MPPT Tracker",
    msmeCompany: "SunRay Agro Electrics",
    domain: "Renewable Energy / Electrical",
    studentTeamLead: "Naveen Raj P",
    studentTeamLeadRegNo: "950821104044",
    facultyMentor: "Dr. K. Annamalai",
    githubUrl: "https://github.com/fxec-msme/solar-mppt-inverter",
    hasMitLicense: true,
    hasReadme: true,
    commitCount: 29,
    lastCommitDate: "2026-10-30",
    status: "SOLUTION_SUBMITTED",
    submittedDate: "2026-10-30",
  },
  {
    id: "REV-2024-003",
    projectId: "PRJ-2024-005",
    projectTitle: "Automated Gasket Optical Inspection Engine",
    msmeCompany: "Nellai Precision Engineering Ltd.",
    domain: "Computer Vision / AI",
    studentTeamLead: "Abinaya K",
    studentTeamLeadRegNo: "950821104003",
    facultyMentor: "Prof. S. Muralidharan",
    githubUrl: "https://github.com/fxec-msme/optical-gasket-inspection",
    hasMitLicense: false,
    hasReadme: true,
    commitCount: 18,
    lastCommitDate: "2026-10-29",
    status: "REVISION_IN_PROGRESS",
    submittedDate: "2026-10-29",
    revisionNotes:
      "Repository lacks standard MIT License file required by PRD §8.5 REQ-STU-02. Please commit LICENSE with copyright notice and resubmit.",
  },
];

// ─── Initial Rating Moderation Desk Items ─────────────────────────────────────
export const initialRatingModerations: RatingModerationItem[] = [
  {
    id: "MOD-2024-001",
    projectId: "PRJ-2024-005",
    projectTitle: "Automated Gasket Optical Inspection Engine",
    msmeCompany: "Nellai Precision Engineering Ltd.",
    studentTeamLead: "Abinaya K",
    ratingStars: 2,
    timelinessScore: 2,
    technicalQualityScore: 3,
    communicationScore: 1,
    writtenFeedback:
      "Deliverable was delayed by 3 weeks beyond initial target timeline. OpenCV pipeline works well on sample images, but camera trigger drops frames under high-speed conveyor belt vibrations. Requires further hardware hardening.",
    submittedDate: "2026-10-31",
    status: "QUEUED",
    adminRemarks:
      "Review flagged due to ≤ 2 stars. Project team completed core requirements but experienced factory integration delays.",
  },
  {
    id: "MOD-2024-002",
    projectId: "PRJ-2024-002",
    projectTitle: "Warehouse Pallet QR-Tracking Web Microservice",
    msmeCompany: "Kovai Metal Castings Pvt Ltd",
    studentTeamLead: "Dinesh Kumar T",
    ratingStars: 1,
    timelinessScore: 1,
    technicalQualityScore: 2,
    communicationScore: 1,
    writtenFeedback:
      "Solution was submitted without offline SQLite caching layer that was explicitly highlighted as a primary operational constraint during problem submission. In current state, cannot deploy on warehouse floor.",
    submittedDate: "2026-10-27",
    status: "QUEUED",
    adminRemarks:
      "Major deviation from constraint requirements. Scheduled mediation discussion between Faculty Supervisor and MSME partner.",
  },
];

// ─── Initial Platform User Directory ──────────────────────────────────────────
export const initialPlatformUsers: PlatformUserItem[] = [
  {
    id: "USR-001",
    uniqueId: "ADM0001",
    name: "MSME Central Administrator",
    email: "admin@msmehub.gov.in",
    role: "MSME_ADMIN",
    departmentOrCompany: "FXEC MSME Governance Cell",
    isVerified: true,
    joinedDate: "2026-09-01",
  },
  {
    id: "USR-002",
    uniqueId: "FAC0001",
    name: "Dr. Selvaraj M",
    email: "selvaraj.m@fxec.ac.in",
    role: "STAFF",
    departmentOrCompany: "Computer Science & Engineering",
    isVerified: true,
    joinedDate: "2026-09-05",
  },
  {
    id: "USR-003",
    uniqueId: "FAC0002",
    name: "Dr. K. Annamalai",
    email: "annamalai.k@fxec.ac.in",
    role: "STAFF",
    departmentOrCompany: "Electrical & Electronics Engineering",
    isVerified: true,
    joinedDate: "2026-09-05",
  },
  {
    id: "USR-004",
    uniqueId: "STU0001",
    name: "Santhosh G",
    email: "santhosh.g21@fxec.ac.in",
    role: "STUDENT",
    departmentOrCompany: "Computer Science (Batch 2021-25)",
    isVerified: true,
    joinedDate: "2026-09-10",
  },
  {
    id: "USR-005",
    uniqueId: "STU0002",
    name: "Nandhini P",
    email: "nandhini.p21@fxec.ac.in",
    role: "STUDENT",
    departmentOrCompany: "Computer Science (Batch 2021-25)",
    isVerified: true,
    joinedDate: "2026-09-10",
  },
  {
    id: "USR-006",
    uniqueId: "STU0003",
    name: "Abinaya K",
    email: "abinaya.k21@fxec.ac.in",
    role: "STUDENT",
    departmentOrCompany: "Electronics & Communication (Batch 2021-25)",
    isVerified: true,
    joinedDate: "2026-09-12",
  },
  {
    id: "USR-007",
    uniqueId: "IND0001",
    name: "Senthil Kumar R",
    email: "senthil.k@hexaware.com",
    role: "INDUSTRY",
    departmentOrCompany: "Hexaware Technology",
    isVerified: true,
    joinedDate: "2026-09-15",
  },
  {
    id: "USR-008",
    uniqueId: "IND0002",
    name: "Venkatesh Narayanan",
    email: "v.narayan@nellaiprecision.in",
    role: "INDUSTRY",
    departmentOrCompany: "Nellai Precision Engineering Ltd.",
    isVerified: true,
    joinedDate: "2026-09-18",
  },
  {
    id: "USR-009",
    uniqueId: "ALU0001",
    name: "Karthik Subramanian",
    email: "karthik.subramanian@google.com",
    role: "ALUMNI",
    departmentOrCompany: "Google (Batch 2021)",
    isVerified: true,
    joinedDate: "2026-09-20",
  },
  {
    id: "USR-010",
    uniqueId: "ALU0002",
    name: "Deepa Ramakrishnan",
    email: "deepa.r@tcs.com",
    role: "ALUMNI",
    departmentOrCompany: "Tata Consultancy Services (Batch 2022)",
    isVerified: true,
    joinedDate: "2026-09-22",
  },
];

