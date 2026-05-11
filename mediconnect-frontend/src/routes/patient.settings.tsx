import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/store/auth";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/patient/settings")({ component: Settings });

function Settings() {
  const user = useAuth((s) => s.user);
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20"><AvatarImage src={user?.avatar} /><AvatarFallback className="bg-gradient-hero text-primary-foreground">{user?.name?.[0]}</AvatarFallback></Avatar>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-glow"><Camera className="h-3.5 w-3.5" /></button>
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" defaultValue={user?.name ?? ""} />
              <Field label="Email" type="email" defaultValue={user?.email ?? ""} />
              <Field label="Phone" defaultValue="+33 6 12 34 56 78" />
              <Field label="Date of birth" type="date" defaultValue="1992-03-15" />
            </div>
            <div className="flex justify-end"><Button className="bg-gradient-hero border-0">Save changes</Button></div>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="p-6 space-y-4">
            <Toggle label="Appointment reminders" desc="Get notified 24h before each appointment" defaultChecked />
            <Toggle label="New messages" desc="Email notification on doctor messages" defaultChecked />
            <Toggle label="AI insights" desc="Weekly health insights from our AI" />
            <Toggle label="Marketing emails" desc="Product updates and tips" />
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card className="p-6 space-y-4">
            <Toggle label="Two-factor authentication" desc="Extra security for your account" defaultChecked />
            <Toggle label="Show profile to doctors" desc="Allow doctors to view your basic info" defaultChecked />
            <Button variant="destructive" className="mt-4">Delete my account</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="mt-1.5" {...rest} />
    </div>
  );
}
function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-border/60">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
