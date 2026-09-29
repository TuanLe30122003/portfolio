import type {
  ListPostsOptions,
  Paginated,
  Post,
  PostSummary,
} from '../interfaces/post.interface.js';

/**
 * Storage-agnostic contract for blog posts. BlogService depends on this
 * abstract class (also used as the DI token), so the Notion source can be
 * swapped for the mock, a CMS or a database without touching the API layer.
 */
export abstract class PostsRepository {
  /** Published posts, newest first. */
  abstract findAll(options: ListPostsOptions): Promise<Paginated<PostSummary>>;

  /** A published post with its content, or `null` if none matches. */
  abstract findBySlug(slug: string): Promise<Post | null>;

  abstract findTags(): Promise<string[]>;
}

export function estimateReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
