"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Float, Icosahedron } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { SceneCanvas } from "@/components/three/SceneCanvas";

/**
 * A single slowly-rotating low-poly wireframe solid. Provides a quiet focal
 * point with depth without competing with the windows in front of it.
 */
function WireframeSolid() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <Icosahedron ref={meshRef} args={[2.4, 1]} position={[3.5, 0.5, -2]}>
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={0.35}
          wireframe
          transparent
          opacity={0.45}
        />
      </Icosahedron>
    </Float>
  );
}

/**
 * Gentle pointer-driven parallax for the whole backdrop — adds a premium
 * sense of depth. Damped toward the target so it never feels twitchy.
 */
function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetX = state.pointer.y * 0.08;
    const targetY = state.pointer.x * 0.12;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Ambient 3D desktop wallpaper. Rendered behind every window at z-0.
 * `paused` is driven by the host (e.g. when a window is maximized and fully
 * covers the backdrop) to save GPU.
 */
export default function DesktopBackgroundScene({
  paused = false,
}: {
  paused?: boolean;
}) {
  return (
    <SceneCanvas
      paused={paused}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      // Backdrop is non-interactive; let pointer events fall through to icons/windows.
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#0a0f1a", 8, 22]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#38bdf8" />

      <ParallaxGroup>
        <Stars
          radius={60}
          depth={40}
          count={2000}
          factor={3}
          saturation={0}
          fade
          speed={0.6}
        />
        <WireframeSolid />
      </ParallaxGroup>
    </SceneCanvas>
  );
}
