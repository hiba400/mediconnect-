import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, CalendarDays, Users, MessageCircle, BarChart3, UserCircle } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/doctor")({ component: DoctorLayout });

const nav: NavItem[] = [
  { label: "Overview", to: "/doctor", icon: LayoutDashboard },
  { label: "Calendar", to: "/doctor/calendar", icon: CalendarDays },
  { label: "Appointments", to: "/doctor/appointments", icon: Users },
  { label: "Conversations", to: "/doctor/conversations", icon: MessageCircle, badge: 4 },
  { label: "Analytics", to: "/doctor/analytics", icon: BarChart3 },
  { label: "Profile", to: "/doctor/profile", icon: UserCircle },
];

function DoctorLayout() {
  const user = useAuth((s) => s.user);
  const loginAs = useAuth((s) => s.loginAs);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) loginAs("doctor");
    else if (user.role !== "doctor") navigate({ to: user.role === "admin" ? "/admin" : "/patient" });
  }, [user, loginAs, navigate]);
  return <DashboardShell nav={nav} variant="doctor"><Outlet /></DashboardShell>;
}
