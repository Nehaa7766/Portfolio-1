"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/ui/Panel";

const FIELD =
  "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100";

const LABEL = "mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

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
    <Panel title="Send a Message" className="lg:col-span-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={LABEL}>Your Name</label>
          <input className={FIELD} placeholder="Enter your name" value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label className={LABEL}>Your Email</label>
          <input type="email" className={FIELD} placeholder="Enter your email" value={form.email} onChange={set("email")} required />
        </div>
        <div>
          <label className={LABEL}>Subject</label>
          <input className={FIELD} placeholder="What is this regarding?" value={form.subject} onChange={set("subject")} />
        </div>
        <div>
          <label className={LABEL}>Message</label>
          <textarea rows={5} className={`${FIELD} resize-none`} placeholder="Write your message..." value={form.message} onChange={set("message")} required />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
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
    </Panel>
  );
}
