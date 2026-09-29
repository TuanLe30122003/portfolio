"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { clsx } from "clsx";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localeInfo,
  locales,
  localizePath,
  stripLocale,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/client";

function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * "VI | EN" toggle. Saves the choice in a cookie (so the proxy stops
 * auto-detecting) and reloads the same page in the other language —
 * a full load, since the root layout (<html lang>) changes.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages } = useI18n();
  const path = stripLocale(usePathname());

  const switchTo = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    saveLocale(target);
    const { pathname, search, hash } = window.location;
    window.location.assign(localizePath(stripLocale(pathname), target) + search + hash);
  };

  return (
    <div
      role="group"
      aria-label={messages.language.label}
      className={clsx("flex items-center rounded-full border border-line p-0.5 font-mono text-xs uppercase", className)}
    >
      {locales.map((target) =>
        target === locale ? (
          <span key={target} aria-current="true" className="rounded-full bg-paper/10 px-2.5 py-1 text-paper">
            <span aria-hidden>{target}</span>
            <span className="sr-only">{localeInfo[target].name}</span>
          </span>
        ) : (
          <a
            key={target}
            href={localizePath(path, target)}
            hrefLang={target}
            lang={target}
            onClick={(event) => switchTo(event, target)}
            className="rounded-full px-2.5 py-1 text-muted transition-colors hover:text-paper"
          >
            <span aria-hidden>{target}</span>
            <span className="sr-only">{localeInfo[target].name}</span>
          </a>
        ),
      )}
    </div>
  );
}
