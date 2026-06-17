import { CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import {
  SKILLS_GAINED,
  KEY_ACHIEVEMENTS,
  LEARNING_JOURNEY,
} from "@/data/experience";

/** Renders the non-timeline sidebar tabs (skills / achievements / journey). */
export function ExperienceTabView({ tab }: { tab: string }) {
  if (tab === "skills") {
    return (
      <div className="flex flex-col gap-5">
        {SKILLS_GAINED.map((group) => (
          <Panel key={group.group} title={group.group}>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    );
  }

  if (tab === "achievements") {
    return (
      <Panel title="Key Achievements">
        <ul className="flex flex-col gap-3">
          {KEY_ACHIEVEMENTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300"
            >
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    );
  }

  // journey
  return (
    <Panel title="Learning Journey">
      <ol className="relative ml-1.5 border-l border-zinc-200 dark:border-white/10">
        {LEARNING_JOURNEY.map((step, i) => (
          <li key={i} className="relative mb-5 pl-6 last:mb-0">
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-500/15 dark:bg-sky-400" />
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
