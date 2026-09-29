"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Thin bar under the header that fills as the article is read. */
export function ReadingProgress({ target }: { target: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bar = ref.current!;
    const setScale = gsap.quickSetter(bar, "scaleX");
    ScrollTrigger.create({
      trigger: target,
      start: "top 64px",
      end: "bottom bottom",
      onUpdate: (self) => setScale(self.progress),
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
