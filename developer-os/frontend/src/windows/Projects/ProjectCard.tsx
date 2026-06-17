import { Star, GitBranch, Calendar, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

function TechTags({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <span
          key={t}
          className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function StatLine({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
      <span className="flex items-center gap-1.5">
        <Calendar size={13} className="text-zinc-400 dark:text-zinc-500" />
        {project.date}
      </span>
      <span className="flex items-center gap-1.5">
        <Star size={13} className="text-zinc-400 dark:text-zinc-500" />
        {project.stars}
      </span>
      <span className="flex items-center gap-1.5">
        <GitBranch size={13} className="text-zinc-400 dark:text-zinc-500" />
        {project.commits}
      </span>
    </div>
  );
}

function ViewDetailsButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10"
    >
      View Details <ArrowRight size={13} />
    </button>
  );
}

/**
 * A project card. Renders horizontally in list view and as a compact vertical
 * card in grid view.
 */
export function ProjectCard({
  project,
  view,
}: {
  project: Project;
  view: "list" | "grid";
}) {
  const Icon = project.icon;

  const IconTile = (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10"
      style={{ backgroundColor: `${project.accent}1a`, color: project.accent }}
    >
      <Icon size={26} />
    </div>
  );

  const Title = (
    <div className="flex items-center gap-2">
      <h3 className="font-semibold tracking-tight text-zinc-900 dark:text-white">
        {project.title}
      </h3>
      {project.featured && (
        <Star size={14} className="fill-amber-400 text-amber-400" />
      )}
    </div>
  );

  return (
    <article
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-sky-400/60",
        "dark:border-white/[0.06] dark:bg-white/[0.02]",
      )}
    >
      {view === "list" ? (
        <div className="flex gap-4">
          {IconTile}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {Title}
              <StatusBadge status={project.status} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {project.description}
            </p>
            <div className="mt-4">
              <TechTags tech={project.tech} />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 pt-4 dark:border-white/[0.06]">
              <StatLine project={project} />
              <ViewDetailsButton />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            {IconTile}
            <StatusBadge status={project.status} />
          </div>
          {Title}
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {project.description}
          </p>
          <TechTags tech={project.tech} />
          <div className="mt-1 flex items-center justify-between border-t border-zinc-200/70 pt-4 dark:border-white/[0.06]">
            <StatLine project={project} />
            <ViewDetailsButton />
          </div>
        </div>
      )}
    </article>
  );
}
