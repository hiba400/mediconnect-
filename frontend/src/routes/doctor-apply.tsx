import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { loginWithCredentials, registerDoctorAndSignIn } from "@/lib/auth-session";
import { createDoctorProfile } from "@/lib/doctor-profile-api";
import { submitDoctorApplication } from "@/hooks/useDoctorApplications";
import {
  clearDoctorApplyPending,
  saveDoctorApplyPending,
} from "@/lib/doctor-apply-pending";

export const Route = createFileRoute("/doctor-apply")({ component: DoctorApply });

const STEPS = ["Identity", "Practice", "Credentials", "Review"];

function DoctorApply() {
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [data, setData] = useState({
    name: "", email: "", password: "", phone: "",
    specialty: "", license: "", experience: "", city: "",
    languages: "", bio: "",
  });

  const update = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));
  const submit = async () => {
    if (!data.name.trim() || !data.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!data.password || data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      fullName: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    };

    saveDoctorApplyPending(payload);
    setSubmitting(true);
    try {
      const { user, token } = await registerDoctorAndSignIn(payload);

      setUser({ ...user, role: "doctor" }, token);

      await createDoctorProfile({
        userId: user.id,
        fullName: payload.fullName,
        specialty: data.specialty || "General Medicine",
        bio: data.bio || "",
        consultationFee: 50,
        yearsOfExperience: Number(data.experience) || 0,
        city: data.city || "Unknown",
      });

      await submitDoctorApplication({
        userId: user.id,
        fullName: payload.fullName,
        email: payload.email,
        specialty: data.specialty || "General Medicine",
        licenseNumber: data.license || "",
        city: data.city || "Unknown",
        yearsOfExperience: Number(data.experience) || 0,
        bio: data.bio || "",
        documentCount: files.length,
      });

      clearDoctorApplyPending();
      toast.success("Welcome, doctor! You're signed in.");
      navigate({ to: "/doctor", replace: true });
    } catch (e: any) {
      const message = e.message || "Failed to submit application";
      if (message.toLowerCase().includes("email already exists")) {
        try {
          const { user, token } = await loginWithCredentials(payload.email, payload.password);
          clearDoctorApplyPending();
          setUser({ ...user, role: "doctor" }, token);
          toast.success("Welcome back — you're signed in!");
          navigate({ to: "/doctor", replace: true });
          return;
        } catch {
          toast.error("This email is already registered. Sign in with your password.");
        }
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const names = Array.from(e.dataTransfer.files).map((f) => f.name);
    setFiles((p) => [...p, ...names]);
  };

  return (
    <AuthLayout
      title="Become a MediConnect doctor"
      subtitle={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
    >
      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold transition ${
              i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-success" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
          {step === 0 && (
            <>
              <FieldRow label="Full name"><Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Dr. Emma Bennett" /></FieldRow>
              <FieldRow label="Email"><Input value={data.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="dr.emma@clinic.com" /></FieldRow>
              <FieldRow label="Password"><Input value={data.password} onChange={(e) => update("password", e.target.value)} type="password" placeholder="••••••••" /></FieldRow>
              <FieldRow label="Phone"><Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+33 6 12 34 56 78" /></FieldRow>
            </>
          )}
          {step === 1 && (
            <>
              <FieldRow label="Specialty"><Input value={data.specialty} onChange={(e) => update("specialty", e.target.value)} placeholder="Cardiology" /></FieldRow>
              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="License number"><Input value={data.license} onChange={(e) => update("license", e.target.value)} placeholder="MED-123456" /></FieldRow>
                <FieldRow label="Years of experience"><Input value={data.experience} onChange={(e) => update("experience", e.target.value)} type="number" placeholder="12" /></FieldRow>
              </div>
              <FieldRow label="City"><Input value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="Paris" /></FieldRow>
              <FieldRow label="Languages spoken"><Input value={data.languages} onChange={(e) => update("languages", e.target.value)} placeholder="French, English, Arabic" /></FieldRow>
              <FieldRow label="Professional bio">
                <Textarea rows={4} value={data.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell patients about your approach to care..." />
              </FieldRow>
            </>
          )}
          {step === 2 && (
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Upload credentials (diploma, license, ID)</Label>
              <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="mt-2 border-2 border-dashed rounded-xl p-10 text-center hover:border-primary hover:bg-accent/50 transition cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · Max 10MB each</p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1 truncate">{f}</span>
                      <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border p-5 bg-muted/30">
                <Badge variant="outline" className="mb-3">Review your application</Badge>
                <Row label="Name" value={data.name || "—"} />
                <Row label="Email" value={data.email || "—"} />
                <Row label="Specialty" value={data.specialty || "—"} />
                <Row label="License" value={data.license || "—"} />
                <Row label="City" value={data.city || "—"} />
                <Row label="Experience" value={data.experience ? `${data.experience} years` : "—"} />
                <Row label="Documents" value={`${files.length} file(s)`} />
              </div>
              <p className="text-xs text-muted-foreground">Submitting creates your doctor account and signs you in automatically.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between gap-3">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} className="bg-gradient-hero border-0 shadow-glow">
            Continue <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting} className="bg-gradient-hero border-0 shadow-glow">
            {submitting ? "Creating account..." : <>Submit application <Check className="h-4 w-4 ml-1" /></>}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b last:border-0 border-border/60">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
