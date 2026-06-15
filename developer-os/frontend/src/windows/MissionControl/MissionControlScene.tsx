"use client";

import { useMemo } from "react";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { FEATURED_PROJECTS, type FeaturedProject } from "@/data/projects";
import { ProjectCard3D } from "./ProjectCard3D";

const COLS = 3;
const GAP_X = 2.6;
const GAP_Y = 1.9;

/**
 * Lay the project cards out on a centered grid that sits on a slightly tilted
 * plane, giving the "mission control overview" feeling.
 */
function useCardLayout(): Array<{ project: FeaturedProject; position: [number, number, number] }> {
  return useMemo(() => {
    const rows = Math.ceil(FEATURED_PROJECTS.length / COLS);
    return FEATURED_PROJECTS.map((project, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = (col - (COLS - 1) / 2) * GAP_X;
      const y = ((rows - 1) / 2 - row) * GAP_Y;
      return { project, position: [x, y, 0] as [number, number, number] };
    });
  }, []);
}

export default function MissionControlScene({
  onSelect,
}: {
  onSelect: (project: FeaturedProject) => void;
}) {
  const cards = useCardLayout();

  return (
    <SceneCanvas camera={{ position: [0, 0.5, 8.5], fov: 50 }}>
      <color attach="background" args={["#0a0f1a"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 5]} intensity={0.9} />
      <pointLight position={[-6, -2, 4]} intensity={0.4} color="#38bdf8" />

      {/* Slight tilt of the whole board reads as a "control surface". */}
      <group rotation={[-0.12, 0, 0]}>
        {cards.map(({ project, position }) => (
          <ProjectCard3D
            key={project.id}
            project={project}
            position={position}
            onSelect={onSelect}
          />
        ))}
      </group>

      <ContactShadows
        position={[0, -3.2, 0]}
        opacity={0.35}
        scale={20}
        blur={2.4}
        far={6}
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={6}
        maxDistance={12}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.9}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
      />
    </SceneCanvas>
  );
}
