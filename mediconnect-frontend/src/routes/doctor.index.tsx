import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Users, Star, TrendingUp, Clock, Video, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts";
import { doctorAppointments, analytics } from "@/lib/mock-data";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/doctor/")({ component: DoctorOverview });

function DoctorOverview() {
  const user = useAuth((s) => s.user);
  const today = doctorAppointments.filter((a) => a.date === "2026-05-12");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name?.split(" ")[1]}</h1>
          <p className="text-sm text-muted-foreground">Here's your clinic at a glance · Tuesday, May 12</p>
        </div>
        <Button className="bg-gradient-hero border-0 shadow-glow">+ Block time</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Calendar} label="Today's appointments" value={today.length.toString()} sub="2 video · 1 in-person" tone="text-primary" />
        <KPI icon={Users} label="Active patients" value="142" sub="+12 this month" tone="text-secondary" />
        <KPI icon={Star} label="Rating" value="4.9" sub="248 reviews" tone="text-warning" />
        <KPI icon={TrendingUp} label="This month" value="€7,240" sub="+18% vs last month" tone="text-success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Today's schedule</h3>
            <Badge variant="outline">{today.length} appointments</Badge>
          </div>
          <div className="space-y-3">
            {today.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl border hover:border-primary/40 transition">
                <div className="text-center w-14 shrink-0">
                  <p className="text-xs text-muted-foreground">{a.time.split(":")[0]}h</p>
                  <p className="font-bold">{a.time}</p>
                </div>
                <div className="h-10 w-px bg-border" />
                <Avatar><AvatarFallback>{a.patientName[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{a.patientName}</p>
                  <p className="text-xs text-muted-foreground">{a.reason ?? "Consultation"}</p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  {a.type === "video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{a.type}
                </Badge>
                <Button size="sm" variant="outline">Open</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Weekly volume</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analytics.weeklyAppointments}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg. consult duration</p>
              <p className="font-bold flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> 24 min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completion</p>
              <p className="font-bold text-success">96%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Revenue trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analytics.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: "var(--primary)" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function KPI({ icon: Icon, label, value, sub, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string; tone: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </Card>
  );
}
