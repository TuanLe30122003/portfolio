import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { ListPostsQueryDto } from './dto/list-posts.query.dto.js';
import type {
  Paginated,
  Post,
  PostSummary,
} from './interfaces/post.interface.js';
import { PostsRepository } from './repositories/posts.repository.js';

/**
 * Caches repository reads so page views don't each cost a Notion API call
 * (Notion allows ~3 requests/second per integration).
 */
@Injectable()
export class BlogService {
  constructor(
    private readonly posts: PostsRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  listPosts({
    tag,
    cursor,
    limit,
  }: ListPostsQueryDto): Promise<Paginated<PostSummary>> {
    return this.cache.wrap(
      `blog:posts:${tag ?? '*'}:${cursor ?? ''}:${limit}`,
      () => this.posts.findAll({ tag, cursor, limit }),
    );
  }

  async getPost(slug: string): Promise<Post> {
    const post = await this.cache.wrap(`blog:post:${slug}`, () =>
      this.posts.findBySlug(slug),
    );
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return post;
  }

  listTags(): Promise<string[]> {
    return this.cache.wrap('blog:tags', () => this.posts.findTags());
  }

  async purgeCache(): Promise<void> {
    await this.cache.clear();
  }
}
