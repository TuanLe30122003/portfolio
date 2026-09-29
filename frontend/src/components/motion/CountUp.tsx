"use client";

import { useRef } from "react";
import { FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/** Counts from 0 to `to` when scrolled into view. Server HTML shows the final value. */
export function CountUp({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const counter = { value: 0 };
        const render = () => {
          el.textContent = `${Math.round(counter.value)}${suffix}`;
        };
        render();
        gsap.to(counter, {
          value: to,
          duration,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        return () => {
          counter.value = to;
          render();
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [to, suffix] },
  );

  return (
    <span ref={ref} className="tabular-nums">
      {to}
      {suffix}
    </span>
  );
}
