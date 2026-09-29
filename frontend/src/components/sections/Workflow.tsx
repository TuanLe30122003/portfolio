import { clsx } from "clsx";
import { workflow } from "@/content/portfolio";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

/** Horizontal leg #2 — full-screen panels, one per step, with giant outlined numbers drifting behind. */
export async function Workflow() {
  const locale = await getLocale();
  const t = (await getDictionary()).workflow;

  return (
    <HorizontalScroll
      id="process"
      aria-label={t.label}
      speed={1.2}
      overlay={
        <>
          <div className="absolute inset-x-5 top-20 h-0.5 bg-line md:inset-x-[10vw]">
            <div data-h-progress className="h-full origin-left bg-accent-blue" style={{ transform: "scaleX(0)" }} />
          </div>
          <div
            data-h-fly
            data-h-fly-y="140"
            data-h-fly-rotate="200"
            className="absolute left-0 top-[22%] size-5 rounded-full bg-accent-violet shadow-[0_0_40px_8px_rgb(167_139_250/0.5)]"
          />
        </>
      }
    >
      {workflow.map((item, index) => (
        <div
          key={item.step}
          data-h-item
          className={clsx(
            "relative flex h-full w-screen shrink-0 items-center overflow-hidden px-5 md:px-[10vw] motion-reduce:snap-start",
            index % 2 === 0 ? "bg-ink" : "bg-ink-2",
          )}
        >
          <span
            aria-hidden
            data-h-speed="-0.6"
            className="pointer-events-none absolute -bottom-[0.12em] right-0 font-display text-[42vw] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.08)]"
          >
            {item.step}
          </span>
          {/* The first panel is on screen when pinning starts, so it doesn't wait for a reveal. */}
          <div data-h-reveal={index > 0 ? "" : undefined} className="relative max-w-2xl">
            <Eyebrow>
              {t.eyebrow} · {item.step}/{String(workflow.length).padStart(2, "0")}
            </Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-black md:text-8xl">{localize(item.title, locale)}</h2>
            <p className="mt-6 text-lg text-muted md:text-2xl">{localize(item.description, locale)}</p>
          </div>
        </div>
      ))}
    </HorizontalScroll>
  );
}
