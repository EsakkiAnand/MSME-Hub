import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DIAGNOSTIC_OPTIONS } from '@/data/mockData';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/ui/Button';
import {
  Wrench,
  Cpu,
  Clock,
  Award,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DiagnosticToolSection() {
  const [selectedDiagId, setSelectedDiagId] = useState(DIAGNOSTIC_OPTIONS[0].id);

  const activeOption =
    DIAGNOSTIC_OPTIONS.find((o) => o.id === selectedDiagId) ||
    DIAGNOSTIC_OPTIONS[0];

  return (
    <section id="diagnostic" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Interactive Engineering Assessment"
          title="Symptom-to-Lab Diagnostic"
          highlight="Matcher Tool"
          description="Select your operational bottleneck below to immediately inspect matched FXEC research infrastructure, certified testing apparatus, turnaround timelines, and eligible government grant subsidies."
        />

        <div className="max-w-5xl mx-auto rounded-xl border border-slate-300 bg-white shadow-elevation overflow-hidden">
          {/* Top Instruction Bar */}
          <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between text-xs">
            <span className="font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Step 1: Choose Your Factory Symptom
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Instant Institutional Scoping
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Selection List */}
            <div className="lg:col-span-5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 space-y-2">
              {DIAGNOSTIC_OPTIONS.map((opt) => {
                const isSelected = opt.id === selectedDiagId;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedDiagId(opt.id)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer space-y-1',
                      isSelected
                        ? 'bg-white border-blue-800 shadow-sm ring-1 ring-blue-700/20'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-blue-800 uppercase">
                        {opt.sector.replace('_', ' ')}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-800" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-xs leading-snug',
                        isSelected ? 'font-bold text-slate-900' : 'text-slate-700 font-medium'
                      )}
                    >
                      {opt.symptomLabel}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Matched Specification Detail */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Matched Technical Category
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeOption.technicalCategory}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Matched Lab */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-blue-700" />
                    Matched Center of Excellence
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {activeOption.matchedLabName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Faculty Domain: {activeOption.facultyDomain}
                  </p>
                </div>

                {/* Timeline */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Turnaround Horizon
                  </span>
                  <p className="font-bold text-slate-900 text-xs">
                    {activeOption.typicalTimeline}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    G1 Triage through G7 Lab Sprint
                  </p>
                </div>
              </div>

              {/* Instrumentation Specifications */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Available Testing Instrumentation:
                </span>
                <div className="p-3 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800">
                  {activeOption.testingEquipment}
                </div>
              </div>

              {/* Eligible Grant Scheme */}
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/60 flex items-start gap-2.5 text-xs">
                <Award className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 font-bold block mb-0.5">
                    Eligible Government Grant & Scheme:
                  </strong>
                  <span className="text-emerald-900 font-medium">
                    {activeOption.eligibleGrantScheme}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <Link
                  to={`/submit-problem?sector=${activeOption.sector}&category=${encodeURIComponent(
                    activeOption.technicalCategory
                  )}`}
                >
                  <Button
                    variant="primary"
                    size="default"
                    className="bg-blue-900 hover:bg-slate-950 text-white font-bold text-xs"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Submit Intake Under This Category
                  </Button>
                </Link>

                <span className="text-[11px] text-slate-500 font-mono">
                  G0 Initial Intake Free of Cost
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

