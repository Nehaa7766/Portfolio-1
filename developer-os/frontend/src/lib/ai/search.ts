/**
 * Document retrieval (V1: keyword scoring — no embeddings, no vector DB).
 *
 * Each document is scored against the query by counting term matches, with
 * frontmatter fields weighted higher than the body (title > tags > summary >
 * content). The top-K scoring documents are returned for context injection.
 */
import type { KbDocument, RetrievedDoc } from "@/types/ai";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "do", "does", "did", "your", "you",
  "me", "my", "i", "about", "tell", "what", "why", "how", "who", "which", "can",
  "could", "would", "please", "give", "show", "it", "this", "that", "their",
]);

const WEIGHTS = { title: 5, tags: 4, summary: 3, content: 1 } as const;

/** Lowercase, split on non-word chars, drop short tokens and stopwords. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function countOccurrences(haystack: string, term: string): number {
  if (!haystack) return 0;
  let count = 0;
  let idx = haystack.indexOf(term);
  while (idx !== -1) {
    count += 1;
    idx = haystack.indexOf(term, idx + term.length);
  }
  return count;
}

function scoreDocument(doc: KbDocument, terms: string[], rawQuery: string): number {
  const title = doc.title.toLowerCase();
  const tags = doc.tags.join(" ").toLowerCase();
  const summary = doc.summary.toLowerCase();
  const body = doc.content.toLowerCase();

  let score = 0;
  for (const term of terms) {
    score += countOccurrences(title, term) * WEIGHTS.title;
    score += countOccurrences(tags, term) * WEIGHTS.tags;
    score += countOccurrences(summary, term) * WEIGHTS.summary;
    score += Math.min(countOccurrences(body, term), 5) * WEIGHTS.content;
  }

  // Bonus when the whole query phrase appears in a high-signal field.
  const phrase = rawQuery.toLowerCase().trim();
  if (phrase.length > 3) {
    if (title.includes(phrase)) score += 10;
    if (tags.includes(phrase) || summary.includes(phrase)) score += 6;
  }

  return score;
}

/**
 * Return the top-K most relevant documents for a query.
 * Documents with a zero score are excluded.
 */
export function searchDocuments(
  query: string,
  docs: KbDocument[],
  k = 3,
): RetrievedDoc[] {
  const terms = Array.from(new Set(tokenize(query)));
  if (terms.length === 0) return [];

  return docs
    .map((doc) => ({ ...doc, score: scoreDocument(doc, terms, query) }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
