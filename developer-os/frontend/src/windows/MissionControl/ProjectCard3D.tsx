"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import type { Group } from "three";
import type { FeaturedProject } from "@/data/projects";

const CARD_W = 2.2;
const CARD_H = 1.4;

interface ProjectCard3DProps {
  project: FeaturedProject;
  position: [number, number, number];
  onSelect: (project: FeaturedProject) => void;
}

/**
 * A single project tile in the Mission Control scene. Lifts and brightens on
 * hover (damped), shows a pointer cursor, and fires `onSelect` on click.
 * Text is rendered with drei <Text> (SDF) — crisp and cheap, no <Html> cost.
 */
export function ProjectCard3D({ project, position, onSelect }: ProjectCard3DProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    // Damp toward a slightly raised + forward pose on hover.
    const targetZ = hovered ? position[2] + 0.6 : position[2];
    const targetY = hovered ? position[1] + 0.15 : position[1];
    const targetScale = hovered ? 1.06 : 1;
    groupRef.current.position.z +=
      (targetZ - groupRef.current.position.z) * 0.15;
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * 0.15;
    const s = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.15;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(project);
      }}
    >
      {/* Card face */}
      <RoundedBox args={[CARD_W, CARD_H, 0.08]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#18212f"
          emissive={project.accent}
          emissiveIntensity={hovered ? 0.5 : 0.18}
          metalness={0.3}
          roughness={0.45}
        />
      </RoundedBox>

      {/* Accent edge strip */}
      <mesh position={[0, CARD_H / 2 - 0.06, 0.045]}>
        <planeGeometry args={[CARD_W - 0.16, 0.06]} />
        <meshBasicMaterial color={project.accent} />
      </mesh>

      <Text
        position={[0, 0.18, 0.06]}
        fontSize={0.22}
        color="#f1f5f9"
        anchorX="center"
        anchorY="middle"
        maxWidth={CARD_W - 0.3}
      >
        {project.title}
      </Text>
      <Text
        position={[0, -0.22, 0.06]}
        fontSize={0.12}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        maxWidth={CARD_W - 0.3}
      >
        {project.tagline}
      </Text>
    </group>
  );
}
