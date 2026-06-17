import { CircleDot } from "lucide-react";
import { SectionLabel } from "@/components/ui/Panel";
import { EXPERIENCE_STATS, CURRENT_FOCUS } from "@/data/experience";

export function ExperienceStats() {
  return (
    <div className="hidden w-72 shrink-0 flex-col gap-6 overflow-auto border-l border-zinc-200 bg-zinc-50/60 p-5 lg:flex dark:border-white/[0.06] dark:bg-white/[0.02]">
      <section>
        <SectionLabel className="mb-5">Experience Stats</SectionLabel>
        <div className="flex flex-col gap-3">
          {EXPERIENCE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.accent}1a`, color: stat.accent }}
                >
                  <Icon size={20} />
                </span>
                <div>
                  <div className="text-2xl font-semibold leading-none text-zinc-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionLabel className="mb-5">Current Focus</SectionLabel>
        <ul className="flex flex-col gap-1">
          {CURRENT_FOCUS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-black/[0.03] dark:text-zinc-300 dark:hover:bg-white/[0.03]"
            >
              <CircleDot size={15} className="shrink-0 text-sky-600 dark:text-sky-300" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
