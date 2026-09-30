import Link from "next/link";
import { clsx } from "clsx";
import { workflow } from "@/content/portfolio";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize, localizePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

/**
 * Horizontal leg #2 — one full-screen panel per working principle, each backed
 * by a real example, with giant outlined numbers drifting behind.
 */
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
          <div
            data-h-reveal={index > 0 ? "" : undefined}
            className="relative grid w-full max-w-6xl gap-8 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16"
          >
            <div>
              <Eyebrow>
                {t.eyebrow} · {item.step}/{String(workflow.length).padStart(2, "0")}
              </Eyebrow>
              <h2 className="mt-6 font-display text-3xl font-black leading-[1.05] text-balance md:text-6xl">
                {localize(item.title, locale)}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted md:text-xl">
                {localize(item.description, locale)}
              </p>
            </div>

            <aside className="rounded-3xl border border-line bg-ink/60 p-6 backdrop-blur md:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {t.proofLabel} · <span className="text-accent">{item.proof.context}</span>
              </p>
              <p className="mt-4 text-base leading-relaxed md:text-lg">{localize(item.proof.text, locale)}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
              {item.proof.href && (
                <Link
                  href={localizePath(item.proof.href, locale)}
                  className="mt-5 inline-block text-sm text-accent underline-offset-4 hover:underline"
                >
                  {t.readBlog}
                </Link>
              )}
            </aside>
          </div>
        </div>
      ))}
    </HorizontalScroll>
  );
}
