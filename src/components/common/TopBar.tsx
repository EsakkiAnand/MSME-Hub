import { Phone, Mail, Award, Bell } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-slate-950 text-slate-300 text-[11px] font-medium py-1.5 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4">
          {/* Institutional Credentials */}
          <div className="flex items-center gap-2 text-slate-400 overflow-x-auto whitespace-nowrap text-center md:text-left">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
              <Award className="h-3 w-3 text-cyan-400" />
              Francis Xavier Engineering College (Autonomous)
            </span>
            <span className="text-slate-600 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-slate-400">
              NBA Accredited • NAAC 'A' Grade • AICTE Approved
            </span>
            <span className="text-slate-600 hidden xl:inline">•</span>
            <span className="hidden xl:inline text-cyan-400 font-mono text-[10px]">
              Host Institute: HI-TN-FXEC-MSME
            </span>
          </div>

          {/* Contact Helpline & Official Cycle Note */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Bell className="h-3 w-3 text-amber-400 animate-pulse" />
              <span>Cycle 2026–27 Intake Open</span>
            </div>
            <a
              href="tel:+914622502283"
              className="flex items-center gap-1 hover:text-white transition-colors text-slate-300"
            >
              <Phone className="h-3 w-3 text-emerald-400" />
              <span className="font-mono text-[11px]">+91 462 2502283</span>
            </a>
            <a
              href="mailto:msmehub@francisxavier.ac.in"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors text-slate-300"
            >
              <Mail className="h-3 w-3 text-cyan-400" />
              <span className="text-[11px]">msmehub@francisxavier.ac.in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

