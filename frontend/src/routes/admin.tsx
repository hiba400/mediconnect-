import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Gauge, FileCheck, Users, BarChart3, ScrollText, Settings } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const nav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: Gauge },
  { label: "Applications", to: "/admin/applications", icon: FileCheck, badge: 3 },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", to: "/admin/reports", icon: ScrollText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const user = useAuth((s) => s.user);
  const loginAs = useAuth((s) => s.loginAs);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) loginAs("admin");
    else if (user.role !== "admin") navigate({ to: user.role === "doctor" ? "/doctor" : "/patient" });
  }, [user, loginAs, navigate]);
  return <DashboardShell nav={nav} variant="admin"><Outlet /></DashboardShell>;
}
