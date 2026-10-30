import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  ClipboardCheck,
  MapPin,
  Users,
  Wrench,
  Award,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import { WORKFLOW_STEPS } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function WorkflowSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  const getStepIcon = (name: string) => {
    switch (name) {
      case 'FileCheck':
        return FileCheck;
      case 'ClipboardCheck':
        return ClipboardCheck;
      case 'MapPin':
        return MapPin;
      case 'Users':
        return Users;
      case 'Wrench':
        return Wrench;
      case 'Award':
        return Award;
      default:
        return CheckCircle2;
    }
  };

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Structured Stage-Gate Methodology"
          title="The 6-Gate Institutional Engineering"
          highlight="Lifecycle (G0 – G10)"
          description="Every industrial challenge follows Francis Xavier Engineering College's formal stage-gate quality framework to ensure confidentiality, academic rigor, verifiable milestones, and validated industrial deliverables."
        />

        {/* Blueprint Progression Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = getStepIcon(step.iconName);
            const isSelected = idx === activeStepIndex;

            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  'flex flex-col text-left p-3.5 rounded-lg border transition-all cursor-pointer',
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-elevation'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold uppercase tracking-wider',
                      isSelected ? 'text-cyan-400' : 'text-slate-500'
                    )}
                  >
                    {step.gateCode}
                  </span>
                  <div
                    className={cn(
                      'h-6 w-6 rounded flex items-center justify-center text-xs font-bold',
                      isSelected ? 'bg-slate-800 text-cyan-300' : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    {step.stepNumber}
                  </div>
                </div>

                <p
                  className={cn(
                    'text-xs font-bold leading-tight line-clamp-2',
                    isSelected ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {step.title}
                </p>
                <span
                  className={cn(
                    'text-[10px] mt-1 line-clamp-1',
                    isSelected ? 'text-slate-400' : 'text-slate-500'
                  )}
                >
                  {step.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Gate Detail Dossier */}
        <div className="rounded-xl border border-slate-300 bg-white shadow-elevation p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Scope & Protocol */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-900 text-white font-mono text-xs font-bold px-2.5 py-1 uppercase">
                  {activeStep.gateCode}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Step {activeStep.stepNumber} of 6 in Protocol
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activeStep.title}
                </h3>
                <p className="text-sm font-semibold text-blue-800 mt-0.5">
                  {activeStep.subtitle}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {activeStep.description}
              </p>

              {/* Stakeholders & Timelines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-blue-700" />
                    Responsible Institutional Actor
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {activeStep.actor}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Indicative Turnaround Horizon
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {activeStep.timeline}
                  </p>
                </div>
              </div>

              {/* Verification Evidence */}
              <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/50 flex items-start gap-2.5 text-xs text-blue-950">
                <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Verification Evidence / Audit Trail:</strong>
                  <span className="text-blue-900">{activeStep.verificationEvidence}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tangible Deliverables Dossier */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-300 bg-slate-900 text-white p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Deliverables Checklist at this Gate
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Stage Output
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {activeStep.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-xs text-slate-200 leading-relaxed font-normal">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link to="/submit-problem">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Start Step 1 Form
                    </Button>
                  </Link>

                  <button
                    onClick={() =>
                      setActiveStepIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length)
                    }
                    className="text-xs font-semibold text-cyan-400 hover:text-white transition-colors"
                  >
                    Next Gate ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
