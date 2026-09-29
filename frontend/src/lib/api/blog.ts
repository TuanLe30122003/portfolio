import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Paginated, Post, PostSummary } from "@/types/blog";
import { ApiError, apiFetch } from "./client";

/** Every blog entry is tagged with this; /api/revalidate expires them all at once. */
export const BLOG_CACHE_TAG = "blog";

export interface PostListResult extends Paginated<PostSummary> {
  /** True when the API could not be reached; render a friendly fallback. */
  unavailable?: boolean;
}

// Each getter caches with the "notion" profile (next.config.ts). Failures are
// cached with the short "seconds" profile so an API outage isn't pinned into
// the static shell — short-lived entries render dynamically inside <Suspense>.

export async function getPosts(query: { tag?: string; cursor?: string; limit?: number } = {}): Promise<PostListResult> {
  "use cache";
  cacheTag(BLOG_CACHE_TAG);
  try {
    const result = await apiFetch<Paginated<PostSummary>>("/blog/posts", { query });
    cacheLife("notion");
    return result;
  } catch (error) {
    cacheLife("seconds");
    console.error("[blog] getPosts failed:", error);
    return { items: [], nextCursor: null, unavailable: true };
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(BLOG_CACHE_TAG, `blog:${slug}`);
  try {
    const post = await apiFetch<Post>(`/blog/posts/${encodeURIComponent(slug)}`);
    cacheLife("notion");
    return post;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      cacheLife("minutes");
      return null;
    }
    throw error;
  }
}

export async function getTags(): Promise<string[]> {
  "use cache";
  cacheTag(BLOG_CACHE_TAG);
  try {
    const tags = await apiFetch<string[]>("/blog/tags");
    cacheLife("notion");
    return tags;
  } catch (error) {
    cacheLife("seconds");
    console.error("[blog] getTags failed:", error);
    return [];
  }
}

/** Server-to-server call that drops the API's in-memory Notion cache. */
export async function purgeApiCache(secret: string): Promise<void> {
  await apiFetch<void>("/blog/revalidate", {
    method: "POST",
    headers: { "x-revalidate-secret": secret },
  });
}
