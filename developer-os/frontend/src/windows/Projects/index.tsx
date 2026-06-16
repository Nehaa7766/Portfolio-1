"use client";

import { useMemo, useState } from "react";
import {
  PROJECTS,
  type ProjectCategory,
  type ProjectStatus,
} from "@/data/projects";
import { ProjectSidebar } from "./ProjectSidebar";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectList } from "./ProjectList";

type CategoryFilter = ProjectCategory | "All";
type StatusFilter = ProjectStatus | "All";

export default function ProjectsWindow() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [tech, setTech] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (status !== "All" && p.status !== status) return false;
      if (tech !== "All" && !p.tech.includes(tech)) return false;
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q) &&
        !p.tech.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [category, status, tech, search]);

  return (
    <div className="flex h-full bg-[#060b16] font-mono text-zinc-300">
      <ProjectSidebar
        category={category}
        onCategory={setCategory}
        status={status}
        onStatus={setStatus}
        tech={tech}
        onTech={setTech}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-auto p-5">
        <ProjectOverview
          search={search}
          onSearch={setSearch}
          view={view}
          onView={setView}
        />

        <section className="rounded-lg border border-sky-500/20 bg-white/[0.02] p-4">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
            {"// "}
            Projects List
          </h2>
          <ProjectList projects={filtered} view={view} />
        </section>
      </div>
    </div>
  );
}
