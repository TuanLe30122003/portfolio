import { cacheLife } from "next/cache";
import type { ComponentProps, ReactNode } from "react";
import { clsx } from "clsx";
import { MarkdownAsync, type Components } from "react-markdown";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { normalizeNotionMarkdown } from "@/lib/notion-markdown";

const prettyCode: PrettyCodeOptions = {
  theme: "tokyo-night",
  keepBackground: true,
  // Only fenced blocks; a string here would also turn every inline `code` into a block.
  defaultLang: { block: "plaintext" },
};

type Props<T = object> = T & { children?: ReactNode };
type NotionSpanProps = { node?: unknown; underline?: string };

/**
 * Renders a post body (Server Component). Raw HTML is enabled because Notion
 * encodes callouts, toggles, columns, mentions… as tags — content comes from
 * your own Notion workspace, so it is trusted. Add rehype-sanitize if not.
 *
 * Cached by content (and locale, read via root params): syntax highlighting loads
 * Shiki grammars asynchronously, which would otherwise keep the article out of
 * the prerendered HTML.
 */
export async function Markdown({ content }: { content: string }) {
  "use cache";
  cacheLife("max");
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <MarkdownAsync
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug, [rehypePrettyCode, prettyCode]]}
      components={createComponents(locale, t.post)}
    >
      {normalizeNotionMarkdown(content)}
    </MarkdownAsync>
  );
}

const MEDIA_FILE = /\.(mp4|webm|ogg|mov|mp3|wav|m4a)(\?|$)/i;

/** Notion blocks whose output depends on the UI language (dates, fallback labels). */
const localizedNotionComponents = (locale: Locale, t: Dictionary["post"]) => ({
  "mention-date": ({ start, end }: Props<{ start?: string; end?: string }>) => (
    <time dateTime={start}>
      {formatDate(start ?? null, locale)}
      {end && ` → ${formatDate(end, locale)}`}
    </time>
  ),
  file: ({ src, children }: Props<{ src?: string }>) => (
    <a href={src} target="_blank" rel="noreferrer">
      📎 {children || t.attachment}
    </a>
  ),
  pdf: ({ src, children }: Props<{ src?: string }>) => (
    <a href={src} target="_blank" rel="noreferrer">
      📄 {children || t.pdf}
    </a>
  ),
});

const notionComponents = {
  callout: ({ icon, children }: Props<{ icon?: string }>) => (
    <aside className="notion-callout">
      {icon && (
        <span aria-hidden className="text-xl leading-8">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </aside>
  ),
  columns: ({ children }: Props) => <div className="grid gap-x-8 md:auto-cols-fr md:grid-flow-col">{children}</div>,
  column: ({ children }: Props) => <div className="min-w-0 [&>:first-child]:mt-0">{children}</div>,
  page: ({ url, children }: Props<{ url?: string }>) => <a href={url}>📄 {children}</a>,
  database: ({ url, children }: Props<{ url?: string }>) => <a href={url}>🗂️ {children}</a>,
  "mention-page": ({ url, children }: Props<{ url?: string }>) => <a href={url}>{children}</a>,
  "mention-user": ({ children }: Props) => <span className="text-accent">@{children}</span>,
  video: ({ src, children }: Props<{ src?: string }>) =>
    src && MEDIA_FILE.test(src) ? (
      <video src={src} controls preload="metadata" className="w-full rounded-2xl">
        {children}
      </video>
    ) : (
      <a href={src} target="_blank" rel="noreferrer">
        ▶ {children || src}
      </a>
    ),
  audio: ({ src }: Props<{ src?: string }>) => <audio src={src} controls className="w-full" />,
  table_of_contents: () => null,
  // Blocks the export couldn't include (page too large or not shared with the integration).
  unknown: () => null,
  synced_block: ({ children }: Props) => <div>{children}</div>,
  synced_block_reference: ({ children }: Props) => <div>{children}</div>,
};

const htmlComponents = {
  // Notion's <span color="red_bg" underline="true">. Other props pass through:
  // rehype-pretty-code's token spans carry `style` and `data-line`.
  span: ({ node, color, underline, className, ...props }: ComponentProps<"span"> & NotionSpanProps) => (
    <span
      {...props}
      data-notion-color={color}
      className={clsx(className, underline === "true" && "underline") || undefined}
    />
  ),
  a: ({ href, children }: ComponentProps<"a">) => {
    const external = href?.startsWith("http");
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {children}
      </a>
    );
  },
  // Plain <img>: Notion file URLs are signed and short-lived, so running them
  // through the image optimizer would only fill its cache with one-off URLs.
  img: ({ src, alt }: ComponentProps<"img">) => (
    <span className="my-8 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : undefined}
        alt={alt ?? ""}
        loading="lazy"
        className="my-0 rounded-2xl"
      />
      {alt && <span className="mt-3 block text-center text-sm text-muted">{alt}</span>}
    </span>
  ),
  table: ({ children }: Props) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
};

const createComponents = (locale: Locale, t: Dictionary["post"]) =>
  ({
    ...notionComponents,
    ...localizedNotionComponents(locale, t),
    ...htmlComponents,
  }) as unknown as Components;
