import { Logger } from '@nestjs/common';
import {
  APIErrorCode,
  APIResponseError,
  Client,
  extractDatabaseId,
  isFullDatabase,
  isFullDataSource,
  isFullPage,
  type PageObjectResponse,
  type QueryDataSourceParameters,
} from '@notionhq/client';
import { compactId, isNotionId } from '../../notion/notion.utils.js';
import { POST_PROPERTIES as P } from '../blog.schema.js';
import type {
  ListPostsOptions,
  Paginated,
  Post,
  PostSummary,
} from '../interfaces/post.interface.js';
import { isPublished, toPostSummary } from './notion-post.mapper.js';
import { estimateReadingTime, PostsRepository } from './posts.repository.js';

type QueryFilter = NonNullable<QueryDataSourceParameters['filter']>;
type FilterCondition = Extract<QueryFilter, { and: unknown }>['and'][number];

export interface NotionPostsOptions {
  /** Database ID or URL. Ignored when `dataSourceId` is set. */
  databaseId?: string;
  dataSourceId?: string;
}

const PUBLISHED_FILTER = {
  property: P.published,
  checkbox: { equals: true },
} satisfies FilterCondition;

/**
 * Reads posts from a Notion database (API version 2025-09-03+, where rows
 * live in a "data source" that belongs to the database).
 */
export class NotionPostsRepository extends PostsRepository {
  private readonly logger = new Logger(NotionPostsRepository.name);
  private dataSourceId?: Promise<string>;

  constructor(
    private readonly notion: Client,
    private readonly options: NotionPostsOptions,
  ) {
    super();
    if (!options.databaseId && !options.dataSourceId) {
      throw new Error(
        'NOTION_TOKEN is set but neither NOTION_DATABASE_ID nor NOTION_DATA_SOURCE_ID is',
      );
    }
  }

  async findAll({
    tag,
    cursor,
    limit,
  }: ListPostsOptions): Promise<Paginated<PostSummary>> {
    const filters: FilterCondition[] = [PUBLISHED_FILTER];
    if (tag) {
      filters.push({ property: P.tags, multi_select: { contains: tag } });
    }

    const response = await this.notion.dataSources.query({
      data_source_id: await this.getDataSourceId(),
      filter: { and: filters },
      sorts: [
        { property: P.date, direction: 'descending' },
        { timestamp: 'created_time', direction: 'descending' },
      ],
      start_cursor: cursor,
      page_size: limit,
    });

    return {
      items: response.results.filter(isFullPage).map(toPostSummary),
      nextCursor: response.next_cursor,
    };
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const page = await this.findPage(slug);
    if (!page) return null;

    const { markdown, truncated, unknown_block_ids } =
      await this.notion.pages.retrieveMarkdown({ page_id: page.id });
    if (truncated || unknown_block_ids.length > 0) {
      this.logger.warn(
        `Post "${slug}": markdown export incomplete (truncated=${truncated}, unsupported blocks=${unknown_block_ids.length})`,
      );
    }

    return {
      ...toPostSummary(page),
      content: markdown,
      readingTimeMinutes: estimateReadingTime(markdown),
    };
  }

  async findTags(): Promise<string[]> {
    const dataSource = await this.notion.dataSources.retrieve({
      data_source_id: await this.getDataSourceId(),
    });
    if (!isFullDataSource(dataSource)) return [];

    const tags = dataSource.properties[P.tags];
    return tags?.type === 'multi_select'
      ? tags.multi_select.options.map((option) => option.name)
      : [];
  }

  /** Looks up by the Slug property first, then by page ID (posts without a slug). */
  private async findPage(slug: string): Promise<PageObjectResponse | null> {
    const dataSourceId = await this.getDataSourceId();

    const bySlug = await this.findPageBySlugProperty(dataSourceId, slug);
    if (bySlug) return bySlug;

    if (!isNotionId(slug)) return null;
    try {
      const page = await this.notion.pages.retrieve({ page_id: slug });
      // Only expose published pages that belong to the blog data source,
      // not any page the integration happens to have access to.
      const belongsToBlog =
        isFullPage(page) &&
        page.parent.type === 'data_source_id' &&
        compactId(page.parent.data_source_id) === compactId(dataSourceId);
      return belongsToBlog && isPublished(page) ? page : null;
    } catch (error) {
      if (
        error instanceof APIResponseError &&
        error.code === APIErrorCode.ObjectNotFound
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * The Slug column is optional: without it every post is addressed by its
   * page ID (see toPostSummary), so a missing column just means "no match".
   */
  private async findPageBySlugProperty(
    dataSourceId: string,
    slug: string,
  ): Promise<PageObjectResponse | null> {
    try {
      const { results } = await this.notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          and: [
            PUBLISHED_FILTER,
            { property: P.slug, rich_text: { equals: slug } },
          ],
        },
        page_size: 1,
      });
      return results.find(isFullPage) ?? null;
    } catch (error) {
      if (
        error instanceof APIResponseError &&
        error.code === APIErrorCode.ValidationError &&
        error.message.includes(`property with name or id: ${P.slug}`)
      ) {
        return null;
      }
      throw error;
    }
  }

  private getDataSourceId(): Promise<string> {
    this.dataSourceId ??= this.resolveDataSourceId().catch((error: unknown) => {
      this.dataSourceId = undefined; // retry on the next request
      throw error;
    });
    return this.dataSourceId;
  }

  private async resolveDataSourceId(): Promise<string> {
    if (this.options.dataSourceId) return this.options.dataSourceId;

    const input = this.options.databaseId!;
    const databaseId = extractDatabaseId(input) ?? input;
    const database = await this.notion.databases.retrieve({
      database_id: databaseId,
    });
    const dataSource = isFullDatabase(database)
      ? database.data_sources[0]
      : undefined;
    if (!dataSource) {
      throw new Error(`Notion database ${databaseId} has no data source`);
    }
    if (isFullDatabase(database) && database.data_sources.length > 1) {
      this.logger.warn(
        `Database has ${database.data_sources.length} data sources; using "${dataSource.name}". Set NOTION_DATA_SOURCE_ID to pick another.`,
      );
    }
    return dataSource.id;
  }
}
