import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { defaultLocale, hasLocale, locales, localizePath, type Locale } from "./config";
import { loadDictionary } from "./dictionaries";

// Server Components only: `next/root-params` reads the `[lang]` root segment
// (no prop drilling). Route Handlers get the locale from their `params` instead.

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary() {
  return loadDictionary(await getLocale());
}

/** Canonical URL, hreflang alternates and RSS feed for a locale-agnostic path like "/blog". */
export async function getAlternates(path: string): Promise<Metadata["alternates"]> {
  const locale = await getLocale();
  return {
    canonical: localizePath(path, locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizePath(path, l)])),
      "x-default": localizePath(path, defaultLocale),
    },
    types: { "application/rss+xml": localizePath("/blog/rss.xml", locale) },
  };
}
