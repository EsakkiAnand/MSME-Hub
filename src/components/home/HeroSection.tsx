import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Search,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Building2,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HUB_STATS, LIVE_PROBLEM_FEED } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'track' | 'capability'>('track');
  const [selectedTrackingId, setSelectedTrackingId] = useState('FXEC-MSME-2026-0001');
  const [capSector, setCapSector] = useState('MANUFACTURING');

  const selectedRecord =
    LIVE_PROBLEM_FEED.find((r) => r.trackingId === selectedTrackingId) ||
    LIVE_PROBLEM_FEED[0];

  return (
    <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 bg-white border-b border-slate-200 bg-blueprint-grid">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left Column: Authoritative Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Host Institute Official Verification Pill */}
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">Host Institute Code:</span>
              <span className="text-cyan-300 font-semibold">HI-TN-FXEC-MSME</span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                Francis Xavier Engineering College
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Direct Engineering Intervention & Prototyping Platform for{' '}
              <span className="text-blue-700 underline decoration-blue-300 decoration-4 underline-offset-4">
                MSMEs.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              Francis Xavier Engineering College (Autonomous, Tirunelveli) connects local enterprises across Southern Tamil Nadu with 16 specialized laboratories, 86 PhD faculty researchers, and multidisciplinary student project squads to solve critical shopfloor bottlenecks, automate manual inspections, and build working prototypes.
            </p>

            {/* Action Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/submit-problem">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-blue-900 hover:bg-slate-950 text-white font-bold text-sm tracking-wide shadow-sm h-12 px-6"
                  rightIcon={<Send className="h-4 w-4 text-cyan-300" />}
                >
                  Initiate 1-Minute Intake Form
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-100 font-semibold text-sm h-12 px-5"
                >
                  The 6-Gate Institutional Protocol
                </Button>
              </a>
            </div>

            {/* Verification & Safeguard Checklist */}
            <div className="pt-4 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Academic NDA Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                <span>48–72 Hr Coordinator Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Zero Cost Preliminary Feasibility</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Tracking & Capability Console */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-300 bg-white shadow-elevation overflow-hidden">
              {/* Console Header Tabs */}
              <div className="flex items-center border-b border-slate-200 bg-slate-50 p-1.5">
                <button
                  onClick={() => setActiveConsoleTab('track')}
                  className={cn(
                    'flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer',
                    activeConsoleTab === 'track'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Live Reference Lookup
                </button>
                <button
                  onClick={() => setActiveConsoleTab('capability')}
                  className={cn(
                    'flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer',
                    activeConsoleTab === 'capability'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Quick Capability Check
                </button>
              </div>

              {/* Tab 1: Live Reference Lookup */}
              {activeConsoleTab === 'track' ? (
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Select / Enter Tracking ID:
                      </label>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live DB Connected
                      </span>
                    </div>

                    {/* Quick Pick Reference IDs */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {LIVE_PROBLEM_FEED.slice(0, 3).map((item) => (
                        <button
                          key={item.trackingId}
                          onClick={() => setSelectedTrackingId(item.trackingId)}
                          className={cn(
                            'text-[11px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer',
                            selectedTrackingId === item.trackingId
                              ? 'bg-blue-900 text-white border-blue-900 font-bold'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          )}
                        >
                          {item.trackingId}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Record Card */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-900 block">
                          {selectedRecord.trackingId}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                          {selectedRecord.companyMasked}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {selectedRecord.district}
                        </p>
                      </div>
                      <span className="rounded bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0 font-mono">
                        {selectedRecord.gate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium border-t border-slate-200 pt-2">
                      <strong className="text-slate-900 block mb-0.5">Problem Statement:</strong>
                      {selectedRecord.categoryTitle}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Lab: {selectedRecord.assignedLab}</span>
                      <span className="font-mono text-slate-700">
                        {selectedRecord.daysActive} days active
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <Link
                      to="/track-status"
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <span>Open full tracking dossier</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[11px] text-slate-400">
                      Member 4 Integration Point
                    </span>
                  </div>
                </div>
              ) : (
                /* Tab 2: Quick Capability Check */
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                      Select Your Industrial Domain:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'Precision Engineering', value: 'MANUFACTURING' },
                        { label: 'Agro & Food Processing', value: 'FOOD_PROCESSING' },
                        { label: 'Textiles & Looms', value: 'TEXTILES' },
                        { label: 'Renewable Power', value: 'RENEWABLE_ENERGY' },
                      ].map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setCapSector(s.value)}
                          className={cn(
                            'text-xs text-left px-3 py-2 rounded border font-medium transition-colors cursor-pointer',
                            capSector === s.value
                              ? 'bg-blue-900 text-white border-blue-900 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Dedicated Center:</span>
                      <span className="text-blue-800 font-semibold font-mono text-[11px]">
                        {capSector === 'MANUFACTURING' && 'CAD/CAM & IoT Lab'}
                        {capSector === 'FOOD_PROCESSING' && 'Agri-Tech & Drying Lab'}
                        {capSector === 'TEXTILES' && 'Mechatronics & Looms Lab'}
                        {capSector === 'RENEWABLE_ENERGY' && 'Microgrid & Power Lab'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Diagnostic Timeline:</span>
                      <span className="text-slate-700">5 – 7 business days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Supported Grant Scheme:</span>
                      <span className="text-emerald-700 font-bold">
                        {capSector === 'MANUFACTURING' && 'EDII-TN IVP (₹1 to 5 Lakhs)'}
                        {capSector === 'FOOD_PROCESSING' && 'ASPIRE / MSME Hackathon'}
                        {capSector === 'TEXTILES' && 'TANSIM TANSEED Voucher'}
                        {capSector === 'RENEWABLE_ENERGY' && 'BEE Energy Audit Scheme'}
                      </span>
                    </div>
                  </div>

                  <Link to={`/submit-problem?sector=${capSector}`} className="block">
                    <Button variant="primary" size="sm" className="w-full bg-blue-900 text-white font-bold">
                      Proceed with {capSector.replace('_', ' ')} Intake ➔
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Ticker of Key Institutional Metrics */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          {HUB_STATS.map((stat) => (
            <div key={stat.label} className="border-l-2 border-blue-900 pl-4 space-y-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800">{stat.label}</p>
              <p className="text-[11px] text-slate-500 font-normal leading-snug">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
