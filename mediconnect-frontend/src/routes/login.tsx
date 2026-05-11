import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, User, Stethoscope, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormData = z.infer<typeof schema>;

function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const loginAs = useAuth((s) => s.loginAs);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { email: "", password: "" }
  });

  const setUser = useAuth((s) => s.setUser);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await import("@/lib/api").then(m => m.fetchApi<any>("/Auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }));
      
      setUser({
        id: res.id,
        name: res.fullName,
        email: res.email,
        role: res.role,
      }, res.token);
      
      toast.success("Welcome back!");
      navigate({ to: res.role === "doctor" ? "/doctor" : res.role === "admin" ? "/admin" : "/patient" });
    } catch (e: any) {
      toast.error(e.message || "Invalid email or password");
    }
  };

  const quickLogin = (role: "patient" | "doctor" | "admin") => {
    toast.error("Demo login disabled. Please register.");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your MediConnect account"
      footer={<>Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <Mail className="h-4 w-4 text-muted-foreground" />
          <Input {...register("email")} type="email" placeholder="you@email.com" className="border-0 focus-visible:ring-0 bg-transparent" />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Lock className="h-4 w-4 text-muted-foreground" />
          <Input {...register("password")} type="password" placeholder="••••••••" className="border-0 focus-visible:ring-0 bg-transparent" />
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="rounded" /> Remember me</label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-hero border-0 shadow-glow">
          {isSubmitting ? "Signing in..." : <>Sign in <ArrowRight className="h-4 w-4 ml-1" /></>}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex-1 h-px bg-border" /> Try a demo <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <DemoBtn icon={User} label="Patient" onClick={() => quickLogin("patient")} />
        <DemoBtn icon={Stethoscope} label="Doctor" onClick={() => quickLogin("doctor")} />
        <DemoBtn icon={ShieldCheck} label="Admin" onClick={() => quickLogin("admin")} />
      </div>
    </AuthLayout>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="mt-1.5 flex items-center gap-2 px-3 h-11 rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-ring transition">
        {children}
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function DemoBtn({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1 py-3 rounded-lg border hover:border-primary hover:bg-accent transition group">
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
