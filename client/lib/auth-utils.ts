import { z } from "zod";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const IndustrySignupSchema = z.object({
  name: z.string().min(2, "Representative name must be at least 2 characters"),
  email: z.string().email("Please enter a valid corporate/business email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name is required"),
  udyamRegNo: z
    .string()
    .min(5, "Udyam registration number is required")
    .transform((val) => val.trim().toUpperCase()),
  domain: z.string().min(2, "Industry domain is required"),
  websiteUrl: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
});

export const AlumniSignupSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  degree: z.string().min(2, "Degree is required (e.g. B.E. Computer Science)"),
  passoutYear: z.coerce
    .number()
    .int()
    .min(1960, "Please enter a valid graduation year")
    .max(new Date().getFullYear(), "Graduation year cannot be in the future"),
  currentCompany: z.string().min(2, "Current company is required"),
  currentRole: z.string().min(2, "Current role/designation is required"),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type IndustrySignupInput = z.infer<typeof IndustrySignupSchema>;
export type AlumniSignupInput = z.infer<typeof AlumniSignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// ---------------------------------------------------------------------------
// Helper: Canonical Dashboard Routing
// ---------------------------------------------------------------------------

export function getRoleDashboardPath(role?: string | null): string {
  switch (role) {
    case "STUDENT":
      return "/dashboard/student";
    case "STAFF":
    case "FACULTY":
      return "/dashboard/faculty";
    case "INDUSTRY":
      return "/dashboard/industry";
    case "ALUMNI":
      return "/dashboard/alumni";
    case "MSME_ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}
