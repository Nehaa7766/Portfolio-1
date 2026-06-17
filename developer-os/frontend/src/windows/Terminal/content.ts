/**
 * Terminal-specific content canon. The interactive terminal tells a focused,
 * recruiter-facing story, so it has its own curated project list and profile
 * blurbs (some values are shared with the windowed apps' data files).
 */
import { STATS } from "@/data/about";
import { CONTACT_METHODS } from "@/data/contact";

export const TERMINAL_VERSION = "1.0.0";
export const WINDOWS_VERSION = "11.0";

export const IDENTITY = {
  name: "Neha Shinde",
  titles: ["Software Engineer", "Full Stack Developer"],
  location: "Pune, Maharashtra, India",
};

/** Headline skills surfaced by `whoami`. */
export const CORE_SKILLS = [
  "Java",
  "Spring Boot",
  "React",
  "Next.js",
  "Automation Testing",
];

export interface TerminalProject {
  /** Argument key used by `project <key>`. */
  key: string;
  index: string;
  name: string;
  tagline: string;
  stack: string[];
  status: "Completed" | "In Progress" | "Planned";
  highlights: string[];
}

export const TERMINAL_PROJECTS: TerminalProject[] = [
  {
    key: "developeros",
    index: "01",
    name: "DeveloperOS",
    tagline: "Interactive Developer Portfolio",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Zustand"],
    status: "In Progress",
    highlights: [
      "Desktop-OS metaphor with draggable, focusable windows.",
      "Live GitHub activity widget and an AI assistant.",
      "This very terminal — a command-driven portfolio shell.",
    ],
  },
  {
    key: "hms",
    index: "02",
    name: "Hospital Management System",
    tagline: "Spring Boot + React",
    stack: ["React", "Spring Boot", "MySQL", "REST"],
    status: "Completed",
    highlights: [
      "Appointment booking, patient records, billing and reporting.",
      "Role-based access for admins, doctors and patients.",
      "Layered backend with a normalized relational schema.",
    ],
  },
  {
    key: "ess",
    index: "03",
    name: "Employee Self Service Platform",
    tagline: "Multi-Tenant HRMS",
    stack: ["Spring Boot", "React", "PostgreSQL", "JWT"],
    status: "Completed",
    highlights: [
      "Multi-tenant HR platform with isolated org workspaces.",
      "Leave, attendance and payroll self-service modules.",
      "Secured with JWT auth and granular permissions.",
    ],
  },
  {
    key: "rawmix",
    index: "04",
    name: "Raw Mix Calculation Engine",
    tagline: "Industrial Automation Platform",
    stack: ["Java", "Spring Boot", "Optimization", "REST"],
    status: "Completed",
    highlights: [
      "Computes optimal raw-material blends for cement production.",
      "Constraint-based calculation engine with live recalculation.",
      "Replaces error-prone manual spreadsheets on the plant floor.",
    ],
  },
];

export const EDUCATION = {
  degree: "Bachelor of Engineering",
  field: "Computer Engineering",
  university: "Pune University",
  years: "2021 - 2025",
};

/** `stats` output, sourced from the shared About data. */
export const TERMINAL_STATS = STATS.map((s) => ({ label: s.label, value: s.value }));

export const CONTACTS = CONTACT_METHODS.map((c) => ({
  label: c.label,
  value: c.value,
  href: c.href,
}));

/** Static learning roadmap for the `roadmap` command. */
export const ROADMAP: { phase: string; items: string[] }[] = [
  {
    phase: "Foundations",
    items: ["Data Structures & Algorithms", "OOP & Design Patterns", "Git & CLI workflows"],
  },
  {
    phase: "Full Stack",
    items: ["Java & Spring Boot", "React & Next.js", "REST & relational databases"],
  },
  {
    phase: "Engineering Depth",
    items: ["System design fundamentals", "Automation & integration testing", "CI/CD and Docker"],
  },
  {
    phase: "Next",
    items: ["Distributed systems", "Observability & performance", "Cloud architecture (AWS)"],
  },
];
