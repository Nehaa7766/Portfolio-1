"use client";

import { Line } from "@react-three/drei";
import { ARCH_EDGES } from "@/data/architecture";

type Vec3 = [number, number, number];

interface ArchitectureEdgesProps {
  positions: Record<string, Vec3>;
  /** The currently focused node (hovered or selected), or null. */
  activeId: string | null;
}

/**
 * Renders the connections between architecture nodes as 3D lines. When a node
 * is focused, its incident edges are highlighted and the rest fade back —
 * making cross-layer data flow easy to trace.
 */
export function ArchitectureEdges({ positions, activeId }: ArchitectureEdgesProps) {
  return (
    <group>
      {ARCH_EDGES.map((edge) => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        if (!from || !to) return null;

        const incident =
          activeId === null || edge.from === activeId || edge.to === activeId;

        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            points={[from, to]}
            color={incident ? "#38bdf8" : "#334155"}
            lineWidth={incident ? 2 : 1}
            transparent
            opacity={activeId === null ? 0.55 : incident ? 0.95 : 0.18}
          />
        );
      })}
    </group>
  );
}
