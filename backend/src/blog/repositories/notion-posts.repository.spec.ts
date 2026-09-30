import { APIErrorCode, APIResponseError, type Client } from '@notionhq/client';
import { NotionPostsRepository } from './notion-posts.repository.js';

const DATA_SOURCE_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

function publishedPage(
  id: string,
  slug: string,
  dataSourceId = DATA_SOURCE_ID,
) {
  return {
    object: 'page',
    id,
    url: `https://www.notion.so/${id}`,
    last_edited_time: '2026-09-01T00:00:00.000Z',
    cover: null,
    parent: { type: 'data_source_id', data_source_id: dataSourceId },
    properties: {
      Name: { type: 'title', title: [{ plain_text: slug }] },
      Slug: { type: 'rich_text', rich_text: [{ plain_text: slug }] },
      Published: { type: 'checkbox', checkbox: true },
    },
  };
}

function createNotion() {
  return {
    databases: {
      retrieve: vi.fn().mockResolvedValue({
        object: 'database',
        id: 'db',
        title: [],
        data_sources: [{ id: DATA_SOURCE_ID, name: 'Posts' }],
      }),
    },
    dataSources: {
      query: vi.fn().mockResolvedValue({ results: [], next_cursor: null }),
      retrieve: vi.fn(),
    },
    pages: {
      retrieve: vi.fn(),
      retrieveMarkdown: vi.fn().mockResolvedValue({
        markdown: '# Hi',
        truncated: false,
        unknown_block_ids: [],
      }),
    },
  };
}

describe('NotionPostsRepository', () => {
  it('resolves the data source from a database URL once and reuses it', async () => {
    const notion = createNotion();
    const repo = new NotionPostsRepository(notion as unknown as Client, {
      databaseId:
        'https://www.notion.so/me/Blog-0123456789abcdef0123456789abcdef?v=1',
    });

    await repo.findAll({ limit: 5 });
    await repo.findAll({ limit: 5, tag: 'Notion' });

    expect(notion.databases.retrieve).toHaveBeenCalledTimes(1);
    expect(notion.databases.retrieve).toHaveBeenCalledWith({
      database_id: '01234567-89ab-cdef-0123-456789abcdef',
    });
    const [, secondQuery] = notion.dataSources.query.mock.calls;
    expect(secondQuery[0]).toMatchObject({
      data_source_id: DATA_SOURCE_ID,
      page_size: 5,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Tags', multi_select: { contains: 'Notion' } },
        ],
      },
    });
  });

  it('finds a post by slug and loads its markdown', async () => {
    const notion = createNotion();
    notion.dataSources.query.mockResolvedValueOnce({
      results: [publishedPage('p1', 'hello')],
      next_cursor: null,
    });
    const repo = new NotionPostsRepository(notion as unknown as Client, {
      dataSourceId: DATA_SOURCE_ID,
    });

    const post = await repo.findBySlug('hello');

    expect(post).toMatchObject({ slug: 'hello', content: '# Hi' });
    expect(notion.pages.retrieveMarkdown).toHaveBeenCalledWith({
      page_id: 'p1',
    });
  });

  it('finds a post by page ID when the database has no Slug column', async () => {
    const notion = createNotion();
    notion.dataSources.query.mockRejectedValueOnce(
      new APIResponseError({
        code: APIErrorCode.ValidationError,
        status: 400,
        message: 'Could not find property with name or id: Slug',
        headers: new Headers(),
        rawBodyText: '',
      }),
    );
    notion.pages.retrieve.mockResolvedValue(publishedPage('p3', ''));
    const repo = new NotionPostsRepository(notion as unknown as Client, {
      dataSourceId: DATA_SOURCE_ID,
    });

    const post = await repo.findBySlug('0123456789abcdef0123456789abcdef');

    expect(post).toMatchObject({ content: '# Hi' });
    expect(notion.pages.retrieve).toHaveBeenCalledWith({
      page_id: '0123456789abcdef0123456789abcdef',
    });
  });

  it('refuses pages by ID that live outside the blog data source', async () => {
    const notion = createNotion();
    notion.pages.retrieve.mockResolvedValue(
      publishedPage('p2', '', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
    );
    const repo = new NotionPostsRepository(notion as unknown as Client, {
      dataSourceId: DATA_SOURCE_ID,
    });

    await expect(
      repo.findBySlug('0123456789abcdef0123456789abcdef'),
    ).resolves.toBeNull();
    expect(notion.pages.retrieveMarkdown).not.toHaveBeenCalled();
  });
});
