"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import type { Mesh } from "three";
import type { ArchNode } from "@/data/architecture";

const NODE_W = 1.9;
const NODE_H = 0.7;

interface ArchitectureNodeProps {
  node: ArchNode;
  position: [number, number, number];
  active: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

/**
 * A single architecture node card. Brightens when it (or a connected node) is
 * active, dims when another part of the graph is focused.
 */
export function ArchitectureNode({
  node,
  position,
  active,
  dimmed,
  onHover,
  onSelect,
}: ArchitectureNodeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = active ? 1.06 : 1;
    const s = meshRef.current.scale.x + (target - meshRef.current.scale.x) * 0.15;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <RoundedBox ref={meshRef} args={[NODE_W, NODE_H, 0.18]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          color="#141c28"
          emissive={node.accent}
          emissiveIntensity={active ? 0.6 : 0.2}
          metalness={0.25}
          roughness={0.5}
          transparent
          opacity={dimmed ? 0.4 : 1}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.16}
        color={dimmed ? "#64748b" : "#e2e8f0"}
        anchorX="center"
        anchorY="middle"
        maxWidth={NODE_W - 0.2}
        textAlign="center"
      >
        {node.label}
      </Text>
    </group>
  );
}
