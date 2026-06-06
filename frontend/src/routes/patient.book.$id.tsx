import React, { useState } from "react";
import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, Video, MapPin, Check, CalendarDays, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth";
import { useDoctors } from "@/hooks/useDoctors";
import { normalizeDoctor } from "@/lib/doctors";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/book/$id")({ component: Book });

function Book() {
  const { id } = useParams({ from: "/patient/book/$id" });
  const user = useAuth((s) => s.user);
  const { data: apiDoctors, isLoading } = useDoctors();
  
  const d = React.useMemo(() => {
    if (!apiDoctors) return null;
    const found = apiDoctors.find((x) => x.id === id);
    if (!found) return null;
    return normalizeDoctor(found);
  }, [apiDoctors, id]);

  const navigate = useNavigate();
  const [type, setType] = useState<"video" | "in-person">("video");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const days = React.useMemo(() => Array.from({ length: 6 }).map((_, i) => {
    const dt = new Date(); dt.setDate(dt.getDate() + i);
    return { label: dt.toLocaleDateString(undefined, { weekday: "short" }), date: dt.getDate(), iso: dt.toISOString().slice(0,10) };
  }), []);

  const slots = ["09:00", "09:30", "10:30", "11:00", "14:00", "14:30", "16:00", "16:30"];

  const confirm = async () => {
    if (!d || !slot || !user) return;

    try {
      const [hours, minutes] = slot.split(":").map(Number);
      const appointmentDate = new Date(days[day].iso);
      appointmentDate.setHours(hours, minutes, 0, 0);

      await fetchApi("/Appointments", {
        method: "POST",
        body: JSON.stringify({
          patientId: user.id,
          doctorId: d.userId,
          appointmentDate: appointmentDate.toISOString(),
          reason: reason || "Consultation",
        }),
      });

      toast.success(`Appointment booked with ${d.name}!`);
      navigate({ to: "/patient/appointments" });
    } catch (e: any) {
      toast.error(e.message || "Failed to book appointment");
    }
  };

  if (isLoading || !d) {
    return <div className="p-8 text-center text-muted-foreground">Loading doctor details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/patient/doctors/$id" params={{ id: d.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to profile</Link>

      <Card className="p-6">
        <div className="flex items-center gap-4 pb-5 border-b">
          <Avatar className="h-14 w-14"><AvatarImage src={d.avatar} /><AvatarFallback>{d.name[3]}</AvatarFallback></Avatar>
          <div>
            <p className="font-semibold">{d.name}</p>
            <p className="text-sm text-muted-foreground">{d.specialty} · €{d.price}</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <p className="font-medium text-sm mb-2">Consultation type</p>
            <div className="grid grid-cols-2 gap-3">
              <TypeBtn active={type === "video"} onClick={() => setType("video")} icon={Video} label="Video consult" desc="Meet online" />
              <TypeBtn active={type === "in-person"} onClick={() => setType("in-person")} icon={MapPin} label="In-person" desc={d.city + " clinic"} />
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 flex items-center gap-1"><CalendarDays className="h-4 w-4" /> Choose date</p>
            <div className="grid grid-cols-6 gap-2">
              {days.map((dd, i) => (
                <button key={dd.iso} onClick={() => setDay(i)} className={`p-3 rounded-xl border text-center transition ${i === day ? "bg-primary text-primary-foreground border-primary shadow-glow" : "hover:bg-accent"}`}>
                  <p className="text-[10px] uppercase tracking-wider opacity-70">{dd.label}</p>
                  <p className="font-bold text-lg">{dd.date}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2 flex items-center gap-1"><Clock className="h-4 w-4" /> Available time</p>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className={`py-2.5 rounded-lg border text-sm font-medium transition ${slot === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Reason for visit (optional)</p>
            <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe your symptoms or reason..." />
          </div>

          <div className="flex items-center justify-between pt-5 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">€{d.price}</p>
              {slot && <Badge variant="secondary" className="mt-1">{days[day].label} {days[day].date} · {slot}</Badge>}
            </div>
            <Button disabled={!slot} onClick={confirm} size="lg" className="bg-gradient-hero border-0 shadow-glow">
              <Check className="h-4 w-4 mr-1" /> Confirm booking
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function TypeBtn({ active, onClick, icon: Icon, label, desc }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string; desc: string }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl border text-left transition ${active ? "border-primary bg-primary/5 shadow-glow" : "hover:bg-accent"}`}>
      <Icon className={`h-5 w-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}
