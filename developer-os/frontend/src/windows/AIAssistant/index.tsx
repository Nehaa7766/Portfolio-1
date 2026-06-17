"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, RotateCcw, Sparkles } from "lucide-react";
import { useAiStore } from "@/store/aiStore";
import { ChatMessage } from "./ChatMessage";

const SUGGESTIONS = [
  "Tell me about the Hospital Management System",
  "Why did you choose PostgreSQL?",
  "Tell me about your experience",
  "What are your skills?",
];

export default function AIAssistantWindow() {
  const messages = useAiStore((s) => s.messages);
  const isLoading = useAiStore((s) => s.isLoading);
  const error = useAiStore((s) => s.error);
  const sendMessage = useAiStore((s) => s.sendMessage);
  const reset = useAiStore((s) => s.reset);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    setInput("");
    void sendMessage(value);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col bg-white text-zinc-600 dark:bg-[#0a0e16] dark:text-zinc-300">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white">
            <Bot size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
              AI Assistant
            </p>
            <p className="text-xs text-zinc-500">Ask about Neha&apos;s work</p>
          </div>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-600 transition-colors hover:border-sky-400/60 hover:bg-black/[0.02] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            <RotateCcw size={13} /> New chat
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-6 overflow-auto p-5">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300">
              <Sparkles size={26} />
            </span>
            <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
              Ask me anything
            </h2>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500">
              I can answer questions about Neha&apos;s projects, experience, skills, and
              engineering decisions.
            </p>
            <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-600 transition-colors hover:border-sky-400/60 hover:bg-black/[0.02] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white">
              <Bot size={16} />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mx-5 mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Composer */}
      <div className="border-t border-zinc-200 p-4 dark:border-white/[0.06]">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder="Ask about projects, skills, experience..."
            className="max-h-32 min-h-[46px] w-full flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={() => submit(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
