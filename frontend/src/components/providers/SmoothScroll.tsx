"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Lenis smooth scrolling on the window, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1, stopInertiaOnNavigate: true }}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}

function LenisScrollTriggerBridge() {
  const lenis = useLenis(ScrollTrigger.update);
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, [lenis]);

  // Web fonts change text metrics after first paint; re-measure trigger positions.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Arriving on "/#work" from another page: pinned sections add spacing after
  // the browser's native hash jump, so jump again once triggers are measured.
  useEffect(() => {
    const hash = window.location.hash;
    if (!lenis || !hash) return;
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lenis.scrollTo(hash, { immediate: true, force: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [lenis, pathname]);

  return null;
}
