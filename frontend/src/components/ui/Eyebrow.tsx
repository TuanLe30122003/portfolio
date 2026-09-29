import type { ComponentProps } from "react";
import { clsx } from "clsx";

/** Small mono label above section headings, e.g. "02 — Dự án". */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={clsx("font-mono text-xs uppercase tracking-[0.3em] text-accent", className)} {...props} />;
}
