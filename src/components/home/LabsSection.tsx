import { LAB_FACILITIES } from '@/data/mockData';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Cpu, CheckCircle2, UserCheck, Wrench, MapPin, Award } from 'lucide-react';

export function LabsSection() {
  return (
    <section id="labs" className="py-20 sm:py-28 bg-slate-900 text-white border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Research & Testing Facilities"
          title="Certified Applied Laboratories &"
          highlight="Centers of Excellence"
          description="Francis Xavier Engineering College houses 16 specialized laboratories with industry-grade instrumentation, rapid fabrication machinery, and metrology standards dedicated to solving MSME challenges."
          className="[&_h2]:text-white [&_p]:text-slate-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LAB_FACILITIES.map((lab) => (
            <div
              key={lab.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-7 space-y-5 hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {lab.department}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {lab.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {lab.buildingLocation}
                  </p>
                </div>
                <span className="rounded bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 text-[10px] font-mono font-bold shrink-0">
                  {lab.badge}
                </span>
              </div>

              {/* Capabilities */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Specialized Capabilities:
                </span>
                <div className="space-y-1">
                  {lab.capabilities.map((c, i) => (
                    <p key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-cyan-400 shrink-0" />
                      <span>{c}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Major Machinery & Models */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Major Machining & Instrumentation:
                </span>
                <div className="space-y-1.5">
                  {lab.equipment.map((eq, i) => (
                    <div
                      key={i}
                      className="rounded bg-slate-900 border border-slate-800/90 p-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div>
                        <span className="font-bold text-slate-200">{eq.name}</span>
                        <span className="text-cyan-400 font-mono text-[11px] ml-1.5 font-semibold">
                          ({eq.model})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {eq.spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculty Lead & ISO Standard */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>
                    Coordinator: <strong className="text-slate-200">{lab.headCoordinator}</strong>
                  </span>
                </div>
                {lab.isoStandard && (
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                    {lab.isoStandard}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
