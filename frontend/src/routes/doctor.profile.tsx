import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/doctor/profile")({ component: DoctorProfile });

function DoctorProfile() {
  const user = useAuth((s) => s.user);
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Your professional profile</h1>

      <Card className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-24 w-24"><AvatarFallback className="bg-gradient-hero text-primary-foreground text-xl">JC</AvatarFallback></Avatar>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-glow"><Camera className="h-4 w-4" /></button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{user?.name}</p>
              <Badge className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Cardiology · 12 years experience</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">General information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name" defaultValue={user?.name ?? ""} />
          <Field label="Email" type="email" defaultValue={user?.email ?? ""} />
          <Field label="Phone" defaultValue="+33 6 12 34 56 78" />
          <Field label="Specialty" defaultValue="Cardiology" />
          <Field label="License #" defaultValue="MED-789432" />
          <Field label="City" defaultValue="Paris" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Professional bio</Label>
          <Textarea rows={4} className="mt-1.5" defaultValue="Board-certified cardiologist with 12 years of experience. I combine evidence-based medicine with a patient-first approach to deliver compassionate, modern care." />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Languages</Label>
          <Input defaultValue="French, English, Arabic" className="mt-1.5" />
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline">Discard</Button>
          <Button className="bg-gradient-hero border-0">Save changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Consultation pricing</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Video consultation (€)" type="number" defaultValue="65" />
          <Field label="In-person consultation (€)" type="number" defaultValue="85" />
        </div>
      </Card>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="mt-1.5" {...rest} />
    </div>
  );
}
