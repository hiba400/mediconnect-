import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin settings</h1>
      <Card className="p-6 space-y-5">
        <h3 className="font-semibold">Platform configuration</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label className="text-xs text-muted-foreground">Platform name</Label><Input className="mt-1.5" defaultValue="MediConnect" /></div>
          <div><Label className="text-xs text-muted-foreground">Support email</Label><Input className="mt-1.5" defaultValue="support@mediconnect.com" /></div>
          <div><Label className="text-xs text-muted-foreground">Default currency</Label><Input className="mt-1.5" defaultValue="EUR" /></div>
          <div><Label className="text-xs text-muted-foreground">Commission rate (%)</Label><Input className="mt-1.5" type="number" defaultValue="8" /></div>
        </div>
      </Card>
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Moderation</h3>
        <Toggle label="Auto-approve verified credentials" desc="Skip manual review for IDs from accredited registries" />
        <Toggle label="Require review for new doctors" desc="All new doctors require admin approval" defaultChecked />
        <Toggle label="Enable AI assistant globally" desc="Make AI medical assistant available to all patients" defaultChecked />
        <Toggle label="Maintenance mode" desc="Temporarily disable patient access" />
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-hero border-0">Save changes</Button>
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/60">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
