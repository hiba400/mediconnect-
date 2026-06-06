import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Video, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/store/auth";
import {
  appointmentStatusLabel,
  useCancelAppointment,
  useConfirmAppointment,
  useDoctorAppointments,
} from "@/hooks/useAppointments";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/appointments")({ component: DoctorAppointments });

function DoctorAppointments() {
  const user = useAuth((s) => s.user);
  const { data: apiAppointments, isLoading } = useDoctorAppointments(user?.id);
  const confirmMutation = useConfirmAppointment();
  const cancelMutation = useCancelAppointment();
  const [search, setSearch] = useState("");

  const appointments = useMemo(() => {
    if (!apiAppointments) return [];
    return apiAppointments.map((a) => ({
      id: a.id,
      patientName: a.patient?.fullName || "Patient",
      date: new Date(a.appointmentDate).toLocaleDateString(),
      time: new Date(a.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "video",
      reason: a.reason,
      status: appointmentStatusLabel[a.status] ?? "pending",
    }));
  }, [apiAppointments]);

  const filtered = appointments.filter((a) =>
    search === "" || a.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async (id: string) => {
    try {
      await confirmMutation.mutateAsync(id);
      toast.success("Appointment confirmed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to confirm");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Appointment cancelled");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments management</h1>
          <p className="text-sm text-muted-foreground">
            {appointments.length} total · {appointments.filter((a) => a.status === "pending").length} pending
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border bg-background w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0"
          />
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{a.patientName[0]}</AvatarFallback></Avatar>
                    <span className="font-medium text-sm">{a.patientName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{a.date} · {a.time}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1">
                    {a.type === "video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    {a.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.reason ?? "—"}</TableCell>
                <TableCell>
                  <Badge className={
                    a.status === "confirmed" ? "bg-success/15 text-success border-0" :
                    a.status === "pending" ? "bg-warning/15 text-warning-foreground border-0" :
                    "bg-muted text-muted-foreground border-0"
                  }>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {a.status === "pending" ? (
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleConfirm(a.id)}>
                        <Check className="h-3.5 w-3.5 text-success" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleCancel(a.id)}>
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </Button>
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
