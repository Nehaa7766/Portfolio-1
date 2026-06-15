"use client";

import dynamic from "next/dynamic";
import { useWindowStore } from "@/store/windowStore";
import { useWebGLSupported } from "@/components/three/useWebGLSupported";
import { SceneLoader } from "@/components/three/SceneLoader";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/data/projects";

const MissionControlScene = dynamic(() => import("./MissionControlScene"), {
  ssr: false,
  loading: () => <SceneLoader label="Booting Mission Control…" />,
});

/** Accessible 2D fallback used when WebGL is unavailable. */
function MissionControl2D({ onSelect }: { onSelect: (p: FeaturedProject) => void }) {
  return (
    <div className="grid h-full grid-cols-2 gap-3 overflow-auto p-4 sm:grid-cols-3">
      {FEATURED_PROJECTS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p)}
          className="flex flex-col gap-1 rounded-lg border border-zinc-700 bg-zinc-800/60 p-3 text-left transition-colors hover:bg-zinc-700"
          style={{ borderTopColor: p.accent, borderTopWidth: 2 }}
        >
          <span className="text-sm font-semibold text-zinc-100">{p.title}</span>
          <span className="text-xs text-zinc-400">{p.tagline}</span>
        </button>
      ))}
    </div>
  );
}

export default function MissionControlWindow() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const webgl = useWebGLSupported();

  // Selecting a project hands off to the (future) Projects window — an
  // example of cross-module OS navigation.
  const handleSelect = () => openWindow("projects");

  return (
    <div className="h-full w-full bg-[#0a0f1a]">
      {webgl ? (
        <MissionControlScene onSelect={handleSelect} />
      ) : (
        <MissionControl2D onSelect={handleSelect} />
      )}
    </div>
  );
}
