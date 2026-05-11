import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Search, Calendar, MessageSquare, Sparkles, Settings } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/patient")({ component: PatientLayout });

const nav: NavItem[] = [
  { label: "Dashboard", to: "/patient", icon: LayoutDashboard },
  { label: "Find doctors", to: "/patient/doctors", icon: Search },
  { label: "Appointments", to: "/patient/appointments", icon: Calendar },
  { label: "Messages", to: "/patient/messages", icon: MessageSquare, badge: 2 },
  { label: "AI Assistant", to: "/patient/assistant", icon: Sparkles },
  { label: "Settings", to: "/patient/settings", icon: Settings },
];

function PatientLayout() {
  const user = useAuth((s) => s.user);
  const loginAs = useAuth((s) => s.loginAs);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) loginAs("patient");
    else if (user.role !== "patient") navigate({ to: user.role === "doctor" ? "/doctor" : "/admin" });
  }, [user, loginAs, navigate]);
  return <DashboardShell nav={nav} variant="patient"><Outlet /></DashboardShell>;
}
