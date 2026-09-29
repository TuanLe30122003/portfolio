"use client";

import { useRef } from "react";
import { clsx } from "clsx";
import { FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/** A vertical line that "draws" itself as its parent scrolls through the viewport. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const line = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line.parentElement,
              start: "top 70%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden className={clsx("origin-top", className)} />;
}
