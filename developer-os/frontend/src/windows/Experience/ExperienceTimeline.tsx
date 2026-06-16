import { TIMELINE } from "@/data/experience";

export function ExperienceTimeline() {
  return (
    <ol className="relative ml-2 border-l border-white/10">
      {TIMELINE.map((entry) => (
        <li key={entry.title} className="relative mb-6 pl-6 last:mb-0">
          {/* Node */}
          <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-sky-400 bg-[#060b16]" />

          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">{entry.period}</span>
            {entry.badge && (
              <span className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-300">
                {entry.badge}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-white">{entry.title}</h3>
          <p className="text-sm text-sky-300">{entry.subtitle}</p>
          <p className="mt-1 text-sm text-zinc-400">{entry.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
