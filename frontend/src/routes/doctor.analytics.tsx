import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Star, TrendingUp, Users, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { analytics, reviews } from "@/lib/mock-data";

export const Route = createFileRoute("/doctor/analytics")({ component: DoctorAnalytics });

function DoctorAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={DollarSign} label="Revenue (May)" value="€7,240" delta="+18%" />
        <Stat icon={Users} label="New patients" value="32" delta="+12%" />
        <Stat icon={TrendingUp} label="Booking rate" value="89%" delta="+4%" />
        <Stat icon={Star} label="Average rating" value="4.9" delta="+0.1" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Monthly revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.monthlyRevenue}>
              <defs>
                <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fill="url(#r)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Weekly appointments</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.weeklyAppointments}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent reviews</h3>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{r.patient}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />)}
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* unused import elision */}
      <span className="hidden"><LineChart data={[]} /></span>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-primary" /></div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-success mt-1">{delta} vs last period</p>
    </Card>
  );
}
