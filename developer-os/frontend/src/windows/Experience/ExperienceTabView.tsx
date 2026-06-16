import { CheckCircle2 } from "lucide-react";
import {
  SKILLS_GAINED,
  KEY_ACHIEVEMENTS,
  LEARNING_JOURNEY,
} from "@/data/experience";

/** Renders the non-timeline sidebar tabs (skills / achievements / journey). */
export function ExperienceTabView({ tab }: { tab: string }) {
  if (tab === "skills") {
    return (
      <div className="flex flex-col gap-4">
        {SKILLS_GAINED.map((group) => (
          <div key={group.group}>
            <p className="mb-2 text-sm font-semibold text-sky-300">{group.group}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "achievements") {
    return (
      <ul className="flex flex-col gap-3">
        {KEY_ACHIEVEMENTS.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // journey
  return (
    <ol className="relative ml-2 border-l border-white/10">
      {LEARNING_JOURNEY.map((step, i) => (
        <li key={i} className="relative mb-4 pl-6 last:mb-0">
          <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-sky-400 bg-[#060b16]" />
          <p className="text-sm text-zinc-300">{step}</p>
        </li>
      ))}
    </ol>
  );
}
