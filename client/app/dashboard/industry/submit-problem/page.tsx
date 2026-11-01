"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Building2,
  FileText,
  Clock,
  Layers,
  Send,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IOSSelect } from "@/components/ui/ios-select";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { safeNavigateBack } from "@/lib/navigation-utils";
import { ContextualBreadcrumb } from "@/components/navigation/contextual-breadcrumb";
import { submitIndustrialProblemAction } from "@/app/actions/industry";

const domainOptions = [
  { value: "Software & Cloud", label: "Software & Cloud Platforms" },
  { value: "IoT & Analytics", label: "IoT, Sensors & Industrial Telemetry" },
  { value: "Manufacturing & AI", label: "Manufacturing, Robotics & Computer Vision" },
  { value: "FinTech & Web", label: "FinTech, Invoicing & ERP Automation" },
  { value: "Automotive & Embedded", label: "Automotive, Power & Embedded Hardware" },
  { value: "General Engineering", label: "General Industrial Problem" },
];

const timelineOptions = [
  { value: "8 Weeks", label: "8 Weeks (Fast-track Capstone)" },
  { value: "12 Weeks", label: "12 Weeks (Single Semester)" },
  { value: "16 Weeks", label: "16 Weeks (Multi-Phase Project)" },
  { value: "24 Weeks", label: "24 Weeks (Comprehensive R&D)" },
];

export default function SubmitProblemPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("Software & Cloud");
  const [timeline, setTimeline] = useState("12 Weeks");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [expectedDeliverables, setExpectedDeliverables] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleCancelClick = () => {
    if (title.trim() || description.trim()) {
      setShowDiscardConfirm(true);
    } else {
      safeNavigateBack(router, "/dashboard/industry/problems");
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !domain || !description.trim()) {
      toast.error("Please fill in the problem title, domain, and description.");
      return;
    }

    if (!consentChecked) {
      toast.error("You must agree to the MIT open-source academic collaboration terms.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitIndustrialProblemAction({
        title: title.trim(),
        domain,
        description: description.trim(),
        constraints: constraints.trim() || undefined,
        expectedDeliverables: expectedDeliverables.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message || "Challenge submitted successfully!");
        setShowConfirm(false);
        router.push("/dashboard/industry/problems");
      } else {
        toast.error(res.error || "Failed to submit challenge.");
        setShowConfirm(false);
      }
    } catch {
      toast.error("Network error while submitting.");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ContextualBreadcrumb
        items={[
          { label: "My Problems", href: "/dashboard/industry/problems" },
          { label: "Submit Challenge", isCurrent: true },
        ]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <PlusCircle className="size-5 text-[#007AFF]" />
            Submit Operational Challenge to Academic Pool
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            PRD §8.3 REQ-IND-01: Verified industry partners submit real-world bottlenecks. Academic staff review, claim, and assign multi-student builder teams.
          </p>
        </div>
      </div>

      <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-foreground">
            Industrial Challenge Brief
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Provide comprehensive requirements, hardware constraints, and deliverable targets for student teams.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-5">
          <form onSubmit={handleSubmitAttempt} className="space-y-5">
            {/* Title & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5 text-[#007AFF]" />
                  Challenge Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Automated Bearing Vibration Monitoring for CNC Spindles"
                  className="text-xs h-9 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-purple-600" />
                  Engineering Domain / Sector <span className="text-rose-500">*</span>
                </label>
                <IOSSelect
                  value={domain}
                  onChange={setDomain}
                  options={domainOptions}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber-600" />
                  Expected Delivery Horizon
                </label>
                <IOSSelect
                  value={timeline}
                  onChange={setTimeline}
                  options={timelineOptions}
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Detailed Problem Description &amp; Industrial Context <span className="text-rose-500">*</span>
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the operational bottleneck, current manual process or failure mode, and the desired technical solution..."
                rows={5}
                className="text-xs"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Be specific about operational context so faculty directors can assemble suitably skilled student rosters.
              </p>
            </div>

            {/* Constraints */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Technical Constraints &amp; Environment Limits (Optional)
              </label>
              <Textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Must run on low-power ARM architecture, budget under ₹5,000 for sensors, offline sync support, response time under 100ms..."
                rows={3}
                className="text-xs"
              />
            </div>

            {/* Expected Deliverables */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Expected Deliverables &amp; Output Artifacts (Optional)
              </label>
              <Textarea
                value={expectedDeliverables}
                onChange={(e) => setExpectedDeliverables(e.target.value)}
                placeholder="e.g. Next.js dashboard, ESP32 firmware binary, PCB schematic, deployment manual, and MIT licensed GitHub repository..."
                rows={3}
                className="text-xs"
              />
            </div>

            {/* Academic Collaboration & MIT License Consent (ADR 0005) */}
            <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-blue-300 text-[#007AFF] focus:ring-blue-500"
                />
                <label htmlFor="consent" className="text-foreground font-medium cursor-pointer leading-relaxed">
                  I agree that solutions developed by student teams are governed under the{" "}
                  <strong>MIT Open Source License</strong> (ADR 0005). My enterprise retains the royalty-free commercial right to use, modify, and deploy the deliverable.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelClick}
                className="text-xs text-foreground hover:bg-black/[0.02] dark:bg-white/[0.03]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9 px-6"
              >
                <Send className="size-3.5 mr-1.5" />
                Review &amp; Submit Challenge
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Discard Confirmation Dialog */}
      <ConfirmationDialog
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard Challenge Draft?"
        description="Are you sure you want to discard this challenge draft? All entered requirements and deliverables will be lost."
        confirmText="Discard Draft"
        cancelText="Keep Editing"
        variant="destructive"
        onConfirm={() => safeNavigateBack(router, "/dashboard/industry/problems")}
      />

      {/* Confirmation Dialog to Prevent Accidental Duplicate Submissions */}
      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Submit Problem to Academic Pool?"
        description={
          <div>
            <p className="mb-2">
              You are submitting: <strong>{title}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Once submitted, it will be placed in the institutional domain pool where verified faculty directors will evaluate and staff multi-student project teams.
            </p>
          </div>
        }
        confirmText={isSubmitting ? "Submitting..." : "Confirm & Post"}
        cancelText="Review Details"
        variant="default"
        isLoading={isSubmitting}
        onConfirm={handleConfirmedSubmit}
      />
    </div>
  );
}

