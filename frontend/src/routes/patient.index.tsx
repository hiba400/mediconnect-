import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Clock, Video, MapPin, Sparkles, MessageSquare, Search, ArrowRight, Heart, Activity, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { useDoctors } from "@/hooks/useDoctors";
import { usePatientAppointments } from "@/hooks/useAppointments";

export const Route = createFileRoute("/patient/")({ component: PatientHome });

function PatientHome() {
  const user = useAuth((s) => s.user);
  
  const { data: apiDoctors } = useDoctors();
  const recommended = React.useMemo(() => {
    if (!apiDoctors) return [];
    return apiDoctors.slice(0, 3).map((d) => ({
      id: d.id,
      userId: d.userId,
      name: d.fullName ?? d.user?.fullName ?? "Doctor",
      specialty: d.specialty || "General",
      avatar: `https://i.pravatar.cc/150?u=${d.id}`,
      nextSlot: "Tomorrow",
    }));
  }, [apiDoctors]);

  const { data: apiAppointments } = usePatientAppointments(user?.id);
  const next = React.useMemo(() => {
    if (!apiAppointments || apiAppointments.length === 0) return null;
    const a = apiAppointments[0];
    return {
      doctorName: a.doctor?.user?.fullName || "Doctor",
      doctorSpecialty: a.doctor?.specialty || "Specialist",
      reason: a.reason,
      date: new Date(a.appointmentDate).toLocaleDateString(),
      time: new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }, [apiAppointments]);

  const upcomingAppointmentsLength = apiAppointments?.length || 0;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden p-8 bg-gradient-hero text-primary-foreground border-0 shadow-elegant">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm opacity-80">Welcome back,</p>
              <h1 className="text-3xl font-bold mt-1">{user?.name?.split(" ")[0]} 👋</h1>
              <p className="mt-2 text-primary-foreground/80 max-w-md">You have <strong>{upcomingAppointmentsLength}</strong> upcoming appointments. Stay on top of your health.</p>
            </div>
            <div className="glass rounded-2xl p-2 flex gap-2 max-w-md w-full md:w-auto">
              <Search className="h-4 w-4 my-auto ml-2 opacity-70" />
              <Input placeholder="Search doctors..." className="border-0 bg-transparent focus-visible:ring-0 text-primary-foreground placeholder:text-primary-foreground/60" />
              <Link to="/patient/doctors"><Button size="sm" variant="secondary">Search</Button></Link>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next appointment */}
          {next && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Your next appointment</h2>
                <Link to="/patient/appointments" className="text-xs text-primary hover:underline">View all →</Link>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gradient-soft border">
                <Avatar className="h-14 w-14"><AvatarImage src="https://i.pravatar.cc/100?img=12" /><AvatarFallback>EB</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{next.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{next.doctorSpecialty} · {next.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {next.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {next.time}</span>
                    <Badge variant="outline" className="gap-1"><Video className="h-3 w-3" /> Video consult</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button size="sm" className="bg-gradient-hero border-0">Join now</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Recommended doctors */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recommended for you</h2>
              <Link to="/patient/doctors" className="text-xs text-primary hover:underline">See all →</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {recommended.map((d) => (
                <Link key={d.id} to="/patient/doctors/$id" params={{ id: d.id }} className="group">
                  <div className="rounded-xl border p-4 hover:shadow-elegant hover:border-primary/40 transition">
                    <Avatar className="h-12 w-12 mb-3"><AvatarImage src={d.avatar} /><AvatarFallback>{d.name[3]}</AvatarFallback></Avatar>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty}</p>
                    <p className="text-xs mt-2 text-success font-medium">Next: {d.nextSlot}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* AI shortcut */}
          <Link to="/patient/assistant">
            <Card className="p-6 bg-gradient-soft border-primary/20 hover:shadow-elegant transition cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-hero grid place-items-center shadow-glow">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">AI Medical Assistant</p>
                  <p className="text-xs text-muted-foreground">Ask anything, anytime</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition" />
              </div>
            </Card>
          </Link>

          {/* Health metrics */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Health snapshot</h3>
            <div className="space-y-3">
              <Metric icon={Heart} label="Heart rate" value="72 bpm" tone="text-destructive" />
              <Metric icon={Activity} label="Activity" value="8.4k steps" tone="text-success" />
              <Metric icon={Pill} label="Active meds" value="2 prescriptions" tone="text-primary" />
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction icon={Search} label="Find doctor" to="/patient/doctors" />
              <QuickAction icon={MessageSquare} label="Messages" to="/patient/messages" />
              <QuickAction icon={Calendar} label="Schedule" to="/patient/appointments" />
              <QuickAction icon={MapPin} label="Near me" to="/patient/doctors" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className={`h-4 w-4 ${tone}`} />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
function QuickAction({ icon: Icon, label, to }: { icon: React.ComponentType<{ className?: string }>; label: string; to: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1 py-4 rounded-lg border hover:border-primary hover:bg-accent transition">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
