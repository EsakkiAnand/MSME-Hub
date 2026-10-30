import { useState } from 'react';
import {
  Send,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, ProblemStatusBadge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ProblemStatus } from '@/types';

export function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const allStatuses: ProblemStatus[] = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'CLARIFICATION_NEEDED',
    'ASSESSMENT_SCHEDULED',
    'AWAITING_APPROVAL',
    'APPROVED_FOR_PROJECT',
    'IN_PROGRESS',
    'COMPLETED',
    'DEFERRED',
    'REJECTED',
  ];

  return (
    <div className="py-24 sm:py-28 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-blue-100 text-blue-900 px-3 py-1 text-xs font-extrabold uppercase">
              Member 1 Foundation
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Shared Component Library & Design System
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            FXEC MSME Hub UI Kit & Design Tokens
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-3xl">
            This showcase presents all standardized UI components, color tokens, and typographies designed for Member 2 (Problem Form), Member 3 (Admin Dashboard), and Member 4 (Project Tracker).
          </p>
        </div>

        {/* 1. COLOR TOKENS */}
        <section className="mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-700" />
            1. Unified Brand & Semantic Color Tokens
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-slate-900 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Institutional Navy</p>
                <p className="text-[11px] text-slate-500">#0B192C (slate-900)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-slate-900</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-blue-900 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Tech Blue</p>
                <p className="text-[11px] text-slate-500">#1E3E62 (blue-900)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-blue-900</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-cyan-500 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Electric Cyan</p>
                <p className="text-[11px] text-slate-500">#00ADB5 (cyan-500)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-cyan-500</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-amber-500 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Industrial Amber</p>
                <p className="text-[11px] text-slate-500">#F59E0B (amber-500)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-amber-500</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-emerald-500 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Success Emerald</p>
                <p className="text-[11px] text-slate-500">#10B981 (emerald-500)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-emerald-500</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2">
              <div className="h-16 w-full rounded-lg bg-slate-100 border border-slate-200 shadow-inner" />
              <div>
                <p className="text-xs font-bold text-slate-900">Canvas Slate</p>
                <p className="text-[11px] text-slate-500">#F8FAFC (slate-50)</p>
                <span className="text-[10px] text-blue-700 font-mono">bg-slate-50</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BUTTON VARIANTS */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              2. Standard Buttons (`Button.tsx`)
            </h2>
            <button
              onClick={() =>
                copyToClipboard(
                  `<Button variant="primary" rightIcon={<Send className="h-4 w-4" />}>Submit Problem</Button>`,
                  'btn-code'
                )
              }
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              {copiedCode === 'btn-code' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode === 'btn-code' ? 'Copied code!' : 'Copy Button import'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" rightIcon={<Send className="h-4 w-4" />}>
                Primary Action
              </Button>
              <Button variant="accent">Electric Cyan</Button>
              <Button variant="amber">Amber Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" isLoading>
                Loading State
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sizes:
              </span>
              <Button size="sm" variant="outline">
                Small (sm)
              </Button>
              <Button size="default" variant="outline">
                Default
              </Button>
              <Button size="lg" variant="outline">
                Large (lg)
              </Button>
              <Button size="xl" variant="primary">
                Extra Large (xl)
              </Button>
            </div>
          </div>
        </section>

        {/* 3. STATUS BADGES */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                3. Lifecycle Status Badges (`ProblemStatusBadge`)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Directly maps to Gate stages G0 through G10 for Member 3 (Admin) and Member 4 (Tracker).
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {allStatuses.map((status) => (
                <div
                  key={status}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-start gap-2"
                >
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {status}
                  </span>
                  <ProblemStatusBadge status={status} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FORM INPUTS (FOR MEMBER 2) */}
        <section className="mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            4. Form Controls (`Input.tsx` & `Textarea.tsx`)
          </h2>
          <p className="text-xs text-slate-500 -mt-4">
            Pre-styled with error indicators, labels, and focus rings ready for Member 2's One-Minute Form.
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Enterprise Legal Name"
              placeholder="e.g. ABC Precision Components Pvt Ltd"
              required
              helperText="As registered under Udyam / MSME registry"
            />

            <Input
              label="Contact Representative Email"
              type="email"
              placeholder="contact@company.com"
              required
              error="Please enter a valid official business email"
            />

            <div className="md:col-span-2">
              <Textarea
                label="Problem Description (Functional challenge)"
                placeholder="Describe machine downtime, defect rate, or process bottleneck..."
                required
                helperText="Do not include confidential trade secrets or proprietary recipes"
              />
            </div>
          </div>
        </section>

        {/* 5. CARDS & MODALS */}
        <section className="mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            5. Containers & Interactive Modals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hoverEffect>
              <CardHeader>
                <CardTitle>Standard Elevation Card</CardTitle>
                <CardDescription>
                  Supports smooth hover lift effects and structured child components.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600">
                  Ideal for problem listings, student squad profiles, milestone timelines, and metric cards.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-slate-400">Card Footer Area</span>
                <Button size="sm" variant="outline">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Accessible Dialog Modal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Features backdrop blur, Escape key dismissal, and custom action footers.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  rightIcon={<Sparkles className="h-4 w-4" />}
                >
                  Test Modal Dialog
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Dialog Instance */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Component Verification Dialog"
          description="Reusable modal wrapper designed for Member 3 triage actions and Member 4 milestone reviews."
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Confirm Action
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              This modal component can be imported anywhere using:
            </p>
            <pre className="p-3 rounded-lg bg-slate-900 text-cyan-300 text-xs font-mono overflow-x-auto">
              {`<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Title">\n  <Content />\n</Modal>`}
            </pre>
          </div>
        </Modal>
      </div>
    </div>
  );
}

