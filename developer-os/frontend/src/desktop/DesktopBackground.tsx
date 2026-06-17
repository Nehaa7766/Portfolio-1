"use client";

import dynamic from "next/dynamic";
import { useWindowStore } from "@/store/windowStore";
import { useWebGLSupported } from "@/components/three/useWebGLSupported";
import { useIsMobile } from "@/hooks/useIsMobile";

// Three.js is heavy — load the scene only on the client and only once the
// desktop is mounted, keeping it out of the initial bundle entirely.
const DesktopBackgroundScene = dynamic(
  () => import("./DesktopBackgroundScene"),
  { ssr: false },
);

/**
 * Hosts the ambient 3D wallpaper at z-0 behind all desktop content.
 * Falls back to the plain CSS gradient (rendered by <Desktop />) when WebGL
 * is unavailable. The render loop pauses whenever a window is maximized and
 * fully covers the backdrop.
 */
export function DesktopBackground() {
  const webgl = useWebGLSupported();
  const isMobile = useIsMobile();
  const hasMaximized = useWindowStore((s) =>
    s.windows.some((w) => w.isMaximized && !w.isMinimized),
  );

  // Skip the 3D wallpaper when WebGL is unavailable or on mobile (saves
  // battery/GPU) — the CSS gradient remains as the backdrop.
  if (!webgl || isMobile) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <DesktopBackgroundScene paused={hasMaximized} />
    </div>
  );
}
