import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/store/auth";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardShellProps {
  nav: NavItem[];
  children: ReactNode;
  /** patient = friendly soft, doctor = professional, admin = enterprise dark sidebar */
  variant: "patient" | "doctor" | "admin";
  title?: string;
}

export function DashboardShell({ nav, children, variant, title }: DashboardShellProps) {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const sidebarClass =
    variant === "admin"
      ? "bg-slate-950 text-slate-100 border-slate-800"
      : variant === "doctor"
        ? "bg-card border-border"
        : "bg-gradient-soft border-border";

  const activeBg =
    variant === "admin"
      ? "bg-white/10 text-white"
      : variant === "doctor"
        ? "bg-primary/10 text-primary border border-primary/20"
        : "bg-primary text-primary-foreground shadow-glow";

  const idleColor =
    variant === "admin"
      ? "text-slate-400 hover:text-white hover:bg-white/5"
      : "text-muted-foreground hover:text-foreground hover:bg-accent";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`hidden lg:flex w-64 shrink-0 flex-col border-r ${sidebarClass}`}>
        <div className={`h-16 px-5 flex items-center border-b ${variant === "admin" ? "border-slate-800" : "border-border"}`}>
          <Logo size="sm" to="/" />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {variant === "admin" && (
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Console</p>
          )}
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? activeBg : idleColor}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-destructive text-destructive-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className={`p-3 border-t ${variant === "admin" ? "border-slate-800" : "border-border"}`}>
          <div className={`rounded-xl p-3 text-xs ${variant === "admin" ? "bg-white/5 text-slate-400" : "bg-card/50 text-muted-foreground"}`}>
            <p className="font-medium mb-0.5 text-foreground/80">Need help?</p>
            <p>Contact our support team 24/7</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between border-b bg-background/80 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="lg:hidden"><Logo size="sm" /></div>
            {title && <h1 className="hidden lg:block text-lg font-semibold tracking-tight">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-accent transition">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-hero text-primary-foreground text-xs">
                      {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}><LogOut className="h-4 w-4 mr-2" />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden flex gap-1 overflow-x-auto px-3 py-2 border-b bg-background scrollbar-thin">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
