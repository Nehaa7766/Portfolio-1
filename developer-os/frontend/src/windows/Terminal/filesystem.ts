/**
 * A small read-only fake filesystem rooted at C:\DeveloperOS, backing the
 * `ls`, `cd`, `cat`, `tree` and `pwd` commands.
 */
import type { Line } from "./types";
import {
  IDENTITY,
  CORE_SKILLS,
  EDUCATION,
  TERMINAL_PROJECTS,
  CONTACTS,
} from "./content";

export const ROOT_LABEL = "C:\\DeveloperOS";

export interface FileNode {
  type: "file";
  content: () => Line[];
}
export interface DirNode {
  type: "dir";
  children: Record<string, FsNode>;
}
export type FsNode = FileNode | DirNode;

function file(content: () => Line[]): FileNode {
  return { type: "file", content };
}
function dir(children: Record<string, FsNode>): DirNode {
  return { type: "dir", children };
}

export const FILE_SYSTEM: DirNode = dir({
  "README.md": file(() => [
    { text: "# DeveloperOS", tone: "heading" },
    { text: "A browser-based developer operating system and portfolio.", tone: "default" },
    { text: "" },
    { text: 'Run "help" to list every available command.', tone: "muted" },
  ]),
  "resume.pdf": file(() => [
    { text: "resume.pdf is a binary document.", tone: "muted" },
    { text: 'Run "resume" to view a summary or download it.', tone: "default" },
  ]),
  profile: dir({
    "about.txt": file(() => [
      { text: IDENTITY.name, tone: "heading" },
      { text: IDENTITY.titles.join("  •  "), tone: "accent" },
      { text: IDENTITY.location, tone: "muted" },
    ]),
    "skills.txt": file(() => CORE_SKILLS.map((s) => ({ text: `- ${s}`, tone: "default" as const }))),
    "education.txt": file(() => [
      { text: `${EDUCATION.degree} — ${EDUCATION.field}`, tone: "default" },
      { text: `${EDUCATION.university}  (${EDUCATION.years})`, tone: "muted" },
    ]),
    "contact.txt": file(() =>
      CONTACTS.map((c) => ({
        text: `${c.label.padEnd(10)} ${c.value}`,
        tone: "default" as const,
        href: c.href,
      })),
    ),
  }),
  projects: dir(
    TERMINAL_PROJECTS.reduce<Record<string, FsNode>>((acc, p) => {
      acc[`${p.key}.md`] = file(() => [
        { text: p.name, tone: "heading" },
        { text: p.tagline, tone: "accent" },
        { text: `Stack: ${p.stack.join(", ")}`, tone: "muted" },
        { text: "" },
        ...p.highlights.map((h) => ({ text: `- ${h}`, tone: "default" as const })),
      ]);
      return acc;
    }, {}),
  ),
});

/** Resolve a path (relative to `cwd`) into normalized segments, or null if invalid. */
export function resolvePath(cwd: string[], input: string): string[] | null {
  const raw = input.trim().replace(/\\/g, "/");
  // Absolute paths: a leading slash or a `C:` drive prefix → start from root.
  const isAbsolute = raw.startsWith("/") || raw.slice(0, 2).toLowerCase() === "c:";
  const segments = isAbsolute ? [] : [...cwd];

  for (const part of raw.split("/")) {
    if (part === "" || part === "." || part.toLowerCase() === "c:") continue;
    if (part === "..") {
      if (segments.length > 0) segments.pop();
      continue;
    }
    segments.push(part);
  }
  return segments;
}

/** Walk segments from the root, returning the node or null. */
export function nodeAt(segments: string[]): FsNode | null {
  let node: FsNode = FILE_SYSTEM;
  for (const seg of segments) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children[seg];
    if (!next) return null;
    node = next;
  }
  return node;
}

/** Display string for the prompt, e.g. `C:\DeveloperOS\projects`. */
export function pathLabel(segments: string[]): string {
  return [ROOT_LABEL, ...segments].join("\\");
}

/** A `tree` rendering of a directory node. */
export function treeLines(node: DirNode, prefix = ""): Line[] {
  const entries = Object.entries(node.children);
  const out: Line[] = [];
  entries.forEach(([name, child], i) => {
    const last = i === entries.length - 1;
    const branch = last ? "└── " : "├── ";
    const isDir = child.type === "dir";
    out.push({
      text: `${prefix}${branch}${name}${isDir ? "/" : ""}`,
      tone: isDir ? "accent" : "default",
    });
    if (child.type === "dir") {
      out.push(...treeLines(child, prefix + (last ? "    " : "│   ")));
    }
  });
  return out;
}
