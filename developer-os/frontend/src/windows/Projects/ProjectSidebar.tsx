"use client";

import { Filter, Zap, CalendarRange, LineChart } from "lucide-react";
import {
  PROJECTS,
  PROJECT_NAV,
  ALL_TECHNOLOGIES,
  PROJECT_STATUSES,
  countByCategory,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";
import { SectionLabel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

type CategoryFilter = ProjectCategory | "All";
type StatusFilter = ProjectStatus | "All";

const DONUT = [
  { label: "Completed", status: "Completed" as ProjectStatus, color: "#22c55e" },
  { label: "In Progress", status: "In Progress" as ProjectStatus, color: "#38bdf8" },
  { label: "Planned", status: "Planned" as ProjectStatus, color: "#f59e0b" },
];

/** Multi-segment ring built with the strokeDasharray (pathLength=100) trick. */
function StatsDonut({ counts, total }: { counts: number[]; total: number }) {
  // Percentage length of each segment, and its cumulative start offset —
  // both derived immutably (no reassignment during render).
  const values = counts.map((c) => (total ? (c / total) * 100 : 0));
  const offsets = values.map((_, i) =>
    values.slice(0, i).reduce((sum, v) => sum + v, 0),
  );

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          strokeWidth="3.5"
          className="stroke-zinc-200 dark:stroke-slate-800"
        />
        {DONUT.map((seg, i) => (
          <circle
            key={seg.label}
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke={seg.color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${values[i]} ${100 - values[i]}`}
            strokeDashoffset={-offsets[i]}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-zinc-900 dark:text-white">{total}</span>
        <span className="text-[10px] text-zinc-500">Projects</span>
      </div>
    </div>
  );
}

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  children,
}: {
  icon: typeof Filter;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 transition-colors focus-within:ring-2 focus-within:ring-sky-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
      <Icon size={14} className="shrink-0 text-sky-600 dark:text-sky-300" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-zinc-800 focus:outline-none dark:text-zinc-200 [&>option]:bg-white dark:[&>option]:bg-zinc-800"
      >
        {children}
      </select>
    </label>
  );
}

export function ProjectSidebar({
  category,
  onCategory,
  status,
  onStatus,
  tech,
  onTech,
}: {
  category: CategoryFilter;
  onCategory: (c: CategoryFilter) => void;
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  tech: string;
  onTech: (t: string) => void;
}) {
  const counts = DONUT.map(
    (seg) => PROJECTS.filter((p) => p.status === seg.status).length,
  );

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 overflow-auto border-r border-zinc-200 bg-zinc-50/60 p-5 lg:flex dark:border-white/[0.06] dark:bg-white/[0.02]">
      {/* Navigation */}
      <section>
        <SectionLabel className="mb-4">Project Navigation</SectionLabel>
        <nav className="flex flex-col gap-1">
          {PROJECT_NAV.map((item) => {
            const Icon = item.icon;
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCategory(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/30 dark:text-sky-300"
                    : "text-zinc-600 hover:bg-black/[0.03] dark:text-zinc-300 dark:hover:bg-white/5",
                )}
              >
                <Icon
                  size={16}
                  className={active ? "text-sky-600 dark:text-sky-300" : "text-zinc-400 dark:text-zinc-500"}
                />
                <span className="flex-1 text-left">{item.label}</span>
                <span className="text-xs text-zinc-500">{countByCategory(item.id)}</span>
              </button>
            );
          })}
        </nav>
      </section>

      {/* Quick filters */}
      <section>
        <SectionLabel className="mb-4">Quick Filters</SectionLabel>
        <div className="flex flex-col gap-2">
          <FilterSelect icon={Filter} value={tech} onChange={onTech}>
            <option value="All">All Technologies</option>
            {ALL_TECHNOLOGIES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect icon={Zap} value={status} onChange={(v) => onStatus(v as StatusFilter)}>
            <option value="All">All Status</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect icon={CalendarRange} value="All" onChange={() => {}}>
            <option value="All">All Time</option>
          </FilterSelect>
        </div>
      </section>

      {/* Stats */}
      <section>
        <SectionLabel className="mb-4">Project Stats</SectionLabel>
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <StatsDonut counts={counts} total={PROJECTS.length} />
          <ul className="flex flex-col gap-2 text-sm">
            {DONUT.map((seg, i) => (
              <li key={seg.label} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="flex-1 text-zinc-600 dark:text-zinc-300">{seg.label}</span>
                <span className="text-zinc-500">{counts[i]}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 py-2 text-sm text-zinc-700 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          <LineChart size={15} className="text-sky-600 dark:text-sky-300" />
          View Analytics
        </button>
      </section>
    </aside>
  );
}
