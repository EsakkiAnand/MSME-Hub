import { Link } from 'react-router-dom';
import { LIVE_PROBLEM_FEED } from '@/data/mockData';
import { Badge, ProblemStatusBadge } from '@/components/ui/Badge';
import { Radio, ArrowRight, Building2, MapPin, Clock } from 'lucide-react';

export function LiveTickerSection() {
  return (
    <section id="live-feed" className="py-12 bg-slate-900 text-white border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-200">
                  Live Intake & Project Activity Stream
                </h3>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-slate-700">
                  Regional MSME Clusters
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Masked problem statements currently undergoing triage, field visits, or lab prototyping at FXEC.
              </p>
            </div>
          </div>

          <Link
            to="/problem-bank"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 shrink-0"
          >
            <span>Explore Complete Problem Bank (Member 3)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Live Grid of Problems */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {LIVE_PROBLEM_FEED.map((item) => (
            <div
              key={item.trackingId}
              className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-400 text-xs">
                  {item.trackingId}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                  {item.gate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-100 leading-snug line-clamp-1">
                  {item.categoryTitle}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  {item.district}
                </span>
                <span className="font-mono text-slate-500">
                  {item.daysActive}d active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

