import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const Route = createFileRoute("/doctor/calendar")({ component: DoctorCalendar });

const week = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];
const hours = Array.from({ length: 10 }).map((_, i) => `${(8 + i).toString().padStart(2, "0")}:00`);
const events = [
  { day: 0, hour: 1, title: "Marcus Lee", type: "video" },
  { day: 0, hour: 2, title: "Helena Ortiz", type: "in-person" },
  { day: 0, hour: 6, title: "Yuki Tanaka", type: "video" },
  { day: 1, hour: 3, title: "Omar Haddad", type: "video" },
  { day: 1, hour: 8, title: "Priya Shah", type: "in-person" },
  { day: 3, hour: 4, title: "James Holt", type: "video" },
];

function DoctorCalendar() {
  const [view, setView] = useState<"week" | "month">("week");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & availability</h1>
          <p className="text-sm text-muted-foreground">Manage your time slots and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setView("week")} className={`px-3 py-1.5 text-xs font-medium ${view === "week" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>Week</button>
            <button onClick={() => setView("month")} className={`px-3 py-1.5 text-xs font-medium ${view === "month" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>Month</button>
          </div>
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <Button className="bg-gradient-hero border-0"><Plus className="h-4 w-4 mr-1" /> Add slot</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b bg-muted/30">
          <div />
          {week.map((d) => (
            <div key={d} className="p-3 text-center border-l">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.split(" ")[0]}</p>
              <p className="font-bold">{d.split(" ")[1]}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((h, hi) => (
            <>
              <div key={`h-${h}`} className="p-2 text-[10px] text-muted-foreground text-right pr-3 border-b border-r h-20">{h}</div>
              {week.map((_, di) => {
                const ev = events.find((e) => e.day === di && e.hour === hi);
                return (
                  <div key={`${di}-${hi}`} className="border-b border-l h-20 p-1 hover:bg-accent/30 transition">
                    {ev && (
                      <div className={`h-full rounded-lg p-2 text-xs ${ev.type === "video" ? "bg-primary/15 border-l-4 border-primary" : "bg-secondary/20 border-l-4 border-secondary"}`}>
                        <p className="font-medium truncate">{ev.title}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{ev.type}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Default working hours</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["Mon-Fri", "Saturday", "Sunday", "Holidays"].map((d, i) => (
            <div key={d} className="p-3 rounded-lg border">
              <p className="text-xs font-medium">{d}</p>
              <p className="text-sm mt-1 text-muted-foreground">{i < 1 ? "08:00 — 18:00" : i === 1 ? "09:00 — 13:00" : "Closed"}</p>
              {i < 2 && <Badge variant="outline" className="mt-2 text-[10px]">Active</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
