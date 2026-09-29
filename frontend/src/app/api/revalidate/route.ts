import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { BLOG_CACHE_TAG, purgeApiCache } from "@/lib/api/blog";

/**
 * POST /api/revalidate  (header `x-revalidate-secret: <REVALIDATE_SECRET>`)
 *
 * Call after publishing/editing in Notion — manually, from a Notion database
 * automation ("Send webhook"), or from CI. Clears the API's Notion cache,
 * then expires every blog entry so the next visit renders fresh content.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret");

  if (!expected || !provided || !safeEqual(provided, expected)) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  try {
    await purgeApiCache(expected);
  } catch (error) {
    console.error("[revalidate] API cache purge failed:", error);
    return Response.json({ revalidated: false, message: "API cache purge failed" }, { status: 502 });
  }

  // Webhook callers can't use updateTag(); expire immediately so the next
  // request blocks on fresh data instead of serving the stale page once more.
  revalidateTag(BLOG_CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
