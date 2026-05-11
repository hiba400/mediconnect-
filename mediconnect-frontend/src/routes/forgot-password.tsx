import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });

function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout
      title={sent ? "Check your inbox" : "Reset your password"}
      subtitle={sent ? "We've sent a password reset link to your email." : "Enter your email and we'll send a reset link."}
      footer={<>Remembered? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></>}
    >
      {sent ? (
        <div className="rounded-xl border bg-success/5 border-success/30 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-success mx-auto" />
          <p className="mt-3 text-sm">Click the link in the email to reset your password. The link expires in 30 minutes.</p>
          <Button onClick={() => setSent(false)} variant="ghost" className="mt-4">Send again</Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Email</Label>
            <div className="mt-1.5 flex items-center gap-2 px-3 h-11 rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring/30">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input type="email" required placeholder="you@email.com" className="border-0 focus-visible:ring-0 bg-transparent" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-hero border-0 shadow-glow">Send reset link <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </form>
      )}
    </AuthLayout>
  );
}
