import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  RESUME,
  RESUME_OVERVIEW,
  KEY_HIGHLIGHTS,
} from "@/data/resume";

export function ResumeOverview() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      {/* Overview cards */}
      <section>
        <SectionHeader>Resume Overview</SectionHeader>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RESUME_OVERVIEW.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.accent}22`, color: card.accent }}
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-sky-300">{card.title}</p>
                  <p className="truncate text-sm font-semibold text-white">{card.primary}</p>
                  <p className="truncate text-xs text-zinc-400">{card.secondary}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Key highlights */}
        <section>
          <SectionHeader>Key Highlights</SectionHeader>
          <ul className="mt-3 flex flex-col gap-2.5">
            {KEY_HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Document info */}
        <section>
          <SectionHeader>Document Info</SectionHeader>
          <dl className="mt-3 grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
            {[
              ["File Name", RESUME.fileName],
              ["Last Updated", RESUME.lastUpdated],
              ["Pages", String(RESUME.pages)],
              ["Format", RESUME.format],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-xs text-zinc-500">{label}</dt>
                <dd className="text-zinc-200">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
