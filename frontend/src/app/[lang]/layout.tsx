import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono, Unbounded } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";
import { localeInfo, locales, localize } from "@/i18n/config";
import { I18nProvider } from "@/i18n/client";
import { getDictionary, getLocale } from "@/i18n/server";
import "../globals.css";

const display = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700", "900"],
});

const body = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
});

/** Prerenders every locale ("/" is served from "/vi" by src/proxy.ts). */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const tagline = localize(site.tagline, locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: site.tabTitle, template: `%s · ${site.tabTitle}` },
    description: tagline,
    // Link previews (LinkedIn, Messenger…) still lead with the name and role.
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${site.role}`,
      description: tagline,
      locale: localeInfo[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].ogLocale),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const t = await getDictionary();

  return (
    // suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, Dark Reader…)
    // add attributes to <html>/<body> before React hydrates. Only these two
    // elements' own attributes are exempt; their children are still checked.
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col font-sans" suppressHydrationWarning>
        <I18nProvider locale={locale} messages={t.ui}>
          <SmoothScroll>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
            >
              {t.layout.skipLink}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
