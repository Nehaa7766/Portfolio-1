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
    <aside className="flex w-64 shrink-0 flex-col gap-4 border-r border-white/10 p-4">
      {/* Total experience */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center">
        <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
          <Briefcase size={22} />
        </span>
        <p className="text-xs text-zinc-400">Total Experience</p>
        <p className="text-sm font-semibold text-white">{TOTAL_EXPERIENCE.title}</p>
        <p className="mt-1 text-[11px] text-emerald-400">{TOTAL_EXPERIENCE.note}</p>
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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30"
                  : "text-zinc-300 hover:bg-white/5",
              )}
            >
              <Icon size={16} className={active ? "text-sky-300" : "text-zinc-400"} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Quote */}
      <div className="mt-auto rounded-lg border border-dashed border-sky-500/30 p-4">
        <Quote size={16} className="mb-2 text-sky-400" />
        <p className="text-xs italic leading-relaxed text-sky-200/80">{EXP_QUOTE}</p>
      </div>
    </aside>
  );
}
