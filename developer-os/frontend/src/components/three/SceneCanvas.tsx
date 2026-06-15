"use client";

import { type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { usePageVisible } from "./usePageVisible";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface SceneCanvasProps extends Omit<CanvasProps, "frameloop"> {
  children: ReactNode;
  /**
   * Pause the render loop (e.g. the host window is minimized / not in view).
   * Combined with tab-visibility and reduced-motion to decide the frameloop.
   */
  paused?: boolean;
}

/**
 * Shared R3F canvas wrapper that centralizes every performance/accessibility
 * guardrail so individual scenes don't have to repeat them:
 *
 * - frameloop is `never` when the tab is hidden or the host is paused
 *   (no wasted GPU), `demand` under reduced-motion (render only on interaction),
 *   and `always` otherwise.
 * - DPR is capped and adapts down on weak GPUs via <AdaptiveDpr>.
 * - <AdaptiveEvents> disables raycasting during camera movement.
 * - alpha canvas so the CSS gradient/wallpaper shows through.
 */
export function SceneCanvas({
  children,
  paused = false,
  dpr = [1, 1.5],
  gl,
  ...rest
}: SceneCanvasProps) {
  const visible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  const frameloop: CanvasProps["frameloop"] = reducedMotion
    ? "demand"
    : visible && !paused
      ? "always"
      : "never";

  return (
    <Canvas
      dpr={dpr}
      frameloop={frameloop}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        ...gl,
      }}
      {...rest}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      {children}
    </Canvas>
  );
}
