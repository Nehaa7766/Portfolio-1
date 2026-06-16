/**
 * LLM service (server-only). Builds a context-injected prompt from the
 * retrieved knowledge-base documents and calls a Chat Completions API.
 *
 * Uses the OpenAI SDK, which also works with any OpenAI-compatible endpoint
 * (e.g. NVIDIA NIM at https://integrate.api.nvidia.com/v1). Configure via:
 *   OPENAI_API_KEY   – the provider key (NVIDIA keys start with "nvapi-")
 *   OPENAI_BASE_URL  – optional; set to the provider's base URL
 *   OPENAI_MODEL     – model id (e.g. "z-ai/glm-4.6", "gpt-4o-mini")
 *
 * The key is read from the environment and is NEVER sent to the client.
 */
import "server-only";
import OpenAI from "openai";
import type { HistoryItem, RetrievedDoc } from "@/types/ai";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const BASE_URL = process.env.OPENAI_BASE_URL;
const MAX_HISTORY = 6;

let client: OpenAI | null = null;

/** Lazily construct the client so a missing key fails at request time, not import. */
function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // When set, routes requests to an OpenAI-compatible provider (e.g. NVIDIA).
      ...(BASE_URL ? { baseURL: BASE_URL } : {}),
    });
  }
  return client;
}

function buildContext(docs: RetrievedDoc[]): string {
  if (docs.length === 0) return "(no relevant documents found)";
  return docs
    .map((d) => `### ${d.title}  [source: ${d.slug}]\n${d.content}`)
    .join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `You are the AI assistant for Neha Shinde's portfolio, "DeveloperOS".
You answer questions about Neha's profile, resume, experience, skills, projects,
engineering decisions, code-review cases, and blog posts.

Rules:
- Answer ONLY using the information in the CONTEXT below.
- If the answer is not in the context, say you don't have that information in the
  knowledge base, and suggest a related topic you do know about.
- Be concise, friendly, and professional. Use markdown (short paragraphs, bullet
  points) when helpful.
- Speak about Neha in the third person (e.g. "Neha built...").
- Never invent facts, numbers, or technologies that are not in the context.`;

/**
 * Generate an answer grounded in the retrieved documents.
 */
export async function generateAnswer(
  question: string,
  docs: RetrievedDoc[],
  history: HistoryItem[] = [],
): Promise<string> {
  const openai = getClient();

  const recentHistory = history.slice(-MAX_HISTORY);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    max_tokens: 700,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `CONTEXT:\n\n${buildContext(docs)}` },
      ...recentHistory.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: question },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Sorry, I couldn't generate a response. Please try again."
  );
}
