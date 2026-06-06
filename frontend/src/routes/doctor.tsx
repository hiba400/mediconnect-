import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Users, MessageCircle, BarChart3, UserCircle } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { useAuthGuard } from "@/hooks/useAuthGuard";

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
  useAuthGuard("doctor");
  return <DashboardShell nav={nav} variant="doctor"><Outlet /></DashboardShell>;
}
