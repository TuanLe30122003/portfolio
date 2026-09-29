import { site } from "@/content/site";
import { hasLocale, locales, localize, localizePath } from "@/i18n/config";
import { getPosts } from "@/lib/api/blog";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/blog/rss.xml">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Not found", { status: 404 });

  const { items } = await getPosts({ limit: 50 });
  const escape = (value: string) =>
    value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

  const entries = items
    .map((post) => {
      const url = `${site.url}${localizePath(`/blog/${post.slug}`, lang)}`;
      const pubDate = post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : "";
      return `<item><title>${escape(post.title)}</title><link>${url}</link><guid>${url}</guid>${pubDate}<description>${escape(post.description)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.name)} — Blog</title><link>${site.url}${localizePath("/blog", lang)}</link><description>${escape(localize(site.tagline, lang))}</description><language>${lang}</language>${entries}</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
