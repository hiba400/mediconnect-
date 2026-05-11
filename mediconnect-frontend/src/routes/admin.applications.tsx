import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Eye, FileText, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { applications } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({ component: Applications });

function Applications() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const filtered = applications.filter((a) => filter === "all" || a.status === filter);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Doctor applications</h1>
        <p className="text-sm text-muted-foreground">Review and approve doctor applications</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex border rounded-lg overflow-hidden">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border bg-background ml-auto w-72">
          <Search className="h-4 w-4 text-muted-foreground" /><Input placeholder="Search applications..." className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0" />
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead><TableHead>Specialty</TableHead><TableHead>City</TableHead>
              <TableHead>Experience</TableHead><TableHead>Submitted</TableHead><TableHead>Documents</TableHead>
              <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{a.name[4]}</AvatarFallback></Avatar><div><p className="font-medium text-sm">{a.name}</p><p className="text-xs text-muted-foreground">{a.email}</p></div></div></TableCell>
                <TableCell className="text-sm">{a.specialty}</TableCell>
                <TableCell className="text-sm">{a.city}</TableCell>
                <TableCell className="text-sm">{a.experience}y</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.submittedAt}</TableCell>
                <TableCell><Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" />{a.documents}</Badge></TableCell>
                <TableCell>
                  <Badge className={a.status === "approved" ? "bg-success/15 text-success border-0" : a.status === "rejected" ? "bg-destructive/15 text-destructive border-0" : "bg-warning/15 text-warning-foreground border-0"}>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Dialog>
                      <DialogTrigger asChild><Button size="sm" variant="outline" className="h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>{a.name}</DialogTitle></DialogHeader>
                        <div className="space-y-2 text-sm">
                          <Row label="Specialty" value={a.specialty} />
                          <Row label="Email" value={a.email} />
                          <Row label="City" value={a.city} />
                          <Row label="Experience" value={`${a.experience} years`} />
                          <Row label="Documents" value={`${a.documents} uploaded`} />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Button onClick={() => toast.success("Application approved")} className="flex-1 bg-gradient-hero border-0"><Check className="h-4 w-4 mr-1" /> Approve</Button>
                          <Button onClick={() => toast.error("Application rejected")} variant="outline" className="flex-1"><X className="h-4 w-4 mr-1" /> Reject</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {a.status === "pending" && <>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => toast.success("Approved")}><Check className="h-3.5 w-3.5 text-success" /></Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => toast.error("Rejected")}><X className="h-3.5 w-3.5 text-destructive" /></Button>
                    </>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b last:border-0 border-border/60 py-1.5"><span className="text-muted-foreground text-xs">{label}</span><span className="font-medium">{value}</span></div>;
}
