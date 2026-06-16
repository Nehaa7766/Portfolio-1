"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const FIELD =
  "w-full rounded-md border border-white/10 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500/50 focus:outline-none";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend in this phase — acknowledge locally and reset.
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <SectionHeader className="text-zinc-300">Send a Message</SectionHeader>

      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Your Name
        <input className={FIELD} placeholder="Enter your name" value={form.name} onChange={set("name")} required />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Your Email
        <input type="email" className={FIELD} placeholder="Enter your email" value={form.email} onChange={set("email")} required />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Subject
        <input className={FIELD} placeholder="What is this regarding?" value={form.subject} onChange={set("subject")} />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-400">
        Message
        <textarea rows={5} className={`${FIELD} resize-none`} placeholder="Write your message..." value={form.message} onChange={set("message")} required />
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-sky-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
      >
        {sent ? (
          <>
            <CheckCircle2 size={16} /> Message Sent!
          </>
        ) : (
          <>
            <Send size={15} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
