import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chatThreads, messages as initialMsgs } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/messages")({ component: Messages });

function Messages() {
  const [active, setActive] = useState(chatThreads[0]);
  const [msgs, setMsgs] = useState(initialMsgs);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "me", text, time: "now" }]);
    setText("");
  };

  return (
    <Card className="overflow-hidden h-[calc(100vh-12rem)] grid grid-cols-1 md:grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <aside className="border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-muted">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="border-0 bg-transparent focus-visible:ring-0 h-8 px-0" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {chatThreads.map((t) => (
            <button key={t.id} onClick={() => setActive(t)} className={`w-full p-3 flex gap-3 items-center text-left hover:bg-accent transition border-b ${active.id === t.id ? "bg-accent" : ""}`}>
              <div className="relative">
                <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                {t.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate">{t.name}</p>
                  <span className="text-[10px] text-muted-foreground">{t.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
              </div>
              {t.unread > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">{t.unread}</span>}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex flex-col min-w-0">
        <header className="p-4 border-b flex items-center gap-3">
          <Avatar><AvatarImage src={active.avatar} /><AvatarFallback>{active.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{active.name}</p>
            <p className="text-xs text-success flex items-center gap-1">{active.online && <span className="h-1.5 w-1.5 rounded-full bg-success" />}{active.online ? "Online" : "Offline"}</p>
          </div>
          <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-gradient-soft">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm"}`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 flex items-center gap-1 ${m.from === "me" ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"}`}>
                  {m.time} {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                </p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 items-center text-xs text-muted-foreground"><span className="flex gap-1"><Dot /><Dot d={0.15} /><Dot d={0.3} /></span> typing...</div>
        </div>

        <footer className="p-3 border-t flex items-center gap-2">
          <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
          <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." className="flex-1" />
          <Button onClick={send} className="bg-gradient-hero border-0"><Send className="h-4 w-4" /></Button>
        </footer>
      </section>
    </Card>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${d}s` }} />;
}
