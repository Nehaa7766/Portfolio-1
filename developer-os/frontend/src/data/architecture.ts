/**
 * Data model for the 3D Architecture Explorer. Nodes are grouped into
 * depth layers (client → frontend → backend → external) so the explorer can
 * stack them along Z and route connections across depth — something a flat
 * diagram cannot convey as intuitively.
 *
 * Phase 1 models DeveloperOS's own architecture as sample content.
 */

export interface ArchLayer {
  id: string;
  label: string;
  /** Depth position along Z. Higher = closer to the camera. */
  z: number;
}

export interface ArchNode {
  id: string;
  label: string;
  layerId: string;
  /** In-layer planar position. */
  x: number;
  y: number;
  accent: string;
}

export interface ArchEdge {
  from: string;
  to: string;
}

export const ARCH_LAYERS: ArchLayer[] = [
  { id: "client", label: "Client / Shell", z: 4.5 },
  { id: "frontend", label: "Frontend", z: 1.5 },
  { id: "backend", label: "Backend API", z: -1.5 },
  { id: "external", label: "External Services", z: -4.5 },
];

export const ARCH_NODES: ArchNode[] = [
  // Client / shell
  { id: "desktop", label: "Desktop Shell", layerId: "client", x: -1.6, y: 0.6, accent: "#0ea5e9" },
  { id: "wm", label: "Window Manager", layerId: "client", x: 1.6, y: -0.4, accent: "#0ea5e9" },

  // Frontend
  { id: "stores", label: "Zustand Stores", layerId: "frontend", x: -2.2, y: 0.8, accent: "#22c55e" },
  { id: "windows", label: "App Windows", layerId: "frontend", x: 0, y: -0.6, accent: "#22c55e" },
  { id: "scenes", label: "3D Scenes (R3F)", layerId: "frontend", x: 2.2, y: 0.7, accent: "#22c55e" },

  // Backend API
  { id: "aiapi", label: "AI Chat API", layerId: "backend", x: -1.8, y: 0.5, accent: "#a855f7" },
  { id: "proxies", label: "Data Proxies", layerId: "backend", x: 1.8, y: -0.3, accent: "#a855f7" },

  // External
  { id: "gemini", label: "Gemini API", layerId: "external", x: -2.4, y: 0.6, accent: "#f59e0b" },
  { id: "kb", label: "Content KB", layerId: "external", x: 0, y: -0.6, accent: "#f59e0b" },
  { id: "devapis", label: "GitHub / LeetCode / Wakatime", layerId: "external", x: 2.4, y: 0.5, accent: "#f59e0b" },
];

export const ARCH_EDGES: ArchEdge[] = [
  { from: "desktop", to: "wm" },
  { from: "desktop", to: "stores" },
  { from: "wm", to: "windows" },
  { from: "windows", to: "stores" },
  { from: "windows", to: "scenes" },
  { from: "windows", to: "aiapi" },
  { from: "windows", to: "proxies" },
  { from: "aiapi", to: "gemini" },
  { from: "aiapi", to: "kb" },
  { from: "proxies", to: "devapis" },
];
