import {
  GraduationCap,
  Briefcase,
  FolderGit2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const RESUME = {
  name: "Neha Shinde",
  role: "Software Engineer",
  /** Place the actual file at /public/<downloadHref> to enable the download. */
  downloadHref: "/Neha_Shinde_Resume.pdf",
  fileName: "Neha_Shinde_Resume.pdf",
  lastUpdated: "May 24, 2025",
  pages: 2,
  format: "PDF Document",
  size: "1.2 MB",
};

export interface OverviewCard {
  icon: LucideIcon;
  title: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const RESUME_OVERVIEW: OverviewCard[] = [
  { icon: GraduationCap, title: "Education", primary: "Bachelor of Engineering", secondary: "Computer Engineering", accent: "#0ea5e9" },
  { icon: Briefcase, title: "Experience", primary: "Student Developer", secondary: "Building & Learning", accent: "#22c55e" },
  { icon: FolderGit2, title: "Projects", primary: "15+ Projects", secondary: "Full Stack Applications", accent: "#f59e0b" },
  { icon: Wrench, title: "Skills", primary: "20+ Technologies", secondary: "Full Stack Development", accent: "#a855f7" },
];

export const KEY_HIGHLIGHTS: string[] = [
  "Full Stack Developer with strong problem-solving skills",
  "Proficient in Java, Spring Boot, React, and MySQL",
  "Experience in building scalable web applications",
  "Passionate about clean code, testing, and automation",
  "Continuous learner with strong determination",
];

/** Content rendered inside the mini resume "paper" preview. */
export const PREVIEW_SKILLS: { name: string; level: number }[] = [
  { name: "JavaScript / TypeScript", level: 5 },
  { name: "React / Next.js", level: 5 },
  { name: "Java / Spring Boot", level: 4 },
  { name: "Databases", level: 4 },
];

export const PREVIEW_EDUCATION = {
  degree: "Bachelor of Engineering",
  field: "Computer Engineering",
  university: "Pune University",
  years: "2021 - 2025",
};
