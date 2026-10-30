import {
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  Cpu,
  FileText,
  Award,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Card } from '@/components/ui/Card';

export function AboutSection() {
  const governancePillars = [
    {
      title: 'Industry / MSME Partner',
      role: 'Problem Provider & Co-Evaluator',
      description:
        'Identifies real shopfloor bottlenecks (machine downtime, high scrap, manual sorting) and authorizes access for baseline engineering measurements under institutional NDA.',
      icon: Building2,
      badge: 'Stakeholder 1',
    },
    {
      title: 'PhD Faculty Research Mentors',
      role: 'Domain Supervision & Scientific Triage',
      description:
        '86+ Doctorate and Senior Faculty members in Mechanical, EEE, ECE, CS & AI supervise testing, conduct on-site diagnostic audits, and validate mathematical/simulation models.',
      icon: GraduationCap,
      badge: 'Stakeholder 2',
    },
    {
      title: 'Multidisciplinary Student Squads',
      role: 'Agile Prototyping & Hardware Delivery',
      description:
        'Selected 3rd & Final year engineering students execute hands-on CAD design, PCB assembly, edge AI programming, and pilot fabrication inside FXEC IDEA Labs.',
      icon: Users,
      badge: 'Stakeholder 3',
    },
  ];

  const institutionalSafeguards = [
    {
      title: 'Academic Non-Disclosure (NDA)',
      desc: 'Standardized institutional confidentiality protocols protecting industrial drawings, customer formulas, and proprietary workflows.',
    },
    {
      title: 'Host Institute Recognition',
      desc: 'Officially recognized Host Institute under the Ministry of MSME, Government of India, supporting student-industry idea hackathons.',
    },
    {
      title: '16 NABL / AICTE Aligned Labs',
      desc: 'Full access to 5-axis CNC machining, CMM coordinate measuring, 1GHz digital oscilloscopes, and thermal infrared telemetry.',
    },
    {
      title: 'IPR & Patent Cell Guidance',
      desc: 'Assistance from FXEC Intellectual Property Rights (IPR) Cell for provisional patent drafting and design registry filings.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Institutional Framework"
          title="Bridging Academic Rigor with"
          highlight="Factory Floor Pragmatism"
          description="Francis Xavier Engineering College (Autonomous, Tirunelveli) established the MSME Innovation Hub as a dedicated industrial intervention engine. We provide local manufacturing and processing units with direct access to collegiate research infrastructure, bypassing commercial consultancy overhead."
        />

        {/* 3 Governance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {governancePillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-300 bg-white p-6 shadow-elevation space-y-4 hover:border-blue-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-800 mt-0.5">
                    {item.role}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Institutional Safeguards & Infrastructure Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 text-white p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Institutional Governance & Operational Location
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Francis Xavier Engineering College MSME Incubation Secretariat
            </h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
              Room 104, Ground Floor, Innovation & Incubation Center, FXEC Campus, Vannarpettai, Tirunelveli.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-800">
            {institutionalSafeguards.map((item) => (
              <div key={item.title} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-xs text-slate-100">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
