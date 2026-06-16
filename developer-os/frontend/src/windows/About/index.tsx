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

/** Card with a `// SECTION` header in the techy accent style. */
function Panel({
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
        "rounded-lg border border-cyan-500/20 bg-white/[0.02] p-4",
        className,
      )}
    >
      <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {"// "}
        {title}
      </h2>
      {children}
    </section>
  );
}

/** SVG ring progress (uses pathLength=100 trick via r≈15.9155). */
function RadialProgress({ percent }: { percent: number }) {
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${percent} 100`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
        {percent}%
      </span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon size={15} className="shrink-0 text-cyan-400" />
      <span className="w-36 shrink-0 text-zinc-400">{label}</span>
      <span className="text-zinc-600">:</span>
      <span className="truncate text-zinc-100">{value}</span>
    </div>
  );
}

export default function AboutWindow() {
  return (
    <div className="min-h-full bg-[#060b16] p-4 font-mono text-zinc-300">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Profile card */}
        <Panel title="Profile" className="lg:col-span-3">
          <div className="flex flex-col items-center text-center">
            {/* Glowing circular avatar */}
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-50 blur-md" />
              <div className="absolute inset-1 overflow-hidden rounded-full ring-2 ring-cyan-400/70">
                <Image
                  src={PROFILE_IMAGE}
                  alt={PROFILE.name}
                  fill
                  sizes="160px"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
              ONLINE
            </div>

            <h1 className="mt-2 text-lg font-bold text-white">{PROFILE.name}</h1>
            <p className="text-sm text-cyan-300">{PROFILE.role}</p>
            <p className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <MapPin size={12} className="text-cyan-400" />
              {PROFILE.location}
            </p>

            <p className="mt-4 rounded-md border border-dashed border-cyan-500/30 p-3 text-xs italic leading-relaxed text-cyan-200/80">
              &ldquo;{PROFILE.quote}&rdquo;
            </p>
          </div>
        </Panel>

        {/* System information */}
        <Panel title="System Information" className="lg:col-span-5">
          <div className="flex flex-col gap-3">
            {SYSTEM_INFO.map((row) => (
              <InfoRow key={row.label} {...row} />
            ))}
          </div>
        </Panel>

        {/* Developer statistics */}
        <Panel title="Developer Statistics" className="lg:col-span-4">
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                >
                  <span
                    className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${stat.accent}22`, color: stat.accent }}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Learning progress */}
          <div className="mt-3 flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <RadialProgress percent={LEARNING.percent} />
            <div>
              <p className="text-sm font-semibold text-white">Learning Progress</p>
              <p className="text-xs text-zinc-400">{LEARNING.areas}</p>
            </div>
          </div>
        </Panel>

        {/* Developer profile (terminal) */}
        <Panel title="Developer Profile" className="lg:col-span-8">
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-emerald-400">$ cat profile.dev</p>
            {PROFILE_BIO.map((para, i) => (
              <p key={i} className="text-zinc-300">
                {para}
              </p>
            ))}
            <p className="text-emerald-400">
              ${" "}
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </Panel>

        {/* Current objectives */}
        <Panel title="Current Objectives" className="lg:col-span-4">
          <div className="flex flex-col gap-4">
            {OBJECTIVES.map((obj) => {
              const Icon = obj.icon;
              return (
                <div key={obj.label} className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0 text-cyan-400" />
                  <span className="text-sm text-zinc-200">{obj.label}</span>
                  <span className="mx-1 flex-1 border-b border-dashed border-zinc-700" />
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_6px] shadow-cyan-400" />
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
