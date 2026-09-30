import type { PageObjectResponse } from '@notionhq/client';
import { POST_PROPERTIES as P } from '../blog.schema.js';
import { isPublished, toPostSummary } from './notion-post.mapper.js';

const text = (value: string) => [{ plain_text: value }];

function makePage(
  properties: Record<string, unknown>,
  extra: Partial<PageObjectResponse> = {},
): PageObjectResponse {
  return {
    object: 'page',
    id: '1f2e3d4c-5b6a-7980-a1b2-c3d4e5f6a7b8',
    last_edited_time: '2026-09-01T10:00:00.000Z',
    cover: null,
    properties,
    ...extra,
  } as unknown as PageObjectResponse;
}

describe('toPostSummary', () => {
  it('maps Notion properties to a post summary', () => {
    const page = makePage(
      {
        [P.title]: { type: 'title', title: text('Hello Notion') },
        [P.slug]: { type: 'rich_text', rich_text: text('hello-notion') },
        [P.description]: { type: 'rich_text', rich_text: text('First post') },
        [P.tags]: {
          type: 'multi_select',
          multi_select: [{ name: 'Next.js' }, { name: 'Notion' }],
        },
        [P.date]: { type: 'date', date: { start: '2026-09-01' } },
        [P.published]: { type: 'checkbox', checkbox: true },
      },
      {
        cover: {
          type: 'external',
          external: { url: 'https://example.com/c.png' },
        },
      } as Partial<PageObjectResponse>,
    );

    expect(toPostSummary(page)).toEqual({
      id: page.id,
      slug: 'hello-notion',
      title: 'Hello Notion',
      description: 'First post',
      cover: 'https://example.com/c.png',
      tags: ['Next.js', 'Notion'],
      publishedAt: '2026-09-01',
      updatedAt: '2026-09-01T10:00:00.000Z',
    });
    expect(isPublished(page)).toBe(true);
  });

  it('falls back to the compact page ID when Slug is empty', () => {
    const page = makePage({
      [P.title]: { type: 'title', title: text('No slug') },
      [P.slug]: { type: 'rich_text', rich_text: [] },
    });

    expect(toPostSummary(page).slug).toBe('1f2e3d4c5b6a7980a1b2c3d4e5f6a7b8');
  });

  it('tolerates missing or mistyped columns', () => {
    const page = makePage({ [P.tags]: { type: 'select', select: null } });

    expect(toPostSummary(page)).toMatchObject({
      title: 'Untitled',
      description: '',
      tags: [],
      publishedAt: null,
    });
    expect(isPublished(page)).toBe(false);
  });
});
