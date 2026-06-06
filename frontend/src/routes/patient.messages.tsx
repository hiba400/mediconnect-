import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical, CheckCheck, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/store/auth";
import { useDoctors, useMonolithDoctors } from "@/hooks/useDoctors";
import { normalizeDoctor } from "@/lib/doctors";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/messages")({ component: Messages });

function Messages() {
  const user = useAuth((s) => s.user);
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    notifyTyping,
    initiateConversation,
    reloadConversations,
    isTyping,
    loading,
    error,
    hubConnected,
  } = useChat();
  const { data: doctors } = useDoctors();
  const { data: monolithDoctors } = useMonolithDoctors();
  const [text, setText] = useState("");

  const doctorsToMessage = React.useMemo(() => {
    if (doctors?.length) {
      return doctors.map((d) => normalizeDoctor(d)).filter((d) => d.userId);
    }
    return (monolithDoctors ?? []).map((d) => ({
      id: d.id,
      userId: d.id,
      name: d.fullName,
      specialty: "Doctor",
      city: "",
      price: 0,
      experience: 0,
      bio: "",
      avatar: `https://i.pravatar.cc/150?u=${d.id}`,
    }));
  }, [doctors, monolithDoctors]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      await sendMessage(text);
      setText("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const startWithDoctor = async (doctorUserId: string) => {
    const conv = await initiateConversation(doctorUserId);
    if (conv) toast.success("Conversation started");
    else toast.error("Could not start conversation");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading conversations...</p>
      </div>
    );
  }

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
          {error && (
            <div className="p-4 m-2 rounded-lg bg-destructive/10 text-destructive text-xs">
              <p className="font-medium">Cannot load messages</p>
              <p className="mt-1">{error}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => reloadConversations()}>
                Retry
              </Button>
            </div>
          )}
          {conversations.length === 0 && !error ? (
            <div className="p-4 space-y-3">
              <p className="text-center text-xs text-muted-foreground">No conversations yet</p>
              <p className="text-center text-[10px] text-muted-foreground">
                Start a chat with a doctor, or confirm an appointment first.
              </p>
              {doctorsToMessage.slice(0, 5).map((doc) => (
                <Button
                  key={doc.userId}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => startWithDoctor(doc.userId)}
                >
                  Message {doc.name}
                </Button>
              ))}
            </div>
          ) : (
            conversations.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveConversation(t)}
                className={`w-full p-3 flex gap-3 items-center text-left hover:bg-accent transition border-b ${
                  activeConversation?.id === t.id ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={t.participantAvatar} />
                    <AvatarFallback>{t.participantName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  {t.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm truncate">{t.participantName}</p>
                    <span className="text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
                </div>
                {t.unread ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                    {t.unread}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex flex-col min-w-0">
        {activeConversation ? (
          <>
            <header className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={activeConversation.participantAvatar} />
                <AvatarFallback>{activeConversation.participantName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{activeConversation.participantName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {hubConnected ? "Connected · real-time" : "REST mode (hub reconnecting…)"}
                </p>
              </div>
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 bg-gradient-soft">
              {messages.map((m) => {
                const isMe = m.senderId?.toLowerCase() === user?.id?.toLowerCase();
                const formattedTime = new Date(m.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border rounded-bl-sm"
                      }`}
                    >
                      <p>{m.content}</p>
                      <p
                        className={`text-[10px] mt-1 flex items-center gap-1 ${
                          isMe ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                        }`}
                      >
                        {formattedTime} {isMe && m.isRead && <CheckCheck className="h-3 w-3" />}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <span className="flex gap-1">
                    <Dot />
                    <Dot d={0.15} />
                    <Dot d={0.3} />
                  </span>{" "}
                  typing...
                </div>
              )}
            </div>

            <footer className="p-3 border-t flex items-center gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  notifyTyping();
                }}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={send} className="bg-gradient-hero border-0">
                <Send className="h-4 w-4" />
              </Button>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
            <Loader2 className="h-10 w-10 text-muted-foreground/30 mb-2" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </section>
    </Card>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
      style={{ animationDelay: `${d}s` }}
    />
  );
}
