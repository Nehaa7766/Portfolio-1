import { CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import {
  RESUME,
  RESUME_OVERVIEW,
  KEY_HIGHLIGHTS,
} from "@/data/resume";

export function ResumeOverview() {
  return (
    <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
      {/* Overview cards */}
      <Panel title="Resume Overview">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RESUME_OVERVIEW.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-sky-400/60 dark:border-white/[0.06] dark:bg-white/[0.02]"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.accent}22`, color: card.accent }}
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-sky-600 dark:text-sky-300">{card.title}</p>
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{card.primary}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{card.secondary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Key highlights */}
        <Panel title="Key Highlights">
          <ul className="flex flex-col gap-3">
            {KEY_HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {h}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Document info */}
        <Panel title="Document Info">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            {[
              ["File Name", RESUME.fileName],
              ["Last Updated", RESUME.lastUpdated],
              ["Pages", String(RESUME.pages)],
              ["Format", RESUME.format],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col border-b border-zinc-200/70 pb-3 last:border-0 last:pb-0 dark:border-white/[0.04]"
              >
                <dt className="text-xs text-zinc-500">{label}</dt>
                <dd className="mt-0.5 font-medium text-zinc-800 dark:text-zinc-200">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}
