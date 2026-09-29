// Locale settings shared by the proxy, Server and Client Components.
// Adding a language: append it to `locales`, fill in `localeInfo`, add a
// dictionary in ./dictionaries and an entry for every `Localized` text in content/.

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

/** Served at unprefixed URLs ("/blog"); other locales live under "/<locale>/…". */
export const defaultLocale: Locale = "vi";

/** For visitors whose browser languages include none of `locales`. */
export const foreignLocale: Locale = "en";

/** Remembers the language picked in the switcher (read by src/proxy.ts). */
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const localeInfo: Record<Locale, { name: string; ogLocale: string }> = {
  vi: { name: "Tiếng Việt", ogLocale: "vi_VN" },
  en: { name: "English", ogLocale: "en_US" },
};

export function hasLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

/** One value per locale, e.g. `{ vi: "Dự án", en: "Work" }`. */
export type Localized<T = string> = Record<Locale, T>;

/** Content text: a plain string when it reads the same in every language. */
export type Text = string | Localized;

export function localize(text: Text, locale: Locale): string {
  return typeof text === "string" ? text : text[locale];
}

/** "/blog?tag=x" → "/en/blog?tag=x" (unchanged for the default locale and external URLs). */
export function localizePath(href: string, locale: Locale): string {
  if (locale === defaultLocale || !href.startsWith("/")) return href;
  const end = href.search(/[?#]/);
  const path = end === -1 ? href : href.slice(0, end);
  const suffix = end === -1 ? "" : href.slice(end);
  return `/${locale}${path === "/" ? "" : path}${suffix}`;
}

/**
 * "/en/blog" → "/blog", "/en" → "/". Also strips "/vi": prerendered pages see
 * the internal "/vi/…" path that the proxy rewrites unprefixed URLs to.
 */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  return hasLocale(first) ? `/${rest.join("/")}` : pathname;
}

/** Best supported locale for an Accept-Language header. */
export function matchLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((entry) => entry.lang && entry.lang !== "*" && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  // No header at all (most crawlers) → default locale.
  if (ranked.length === 0) return defaultLocale;
  return ranked.map((entry) => entry.lang).find(hasLocale) ?? foreignLocale;
}
