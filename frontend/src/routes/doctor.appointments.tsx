import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Video, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { doctorAppointments } from "@/lib/mock-data";

export const Route = createFileRoute("/doctor/appointments")({ component: DoctorAppointments });

function DoctorAppointments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments management</h1>
          <p className="text-sm text-muted-foreground">{doctorAppointments.length} total · {doctorAppointments.filter(a => a.status === "pending").length} pending</p>
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border bg-background w-72">
          <Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search patient..." className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0" />
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date / Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctorAppointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{a.patientName[0]}</AvatarFallback></Avatar>
                    <span className="font-medium text-sm">{a.patientName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{a.date} · {a.time}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">{a.type === "video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{a.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.reason ?? "—"}</TableCell>
                <TableCell>
                  <Badge className={
                    a.status === "upcoming" ? "bg-success/15 text-success border-0" :
                    a.status === "pending" ? "bg-warning/15 text-warning-foreground border-0" :
                    "bg-muted text-muted-foreground border-0"
                  }>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {a.status === "pending" ? (
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Check className="h-3.5 w-3.5 text-success" /></Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0"><X className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">Open</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
