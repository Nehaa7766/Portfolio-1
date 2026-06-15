/**
 * Featured projects surfaced in the Mission Control overview.
 * Phase 1 placeholder data — real content arrives in later phases.
 */
export interface FeaturedProject {
  id: string;
  title: string;
  tagline: string;
  /** Hex accent used for the card's emissive edge / highlight. */
  accent: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  { id: "p1", title: "DeveloperOS", tagline: "Browser-based engineer OS", accent: "#0ea5e9" },
  { id: "p2", title: "Realtime Chat", tagline: "WebSocket • presence • E2E", accent: "#22c55e" },
  { id: "p3", title: "Vision Pipeline", tagline: "ML inference at the edge", accent: "#a855f7" },
  { id: "p4", title: "Payments API", tagline: "Idempotent • PCI-aware", accent: "#f59e0b" },
  { id: "p5", title: "Graph Search", tagline: "Vector + keyword hybrid", accent: "#ef4444" },
  { id: "p6", title: "Infra Toolkit", tagline: "IaC • observability", accent: "#14b8a6" },
];
