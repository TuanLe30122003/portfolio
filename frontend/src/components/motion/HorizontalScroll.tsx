"use client";

import { useRef, type ReactNode } from "react";
import { clsx } from "clsx";
import { FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

interface HorizontalScrollProps {
  id?: string;
  "aria-label"?: string;
  className?: string;
  trackClassName?: string;
  /** Layer pinned with the section, above the track (progress bars, flying objects). */
  overlay?: ReactNode;
  /** Vertical scroll distance per pixel of horizontal travel (higher = slower). */
  speed?: number;
  children: ReactNode;
}

/**
 * The "horizontal" leg of the vertical → horizontal → vertical flow: the
 * section pins to the viewport and vertical scroll drives the track sideways.
 *
 * Children opt into extra motion with data attributes:
 * - `data-h-reveal`            fades/rises in as it enters from the right
 * - `data-h-speed="0.3"`       parallax drift relative to the track (inside a `data-h-item`)
 * - `data-h-progress`          (overlay) scaleX follows section progress
 * - `data-h-fly`               (overlay) crosses the viewport left → right;
 *   tune with `data-h-fly-y` (px), `data-h-fly-rotate` (deg), `data-h-fly-range="0.2,0.9"`
 *
 * With `prefers-reduced-motion: reduce` nothing is pinned and the track is a
 * native, swipeable horizontal scroller instead.
 */
export function HorizontalScroll({
  id,
  className,
  trackClassName,
  overlay,
  speed = 1,
  children,
  ...rest
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const track = trackRef.current!;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        const progressEls = gsap.utils.toArray<HTMLElement>("[data-h-progress]", section);
        const flyEls = gsap.utils.toArray<HTMLElement>("[data-h-fly]", section);

        const applyOverlay = (progress: number) => {
          for (const el of progressEls) el.style.transform = `scaleX(${progress})`;
          for (const el of flyEls) {
            const [start, end] = (el.dataset.hFlyRange ?? "0,1").split(",").map(Number);
            const p = gsap.utils.clamp(0, 1, (progress - start) / (end - start));
            // Start/end fully off-screen, with room for glows and shadows.
            const fromX = -el.offsetWidth - 120;
            const toX = section.clientWidth + 120;
            const y = Number(el.dataset.hFlyY ?? 0) * p;
            const rotate = Number(el.dataset.hFlyRotate ?? 0) * p;
            el.style.transform = `translate3d(${fromX + (toX - fromX) * p}px, ${y}px, 0) rotate(${rotate}deg)`;
          }
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          // The tween's own (scrub-smoothed) progress keeps overlays in step with the track.
          // `this` rather than `tween`: the first update fires while gsap.to() is still running.
          onUpdate(this: gsap.core.Tween) {
            applyOverlay(this.progress());
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * speed}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        applyOverlay(0);

        for (const el of gsap.utils.toArray<HTMLElement>("[data-h-reveal]", track)) {
          gsap.from(el, {
            autoAlpha: 0,
            y: 80,
            rotate: 2,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left 92%",
              toggleActions: "play none none reverse",
            },
          });
        }

        for (const el of gsap.utils.toArray<HTMLElement>("[data-h-speed]", track)) {
          const amount = Number(el.dataset.hSpeed) * 50;
          gsap.fromTo(
            el,
            { xPercent: -amount },
            {
              xPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("[data-h-item]") ?? el,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // GSAP wraps a pinned element in a "pin-spacer"; the outer div keeps the
  // node React inserts/removes stable while that happens.
  return (
    <div>
      <section
        ref={sectionRef}
        id={id}
        aria-label={rest["aria-label"]}
        className={clsx(
          "relative h-svh overflow-hidden motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:overflow-x-auto",
          className,
        )}
      >
        {overlay && <div className="pointer-events-none absolute inset-0 z-10 motion-reduce:hidden">{overlay}</div>}
        <div ref={trackRef} className={clsx("flex h-full w-max items-center will-change-transform", trackClassName)}>
          {children}
        </div>
      </section>
    </div>
  );
}
