import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Send, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { doctorChatThreads } from "@/lib/mock-data";

export const Route = createFileRoute("/doctor/conversations")({ component: DoctorConversations });

function DoctorConversations() {
  const [active, setActive] = useState(doctorChatThreads[0]);
  return (
    <Card className="overflow-hidden h-[calc(100vh-12rem)] grid grid-cols-1 md:grid-cols-[320px_1fr]">
      <aside className="border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Patient conversations</h2>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-muted">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {doctorChatThreads.map((t) => (
            <button key={t.id} onClick={() => setActive(t)} className={`w-full p-3 flex gap-3 items-center text-left hover:bg-accent transition border-b ${active.id === t.id ? "bg-accent" : ""}`}>
              <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between"><p className="font-medium text-sm truncate">{t.name}</p><span className="text-[10px] text-muted-foreground">{t.time}</span></div>
                <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
              </div>
              {t.unread > 0 && <Badge className="text-[10px] bg-primary">{t.unread}</Badge>}
            </button>
          ))}
        </div>
      </aside>
      <section className="flex flex-col min-w-0">
        <header className="p-4 border-b flex items-center gap-3">
          <Avatar><AvatarImage src={active.avatar} /><AvatarFallback>{active.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{active.name}</p>
            <p className="text-xs text-muted-foreground">Patient · Last visit Apr 21</p>
          </div>
          <Button variant="outline" size="sm">View patient file</Button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-soft">
          {[
            { me: false, t: "Hi doctor, I've been taking the medication for 5 days now." },
            { me: false, t: "I'm feeling much better but still some mild dizziness in the morning." },
            { me: true, t: "Glad to hear it. Mild dizziness can occur in the first week — it should fade." },
            { me: true, t: "Continue the dose for another week and let me know if it persists." },
            { me: false, t: "Thanks doctor, feeling much better." },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : ""}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm"}`}>{m.t}</div>
            </div>
          ))}
        </div>
        <footer className="p-3 border-t flex items-center gap-2">
          <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
          <Input placeholder="Reply to patient..." className="flex-1" />
          <Button className="bg-gradient-hero border-0"><Send className="h-4 w-4" /></Button>
        </footer>
      </section>
    </Card>
  );
}
