"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import {
  CONTACT_INTRO,
  CONTACT_METHODS,
  AVAILABILITY,
  type ContactType,
} from "@/data/contact";

/** Inline brand marks (lucide v1 dropped brand icons). */
function LinkedInMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H20v-5.4c0-1.3 0-2.95-1.8-2.95s-2.07 1.4-2.07 2.85V21H12z" />
    </svg>
  );
}
function GitHubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0022 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function MethodIcon({ type, size = 18 }: { type: ContactType; size?: number }) {
  switch (type) {
    case "email":
      return <Mail size={size} />;
    case "phone":
      return <Phone size={size} />;
    case "linkedin":
      return <LinkedInMark size={size} />;
    case "github":
      return <GitHubMark size={size} />;
    case "location":
      return <MapPin size={size} />;
  }
}

export function ContactInfo() {
  const [copied, setCopied] = useState<ContactType | null>(null);

  const copy = (type: ContactType, value: string) => {
    void navigator.clipboard?.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6 lg:col-span-5">
      <Panel title="Let's Connect">
        <p className="mb-5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {CONTACT_INTRO}
        </p>

        <div className="flex flex-col gap-3">
          {CONTACT_METHODS.map((m) => (
            <div
              key={m.type}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-sky-400/60 dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <MethodIcon type={m.type} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500">{m.label}</p>
                {m.href ? (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-zinc-800 transition-colors hover:text-sky-600 dark:text-zinc-100 dark:hover:text-sky-300"
                  >
                    {m.value}
                  </a>
                ) : (
                  <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{m.value}</p>
                )}
              </div>
              <button
                type="button"
                aria-label={`Copy ${m.label}`}
                onClick={() => copy(m.type, m.value)}
                className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-black/[0.03] hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
              >
                {copied === m.type ? (
                  <Check size={15} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy size={15} />
                )}
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Availability">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-400/20">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-400 dark:bg-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{AVAILABILITY.status}</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{AVAILABILITY.note}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
