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
    <div className="flex h-full flex-col bg-[#060b16] text-zinc-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white">
            <Bot size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">AI Assistant</p>
            <p className="text-xs text-zinc-500">Ask about Neha&apos;s work</p>
          </div>
        </div>
        {!isEmpty && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10"
          >
            <RotateCcw size={13} /> New chat
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-auto p-4">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600/20 text-sky-400">
              <Sparkles size={26} />
            </span>
            <h2 className="text-base font-semibold text-white">Ask me anything</h2>
            <p className="mt-1 max-w-xs text-sm text-zinc-500">
              I can answer questions about Neha&apos;s projects, experience, skills, and
              engineering decisions.
            </p>
            <div className="mt-5 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:border-sky-500/40 hover:bg-white/[0.06]"
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white">
              <Bot size={16} />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 animate-bounce rounded-full bg-zinc-500"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mx-4 mb-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {/* Composer */}
      <div className="border-t border-white/10 p-3">
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
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-lg border border-white/10 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => submit(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
