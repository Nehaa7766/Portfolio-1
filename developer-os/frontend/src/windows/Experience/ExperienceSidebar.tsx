"use client";

import { Briefcase, Quote } from "lucide-react";
import {
  TOTAL_EXPERIENCE,
  EXP_QUOTE,
  EXPERIENCE_TABS,
} from "@/data/experience";
import { cn } from "@/lib/utils";

export function ExperienceSidebar({
  activeTab,
  onTab,
}: {
  activeTab: string;
  onTab: (id: string) => void;
}) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-5 border-r border-zinc-200 bg-zinc-50/60 p-5 lg:flex dark:border-white/[0.06] dark:bg-white/[0.02]">
      {/* Total experience */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300">
          <Briefcase size={22} />
        </span>
        <p className="text-xs text-zinc-500">Total Experience</p>
        <p className="mt-0.5 font-semibold tracking-tight text-zinc-900 dark:text-white">
          {TOTAL_EXPERIENCE.title}
        </p>
        <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
          {TOTAL_EXPERIENCE.note}
        </p>
      </div>

      {/* Tab navigation */}
      <nav className="flex flex-col gap-1">
        {EXPERIENCE_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTab(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sky-600 text-white"
                  : "text-zinc-600 hover:bg-black/[0.03] dark:text-zinc-300 dark:hover:bg-white/10",
              )}
            >
              <Icon
                size={16}
                className={active ? "text-white" : "text-zinc-400 dark:text-zinc-500"}
              />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Quote */}
      <div className="mt-auto rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <Quote size={16} className="mb-2 text-sky-600 dark:text-sky-300" />
        <p className="text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400">
          {EXP_QUOTE}
        </p>
      </div>
    </aside>
  );
}
