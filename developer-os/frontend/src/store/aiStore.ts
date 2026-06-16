import { create } from "zustand";
import type {
  ChatMessage,
  ChatResponse,
  ChatErrorResponse,
  HistoryItem,
} from "@/types/ai";

const HISTORY_LIMIT = 8;

function uid(): string {
  // Browser-safe unique id.
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

interface AiStore {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  sendMessage: (text: string) => Promise<void>;
  reset: () => void;
}

export const useAiStore = create<AiStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().isLoading) return;

    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    // History to send = prior messages (before this one).
    const history: HistoryItem[] = get()
      .messages.slice(-HISTORY_LIMIT)
      .map((m) => ({ role: m.role, content: m.content }));

    set((s) => ({
      messages: [...s.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const res = await fetch(`/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ChatErrorResponse | null;
        throw new Error(data?.error ?? `Request failed (${res.status}).`);
      }

      const data = (await res.json()) as ChatResponse;
      const assistantMessage: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        createdAt: Date.now(),
      };

      set((s) => ({ messages: [...s.messages, assistantMessage], isLoading: false }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reach the AI service.";
      set({ isLoading: false, error: message });
    }
  },

  reset: () => set({ messages: [], isLoading: false, error: null }),
}));
