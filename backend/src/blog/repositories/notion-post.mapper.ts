import type { PageObjectResponse } from '@notionhq/client';
import {
  compactId,
  getCoverUrl,
  getProperty,
  toPlainText,
} from '../../notion/notion.utils.js';
import { POST_PROPERTIES as P } from '../blog.schema.js';
import type { PostSummary } from '../interfaces/post.interface.js';

export function toPostSummary(page: PageObjectResponse): PostSummary {
  const slug = toPlainText(getProperty(page, P.slug, 'rich_text')?.rich_text);

  return {
    id: page.id,
    slug: slug.trim() || compactId(page.id),
    title:
      toPlainText(getProperty(page, P.title, 'title')?.title) || 'Untitled',
    description: toPlainText(
      getProperty(page, P.description, 'rich_text')?.rich_text,
    ),
    cover: getCoverUrl(page),
    tags:
      getProperty(page, P.tags, 'multi_select')?.multi_select.map(
        (option) => option.name,
      ) ?? [],
    publishedAt: getProperty(page, P.date, 'date')?.date?.start ?? null,
    updatedAt: page.last_edited_time,
  };
}

export function isPublished(page: PageObjectResponse): boolean {
  return getProperty(page, P.published, 'checkbox')?.checkbox === true;
}
