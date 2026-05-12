import { Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

export function Logo({ size = "md", to = "/" }: { size?: "sm" | "md" | "lg"; to?: string }) {
  const sz = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const txt = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className={`${sz} rounded-xl bg-gradient-hero shadow-glow grid place-items-center text-primary-foreground transition-transform group-hover:scale-105`}>
        <Stethoscope className="h-1/2 w-1/2" strokeWidth={2.5} />
      </div>
      <span className={`${txt} font-bold tracking-tight`}>
        Medi<span className="text-gradient">Connect</span>
      </span>
    </Link>
  );
}
