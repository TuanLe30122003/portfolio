// Mirrors backend/src/blog/interfaces/post.interface.ts

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string | null;
  tags: string[];
  publishedAt: string | null;
  updatedAt: string;
}

export interface Post extends PostSummary {
  /** Notion-flavored Markdown. */
  content: string;
  readingTimeMinutes: number;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}
