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
          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Meta({ project, align }: { project: Project; align: "start" | "end" }) {
  return (
    <div className={cn("flex flex-col gap-2", align === "end" ? "items-end" : "items-start")}>
      <StatusBadge status={project.status} />
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <Calendar size={12} />
        {project.date}
      </span>
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Star size={12} />
          {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <GitBranch size={12} />
          {project.commits}
        </span>
      </div>
      <button
        type="button"
        className="mt-1 flex items-center gap-1 rounded-md border border-white/10 px-3 py-1 text-xs text-zinc-200 transition-colors hover:bg-white/10"
      >
        View Details <ArrowRight size={12} />
      </button>
    </div>
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
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${project.accent}1a`, color: project.accent }}
    >
      <Icon size={28} />
    </div>
  );

  const Title = (
    <div className="flex items-center gap-2">
      <h3 className="text-base font-semibold text-white">{project.title}</h3>
      {project.featured && (
        <Star size={14} className="fill-amber-400 text-amber-400" />
      )}
    </div>
  );

  return (
    <article
      className="rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-sky-500/40"
      style={{ borderLeft: `3px solid ${project.accent}` }}
    >
      {view === "list" ? (
        <div className="flex gap-4">
          {IconTile}
          <div className="min-w-0 flex-1">
            {Title}
            <p className="mt-1 text-sm text-zinc-400">{project.description}</p>
            <div className="mt-3">
              <TechTags tech={project.tech} />
            </div>
          </div>
          <div className="w-40 shrink-0">
            <Meta project={project} align="end" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            {IconTile}
            <StatusBadge status={project.status} />
          </div>
          {Title}
          <p className="text-sm text-zinc-400">{project.description}</p>
          <TechTags tech={project.tech} />
          <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {project.date}
              </span>
              <span className="flex items-center gap-1">
                <Star size={12} />
                {project.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch size={12} />
                {project.commits}
              </span>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-1 text-xs text-zinc-200 transition-colors hover:bg-white/10"
            >
              View Details <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
