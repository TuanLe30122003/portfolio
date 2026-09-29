import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  hasLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localizePath,
  matchLocale,
  stripLocale,
} from "@/i18n/config";

/**
 * Locale routing. Every page lives under app/[lang]; the default locale keeps
 * clean URLs:
 *
 *   /blog     → rewrite to /vi/blog, or redirect to /en/blog when the visitor
 *               prefers English (NEXT_LOCALE cookie, else Accept-Language)
 *   /en/blog  → served as is
 *   /vi/blog  → redirect to /blog (one URL per page), remembering "vi"
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first] = pathname.split("/");
  const url = request.nextUrl.clone();

  if (first === defaultLocale) {
    url.pathname = stripLocale(pathname);
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, defaultLocale, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
    return response;
  }
  if (hasLocale(first)) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(saved) ? saved : matchLocale(request.headers.get("accept-language"));
  if (locale !== defaultLocale) {
    url.pathname = localizePath(pathname, locale);
    return NextResponse.redirect(url);
  }

  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Skip the API, Next internals and files (/favicon.ico, /projects/x.webp, /sitemap.xml…).
    "/((?!api|_next|_vercel|.*\\.[^/]+$).*)",
    // …but keep the blog, whose RSS feed and slugs may contain a dot.
    "/blog/:path*",
  ],
};
