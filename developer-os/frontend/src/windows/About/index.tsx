"use client";

import Image from "next/image";
import { MapPin, type LucideIcon } from "lucide-react";
import {
  PROFILE,
  PROFILE_IMAGE,
  SYSTEM_INFO,
  STATS,
  LEARNING,
  PROFILE_BIO,
  OBJECTIVES,
} from "@/data/about";
import { cn } from "@/lib/utils";

/** A titled content block with a small, refined section label. */
function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-50/60 p-6 dark:border-white/[0.06] dark:bg-white/[0.02]",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-4 w-[3px] rounded-full bg-sky-500 dark:bg-sky-400/80" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** SVG ring progress (uses pathLength=100 trick via r≈15.9155). */
function RadialProgress({ percent }: { percent: number }) {
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <svg viewBox="0 0 36 36" className="h-[68px] w-[68px] -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          strokeWidth="2.5"
          className="stroke-zinc-200 dark:stroke-slate-800"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${percent} 100`}
          className="stroke-sky-500 dark:stroke-sky-400"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-zinc-900 dark:text-white">
        {percent}%
      </span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-200/70 py-2.5 last:border-0 dark:border-white/[0.04]">
      <Icon size={15} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
      <span className="w-40 shrink-0 text-sm text-zinc-500">{label}</span>
      <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{value}</span>
    </div>
  );
}

export default function AboutWindow() {
  return (
    <div className="min-h-full bg-white p-6 text-zinc-600 dark:bg-[#0a0e16] dark:text-zinc-300">
      <div className="mx-auto max-w-5xl">
        {/* Header — avatar + identity */}
        <header className="flex flex-col items-center gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:gap-8 dark:border-white/[0.06]">
          <div className="relative h-32 w-32 shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-sky-500/40 to-indigo-500/30" />
            <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
              <Image
                src={PROFILE_IMAGE}
                alt={PROFILE.name}
                fill
                sizes="128px"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Available for opportunities
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {PROFILE.name}
            </h1>
            <p className="mt-1 text-base text-sky-600 dark:text-sky-300">{PROFILE.role}</p>

            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin size={14} className="text-zinc-400 dark:text-zinc-500" />
              {PROFILE.location}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {PROFILE.quote}
            </p>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Bio */}
          <Section title="About" className="lg:col-span-7">
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {PROFILE_BIO.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Section>

          {/* Stats */}
          <Section title="At a Glance" className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
                  >
                    <span
                      className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${stat.accent}1a`, color: stat.accent }}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="text-2xl font-semibold text-zinc-900 dark:text-white">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <RadialProgress percent={LEARNING.percent} />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Currently Learning</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{LEARNING.areas}</p>
              </div>
            </div>
          </Section>

          {/* Details */}
          <Section title="Details" className="lg:col-span-7">
            <div className="flex flex-col">
              {SYSTEM_INFO.map((row) => (
                <InfoRow key={row.label} {...row} />
              ))}
            </div>
          </Section>

          {/* Objectives */}
          <Section title="Current Focus" className="lg:col-span-5">
            <div className="flex flex-col gap-1">
              {OBJECTIVES.map((obj) => {
                const Icon = obj.icon;
                return (
                  <div
                    key={obj.label}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300">
                      <Icon size={15} />
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{obj.label}</span>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
