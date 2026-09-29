import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client';

type PageProperty = PageObjectResponse['properties'][string];
type PropertyOfType<T extends PageProperty['type']> = Extract<
  PageProperty,
  { type: T }
>;

/** Reads a page property by name, returning it only if it has the expected type. */
export function getProperty<T extends PageProperty['type']>(
  page: PageObjectResponse,
  name: string,
  type: T,
): PropertyOfType<T> | undefined {
  const property = page.properties[name];
  return property?.type === type ? (property as PropertyOfType<T>) : undefined;
}

export function toPlainText(richText: RichTextItemResponse[] = []): string {
  return richText.map((item) => item.plain_text).join('');
}

export function getCoverUrl(page: PageObjectResponse): string | null {
  const cover = page.cover;
  if (!cover) return null;
  switch (cover.type) {
    case 'external':
      return cover.external.url;
    case 'file':
      return cover.file.url;
    default:
      return null;
  }
}

/** Notion IDs are UUIDs; URLs and slugs use the 32-char form without dashes. */
export function compactId(id: string): string {
  return id.replaceAll('-', '');
}

export function isNotionId(value: string): boolean {
  return /^[0-9a-f]{32}$/i.test(compactId(value));
}
