import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/store/auth";
import { registerAccount } from "@/lib/auth-session";
import {
  clearDoctorApplyPending,
  readDoctorApplyPending,
} from "@/lib/doctor-apply-pending";
import { toast } from "sonner";

const searchSchema = z.object({
  flow: z.enum(["doctor", "patient"]).optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: searchSchema,
  component: VerifyEmail,
});

function dashboardForRole(role: "patient" | "doctor" | "admin") {
  return role === "doctor" ? "/doctor" : role === "admin" ? "/admin" : "/patient";
}

function VerifyEmail() {
  const navigate = useNavigate();
  const { flow } = Route.useSearch();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: dashboardForRole(user.role), replace: true });
    }
  }, [user, navigate]);

  const isDoctorFlow = flow === "doctor" || !!readDoctorApplyPending();

  useEffect(() => {
    if (user) return;

    const pending = readDoctorApplyPending();
    if (!pending) return;

    let cancelled = false;
    (async () => {
      setFinishing(true);
      try {
        const { user: authUser, token } = await registerAccount({
          fullName: pending.fullName,
          email: pending.email,
          password: pending.password,
          role: 1,
        });
        if (cancelled) return;
        clearDoctorApplyPending();
        setUser(authUser, token);
        toast.success("Account ready — welcome!");
        navigate({ to: "/doctor", replace: true });
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Could not finish sign-in";
        toast.error(message);
      } finally {
        if (!cancelled) setFinishing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, setUser, navigate]);
  const title = isDoctorFlow ? "Application received!" : "You're all set!";
  const description = isDoctorFlow
    ? finishing
      ? "Creating your account and signing you in..."
      : "Your doctor account is ready. You'll be redirected to your dashboard."
    : "Your email has been verified successfully. We've received your information and will keep you posted.";

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-mesh px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-3xl p-10 max-w-md w-full text-center shadow-elegant"
      >
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="h-20 w-20 rounded-full bg-success/10 grid place-items-center mx-auto mb-6"
        >
          {finishing ? (
            <Loader2 className="h-10 w-10 text-success animate-spin" />
          ) : (
            <CheckCircle2 className="h-10 w-10 text-success" />
          )}
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>

        {!finishing && (
          <div className="mt-7 flex flex-col gap-2">
            {isDoctorFlow ? (
              <Link to="/doctor">
                <Button className="w-full bg-gradient-hero border-0 shadow-glow">
                  Go to doctor dashboard <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ) : null}
            <Link to="/login">
              <Button
                variant={isDoctorFlow ? "outline" : "default"}
                className={isDoctorFlow ? "w-full" : "w-full bg-gradient-hero border-0 shadow-glow"}
              >
                {isDoctorFlow ? "Sign in manually" : <>Continue to sign in <ArrowRight className="h-4 w-4 ml-1" /></>}
              </Button>
            </Link>
            {isDoctorFlow && (
              <Link to="/doctor-apply" className="text-xs text-muted-foreground hover:text-primary">
                Submit a new application
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
