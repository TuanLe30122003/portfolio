"use client";

import { useRef } from "react";
import { heroOrbit } from "@/content/portfolio";
import { site } from "@/content/site";
import { TechOrbit } from "@/components/motion/TechOrbit";
import { HashLink, pillButtonClass } from "@/components/ui/HashLink";
import { localize } from "@/i18n/config";
import { useI18n } from "@/i18n/client";
import type { Dictionary } from "@/i18n/dictionaries/vi";
import { FULL_MOTION, gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Vertical leg #1 — intro with split-text headline and an orbit of tech logos. */
export function Hero({ copy }: { copy: Dictionary["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { locale } = useI18n();

  useGSAP(
    () => {
      const section = ref.current!;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        // Intro: headline words rise out of line masks, then the rest fades in.
        SplitText.create("[data-hero-title]", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, { yPercent: 120, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.15 }),
        });
        gsap.from("[data-orb]", {
          scale: 0,
          autoAlpha: 0,
          duration: 0.9,
          ease: "back.out(1.7)",
          stagger: 0.07,
          delay: 0.3,
        });
        gsap.from("[data-hero-fade]", {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.7,
        });

        // Scroll-out: every [data-speed] layer drifts at its own rate while the content lifts away.
        const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: true };
        for (const el of gsap.utils.toArray<HTMLElement>("[data-speed]", section)) {
          gsap.to(el, { yPercent: Number(el.dataset.speed) * 100, ease: "none", scrollTrigger: scrub });
        }
        gsap.to("[data-hero-content]", {
          y: -120,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { ...scrub, end: "80% top" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-16 max-md:pt-[calc(5rem+64vw)]"
    >
      {/* Background layers */}
      <div aria-hidden className="starfield absolute inset-0 animate-twinkle opacity-70" data-speed="0.15" />
      <div
        aria-hidden
        className="starfield absolute inset-0 opacity-40 [background-size:540px_400px]"
        data-speed="0.35"
      />
      {/*
        Outer div only positions the orbit; GSAP parallax lives on the inner div.
        (Putting both on one element lets GSAP fold the -50% centring into its own
        transform, which made the orbit sink while scrolling.)
        --orbit: sized by width *and* height so it always fits below the header;
        its centre sits at 45% of the hero, never closer than 5rem to the top.
      */}
      <div className="absolute right-[max(-8vw,calc(50vw_-_42rem))] top-[max(calc(5rem_+_var(--orbit)/2),45%)] w-(--orbit) -translate-y-1/2 [--orbit:min(42vw,560px,calc(100svh_-_14rem))] max-md:top-16 max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:[--orbit:64vw]">
        <div data-speed="-0.2">
          <TechOrbit {...heroOrbit} className="animate-float" />
        </div>
      </div>

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        {/* Text column leaves the right side to the tech orbit. */}
        <div className="md:max-w-[min(60vw,860px)]">
          <p data-hero-fade className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-accent md:text-sm">
            {site.role} @ {site.company} · {localize(site.location, locale)}
          </p>
          <h1
            data-hero-title
            className="max-w-5xl font-display text-[clamp(2.6rem,8.5vw,8rem)] font-black leading-[0.95] tracking-tight text-balance"
          >
            {site.heroName}
            <span className="text-accent">.</span>
          </h1>
          <p data-hero-fade className="mt-8 max-w-2xl text-lg text-muted md:text-xl">
            {localize(site.tagline, locale)}
          </p>
          <div data-hero-fade className="mt-10 flex flex-wrap gap-3">
            <HashLink href="/#work" variant="primary">
              {copy.viewProjects}
            </HashLink>
            <HashLink href="/#contact" variant="ghost">
              {copy.contact}
            </HashLink>
            {site.resume && (
              <a href={site.resume} target="_blank" rel="noreferrer" className={pillButtonClass("ghost")}>
                {copy.downloadCv}
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        data-hero-fade
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted max-md:hidden"
      >
        {copy.scrollDown}
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-accent" />
        </span>
      </div>
    </section>
  );
}
