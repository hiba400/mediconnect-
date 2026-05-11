import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/verify-email")({ component: VerifyEmail });

function VerifyEmail() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-mesh px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="glass-strong rounded-3xl p-10 max-w-md w-full text-center shadow-elegant">
        <div className="flex justify-center mb-6"><Logo /></div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="h-20 w-20 rounded-full bg-success/10 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">You're all set!</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your email has been verified successfully. We've received your information and will keep you posted.</p>
        <Link to="/login"><Button className="mt-7 bg-gradient-hero border-0 shadow-glow">Continue to sign in <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
      </motion.div>
    </div>
  );
}
