/**
 * Knowledge base loader (server-only).
 *
 * Reads every markdown file under `content/`, parses frontmatter with
 * gray-matter, and caches the result in memory.
 */
import "server-only";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import type { KbDocument } from "@/types/ai";

const CONTENT_DIR = path.join(process.cwd(), "content");

let cache: KbDocument[] | null = null;

/** Recursively collect all `.md` file paths under a directory. */
async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdownFiles(full);
      return entry.name.endsWith(".md") ? [full] : [];
    }),
  );
  return files.flat();
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

/**
 * Load and parse the entire knowledge base. Cached after the first call for
 * the lifetime of the server process.
 */
export async function loadKnowledgeBase(): Promise<KbDocument[]> {
  if (cache) return cache;

  let files: string[] = [];
  try {
    files = await collectMarkdownFiles(CONTENT_DIR);
  } catch {
    cache = [];
    return cache;
  }

  const docs = await Promise.all(
    files.map(async (file): Promise<KbDocument> => {
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = matter(raw);
      const slug = path
        .relative(CONTENT_DIR, file)
        .replace(/\\/g, "/")
        .replace(/\.md$/, "");

      return {
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        category: typeof data.category === "string" ? data.category : "",
        tags: toStringArray(data.tags),
        summary: typeof data.summary === "string" ? data.summary : "",
        content: content.trim(),
      };
    }),
  );

  cache = docs;
  return cache;
}

/** Test/dev helper to clear the in-memory cache. */
export function clearKnowledgeBaseCache(): void {
  cache = null;
}
