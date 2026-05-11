import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { analytics } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

const pieData = [
  { name: "Cardiology", value: 28 },
  { name: "Dermatology", value: 19 },
  { name: "Pediatrics", value: 22 },
  { name: "Neurology", value: 14 },
  { name: "Other", value: 17 },
];
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Platform analytics</h1>

      <Card className="p-6 bg-slate-950 text-slate-100 border-slate-800">
        <h3 className="font-semibold mb-4">Growth — Patients vs Doctors</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analytics.platformGrowth}>
            <defs>
              <linearGradient id="p1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} /><stop offset="100%" stopColor="#38bdf8" stopOpacity={0} /></linearGradient>
              <linearGradient id="p2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" stopOpacity={0.5} /><stop offset="100%" stopColor="#34d399" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }} />
            <Area type="monotone" dataKey="patients" stroke="#38bdf8" fill="url(#p1)" strokeWidth={2} />
            <Area type="monotone" dataKey="doctors" stroke="#34d399" fill="url(#p2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Specialties distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Appointments by day</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.weeklyAppointments}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
