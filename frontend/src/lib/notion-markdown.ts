/**
 * Prepares Notion-flavored Markdown (GET /v1/pages/:id/markdown) for a
 * CommonMark parser. See https://developers.notion.com/guides/data-apis/enhanced-markdown
 *
 * Differences this smooths over:
 * - Adjacent blocks are separated by a single "\n" (line breaks inside a
 *   block are `<br>`), which CommonMark would merge into one paragraph —
 *   so every block gets its own blank-line-separated chunk.
 * - Children are nested inside XML-like container tags and indented with
 *   tabs. Left as-is, the container becomes one raw HTML block (inner
 *   Markdown never parsed) and tab-indented lines turn into code blocks.
 *   Each tag is put in its own HTML block and the nesting indentation removed.
 * - Block attribute lists like `{color="red"}` are dropped.
 * - Self-closing custom tags (`<mention-date start="…"/>`) are expanded to
 *   open/close pairs; HTML parsers ignore "/>" on non-void elements, which
 *   would otherwise swallow the rest of the paragraph.
 */

const CONTAINER_TAGS = "callout|details|columns|column|synced_block|synced_block_reference";
const OPEN_TAG = new RegExp(`^<(?:${CONTAINER_TAGS})(?:\\s[^>]*)?>$`);
const CLOSE_TAG = new RegExp(`^</(?:${CONTAINER_TAGS})>$`);
const SUMMARY = /^<summary>.*<\/summary>$/;
const BLOCK_ATTRIBUTES = /\s*\{(?:[\w-]+="[^"]*"\s*)+\}\s*$/;
const TOGGLE_HEADING = /^#{1,6}\s.*\{[^}]*toggle="true"[^}]*\}\s*$/;
const LIST_ITEM = /^\t*(?:[-*+]|\d+[.)])\s/;
const FENCE = /^(`{3,}|~{3,})/;
const SELF_CLOSING_CUSTOM_TAG = /<([a-z][a-z0-9]*[-_][\w-]*|unknown)(\s[^<>]*?)?\s*\/>/g;

export function normalizeNotionMarkdown(markdown: string): string {
  const out: string[] = [];
  let containerDepth = 0;
  // Toggle headings ("# Title {toggle="true"}") nest children by indentation only.
  const toggleIndents: number[] = [];
  let fence: string | null = null;
  let inTable = false;
  let previousWasListItem = false;

  /** Starts a new Markdown block; consecutive list items stay together as one list. */
  const pushBlock = (line: string) => {
    const isListItem = LIST_ITEM.test(line);
    if (!(isListItem && previousWasListItem)) out.push("");
    out.push(line);
    previousWasListItem = isListItem;
  };

  for (const rawLine of markdown.split("\n")) {
    const indent = rawLine.match(/^\t*/)![0].length;
    if (!fence && !inTable && rawLine.trim() !== "") {
      while (toggleIndents.length > 0 && indent - containerDepth <= toggleIndents.at(-1)!) toggleIndents.pop();
    }

    const stripped = stripTabs(rawLine, containerDepth + toggleIndents.length);

    // Verbatim region: fenced code.
    if (fence) {
      out.push(stripped);
      if (stripped.trim().startsWith(fence)) fence = null;
      continue;
    }

    const line = stripped.replace(SELF_CLOSING_CUSTOM_TAG, "<$1$2></$1>");
    const trimmed = line.trim();

    // Verbatim region: HTML tables.
    if (inTable) {
      out.push(trimmed);
      if (trimmed.startsWith("</table>")) inTable = false;
      continue;
    }
    const fenceMatch = trimmed.match(FENCE);
    if (fenceMatch) {
      fence = fenceMatch[1];
      pushBlock(line);
      previousWasListItem = false;
      continue;
    }
    if (trimmed.startsWith("<table")) {
      inTable = !trimmed.includes("</table>");
      pushBlock(trimmed);
      continue;
    }

    if (trimmed === "") continue;
    if (OPEN_TAG.test(trimmed)) {
      pushBlock(trimmed);
      containerDepth++;
    } else if (CLOSE_TAG.test(trimmed)) {
      containerDepth = Math.max(0, containerDepth - 1);
      pushBlock(trimmed);
    } else if (SUMMARY.test(trimmed)) {
      pushBlock(trimmed);
    } else if (trimmed === "<empty-block></empty-block>") {
      previousWasListItem = false;
    } else {
      if (TOGGLE_HEADING.test(trimmed)) toggleIndents.push(indent - containerDepth);
      pushBlock(line.replace(BLOCK_ATTRIBUTES, ""));
    }
  }

  return out.join("\n").trim() + "\n";
}

function stripTabs(line: string, count: number): string {
  let i = 0;
  while (i < count && line[i] === "\t") i++;
  return line.slice(i);
}
