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
      <p className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
        No projects match your filters.
      </p>
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
