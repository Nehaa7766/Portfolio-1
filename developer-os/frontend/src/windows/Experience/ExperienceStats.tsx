import { CircleDot } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EXPERIENCE_STATS, CURRENT_FOCUS } from "@/data/experience";

export function ExperienceStats() {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 border-l border-white/10 p-4">
      <section>
        <SectionHeader>Experience Stats</SectionHeader>
        <div className="mt-3 flex flex-col gap-3">
          {EXPERIENCE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.accent}22`, color: stat.accent }}
                >
                  <Icon size={20} />
                </span>
                <div>
                  <div className="text-xs text-zinc-400">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader>Current Focus</SectionHeader>
        <ul className="mt-3 flex flex-col gap-2">
          {CURRENT_FOCUS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-zinc-300">
              <CircleDot size={14} className="text-sky-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
