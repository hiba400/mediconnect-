import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, AlertTriangle, Plus, MessageSquare, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiSuggestions } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { sendAiChat, type ChatMessage } from "@/hooks/useAiChat";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/assistant")({ component: AIAssistant });

interface Msg { id: number; from: "me" | "ai"; text: string }

function AIAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: "ai", text: "Hi! I'm your MediConnect AI assistant. Ask me anything about symptoms, medications or wellness. How can I help today?" },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (q: string) => {
    if (!q.trim() || loading) return;
    const userMsg = { id: Date.now(), from: "me" as const, text: q };
    setMsgs((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    const history: ChatMessage[] = msgs
      .filter((m) => m.id !== 1)
      .map((m) => ({
        role: m.from === "me" ? "human" : "ai",
        content: m.text,
      }));

    try {
      const res = await sendAiChat(q, history);
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "ai", text: res.answer }]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "AI service unavailable";
      toast.error(message);
      setMsgs((m) => [
        ...m,
        {
          id: Date.now() + 1,
          from: "ai",
          text: "Sorry, I could not reach the AI service right now. Please try again later or consult a doctor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-12rem)]">
      <aside className="space-y-2 hidden lg:block">
        <Button className="w-full bg-gradient-hero border-0 shadow-glow" onClick={() => setMsgs([msgs[0]])}>
          <Plus className="h-4 w-4 mr-1" /> New conversation
        </Button>
        <Card className="p-3 mt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Recent</p>
          {["Headache symptoms", "Sleep quality tips", "Allergy management"].map((t) => (
            <button key={t} onClick={() => ask(t)} className="w-full text-left text-sm py-2 px-2 rounded-lg hover:bg-accent flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> {t}
            </button>
          ))}
        </Card>
      </aside>

      <Card className="flex flex-col overflow-hidden">
        <div className="p-3 bg-warning/10 border-b border-warning/20 flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <p>These informations sont à caractère général uniquement. Consultez votre médecin pour un avis médical.</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4 bg-gradient-soft">
          {msgs.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.from === "me" ? "justify-end" : ""}`}>
              {m.from === "ai" && (
                <div className="h-9 w-9 rounded-xl bg-gradient-hero grid place-items-center shrink-0 shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.from === "me" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border rounded-tl-sm shadow-soft"}`}>
                {m.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          )}

          {msgs.length === 1 && !loading && (
            <div className="pt-6">
              <p className="text-xs text-muted-foreground mb-3 font-medium">Try asking:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {aiSuggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="text-left p-3 rounded-xl border bg-card hover:border-primary hover:shadow-soft transition text-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(text)}
            placeholder="Ask anything about your health..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={() => ask(text)} disabled={loading} className="bg-gradient-hero border-0 shadow-glow">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
