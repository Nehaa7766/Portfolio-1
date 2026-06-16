import {
  Building2,
  ShoppingCart,
  BarChart3,
  Code2,
  LayoutGrid,
  Layers,
  Server,
  Monitor,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ProjectStatus = "Completed" | "In Progress" | "Planned";

export type ProjectCategory =
  | "Full Stack"
  | "Backend"
  | "Frontend"
  | "DevOps"
  | "Tools & Utilities";

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Marks a flagship project (shown with a star). */
  featured: boolean;
  category: ProjectCategory;
  tech: string[];
  status: ProjectStatus;
  /** Human label, e.g. "Apr 2024" or "Upcoming". */
  date: string;
  stars: number;
  commits: number;
  icon: LucideIcon;
  /** Hex accent used for the icon tile / card edge. */
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: "hospital",
    title: "Hospital Management System",
    description:
      "Full stack hospital management solution with appointment booking, patient management, billing, and reporting.",
    featured: true,
    category: "Full Stack",
    tech: ["React", "Spring Boot", "MySQL", "Tailwind CSS"],
    status: "Completed",
    date: "Apr 2024",
    stars: 128,
    commits: 458,
    icon: Building2,
    accent: "#a855f7",
  },
  {
    id: "ecommerce",
    title: "Smart E-Commerce Platform",
    description:
      "Modern e-commerce platform with AI recommendations, secure payments, and order tracking.",
    featured: true,
    category: "Full Stack",
    tech: ["Next.js", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    status: "In Progress",
    date: "Jan 2024",
    stars: 96,
    commits: 312,
    icon: ShoppingCart,
    accent: "#22c55e",
  },
  {
    id: "analytics",
    title: "Developer Analytics Dashboard",
    description:
      "Real-time analytics dashboard to track development productivity and GitHub metrics.",
    featured: true,
    category: "Frontend",
    tech: ["Next.js", "TypeScript", "Chart.js", "GitHub API", "Tailwind CSS"],
    status: "Completed",
    date: "Dec 2023",
    stars: 72,
    commits: 245,
    icon: BarChart3,
    accent: "#f59e0b",
  },
  {
    id: "snippets",
    title: "Code Snippet Manager",
    description:
      "Organize, search, and manage code snippets efficiently with tags and collections.",
    featured: false,
    category: "Tools & Utilities",
    tech: ["React", "LocalStorage", "Tailwind CSS"],
    status: "Planned",
    date: "Upcoming",
    stars: 0,
    commits: 0,
    icon: Code2,
    accent: "#0ea5e9",
  },
];

/** Sidebar navigation categories ("All" plus each real category). */
export const PROJECT_NAV: { id: ProjectCategory | "All"; label: string; icon: LucideIcon }[] = [
  { id: "All", label: "All Projects", icon: LayoutGrid },
  { id: "Full Stack", label: "Full Stack", icon: Layers },
  { id: "Backend", label: "Backend", icon: Server },
  { id: "Frontend", label: "Frontend", icon: Monitor },
  { id: "DevOps", label: "DevOps", icon: Settings },
  { id: "Tools & Utilities", label: "Tools & Utilities", icon: Wrench },
];

/** Unique, sorted list of all technologies across projects (for the filter). */
export const ALL_TECHNOLOGIES: string[] = Array.from(
  new Set(PROJECTS.flatMap((p) => p.tech)),
).sort();

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Completed",
  "In Progress",
  "Planned",
];

/** Count of projects in a given category (or all). */
export function countByCategory(category: ProjectCategory | "All"): number {
  return category === "All"
    ? PROJECTS.length
    : PROJECTS.filter((p) => p.category === category).length;
}
