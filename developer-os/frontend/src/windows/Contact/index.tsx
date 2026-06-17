"use client";

import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import { ConnectVia } from "./ConnectVia";

export default function ContactWindow() {
  return (
    <div className="min-h-full bg-white p-6 text-zinc-600 dark:bg-[#0a0e16] dark:text-zinc-300">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-zinc-200 pb-8 dark:border-white/[0.06]">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Have a question, an opportunity, or just want to say hello? Reach out
            through any of the channels below or send a message directly.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ContactInfo />
          <ContactForm />
          <ConnectVia />
        </div>
      </div>
    </div>
  );
}
