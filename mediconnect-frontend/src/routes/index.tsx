import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Search, Calendar, MessageSquare, Sparkles, Shield, Stethoscope,
  Star, ArrowRight, Activity, Clock, Globe2, CheckCircle2, Heart, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediConnect — Find verified doctors, book in seconds" },
      { name: "description", content: "MediConnect is the premium healthcare platform connecting patients with verified doctors. Book appointments, chat securely, and access AI medical assistance." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Search, title: "Find verified doctors", desc: "Browse 10,000+ vetted specialists by specialty, city, language and rating.", color: "from-sky-500 to-cyan-400" },
  { icon: Calendar, title: "Book in 30 seconds", desc: "Real-time availability with instant confirmation. No phone calls, no waiting.", color: "from-cyan-500 to-teal-400" },
  { icon: MessageSquare, title: "Secure messaging", desc: "End-to-end encrypted chat with your care team. Share files and follow up easily.", color: "from-teal-500 to-emerald-400" },
  { icon: Sparkles, title: "AI medical assistant", desc: "Get instant general information about symptoms, medications and wellness.", color: "from-violet-500 to-fuchsia-400" },
  { icon: Shield, title: "Verified credentials", desc: "Every doctor is manually reviewed by our medical board for your safety.", color: "from-blue-500 to-indigo-400" },
  { icon: Activity, title: "Health timeline", desc: "All your appointments, prescriptions and notes in one place, forever.", color: "from-rose-500 to-orange-400" },
];

const steps = [
  { n: "01", title: "Search & discover", desc: "Find the right specialist by symptom, specialty or location." },
  { n: "02", title: "Book instantly", desc: "Pick a slot that works for you — video or in-person." },
  { n: "03", title: "Meet & follow-up", desc: "Consult, message securely and access your full health record." },
];

const stats = [
  { value: "10K+", label: "Verified doctors" },
  { value: "1.2M", label: "Patients served" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "32", label: "Countries" },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Patient · London", text: "Booked a cardiologist in 30 seconds and had my appointment within 24 hours. The chat follow-up is a game changer.", avatar: "https://i.pravatar.cc/100?img=49" },
  { name: "Dr. James Carter", role: "Cardiologist · Paris", text: "MediConnect lets me focus on my patients. The scheduling and verification are flawless.", avatar: "https://i.pravatar.cc/100?img=12" },
  { name: "Marcus Lee", role: "Patient · Berlin", text: "The AI assistant helped me understand my symptoms before my consult. Incredibly reassuring.", avatar: "https://i.pravatar.cc/100?img=51" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-80 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-5 px-3 py-1 glass">
              <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
              AI-powered healthcare, redefined
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Your health,<br />
              <span className="text-gradient">beautifully connected.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Find verified doctors, book appointments instantly, and access secure medical care from anywhere. The premium healthcare platform you deserve.
            </p>

            <div className="mt-8 glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-xl shadow-elegant">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input placeholder="Search by specialty, doctor or condition..." className="border-0 bg-transparent focus-visible:ring-0 px-0" />
              </div>
              <Link to="/register">
                <Button size="lg" className="bg-gradient-hero shadow-glow border-0 w-full sm:w-auto">
                  Find a doctor <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> No credit card</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> HIPAA compliant</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 24/7 support</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative h-[520px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-3xl" />
            <FloatingCard className="absolute top-0 right-8 w-72" delay={0}>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarImage src="https://i.pravatar.cc/100?img=12" /><AvatarFallback>EB</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-sm">Dr. Emma Bennett</p>
                  <p className="text-xs text-muted-foreground">Cardiology · 12y exp</p>
                </div>
                <Badge className="ml-auto bg-success text-success-foreground">Online</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 4.9
                <span className="text-muted-foreground">· 248 reviews</span>
              </div>
              <Button size="sm" className="w-full mt-3 bg-gradient-hero border-0">Book — Today 14:30</Button>
            </FloatingCard>

            <FloatingCard className="absolute top-44 left-0 w-64" delay={0.3}>
              <div className="flex items-center gap-2 text-xs font-medium text-success">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" /> Appointment confirmed
              </div>
              <p className="mt-2 font-semibold text-sm">Video consult · Tomorrow</p>
              <p className="text-xs text-muted-foreground">10:30 — Dr. Reyes</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">Reschedule</Button>
                <Button size="sm" className="flex-1">Join</Button>
              </div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-12 right-0 w-72" delay={0.6}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold">AI Assistant</p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Based on your symptoms, I recommend consulting a <span className="text-foreground font-medium">cardiologist</span> for an evaluation.
              </p>
            </FloatingCard>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-gradient">{s.value}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Everything you need for modern care</h2>
            <p className="mt-4 text-muted-foreground">Built for patients and clinicians who refuse to settle.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="p-6 h-full hover:shadow-elegant transition-all group border-border/60">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> AI Assistant</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">A medical co-pilot in your pocket.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ask anything — from symptom triage to medication interactions. Our AI provides general medical information instantly, then helps you connect with the right specialist.
            </p>
            <div className="mt-6 space-y-3">
              {["24/7 availability", "Multilingual support", "Connects you to a real doctor when needed"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                </div>
              ))}
            </div>
            <Link to="/register"><Button size="lg" className="mt-8 bg-gradient-hero border-0 shadow-glow">Try the assistant</Button></Link>
          </div>
          <Card className="p-6 glass-strong shadow-elegant">
            <div className="space-y-3">
              <ChatBubble side="me">I've had headaches for 3 days, what could it be?</ChatBubble>
              <ChatBubble side="ai">
                Headaches lasting several days can have many causes — tension, dehydration, sleep disruption or migraines. I'd suggest tracking when they occur and trying to rest. If they intensify or come with fever, please consult a doctor.
                <p className="mt-2 text-[10px] text-muted-foreground italic">These informations sont à caractère général uniquement. Consultez votre médecin pour un avis médical.</p>
              </ChatBubble>
              <ChatBubble side="me">Can you find me a neurologist?</ChatBubble>
              <ChatBubble side="ai">Of course — here are 3 verified neurologists available this week.</ChatBubble>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3">How it works</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Care in three simple steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <Card key={s.n} className="p-8 relative overflow-hidden border-border/60">
                <span className="absolute -top-3 -right-3 text-7xl font-bold text-muted/40 select-none">{s.n}</span>
                <Stethoscope className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-3">Loved by 1.2M patients</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Real stories, real care</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 border-border/60">
                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden bg-gradient-hero text-primary-foreground p-12 lg:p-16 text-center border-0 shadow-elegant relative">
            <Heart className="absolute top-6 left-6 h-6 w-6 opacity-30" />
            <Brain className="absolute bottom-6 right-6 h-6 w-6 opacity-30" />
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Ready to take charge of your health?</h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">Join MediConnect today and discover what modern healthcare feels like.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register"><Button size="lg" variant="secondary" className="shadow-elegant">Create free account</Button></Link>
              <Link to="/doctor-apply"><Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">Apply as doctor</Button></Link>
            </div>
          </Card>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function FloatingCard({ children, className, delay }: { children: React.ReactNode; className?: string; delay: number }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`glass-strong rounded-2xl p-4 shadow-elegant ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ChatBubble({ side, children }: { side: "me" | "ai"; children: React.ReactNode }) {
  if (side === "me") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center shrink-0">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] text-sm">{children}</div>
    </div>
  );
}

// Suppress unused import warnings on icons used implicitly
void Clock; void Globe2;
