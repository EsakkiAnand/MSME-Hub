# FXEC MSME Innovation Hub — Frontend Platform

> **Francis Xavier Engineering College (Autonomous), Tirunelveli**  
> Bridging Industrial MSME Bottlenecks with Academic Engineering Rigor, Multidisciplinary Student Innovators, and Advanced Research Laboratories.

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Component Architecture**: Custom UI Kit inspired by shadcn/ui & Radix primitives
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)

---

## 👥 4-Member Team Work Division

| Member | Focus Area | Status / Handover Location |
| :--- | :--- | :--- |
| **Member 1 (Current)** | **Homepage & Common UI Foundation** | ✅ **Complete** (`src/pages/Home.tsx`, `src/components/home/`, `src/components/ui/`, `src/components/common/`, `src/pages/DesignSystem.tsx`) |
| **Member 2** | **Industry Problem Submission** | 📍 Work inside `src/components/submission/` and `src/pages/SubmitProblem.tsx` (route: `/submit-problem`) |
| **Member 3** | **Admin Dashboard & Problem Bank** | 📍 Work inside `src/components/admin/` and `src/pages/AdminDashboard.tsx` (routes: `/admin`, `/problem-bank`) |
| **Member 4** | **Project Tracking & Integration** | 📍 Work inside `src/components/tracking/` and `src/pages/ProjectTracking.tsx` (route: `/track-status`) |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Typecheck
```bash
npm run build
```

---

## 🎨 Shared UI Component Kit for Teammates
All team members can visit **`/design-system`** on the local server to inspect and copy pre-built, standardized components:
- **Buttons**: `<Button variant="primary" rightIcon={<Send className="h-4 w-4" />}>Submit</Button>`
- **Badges**: `<ProblemStatusBadge status="IN_PROGRESS" />` (supports all gates G0 through G10)
- **Form Controls**: `<Input label="Company Name" required error={errors.name} />`
- **Cards**: `<Card hoverEffect><CardHeader>...</CardHeader></Card>`
- **Modals**: `<Modal isOpen={isOpen} onClose={...} title="...">...</Modal>`

---

## 📁 Project Architecture
```
msme-hub-frontend/
├── src/
│   ├── components/
│   │   ├── common/       # Navbar, Footer, SectionHeading (Member 1)
│   │   ├── ui/           # Button, Badge, Card, Input, Textarea, Modal (Member 1)
│   │   ├── home/         # Hero, About, Workflow, Categories, Labs, Stories (Member 1)
│   │   ├── submission/   # [Reserved for Member 2]
│   │   ├── admin/        # [Reserved for Member 3]
│   │   └── tracking/     # [Reserved for Member 4]
│   ├── data/
│   │   └── mockData.ts   # Central data models, categories, stats, and labs
│   ├── layouts/
│   │   └── MainLayout.tsx# Sticky Navbar + Page Content + Footer
│   ├── pages/
│   │   ├── Home.tsx          # Member 1 Homepage
│   │   ├── DesignSystem.tsx  # Member 1 Shared UI Kit
│   │   └── Placeholders.tsx  # Dedicated placeholders for Members 2, 3, & 4
│   ├── styles/
│   │   └── globals.css       # Design tokens, gradients, and glassmorphism
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces (ProblemStatus, IndustrySector, etc.)
│   ├── App.tsx               # Master Route Configuration
│   └── main.tsx
└── tailwind.config.js        # FXEC institutional colors & animations
```

