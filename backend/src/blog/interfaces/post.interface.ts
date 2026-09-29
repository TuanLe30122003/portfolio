// Keep in sync with frontend/src/types/blog.ts

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string | null;
  tags: string[];
  /** ISO date (YYYY-MM-DD or full ISO string) from the "Date" property. */
  publishedAt: string | null;
  updatedAt: string;
}

export interface Post extends PostSummary {
  /** Page body as Markdown (Notion-flavored). */
  content: string;
  readingTimeMinutes: number;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ListPostsOptions {
  tag?: string;
  cursor?: string;
  limit: number;
}
