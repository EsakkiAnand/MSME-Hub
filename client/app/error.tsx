"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50/80 via-slate-100/60 to-slate-50/80 dark:from-[#090D16] dark:via-[#0E1524] dark:to-[#090D16] px-4 py-12 text-foreground">
      <div className="w-full max-w-md text-center p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="size-14 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center shadow-2xs">
            <AlertCircle className="size-7" />
          </div>
        </div>

        {/* Heading & Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            Application Error
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            An unexpected error occurred while rendering this view. Our system has logged the event.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-10 px-5 gap-2 rounded-xl bg-[#14283F] hover:bg-[#14283F]/90 text-white font-semibold transition-all duration-150 active:scale-[0.99] shadow-xs"
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-10 px-5 gap-2 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium transition-colors">
              <Home className="size-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 text-[11px] text-muted-foreground border-t border-slate-100 dark:border-slate-800/60">
          FXEC MSME Hub &middot; Francis Xavier Engineering College
        </div>
      </div>
    </div>
  );
}
