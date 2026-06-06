import { fetchApi } from "@/lib/api";

export type ChatMessage = { role: string; content: string };

export async function sendAiChat(query: string, chatHistory: ChatMessage[] = []) {
  return fetchApi<{ answer: string }>("/Ai/chat", {
    method: "POST",
    body: JSON.stringify({ query, chatHistory }),
  });
}
