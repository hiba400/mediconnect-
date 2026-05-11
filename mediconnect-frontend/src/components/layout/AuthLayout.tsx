import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ShieldCheck, Sparkles, Stethoscope } from "lucide-react";

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle?: string; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col px-6 lg:px-12 py-8">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md py-10">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="h-3 w-3" /> Trusted by 1.2M patients
          </div>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">The premium way to access healthcare.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-md">Verified doctors, instant booking, secure messaging and an AI assistant — all in one beautifully crafted platform.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Feature icon={ShieldCheck} title="Bank-grade security" desc="HIPAA & GDPR compliant" />
            <Feature icon={Stethoscope} title="10K+ verified doctors" desc="Across 32 countries" />
          </div>
        </div>
        <div className="relative text-xs text-primary-foreground/70">© 2026 MediConnect</div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <Icon className="h-5 w-5 mb-2" />
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-primary-foreground/80">{desc}</p>
    </div>
  );
}
