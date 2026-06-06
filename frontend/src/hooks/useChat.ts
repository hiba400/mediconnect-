import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { fetchApi, API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/store/auth";

export interface Conversation {
  id: string;
  patientId: string;
  doctorId: string;
  createdAt: string;
  participantName?: string;
  participantAvatar?: string;
  participantRole?: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  online?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

const MESSAGING_SERVICE_URL =
  import.meta.env.VITE_MESSAGING_SERVICE_URL || API_BASE_URL;
const CHAT_HUB_URL =
  import.meta.env.VITE_CHAT_HUB_URL || "http://localhost:5197/hubs/chat";

function normId(id: string | undefined | null) {
  return (id ?? "").toLowerCase();
}

function mapConversation(raw: Record<string, unknown>): Conversation {
  return {
    id: String(raw.id ?? raw.Id ?? ""),
    patientId: String(raw.patientId ?? raw.PatientId ?? ""),
    doctorId: String(raw.doctorId ?? raw.DoctorId ?? ""),
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ""),
  };
}

function mapMessage(raw: Record<string, unknown>): Message {
  return {
    id: String(raw.id ?? raw.Id ?? ""),
    conversationId: String(raw.conversationId ?? raw.ConversationId ?? ""),
    senderId: String(raw.senderId ?? raw.SenderId ?? ""),
    content: String(raw.content ?? raw.Content ?? ""),
    sentAt: String(raw.sentAt ?? raw.SentAt ?? ""),
    isRead: Boolean(raw.isRead ?? raw.IsRead ?? false),
  };
}

export function useChat() {
  const user = useAuth((s) => s.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hubConnected, setHubConnected] = useState(false);

  const activeConversationRef = useRef<Conversation | null>(null);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const initiateConversation = useCallback(async (doctorId: string, patientId: string) => {
    const raw = await fetchApi<Record<string, unknown>>(
      "/Conversations/initiate",
      {
        method: "POST",
        body: JSON.stringify({ patientId, doctorId }),
      },
      MESSAGING_SERVICE_URL
    );
    return mapConversation(raw);
  }, []);

  const syncConversationsFromAppointments = useCallback(async () => {
    if (!user || user.role !== "patient") return;

    try {
      const appointments = await fetchApi<Array<{ doctorId: string; status: number }>>(
        `/Appointments/patient/${user.id}`
      );
      const confirmed = appointments.filter((a) => a.status === 1);
      for (const appt of confirmed) {
        try {
          await initiateConversation(appt.doctorId, user.id);
        } catch {
          /* may already exist */
        }
      }
    } catch (e) {
      console.error("Failed to sync conversations from appointments", e);
    }
  }, [user, initiateConversation]);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    const token = localStorage.getItem("mediconnect-auth-token");
    if (!token) {
      setError("Not signed in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data = await fetchApi<Record<string, unknown>[]>(
        "/Conversations",
        {},
        MESSAGING_SERVICE_URL
      );

      if (data.length === 0) {
        await syncConversationsFromAppointments();
        data = await fetchApi<Record<string, unknown>[]>(
          "/Conversations",
          {},
          MESSAGING_SERVICE_URL
        );
      }

      const mapped = data.map(mapConversation);

      const populated = await Promise.all(
        mapped.map(async (c) => {
          const participantId =
            user.role === "patient" ? c.doctorId : c.patientId;
          let name = user.role === "patient" ? "Doctor" : "Patient";
          let avatar = `https://i.pravatar.cc/150?u=${participantId}`;
          let role = user.role === "patient" ? "Doctor" : "Patient";

          try {
            const u = await fetchApi<{ fullName: string; role: string }>(
              `/Users/${participantId}`,
              {},
              API_BASE_URL
            );
            name = u.fullName;
            role = u.role;
          } catch (e) {
            console.error("Failed to fetch participant info", e);
          }

          let lastMessage = "No messages yet";
          let time = "";
          let unread = 0;
          try {
            const msgsRaw = await fetchApi<Record<string, unknown>[]>(
              `/Conversations/${c.id}/messages`,
              {},
              MESSAGING_SERVICE_URL
            );
            const msgs = msgsRaw.map(mapMessage);
            unread = msgs.filter(
              (m) => !m.isRead && normId(m.senderId) !== normId(user.id)
            ).length;
            if (msgs.length > 0) {
              const last = msgs[msgs.length - 1];
              lastMessage = last.content;
              time = new Date(last.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
          } catch (e) {
            console.error("Failed to fetch messages preview", c.id, e);
          }

          return {
            ...c,
            participantName: name,
            participantAvatar: avatar,
            participantRole: role,
            lastMessage,
            time,
            unread,
            online: false,
          };
        })
      );

      setConversations(populated);
      if (populated.length > 0 && !activeConversationRef.current) {
        setActiveConversation(populated[0]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load conversations";
      setError(msg);
      setConversations([]);
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  }, [user, syncConversationsFromAppointments, initiateConversation]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    const loadMessages = async () => {
      try {
        const data = await fetchApi<Record<string, unknown>[]>(
          `/Conversations/${activeConversation.id}/messages`,
          {},
          MESSAGING_SERVICE_URL
        );
        setMessages(data.map(mapMessage));
      } catch (e) {
        console.error("Failed to load messages", e);
      }
    };
    loadMessages();
  }, [activeConversation]);

  useEffect(() => {
    if (!connection || !activeConversation || !user || messages.length === 0) return;
    const unreadFromOthers = messages.filter(
      (m) => !m.isRead && normId(m.senderId) !== normId(user.id)
    );
    unreadFromOthers.forEach((msg) => {
      connection.invoke("MarkAsRead", activeConversation.id, msg.id).catch(() => {});
    });
  }, [connection, activeConversation, messages, user]);

  useEffect(() => {
    const token = localStorage.getItem("mediconnect-auth-token");
    if (!token || !user) return;

    const hubUrl = `${CHAT_HUB_URL}?access_token=${encodeURIComponent(token)}`;
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveMessage", (msg: Record<string, unknown>) => {
      const message = mapMessage(msg);
      const active = activeConversationRef.current;
      if (active && message.conversationId === active.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === message.conversationId) {
            return {
              ...c,
              lastMessage: message.content,
              time: new Date(message.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }
          return c;
        })
      );
    });

    newConnection.on("MessageRead", (_conversationId: string, messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
      );
    });

    newConnection.on("UserTyping", (conversationId: string, senderId: string) => {
      if (normId(senderId) !== normId(user.id)) {
        setTypingUsers((prev) => ({ ...prev, [conversationId]: true }));
        setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [conversationId]: false }));
        }, 3000);
      }
    });

    newConnection
      .start()
      .then(() => {
        setConnection(newConnection);
        setHubConnected(true);
      })
      .catch((err) => {
        console.error("SignalR Connection Error:", err);
        setHubConnected(false);
      });

    return () => {
      newConnection.stop();
      setHubConnected(false);
    };
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!activeConversation || !content.trim()) return;

    const payload = {
      conversationId: activeConversation.id,
      content: content.trim(),
    };

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: user?.id ?? "",
      content: content.trim(),
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    if (connection && hubConnected) {
      try {
        setMessages((prev) => [...prev, optimistic]);
        await connection.invoke("SendMessage", payload);
        return;
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        console.error("SignalR send failed, falling back to REST", e);
      }
    }

    try {
      const raw = await fetchApi<Record<string, unknown>>(
        `/Conversations/${activeConversation.id}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: content.trim() }),
        },
        MESSAGING_SERVICE_URL
      );
      const message = mapMessage(raw);
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                lastMessage: message.content,
                time: new Date(message.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : c
        )
      );
    } catch (e) {
      console.error("Failed to send message", e);
      throw e;
    }
  };

  const notifyTyping = async () => {
    if (!connection || !activeConversation || !hubConnected) return;
    try {
      await connection.invoke("NotifyTyping", activeConversation.id);
    } catch (e) {
      console.error("Failed to notify typing", e);
    }
  };

  const startConversationWithDoctor = async (doctorUserId: string) => {
    if (!user) return null;
    const patientId = user.role === "patient" ? user.id : doctorUserId;
    const doctorId = user.role === "patient" ? doctorUserId : user.id;
    try {
      const conv = await initiateConversation(doctorId, patientId);
      setError(null);
      const token = localStorage.getItem("mediconnect-auth-token");
      if (!token) return conv;

      const data = await fetchApi<Record<string, unknown>[]>(
        "/Conversations",
        {},
        MESSAGING_SERVICE_URL
      );
      const mapped = data.map(mapConversation);
      const populated = await Promise.all(
        mapped.map(async (c) => {
          const participantId =
            user.role === "patient" ? c.doctorId : c.patientId;
          let name = user.role === "patient" ? "Doctor" : "Patient";
          try {
            const u = await fetchApi<{ fullName: string }>(
              `/Users/${participantId}`,
              {},
              API_BASE_URL
            );
            name = u.fullName;
          } catch {
            /* ignore */
          }
          return {
            ...c,
            participantName: name,
            participantAvatar: `https://i.pravatar.cc/150?u=${participantId}`,
            lastMessage: "No messages yet",
            time: "",
            unread: 0,
            online: false,
          };
        })
      );
      setConversations(populated);
      const active =
        populated.find((c) => c.id === conv.id) ?? populated[0] ?? null;
      setActiveConversation(active);
      return active;
    } catch (e) {
      console.error("Failed to start conversation", e);
      setError(e instanceof Error ? e.message : "Failed to start conversation");
      return null;
    }
  };

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    notifyTyping,
    initiateConversation: startConversationWithDoctor,
    reloadConversations: loadConversations,
    isTyping: activeConversation ? !!typingUsers[activeConversation.id] : false,
    loading,
    error,
    hubConnected,
  };
}
