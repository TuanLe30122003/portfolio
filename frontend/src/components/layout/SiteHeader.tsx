"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { useEffect, useState, type MouseEvent } from "react";
import { clsx } from "clsx";
import { navItems, site } from "@/content/site";
import { useHashNavigation } from "@/hooks/useHashNavigation";
import { localize, localizePath, stripLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import { LanguageSwitcher } from "./LanguageSwitcher";

const SECTION_IDS = navItems.flatMap((item) => (item.href.startsWith("/#") ? [item.href.slice(2)] : []));

export function SiteHeader() {
  const { locale, messages } = useI18n();
  // Locale-agnostic ("/en/blog" → "/blog"), so it matches the unprefixed hrefs in navItems.
  const pathname = stripLocale(usePathname());
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const activeSection = useActiveSection(pathname === "/" ? SECTION_IDS : []);

  // Solid background once scrolled; hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > lastY && y > 320);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const scrollToHash = useHashNavigation();
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    scrollToHash(event, href);
  };

  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" && activeSection === href.slice(2) : pathname.startsWith(href);
  const home = localizePath("/", locale);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[translate,background-color,border-color] duration-500",
        hidden && !open && "-translate-y-full",
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label={messages.header.nav}
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8"
      >
        <Link
          href={home}
          onClick={(e) => handleNavigate(e, home)}
          className="group flex items-center gap-3 font-display text-sm font-bold tracking-wider"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-ink transition-transform duration-300 group-hover:rotate-12">
            {site.initials}
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizePath(item.href, locale)}
                  onClick={(e) => handleNavigate(e, localizePath(item.href, locale))}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive(item.href) ? "bg-paper/10 text-paper" : "text-muted hover:text-paper",
                  )}
                >
                  {localize(item.label, locale)}
                </Link>
              </li>
            ))}
          </ul>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? messages.header.closeMenu : messages.header.openMenu}
            className="relative grid size-10 place-items-center rounded-full border border-line md:hidden"
          >
            <span
              className={clsx("absolute h-px w-4 bg-paper transition-transform", open ? "rotate-45" : "-translate-y-1")}
            />
            <span
              className={clsx("absolute h-px w-4 bg-paper transition-transform", open ? "-rotate-45" : "translate-y-1")}
            />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-line px-5 pt-10 md:hidden"
      >
        <ul className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <li key={item.href}>
              <Link
                href={localizePath(item.href, locale)}
                onClick={(e) => handleNavigate(e, localizePath(item.href, locale))}
                className="flex items-baseline gap-4 py-2 font-display text-3xl font-bold"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {localize(item.label, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/** Which home-page section is currently crossing the middle of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const elements = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [key]);

  return active;
}
