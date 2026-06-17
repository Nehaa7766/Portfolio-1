import { TIMELINE } from "@/data/experience";

export function ExperienceTimeline() {
  return (
    <ol className="relative flex flex-col gap-6 pl-8">
      {/* Vertical connector line */}
      <span
        aria-hidden
        className="absolute left-[5px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-white/10"
      />

      {TIMELINE.map((entry) => (
        <li key={entry.title} className="relative">
          {/* Node */}
          <span className="absolute -left-8 top-5 h-2.5 w-2.5 rounded-full bg-sky-500 ring-4 ring-sky-500/15 dark:bg-sky-400" />

          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500">{entry.period}</span>
              {entry.badge && (
                <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
                  {entry.badge}
                </span>
              )}
            </div>

            <h3 className="font-semibold tracking-tight text-zinc-900 dark:text-white">
              {entry.title}
            </h3>
            <p className="text-sm text-sky-600 dark:text-sky-300">{entry.subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {entry.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
