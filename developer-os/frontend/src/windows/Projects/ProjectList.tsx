import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectList({
  projects,
  view,
}: {
  projects: Project[];
  view: "list" | "grid";
}) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          No projects match your filters.
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Try adjusting your search or clearing a filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 gap-4 xl:grid-cols-2"
          : "flex flex-col gap-4",
      )}
    >
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} view={view} />
      ))}
    </div>
  );
}
