import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, MapPin, Languages, Calendar, MessageSquare, CheckCircle2, Award, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doctors, reviews } from "@/lib/mock-data";

import React from "react";
import { useDoctors } from "@/hooks/useDoctors";

export const Route = createFileRoute("/patient/doctors/$id")({ component: DoctorDetails });

function DoctorDetails() {
  const { id } = useParams({ from: "/patient/doctors/$id" });
  const { data: apiDoctors, isLoading } = useDoctors();
  
  const d = React.useMemo(() => {
    if (!apiDoctors) return null;
    const found = apiDoctors.find((x) => x.id === id);
    if (!found) return null;
    return {
      id: found.id,
      name: found.user?.fullName || "Doctor",
      specialty: found.specialty,
      city: found.city,
      price: found.consultationFee,
      experience: found.yearsOfExperience,
      bio: found.bio,
      avatar: `https://i.pravatar.cc/150?u=${found.id}`,
      rating: 5.0,
      reviews: 0,
      verified: true,
      languages: ["English"],
    };
  }, [apiDoctors, id]);

  const slots = ["09:00", "09:30", "11:00", "11:30", "14:00", "14:30", "16:00", "16:30"];

  if (isLoading || !d) {
    return <div className="p-8 text-center text-muted-foreground">Loading doctor details...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="relative flex flex-col md:flex-row gap-6">
          <Avatar className="h-28 w-28 shadow-elegant"><AvatarImage src={d.avatar} /><AvatarFallback>{d.name[3]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{d.name}</h1>
              {d.verified && <Badge className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>}
            </div>
            <p className="text-muted-foreground">{d.specialty} · {d.experience} years experience</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {d.rating.toFixed(1)} ({d.reviews} reviews)</span>
              <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {d.city}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Languages className="h-4 w-4" /> {d.languages.join(", ")}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/patient/book/$id" params={{ id: d.id }}>
              <Button className="w-full bg-gradient-hero border-0 shadow-glow"><Calendar className="h-4 w-4 mr-1" /> Book — €{d.price}</Button>
            </Link>
            <Link to="/patient/messages"><Button variant="outline" className="w-full"><MessageSquare className="h-4 w-4 mr-1" /> Message</Button></Link>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="awards">Credentials</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <Card className="p-6">
                <h3 className="font-semibold mb-3">About {d.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.bio}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Specializing in {d.specialty.toLowerCase()}, {d.name.split(" ")[1]} combines years of clinical excellence with a warm, patient-centered approach.
                </p>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-3">
                {reviews.map((r) => (
                  <Card key={r.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{r.patient}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                    <div className="flex gap-0.5 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-sm mt-2">{r.text}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="awards">
              <Card className="p-6 space-y-3">
                {[
                  "Board certified in " + d.specialty,
                  "MD, Université Paris-Sorbonne",
                  "Member of European Medical Society",
                  "10+ years of clinical research experience",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-3"><Award className="h-4 w-4 text-primary" /><span className="text-sm">{t}</span></div>
                ))}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Available today</h3>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {slots.map((s) => (
              <Link key={s} to="/patient/book/$id" params={{ id: d.id }}>
                <button className="w-full px-3 py-2 rounded-lg border text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition">{s}</button>
              </Link>
            ))}
          </div>
          <Link to="/patient/book/$id" params={{ id: d.id }}>
            <Button className="w-full mt-4 bg-gradient-hero border-0">See more slots</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
