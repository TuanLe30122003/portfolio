import type { MetadataRoute } from "next";
import { projects } from "@/content/portfolio";
import { site } from "@/content/site";
import { defaultLocale, locales, localizePath } from "@/i18n/config";
import { getPosts } from "@/lib/api/blog";

type Entry = Omit<MetadataRoute.Sitemap[number], "url" | "alternates">;

/** One entry per locale, each listing every translation as an hreflang alternate. */
function localized(path: string, entry: Entry): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}${localizePath(path, l)}`]));
  languages["x-default"] = `${site.url}${localizePath(path, defaultLocale)}`;
  return locales.map((l) => ({ ...entry, url: languages[l], alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { items } = await getPosts({ limit: 100 });
  return [
    ...localized("/", { changeFrequency: "monthly", priority: 1 }),
    ...localized("/blog", { changeFrequency: "weekly", priority: 0.8 }),
    ...projects.flatMap((project) =>
      localized(`/projects/${project.slug}`, { changeFrequency: "monthly", priority: 0.7 }),
    ),
    ...items.flatMap((post) =>
      localized(`/blog/${post.slug}`, { lastModified: post.updatedAt, changeFrequency: "monthly", priority: 0.6 }),
    ),
  ];
}
