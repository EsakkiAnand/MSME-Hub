# Feature Progress: Login & Sign-Up Authentication Flow

## Goal
Deliver complete Login and Sign-Up authentication feature for MSME-Hub, supporting Google OAuth and role-tailored Email/Password authentication in full alignment with PRD §8.1 and ADR 0001.

## Sub-agent Model Roster
- Implementer: Gemini 3.8 Flash · High
- Researcher: Gemini 3.8 Flash · Medium
- Reviewer: Gemini 3.8 Pro · High

## Workstreams & Status
- [x] Workstream 1: Auth Architecture & Better Auth Server Actions
  - [x] DatabaseHooks in `lib/auth.ts` to automatically populate `institutionDomain`
  - [x] Server actions in `app/actions/auth.ts` (`registerIndustryAction`, `registerAlumniAction`, `syncOAuthRoleAction`, `validateInstitutionalEmail`)
  - [x] Synchronizes `IndustryProfile` and `AlumniProfile` in transactions upon registration
  - [x] Pure utility helpers in `lib/auth-utils.ts` (`getRoleDashboardPath`, Zod schemas)
- [x] Workstream 2: Sign-Up Page (`/signup` & `/register`)
  - [x] Tab 1: Academic (Toggle Student vs Faculty, Google OAuth button, institutional domain notice)
  - [x] Tab 2: Industry (Name, Email, Password, Company Name, Udyam No, Domain dropdown, Website; notice that Udyam PDF verification upload is deferred to dashboard)
  - [x] Tab 3: Alumni (Name, Email, Password, Degree, Graduation Year, Company, Role, LinkedIn; notice of 1-click faculty queue)
  - [x] Strict exclusion of Admin registration (banner clarifying CLI seed requirement)
  - [x] Sonner toasts and loading spinners on submit
- [x] Workstream 3: Log-In Page (`/login` & `/sign-in`)
  - [x] Google OAuth button ("Continue with Google")
  - [x] Email & password credentials form + remember me checkbox + forgot password helper
  - [x] Link to `/signup` ("Don't have an account? Sign up")
  - [x] Dynamic post-login redirector reading session role and routing to `/dashboard/{role}`
  - [x] Toast notifications via Sonner
- [x] Workstream 4: Dashboard Placeholders & Routing
  - [x] Canonical redirects: `/sign-in` -> `/login` (308), `/register` -> `/signup` (308) via `next.config.ts` and redirect pages
  - [x] Dedicated workspace dashboards:
    - `/dashboard/student`: Active project limits (0/2), ideas, guidance requests
    - `/dashboard/staff`: Domain problem pool counter, supervised projects, idea evaluations
    - `/dashboard/industry`: Verification banner with Udyam PDF upload file picker and problem counters
    - `/dashboard/alumni`: 1-click verification queue alert banner and mentorship metrics
    - `/dashboard/admin`: Super admin governance counters and Prisma 7 status
    - `/dashboard`: Index router resolving session role to canonical sub-path
- [x] Workstream 5: Verification & Build Gates
  - [x] `npx tsc --noEmit` passed with 0 errors
  - [x] `npm run build` compiled 15/15 static and dynamic routes successfully
  - [x] Verified HTTP 200/308 responses across all endpoints via dev server
