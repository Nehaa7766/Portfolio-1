"use client";

import dynamic from "next/dynamic";
import { useWebGLSupported } from "@/components/three/useWebGLSupported";
import { SceneLoader } from "@/components/three/SceneLoader";
import { ARCH_LAYERS, ARCH_NODES } from "@/data/architecture";

const ArchitectureScene = dynamic(() => import("./ArchitectureScene"), {
  ssr: false,
  loading: () => <SceneLoader label="Rendering architecture…" />,
});

/** Accessible 2D fallback: layers as columns of node chips. */
function Architecture2D() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4">
      {ARCH_LAYERS.map((layer) => (
        <section key={layer.id}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {layer.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            {ARCH_NODES.filter((n) => n.layerId === layer.id).map((n) => (
              <span
                key={n.id}
                className="rounded-md border bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-200"
                style={{ borderColor: n.accent }}
              >
                {n.label}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ArchitectureExplorerWindow() {
  const webgl = useWebGLSupported();

  return (
    <div className="h-full w-full bg-[#070b12]">
      {webgl ? <ArchitectureScene /> : <Architecture2D />}
    </div>
  );
}
