import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Stethoscope, FileCheck, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { analytics, applications } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const pending = applications.filter((a) => a.status === "pending");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform overview</h1>
        <p className="text-sm text-muted-foreground">Real-time stats across MediConnect</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Users} label="Total patients" value="4,280" delta="+12.4%" />
        <KPI icon={Stethoscope} label="Active doctors" value="124" delta="+8" />
        <KPI icon={FileCheck} label="Pending applications" value={pending.length.toString()} delta="Action required" tone="warning" />
        <KPI icon={Activity} label="Appointments today" value="389" delta="+5.2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-slate-950 text-slate-100 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Platform growth</h3>
            <Badge className="bg-success/20 text-success border-0">+34% MoM</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analytics.platformGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, fontSize: 12, color: "#fff" }} />
              <Line type="monotone" dataKey="patients" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="doctors" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 text-xs">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-400" /> Patients</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Doctors</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending review</h3>
            <Link to="/admin/applications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 4).map((a) => (
              <div key={a.id} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.specialty} · {a.city}</p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-warning" />
                </div>
                <div className="mt-2 flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5"><p className="text-xs text-muted-foreground">Active sessions</p><p className="text-2xl font-bold mt-1">1,847</p><div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-hero" /></div></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Avg. response time</p><p className="text-2xl font-bold mt-1">142ms</p><p className="text-xs text-success mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />Stable</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">System health</p><p className="text-2xl font-bold mt-1 text-success">99.98%</p><p className="text-xs text-muted-foreground mt-1">Last 30 days</p></Card>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; tone?: "warning" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-primary" /></div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-1 ${tone === "warning" ? "text-warning-foreground" : "text-success"}`}>{delta}</p>
    </Card>
  );
}
