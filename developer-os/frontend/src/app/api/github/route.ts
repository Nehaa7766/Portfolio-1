/**
 * GET /api/github — live GitHub stats for the configured user.
 * Server-only so GITHUB_TOKEN (if used) never reaches the browser.
 * Same-origin, so no CORS needed.
 */
import { getGithubStats } from "@/lib/github/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const stats = await getGithubStats();
    return Response.json(stats);
  } catch (err) {
    console.error("[/api/github] error:", err);
    const detail = err instanceof Error ? err.message : String(err);
    const isProd = process.env.NODE_ENV === "production";
    return Response.json(
      { error: isProd ? "Failed to load GitHub data." : `GitHub error: ${detail}` },
      { status: 500 },
    );
  }
}
