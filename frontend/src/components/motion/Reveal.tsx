"use client";

import { useRef, type ReactNode } from "react";
import { FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Vertical offset (px) the content rises from. */
  y?: number;
  stagger?: number;
}

/**
 * Fades content up when it scrolls into view (vertical sections).
 * Descendants marked `data-reveal-item` animate one after another;
 * otherwise the whole block animates.
 */
export function Reveal({ children, className, y = 48, stagger = 0.1 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", el);
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        gsap.from(items.length > 0 ? items : el, {
          y,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
