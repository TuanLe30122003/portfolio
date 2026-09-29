"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useCallback, type MouseEvent } from "react";
import { stripLocale } from "@/i18n/config";

/**
 * Click handler for links like "/#work" (or "/en#work"): on the page they
 * point to, scroll smoothly with Lenis instead of letting the router jump.
 * Links to other pages fall through to normal <Link> navigation.
 */
export function useHashNavigation() {
  const pathname = stripLocale(usePathname());
  const lenis = useLenis();

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      const [path, hash] = href.split("#");
      if (stripLocale(path || "/") !== pathname) return;
      if (!hash && stripLocale(href) !== pathname) return;

      event.preventDefault();
      const target = hash ? `#${hash}` : 0;
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", hash ? `#${hash}` : location.pathname);
    },
    [pathname, lenis],
  );
}
