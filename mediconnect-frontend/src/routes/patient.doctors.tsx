import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Star, MapPin, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDoctors } from "@/hooks/useDoctors";

export const Route = createFileRoute("/patient/doctors")({ component: FindDoctors });

function FindDoctors() {
  const { data: apiDoctors, isLoading } = useDoctors();
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("all");
  const [city, setCity] = useState("all");

  const mappedDoctors = useMemo(() => {
    if (!apiDoctors) return [];
    return apiDoctors.map(d => ({
      id: d.id,
      name: d.user?.fullName || "Doctor",
      specialty: d.specialty || "General",
      city: d.city || "Unknown",
      price: d.consultationFee || 50,
      experience: d.yearsOfExperience || 0,
      avatar: `https://i.pravatar.cc/150?u=${d.id}`, // Placeholder avatar
      verified: true,
      rating: 5.0,
      reviews: 0,
      languages: ["English"],
      nextSlot: "Tomorrow",
    }));
  }, [apiDoctors]);

  const specs = Array.from(new Set(mappedDoctors.map((d) => d.specialty)));
  const cities = Array.from(new Set(mappedDoctors.map((d) => d.city)));

  const filtered = useMemo(() => mappedDoctors.filter((d) =>
    (spec === "all" || d.specialty === spec) &&
    (city === "all" || d.city === city) &&
    (q === "" || d.name.toLowerCase().includes(q.toLowerCase()) || d.specialty.toLowerCase().includes(q.toLowerCase()))
  ), [q, spec, city, mappedDoctors]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading doctors...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Find your doctor</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} verified specialists available</p>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 flex items-center gap-2 px-3 h-10 rounded-lg border bg-background">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or specialty..." className="border-0 focus-visible:ring-0 bg-transparent px-0" />
        </div>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All specialties</SelectItem>
            {specs.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon"><SlidersHorizontal className="h-4 w-4" /></Button>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No doctors found matching your criteria.
          </div>
        )}
        {filtered.map((d) => (
          <Link key={d.id} to="/patient/doctors/$id" params={{ id: d.id }}>
            <Card className="p-5 h-full hover:shadow-elegant hover:border-primary/40 transition group">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16"><AvatarImage src={d.avatar} /><AvatarFallback>{d.name[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold truncate">{d.name}</p>
                    {d.verified && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{d.specialty} · {d.experience}y experience</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{d.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({d.reviews})</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{d.city}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {d.languages.map((l) => <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>)}
              </div>
              <div className="mt-4 flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Next available</p>
                  <p className="text-xs font-medium text-success">{d.nextSlot}</p>
                </div>
                <span className="text-sm font-semibold">€{d.price}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
