import React, { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import { usePatientAppointments } from "@/hooks/useAppointments";

export const Route = createFileRoute("/patient/appointments")({ component: Appointments });

function Appointments() {
  const user = useAuth((s) => s.user);
  const { data: apiAppointments, isLoading } = usePatientAppointments(user?.id);

  const appointments = React.useMemo(() => {
    if (!apiAppointments) return [];
    return apiAppointments.map((a: any) => ({
      id: a.id,
      doctorName: a.doctor?.user?.fullName || "Doctor",
      doctorSpecialty: a.doctor?.specialty || "Specialist",
      reason: a.reason,
      date: new Date(a.appointmentDate).toLocaleDateString(),
      time: new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "video", // Default mock mapping
      status: a.status === 0 ? "pending" : a.status === 1 ? "upcoming" : "completed",
    }));
  }, [apiAppointments]);

  const upcomingAppointments = appointments.filter((a: any) => a.status === "upcoming" || a.status === "pending");
  const pastAppointments = appointments.filter((a: any) => a.status === "completed" || a.status === "cancelled");

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">Your appointments</h1>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-3">
          {upcomingAppointments.length === 0 && <p className="text-muted-foreground">No upcoming appointments.</p>}
          {upcomingAppointments.map((a: any) => <ApptRow key={a.id} a={a} upcoming />)}
        </TabsContent>
        <TabsContent value="past" className="space-y-3">
          {pastAppointments.length === 0 && <p className="text-muted-foreground">No past appointments.</p>}
          {pastAppointments.map((a: any) => <ApptRow key={a.id} a={a} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApptRow({ a, upcoming }: { a: Appointment; upcoming?: boolean }) {
  const tone = a.status === "upcoming" ? "bg-success/10 text-success" : a.status === "pending" ? "bg-warning/10 text-warning-foreground" : "bg-muted text-muted-foreground";
  return (
    <Card className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <Avatar className="h-12 w-12"><AvatarImage src="https://i.pravatar.cc/100?img=12" /><AvatarFallback>{a.doctorName[4]}</AvatarFallback></Avatar>
      <div className="flex-1">
        <p className="font-semibold">{a.doctorName}</p>
        <p className="text-sm text-muted-foreground">{a.doctorSpecialty}{a.reason ? ` · ${a.reason}` : ""}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.time}</span>
          <span className="flex items-center gap-1">{a.type === "video" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {a.type}</span>
        </div>
      </div>
      <Badge className={tone + " border-0 capitalize"}>{a.status}</Badge>
      {upcoming ? (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Reschedule</Button>
          <Button size="sm" className="bg-gradient-hero border-0">Join</Button>
        </div>
      ) : (
        <Button variant="outline" size="sm">View notes</Button>
      )}
    </Card>
  );
}
