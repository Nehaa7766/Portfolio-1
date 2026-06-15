"use client";

import { useMemo, useState } from "react";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import {
  ARCH_LAYERS,
  ARCH_NODES,
  ARCH_EDGES,
} from "@/data/architecture";
import { ArchitectureNode } from "./ArchitectureNode";
import { ArchitectureEdges } from "./ArchitectureEdges";

type Vec3 = [number, number, number];

export default function ArchitectureScene() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = hoveredId ?? selectedId;

  // World position per node = its planar (x,y) + its layer's depth (z).
  const positions = useMemo<Record<string, Vec3>>(() => {
    const layerZ = Object.fromEntries(ARCH_LAYERS.map((l) => [l.id, l.z]));
    return Object.fromEntries(
      ARCH_NODES.map((n) => [n.id, [n.x, n.y, layerZ[n.layerId] ?? 0] as Vec3]),
    );
  }, []);

  // Adjacency for dim/highlight when a node is focused.
  const neighbors = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const n of ARCH_NODES) map[n.id] = new Set();
    for (const e of ARCH_EDGES) {
      map[e.from]?.add(e.to);
      map[e.to]?.add(e.from);
    }
    return map;
  }, []);

  const isDimmed = (id: string) => {
    if (!activeId) return false;
    return id !== activeId && !neighbors[activeId]?.has(id);
  };

  return (
    <SceneCanvas
      camera={{ position: [0, 1.5, 12], fov: 50 }}
      // Clicking empty space clears the current selection.
      onPointerMissed={() => setSelectedId(null)}
    >
      <color attach="background" args={["#070b12"]} />
      <fog attach="fog" args={["#070b12", 14, 30]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 10]} intensity={0.8} />

      {/* Faint plane + label per depth layer to communicate grouping. */}
      {ARCH_LAYERS.map((layer) => (
        <group key={layer.id} position={[0, 0, layer.z]}>
          <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[9, 4]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.03} />
          </mesh>
          <Billboard position={[-5.2, 1.9, 0]}>
            <Text fontSize={0.26} color="#475569" anchorX="left" anchorY="middle">
              {layer.label}
            </Text>
          </Billboard>
        </group>
      ))}

      <ArchitectureEdges positions={positions} activeId={activeId} />

      {ARCH_NODES.map((node) => (
        <ArchitectureNode
          key={node.id}
          node={node}
          position={positions[node.id]}
          active={activeId === node.id || neighbors[activeId ?? ""]?.has(node.id) || false}
          dimmed={isDimmed(node.id)}
          onHover={setHoveredId}
          onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={7}
        maxDistance={20}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
    </SceneCanvas>
  );
}
