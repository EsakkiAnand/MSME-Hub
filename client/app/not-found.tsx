import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MsmeLogoMark } from "@/components/ui/msme-logo";
import { ArrowLeft, Home, Compass } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | FXEC MSME Hub",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Brand Mark */}
        <div className="flex justify-center">
          <div className="p-3 rounded-2xl bg-muted/50 border border-border">
            <MsmeLogoMark size={44} />
          </div>
        </div>

        {/* Status Code & Heading */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Error 404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The page you requested could not be found. It may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-10 px-5 gap-2 rounded-lg">
              <Home className="size-4" />
              <span>Return to Home</span>
            </Button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-10 px-5 gap-2 rounded-lg">
              <Compass className="size-4" />
              <span>Sign In to Workspace</span>
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
