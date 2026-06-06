import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Search, Calendar, MessageSquare, Sparkles, Settings } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
  useAuthGuard("patient");
  return <DashboardShell nav={nav} variant="patient"><Outlet /></DashboardShell>;
}
