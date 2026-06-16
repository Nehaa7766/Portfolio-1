/**
 * POST /api/ai/chat — the AI Assistant endpoint.
 *
 * Server-only (nodejs runtime), so the provider API key never reaches the
 * browser. Flow: load KB → retrieve relevant docs → inject as context →
 * call the LLM → return answer + sources. Same-origin, so no CORS needed.
 */
import { loadKnowledgeBase } from "@/lib/ai/knowledge-base";
import { searchDocuments } from "@/lib/ai/search";
import { generateAnswer } from "@/lib/ai/openai";
import type { ChatRequest, RetrievedDoc } from "@/types/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "The AI service is not configured. Set OPENAI_API_KEY in .env.local." },
      { status: 503 },
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json({ error: "A non-empty 'message' is required." }, { status: 400 });
  }
  if (message.length > 1000) {
    return Response.json({ error: "Message is too long (max 1000 characters)." }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  try {
    const kb = await loadKnowledgeBase();
    const matches = searchDocuments(message, kb, 3);

    // Fallback so the assistant always has baseline context about Neha.
    const used: RetrievedDoc[] =
      matches.length > 0
        ? matches
        : kb.filter((d) => d.slug === "profile/about").map((d) => ({ ...d, score: 0 }));

    const answer = await generateAnswer(message, used, history);
    return Response.json({ answer, sources: used.map((d) => d.slug) });
  } catch (err) {
    console.error("[/api/ai/chat] error:", err);
    const detail = err instanceof Error ? err.message : String(err);
    const isProd = process.env.NODE_ENV === "production";
    return Response.json(
      {
        error: isProd
          ? "Something went wrong while generating a response. Please try again."
          : `AI service error: ${detail}`,
      },
      { status: 500 },
    );
  }
}
