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
    <section className="rounded-lg border border-sky-500/20 bg-white/[0.02] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
          {"// "}
          Project Overview
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800/70 px-3 py-1.5">
            <Search size={14} className="text-zinc-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-40 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center rounded-md border border-white/10 p-0.5">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => onView("grid")}
              className={cn(
                "rounded p-1.5 transition-colors",
                view === "grid" ? "bg-sky-600 text-white" : "text-zinc-400 hover:bg-white/10",
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
                view === "list" ? "bg-sky-600 text-white" : "text-zinc-400 hover:bg-white/10",
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
              className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl font-bold text-white">{card.value}</span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${card.accent}22`, color: card.accent }}
                >
                  <Icon size={15} />
                </span>
              </div>
              <div className="mt-1 text-xs text-zinc-400">{card.label}</div>
              <div className="mt-1 text-[11px] text-green-400">{card.sub} ↑</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
