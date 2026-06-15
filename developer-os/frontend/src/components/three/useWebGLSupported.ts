"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

/** Synchronous, cached WebGL capability check (client-only). */
function detect(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    cached = false;
  }
  return cached;
}

// Capability never changes during a session — no real subscription needed.
const noopSubscribe = () => () => {};

/**
 * Detects WebGL availability. When unsupported (old browsers, blocked GPU,
 * some headless environments) modules fall back to their 2D rendering.
 * Optimistically returns `true` during SSR (3D scenes are client-only anyway).
 */
export function useWebGLSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, detect, () => true);
}
