import type {
  ListPostsOptions,
  Paginated,
  Post,
  PostSummary,
} from '../interfaces/post.interface.js';
import { estimateReadingTime, PostsRepository } from './posts.repository.js';

/** In-memory posts used when NOTION_TOKEN is not configured (local dev, tests). */
export class MockPostsRepository extends PostsRepository {
  private readonly posts: Post[] = SAMPLE_POSTS.map((post) => ({
    ...post,
    readingTimeMinutes: estimateReadingTime(post.content),
  }));

  findAll({
    tag,
    cursor,
    limit,
  }: ListPostsOptions): Promise<Paginated<PostSummary>> {
    const matching = this.posts.filter(
      (post) => !tag || post.tags.includes(tag),
    );
    const start = cursor ? Number(cursor) : 0;
    const end = start + limit;

    return Promise.resolve({
      items: matching.slice(start, end).map(toSummary),
      nextCursor: end < matching.length ? String(end) : null,
    });
  }

  findBySlug(slug: string): Promise<Post | null> {
    return Promise.resolve(this.posts.find((p) => p.slug === slug) ?? null);
  }

  findTags(): Promise<string[]> {
    return Promise.resolve([...new Set(this.posts.flatMap((p) => p.tags))]);
  }
}

function toSummary(post: Post): PostSummary {
  const { id, slug, title, description, cover, tags, publishedAt, updatedAt } =
    post;
  return { id, slug, title, description, cover, tags, publishedAt, updatedAt };
}

/**
 * Content mirrors what GET /v1/pages/:id/markdown returns ("Notion-flavored
 * Markdown": one "\n" between blocks, tab-indented children inside tags),
 * so the frontend renderer is exercised exactly as with real Notion data.
 */
const SAMPLE_POSTS: Omit<Post, 'readingTimeMinutes'>[] = [
  {
    id: 'mock-1',
    slug: 'scroll-animation-doc-ngang-doc',
    title: 'Dựng scroll animation dọc → ngang → dọc với GSAP',
    description:
      'Pin một section, đổi trục cuộn sang ngang rồi trả lại trục dọc — kỹ thuật đằng sau trang chủ này.',
    cover: null,
    tags: ['Animation', 'Next.js'],
    publishedAt: '2026-09-20',
    updatedAt: '2026-09-20T08:00:00.000Z',
    content: [
      'Đây là bài viết mẫu từ **MockPostsRepository**. Đặt `NOTION_TOKEN` và `NOTION_DATABASE_ID` ở backend để lấy bài thật từ Notion.',
      '<callout icon="💡" color="yellow_bg">',
      '\tSection được **pin** lại trong lúc bạn tiếp tục cuộn dọc; quãng cuộn đó được quy đổi thành `translateX` của track bên trong.',
      '</callout>',
      '## Ý tưởng {color="yellow"}',
      'Tính quãng đường cần trượt ngang bằng `scrollWidth - innerWidth`, rồi dùng chính con số đó làm độ dài cuộn dọc:',
      '```typescript',
      'gsap.to(track, {',
      '  x: () => -(track.scrollWidth - window.innerWidth),',
      "  ease: 'none',",
      '  scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => `+=${track.scrollWidth}` },',
      '});',
      '```',
      '## Checklist',
      '<table header-row="true">',
      '\t<tr>',
      '\t\t<td>Việc</td>',
      '\t\t<td>Lý do</td>',
      '\t</tr>',
      '\t<tr>',
      '\t\t<td><code>invalidateOnRefresh</code></td>',
      '\t\t<td>Tính lại kích thước khi resize</td>',
      '\t</tr>',
      '\t<tr>',
      '\t\t<td><code>prefers-reduced-motion</code></td>',
      '\t\t<td>Tôn trọng cài đặt của người dùng</td>',
      '\t</tr>',
      '</table>',
      '> Mẹo: dùng `containerAnimation` để animate phần tử *bên trong* track ngang.',
    ].join('\n'),
  },
  {
    id: 'mock-2',
    slug: 'notion-lam-cms',
    title: 'Dùng Notion làm CMS cho blog cá nhân',
    description:
      'Viết bài trong Notion, NestJS đọc qua Notion API và Next.js render thành trang tĩnh.',
    cover: null,
    tags: ['Notion', 'NestJS'],
    publishedAt: '2026-09-12',
    updatedAt: '2026-09-12T08:00:00.000Z',
    content: [
      '## Luồng dữ liệu',
      '1. Viết bài trong database Notion, tick **Published**.',
      '2. Backend gọi `dataSources.query` để lấy danh sách và `pages.retrieveMarkdown` để lấy nội dung.',
      "3. Frontend cache kết quả với `'use cache'` và gọi `revalidateTag` khi có bài mới.",
      'Hai đoạn văn liền nhau trong Notion là hai block riêng.',
      'Đây là block thứ hai<br>và một dòng xuống hàng bên trong block.',
      '<details>',
      '<summary>Vì sao không dùng thư viện convert block → markdown?</summary>',
      '\tNotion API đã có endpoint `GET /v1/pages/:id/markdown` trả về *Notion-flavored Markdown*:',
      '\t- Callout, toggle, columns là thẻ XML',
      '\t\t- Con được thụt lề bằng tab',
      '\t- Màu sắc là `{color="..."}`',
      '</details>',
      '<columns>',
      '\t<column>',
      '\t\t### Backend',
      '\t\tGọi Notion, cache, trả JSON.',
      '\t</column>',
      '\t<column>',
      '\t\t### Frontend',
      '\t\tRender Markdown, cache bằng `cacheTag`.',
      '\t</column>',
      '</columns>',
      '- [x] Không cần thư viện convert block → markdown',
      '- [ ] Thêm webhook từ Notion để tự revalidate',
    ].join('\n'),
  },
  {
    id: 'mock-3',
    slug: 'cau-truc-du-an-fe-be',
    title: 'Cấu trúc dự án tách FE / BE',
    description:
      'Vì sao tách Next.js và NestJS thành hai ứng dụng độc lập, và chúng nói chuyện với nhau thế nào.',
    cover: null,
    tags: ['Architecture'],
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-01T08:00:00.000Z',
    content: [
      'Frontend chỉ biết một biến môi trường: `API_URL`. Mọi thứ liên quan tới Notion (token, database, cache) nằm ở backend.',
      '```bash',
      'curl "http://localhost:4000/api/blog/posts?limit=3"',
      '```',
      'Được viết bởi <mention-user url="user://1">Bạn</mention-user> vào <mention-date start="2026-09-01"/>.',
    ].join('\n'),
  },
];
