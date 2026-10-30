// ==========================================
// FXEC MSME Hub - TypeScript Domain Types
// ==========================================

export type ProblemStatus =
  | 'SUBMITTED'               // G0: Problem received & registered
  | 'UNDER_REVIEW'            // G1: Initial triage (category, completeness, duplicate check)
  | 'CLARIFICATION_NEEDED'    // G2: Hub coordinator asked enterprise for details
  | 'ASSESSMENT_SCHEDULED'    // G3: Field visit / assessment scheduled with faculty
  | 'AWAITING_APPROVAL'       // G4: Feasibility and risk review completed
  | 'APPROVED_FOR_PROJECT'    // G5: Project charter signed & approved
  | 'IN_PROGRESS'             // G6-G9: Active student & mentor execution
  | 'COMPLETED'               // G10: Final validation, report handover & closure
  | 'DEFERRED'                // Out of scope or deferred for future cycle
  | 'REJECTED';               // Rejected with recorded reason

export type IndustrySector =
  | 'MANUFACTURING'           // Precision engineering, CNC, tooling, foundries
  | 'FOOD_PROCESSING'         // Agro-processing, packaging, cold storage, perishables
  | 'TEXTILES'                // Spinning, powerloom, apparel, dyeing automation
  | 'RENEWABLE_ENERGY'        // Solar microgrids, rooftop PV, bio-mass, energy audits
  | 'ELECTRONICS_IOT'         // Embedded devices, sensors, power electronics
  | 'SOFTWARE_AI'             // Production ERP, inventory vision, defect detection
  | 'HEALTHCARE_MEDTECH'      // Medical assistive devices, clinic diagnostics
  | 'LOGISTICS_SUPPLY'        // Fleet routing, warehouse dispatch, packaging
  | 'CIRCULAR_ECONOMY';       // Waste recycling, industrial byproduct utilization

export interface ProblemCategory {
  id: string;
  name: string;
  sector: IndustrySector;
  iconName: string;
  shortDesc: string;
  typicalBottlenecks: string[];
  associatedLab: string;
  sampleChallenge: string;
  turnaroundEst: string;
  recommendedScheme?: string;
}

export interface HubStat {
  label: string;
  value: string;
  suffix?: string;
  description: string;
  icon: string;
  trend?: string;
}

export interface WorkflowStep {
  stepNumber: number;
  gateCode: string; // e.g. G0, G1-G2, G3, G5, etc.
  title: string;
  subtitle: string;
  description: string;
  actor: 'Industry / MSME' | 'Hub Coordinator' | 'Faculty Expert' | 'Student & Mentor Squad';
  deliverables: string[];
  timeline: string;
  iconName: string;
  verificationEvidence: string;
}

export interface LabFacility {
  id: string;
  name: string;
  department: string;
  buildingLocation: string;
  capabilities: string[];
  equipment: { name: string; model: string; spec: string }[];
  headCoordinator: string;
  designation: string;
  badge: string;
  isoStandard?: string;
}

export interface SuccessStory {
  id: string;
  companyName: string;
  district: string;
  industry: string;
  problemSummary: string;
  solutionOutcome: string;
  impactMetrics: string;
  leadDepartment: string;
  facultyMentor: string;
  turnaroundWeeks: number;
  year: string;
}

export interface LiveProblemRecord {
  trackingId: string;
  companyMasked: string;
  district: string;
  sector: IndustrySector;
  categoryTitle: string;
  summary: string;
  status: ProblemStatus;
  gate: string;
  assignedLab: string;
  daysActive: number;
  lastUpdate: string;
}

export interface DiagnosticOption {
  id: string;
  sector: IndustrySector;
  symptomLabel: string;
  technicalCategory: string;
  matchedLabId: string;
  matchedLabName: string;
  facultyDomain: string;
  testingEquipment: string;
  typicalTimeline: string;
  eligibleGrantScheme: string;
}
