"use client";

import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Building2,
  Briefcase,
  Globe,
  Award,
  CheckCircle2,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyIdBadge } from "@/components/ui/copy-id-badge";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  getAlumniOverviewAction,
  updateAlumniProfileAction,
} from "@/app/actions/alumni";

export default function AlumniProfilePage() {
  const session = authClient.useSession();
  const sessionUser = session?.data?.user;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uniqueId, setUniqueId] = useState("ALU0001");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [passoutYear, setPassoutYear] = useState<number | string>(2020);
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [helpfulCount, setHelpfulCount] = useState(14);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await getAlumniOverviewAction();
        if (res.success) {
          setName(res.user?.name || sessionUser?.name || "Alumni Mentor");
          setEmail(res.user?.email || sessionUser?.email || "alumni@francisxavier.ac.in");
          setUniqueId(res.user?.uniqueId || "ALU0001");

          if (res.profile) {
            setDegree(res.profile.degree || "B.E. Computer Science & Engineering");
            setPassoutYear(res.profile.passoutYear || 2020);
            setCurrentCompany(res.profile.currentCompany || "Zoho Corporation");
            setCurrentRole(res.profile.currentRole || "Principal Architect");
            setLinkedinUrl(res.profile.linkedinUrl || "https://linkedin.com/in/alumni");
            setHelpfulCount(res.profile.helpfulCount ?? 14);
          }
        }
      } catch {
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [sessionUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !currentCompany.trim() || !currentRole.trim()) {
      toast.error("Please fill in degree, company, and role fields.");
      return;
    }

    setSaving(true);
    try {
      const res = await updateAlumniProfileAction({
        degree: degree.trim(),
        passoutYear: Number(passoutYear),
        currentCompany: currentCompany.trim(),
        currentRole: currentRole.trim(),
        linkedinUrl: linkedinUrl.trim() || undefined,
      });

      if (res.success) {
        toast.success("Alumni profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to save profile changes.");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-[#007AFF] mb-3" />
        <p className="text-sm font-medium">Loading Alumni Profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Profile Identity Card */}
      <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white overflow-hidden">
        <div className="h-20 bg-black/[0.03] dark:bg-white/[0.04] border-b border-black/[0.06] dark:border-white/[0.08]" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="size-16 rounded-[16px] bg-[#007AFF] text-white border-4 border-white dark:border-[#1C1C1E] shadow-sm flex items-center justify-center text-2xl font-bold">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{name}</h2>
                  <Badge variant="outline" className="bg-[#34C759]/10 text-[#34C759] border-transparent text-xs">
                    <CheckCircle2 className="size-3 mr-1" /> Verified Mentor
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CopyIdBadge id={uniqueId} label="Alumni ID" size="default" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100">
              <span className="text-muted-foreground block text-[11px]">Passout Batch</span>
              <span className="font-bold text-foreground">{passoutYear}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100">
              <span className="text-muted-foreground block text-[11px]">Organization</span>
              <span className="font-bold text-foreground truncate block">{currentCompany}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.03] border border-slate-100">
              <span className="text-muted-foreground block text-[11px]">Designation</span>
              <span className="font-bold text-foreground truncate block">{currentRole}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <span className="text-amber-600 block text-[11px]">Endorsements</span>
              <span className="font-black text-amber-700 flex items-center gap-1">
                <Sparkles className="size-3.5" /> {helpfulCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Form */}
      <Card className="border-black/[0.06] dark:border-white/[0.08] shadow-xs bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-foreground">
            Professional Information &amp; Mentorship Credentials
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Keep your credentials up to date so student builders and faculty can route relevant domain inquiries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-[#007AFF]" />
                  Engineering Degree
                </label>
                <Input
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.E. Computer Science & Engineering"
                  className="text-xs h-9 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Graduation Year
                </label>
                <Input
                  type="number"
                  value={passoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                  placeholder="2020"
                  className="text-xs h-9 bg-white"
                  min={1990}
                  max={2030}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-emerald-600" />
                  Current Organization / Company
                </label>
                <Input
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="e.g. Zoho Corporation / Hexaware"
                  className="text-xs h-9 bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="size-3.5 text-purple-600" />
                  Current Designation / Role
                </label>
                <Input
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Principal Architect / Staff SRE"
                  className="text-xs h-9 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="size-3.5 text-[#007AFF]" />
                LinkedIn / Professional Profile URL
              </label>
              <Input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="text-xs h-9 bg-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white text-xs h-9 px-5"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-3.5 mr-1.5" />
                    Save Profile Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
