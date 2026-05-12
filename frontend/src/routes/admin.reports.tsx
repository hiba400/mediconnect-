import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/reports")({ component: Reports });

const reports = [
  { name: "Monthly platform report — May 2026", date: "May 1", size: "2.4 MB", type: "Performance" },
  { name: "Doctor onboarding analytics", date: "Apr 28", size: "1.1 MB", type: "Onboarding" },
  { name: "Patient engagement quarterly", date: "Apr 15", size: "3.8 MB", type: "Engagement" },
  { name: "Revenue summary — Q1 2026", date: "Apr 5", size: "1.7 MB", type: "Finance" },
  { name: "Compliance & security audit", date: "Mar 30", size: "5.2 MB", type: "Compliance" },
];

function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Download platform reports and audit logs</p>
      </div>
      <div className="grid gap-3">
        {reports.map((r) => (
          <Card key={r.name} className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center"><FileText className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
            </div>
            <Badge variant="outline">{r.type}</Badge>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
