/**
 * Property names of the Notion database that backs the blog.
 * Rename these if your database uses different column names.
 *
 * | Column      | Notion type   | Required |
 * | ----------- | ------------- | -------- |
 * | Name        | Title         | yes      |
 * | Slug        | Text          | no — falls back to the page ID |
 * | Description | Text          | no       |
 * | Tags        | Multi-select  | no       |
 * | Published   | Checkbox      | yes — only checked rows are public |
 * | Date        | Date          | no — used for sorting |
 */
export const POST_PROPERTIES = {
  title: 'Name',
  slug: 'Slug',
  description: 'Description',
  tags: 'Tags',
  published: 'Published',
  date: 'Date',
} as const;
