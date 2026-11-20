"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected runtime client error
    console.error("Runtime application error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="size-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <AlertCircle className="size-7" />
          </div>
        </div>

        {/* Heading & Details */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-destructive">
            Application Error
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            An unexpected error occurred while rendering this view. Our system has logged the event.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-10 px-5 gap-2 rounded-lg"
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-10 px-5 gap-2 rounded-lg">
              <Home className="size-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 text-xs text-muted-foreground border-t border-border/50">
          FXEC MSME Hub &middot; Francis Xavier Engineering College
        </div>
      </div>
    </div>
  );
}
