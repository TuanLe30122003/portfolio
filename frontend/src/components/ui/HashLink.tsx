"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { clsx } from "clsx";
import { useHashNavigation } from "@/hooks/useHashNavigation";
import { localizePath } from "@/i18n/config";
import { useI18n } from "@/i18n/client";

type HashLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  variant?: "primary" | "ghost";
};

/** Pill button styles shared by HashLink and plain anchors (e.g. file downloads). */
export function pillButtonClass(variant: "primary" | "ghost") {
  return clsx(
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,color,translate] duration-300 hover:-translate-y-0.5",
    variant === "primary" && "bg-accent text-ink hover:bg-paper",
    variant === "ghost" && "border border-line text-paper hover:bg-paper/10",
  );
}

/**
 * <Link> that smooth-scrolls for same-page "/#id" targets and prefixes the
 * current locale ("/blog" → "/en/blog"). Styled as a pill button when `variant` is set.
 */
export function HashLink({ href, variant, className, onClick, ...props }: HashLinkProps) {
  const scrollToHash = useHashNavigation();
  const localizedHref = localizePath(href, useI18n().locale);

  return (
    <Link
      href={localizedHref}
      onClick={(event) => {
        onClick?.(event);
        scrollToHash(event, localizedHref);
      }}
      className={clsx(variant && pillButtonClass(variant), className)}
      {...props}
    />
  );
}
