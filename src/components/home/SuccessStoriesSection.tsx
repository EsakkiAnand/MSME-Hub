import { SUCCESS_STORIES } from '@/data/mockData';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Award, TrendingUp, CheckCircle2, Building2, UserCheck, Clock } from 'lucide-react';

export function SuccessStoriesSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Validated Engineering Deliveries"
          title="Documented Field Interventions &"
          highlight="Enterprise Outcomes"
          description="Illustrative field case studies demonstrating how FXEC faculty-led student engineering squads resolved high scrap rates, manual inspection bottlenecks, and machine downtime for Southern Tamil Nadu enterprises."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story) => (
            <div
              key={story.id}
              className="rounded-xl border border-slate-300 bg-white p-6 shadow-elevation flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                    {story.industry}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Cycle {story.year}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {story.companyName}
                  </h3>
                  <p className="text-[11px] text-slate-500">{story.district}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
                      Shopfloor Problem Faced:
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {story.problemSummary}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-blue-800 uppercase block">
                      FXEC Engineering Solution:
                    </span>
                    <p className="text-slate-800 leading-relaxed text-[11px]">
                      {story.solutionOutcome}
                    </p>
                  </div>
                </div>

                {/* Verified Impact */}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px] font-bold text-emerald-950">
                      Verified Industrial Impact:
                    </strong>
                    <span className="text-[11px] text-emerald-800 font-medium">
                      {story.impactMetrics}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Details */}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>Mentor: {story.facultyMentor}</span>
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                  <span>Turnaround: {story.turnaroundWeeks} weeks</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Commissioned
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
