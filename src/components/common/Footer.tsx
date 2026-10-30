import { Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-sm">
                <Building2 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block">
                  FXEC <span className="text-cyan-400">MSME INNOVATION HUB</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  Francis Xavier Engineering College (Autonomous), Tirunelveli
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A mission-driven technological intervention and incubation facility connecting Micro, Small and Medium Enterprises across Southern Tamil Nadu with 16 specialized laboratories, 86 PhD faculty researchers, and multidisciplinary student project squads.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-300">
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5">
                AICTE Approved
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-cyan-300">
                Anna University Affiliated
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-emerald-400">
                NAAC 'A' Grade & NBA
              </span>
              <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-amber-400">
                Host Institute: HI-TN-FXEC-MSME
              </span>
            </div>
          </div>

          {/* Col 3: Public Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              Institutional Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/#about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Overview & Governance
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  The 6-Gate Protocol (G0–G10)
                </a>
              </li>
              <li>
                <a href="/#diagnostic" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Diagnostic Matcher
                </a>
              </li>
              <li>
                <a href="/#industries" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Problem Categories
                </a>
              </li>
              <li>
                <a href="/#labs" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Applied Laboratories
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/submit-problem" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  1-Min Problem Intake
                  <span className="text-[9px] font-mono bg-blue-950 text-cyan-300 px-1 py-0.2 rounded border border-blue-800">
                    M2
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/problem-bank" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Problem Bank (Admin)
                  <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1 py-0.2 rounded border border-slate-800">
                    M3
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/track-status" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Project Tracker (G0–G10)
                  <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1 py-0.2 rounded border border-slate-800">
                    M4
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                  Staff Portal Login
                  <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1 py-0.2 rounded border border-slate-800">
                    M3
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-cyan-500" />
                  Developer UI Kit
                  <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1 py-0.2 rounded border border-cyan-700">
                    M1
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Location & Official Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              Campus Secretariat
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Room 104, Innovation & Incubation Block, FXEC Campus, 103/G2, Bypass Road, Vannarpettai, Tirunelveli - 627 003, Tamil Nadu.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px]">+91 (0462) 2502283</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px]">msmehub@francisxavier.ac.in</span>
              </div>
              <div className="pt-1 text-[10px] text-slate-500 font-mono">
                Secretariat Hours: Mon – Sat (09:00 – 17:00 IST)
              </div>
            </div>
          </div>
        </div>

        {/* Legal & NDA Disclaimer Notice */}
        <div className="py-5 border-b border-slate-900 text-xs text-slate-400 leading-relaxed flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Institutional Confidentiality Protocol:</strong> Submissions via this portal are handled under institutional non-disclosure guidelines. Initial triage is conducted on functional bottleneck descriptions without requiring proprietary drawings or trade secrets.
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">
            ISO 9001:2015 Quality Certified
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>
            © {new Date().getFullYear()} Francis Xavier Engineering College. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Institutional Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Stage-Gate Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">IPR & Patent Cell</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
