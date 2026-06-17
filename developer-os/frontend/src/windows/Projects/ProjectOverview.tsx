"use client";

import {
  Search,
  LayoutGrid,
  List,
  FolderOpen,
  CheckCircle2,
  RefreshCw,
  Code2,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { SectionLabel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/** Compact "1.2K+" style formatting for large counts. */
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return `${n}`;
}

const total = PROJECTS.length;
const completed = PROJECTS.filter((p) => p.status === "Completed").length;
const inProgress = PROJECTS.filter((p) => p.status === "In Progress").length;
const techUsed = new Set(PROJECTS.flatMap((p) => p.tech)).size;
const totalCommits = PROJECTS.reduce((s, p) => s + p.commits, 0);

const pct = (n: number) => (total ? `${((n / total) * 100).toFixed(1)}%` : "0%");

interface OverviewCard {
  icon: LucideIcon;
  value: string;
  label: string;
  sub: string;
  accent: string;
}

const CARDS: OverviewCard[] = [
  { icon: FolderOpen, value: `${total}`, label: "Total Projects", sub: "100%", accent: "#0ea5e9" },
  { icon: CheckCircle2, value: `${completed}`, label: "Completed", sub: pct(completed), accent: "#22c55e" },
  { icon: RefreshCw, value: `${inProgress}`, label: "In Progress", sub: pct(inProgress), accent: "#38bdf8" },
  { icon: Code2, value: `${techUsed}+`, label: "Technologies Used", sub: "100%", accent: "#a855f7" },
  { icon: GitBranch, value: formatCount(totalCommits), label: "Total Commits", sub: "100%", accent: "#f59e0b" },
];

export function ProjectOverview({
  search,
  onSearch,
  view,
  onView,
}: {
  search: string;
  onSearch: (v: string) => void;
  view: "list" | "grid";
  onView: (v: "list" | "grid") => void;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Project Overview</SectionLabel>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-48 rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            />
          </div>
          <div className="flex items-center gap-0.5 rounded-md border border-zinc-200 p-0.5 dark:border-white/10">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => onView("grid")}
              className={cn(
                "rounded p-1.5 transition-colors",
                view === "grid"
                  ? "bg-sky-600 text-white hover:bg-sky-500"
                  : "text-zinc-500 hover:bg-black/[0.03] dark:text-zinc-400 dark:hover:bg-white/10",
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => onView("list")}
              className={cn(
                "rounded p-1.5 transition-colors",
                view === "list"
                  ? "bg-sky-600 text-white hover:bg-sky-500"
                  : "text-zinc-500 hover:bg-black/[0.03] dark:text-zinc-400 dark:hover:bg-white/10",
              )}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-white/[0.06] dark:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {card.value}
                </span>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
                >
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-2 text-xs text-zinc-500">{card.label}</div>
              <div className="mt-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
