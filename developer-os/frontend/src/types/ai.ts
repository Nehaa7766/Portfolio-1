/** AI Assistant types (shared by the UI and the server-side API/lib). */

export type ChatRole = "user" | "assistant";

/* ---- Knowledge base / retrieval (server) ---- */

export interface KbDocument {
  /** Path-based id, e.g. "projects/hospital-management". */
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  /** Markdown body (frontmatter stripped). */
  content: string;
}

export interface RetrievedDoc extends KbDocument {
  score: number;
}

/* ---- Chat (UI + API) ---- */

/** A message rendered in the chat UI. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Knowledge-base slugs used to answer (assistant messages only). */
  sources?: string[];
  createdAt: number;
}

/** Minimal history item exchanged with the API. */
export interface HistoryItem {
  role: ChatRole;
  content: string;
}

/** Request body for POST /api/ai/chat. */
export interface ChatRequest {
  message: string;
  history?: HistoryItem[];
}

/** Successful response from POST /api/ai/chat. */
export interface ChatResponse {
  answer: string;
  sources: string[];
}

/** Error response shape. */
export interface ChatErrorResponse {
  error: string;
}
