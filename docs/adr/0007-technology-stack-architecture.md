# Technology Stack Architecture

For the core platform implementation, we adopt a modern, type-safe full-stack Next.js ecosystem:
- **Authentication**: **Better Auth** with the Prisma adapter, supporting institutional Google OAuth (domain whitelist) and credentials-based authentication with role claims.
- **Database**: **PostgreSQL** for relational referential integrity, strong multi-table foreign keys, and ACID compliance across project state transitions.
- **ORM & Data Layer**: **Prisma ORM** for type-safe schema definitions, automated migrations, and client generation.
- **Styling & UI Components**: **Tailwind CSS (v4)** coupled with **shadcn/ui** (accessible Radix UI primitives) for consistent, accessible, and themeable component architecture.
- **Deployment & Hosting**: **Vercel** serverless runtime for seamless Next.js App Router edge optimization, automated preview environments, and continuous deployment.
