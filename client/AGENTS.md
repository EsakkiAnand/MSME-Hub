# AGENTS.md — MSME-Hub Client

Engineering guidelines, architectural constraints, and context pointers for autonomous and pair-programming agents working inside `client/`.

---

## 1. Context Pointers

Consult these primary repository documents before designing features, naming symbols, or modifying architecture:

- **[`../PRD.md`](../PRD.md)**: Authoritative functional specification, RBAC matrix, dual-track workflows (Industry Problem $\rightarrow$ Solution and Student Idea Incubation), and state machine lifecycles.
- **[`../GLOSSARY.md`](../GLOSSARY.md)**: Canonical domain terminology (`Project Team Lead`, `Guidance Request`, `Guidance Board`, `Industry Rating`, `Moderated Rating`, `Sponsorship Showcase`, `Deadline Extension Request`, `Helpful Endorsement`). Never coin competing synonyms.
- **[`../docs/adr/`](../docs/adr/)**: Architectural Decision Records (ADR 0001 to 0009). Locked decisions regarding auth, public GitHub repos, rate limiting, and database architecture.

---

## 2. Technology Stack & Key Files

| Layer | Technology | Primary Config / Implementation File |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, React 19, TypeScript) | `next.config.ts`, `app/` |
| **Styling & UI** | Tailwind CSS v4 + shadcn/ui (Radix primitives) | `app/globals.css`, `components.json`, `components/ui/` |
| **Authentication** | Better Auth with Prisma adapter | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts` |
| **Database & ORM** | PostgreSQL (Neon serverless) + Prisma ORM (v7) | `prisma/schema.prisma`, `prisma7.config.ts`, `lib/prisma.ts` |
| **Mutations & Validation** | Server Actions + Zod + React Hook Form | Server Actions in `app/actions/` |
| **File Storage** | Vercel Blob (Industry PDF registration proofs) | Server-side upload handler |
| **Email** | Resend + React Email | Transactional notification helpers |

---

## 3. Essential Commands

Execute all commands directly from this `client/` directory:

```bash
# Development server (runs on port 3000)
npm run dev

# Type check & production build
npx tsc --noEmit
npm run build

# Database schema & Prisma client
npx prisma validate
npx prisma generate
npx prisma migrate dev --name <migration_name>

# Add shadcn components
npx shadcn@latest add <component_name>
```

---

## 4. Architectural Guardrails & Invariants

When implementing features, enforce these non-negotiable rules:

1. **Strict 5-Role Model**:
   - Allowed roles: `STUDENT`, `STAFF`, `ALUMNI`, `INDUSTRY`, `MSME_ADMIN`.
   - Never allow public signups for `MSME_ADMIN`. Root admins are provisioned exclusively via CLI database seed.
   - Students and Staff authenticate via Google Workspace OAuth with an institutional email domain whitelist (`@college.edu`).
   - Industry accounts require document verification (Udyam certificate PDF) approved by an MSME Admin before problem creation is unlocked.
   - Alumni require 1-click verification queue approval by Staff/Admin.

2. **Project & Team Governance**:
   - Staff directly assigns multi-student teams (1 to N) and designates exactly one **Project Team Lead**.
   - Concurrency limit: Students cannot be assigned to more than **2 active projects** concurrently.
   - Only the designated Student Team Lead has permission to submit or update the solution GitHub repository URL.
   - Staff retains exclusive authority to adjust student team rosters mid-flight and approve Deadline Extension Requests.

3. **Public GitHub Deliverables & Tree Inspection**:
   - Solutions must point to a public GitHub repository URL containing an `MIT License`, a `README.md`, and commits.
   - In-dashboard repository tree previews query the server proxy with a server-side GitHub token and a 5-minute database cache (`Project.githubTreeJson`, `Project.githubTreeCachedAt`). Do not make unauthenticated client-side GitHub API calls.

4. **Moderated Industry Ratings**:
   - Industry partners rate completed solutions (1–5 stars and written review).
   - Ratings $\le 2$ stars are automatically routed to the MSME Admin moderation queue before appearing on student portfolios.

5. **Prisma 7 Driver Adapter Requirement**:
   - Always import the shared database client from `@/lib/prisma`.
   - In Prisma 7, connection strings live in `prisma7.config.ts`, and `PrismaClient` requires the `@prisma/adapter-pg` pool adapter. Never instantiate an unconfigured `new PrismaClient()`.

6. **UI & Styling Conventions**:
   - Compose with shadcn/ui primitives. Use semantic color tokens (`bg-primary`, `text-muted-foreground`, `border-border`) rather than hardcoded palette classes.
   - Form controls must use accessible labels, descriptions, and ARIA attributes with Zod validation.
