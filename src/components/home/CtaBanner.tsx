import { Link } from 'react-router-dom';
import { Send, ShieldCheck, Clock, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded bg-slate-800 text-cyan-400 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-slate-700">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Zero-Friction Intake Protocol
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Initiate a Technical Intervention for Your Shopfloor
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Submit a concise problem summary today. Our Hub Coordinator and domain faculty mentors will triage your challenge and contact you within 72 business hours.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/submit-problem" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm h-12 px-6"
                rightIcon={<Send className="h-4 w-4 text-white" />}
              >
                Submit Problem Intake (60s)
              </Button>
            </Link>

            <Link to="/track-status" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 text-slate-200 bg-slate-950 hover:bg-slate-800 h-12 px-5 font-semibold text-xs"
                leftIcon={<Search className="h-4 w-4 text-slate-400" />}
              >
                Track Existing Reference ID
              </Button>
            </Link>
          </div>

          {/* Institutional Reassurance */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Institutional NDA Safeguard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>Response in 48–72 Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>Zero Upfront Financial Obligation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
