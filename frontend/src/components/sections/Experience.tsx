import { experience } from "@/content/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

/** Vertical leg #3 — timeline whose line draws itself on scroll. */
export async function Experience() {
  const locale = await getLocale();
  const t = (await getDictionary()).experience;

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <Eyebrow data-reveal-item>{t.eyebrow}</Eyebrow>
          <h2 data-reveal-item className="mt-6 font-display text-4xl font-black leading-[1] md:text-5xl">
            {t.titleLines[0]}
            <br />
            {t.titleLines[1]}
          </h2>
        </Reveal>

        <div className="relative md:col-span-8">
          <div aria-hidden className="absolute left-0 top-2 h-full w-px bg-line" />
          <ScrollLine className="absolute left-0 top-2 h-full w-px bg-accent" />
          <Reveal>
            <ol>
              {experience.map((item) => (
                <li key={localize(item.period, locale)} data-reveal-item className="relative pb-16 pl-10 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute left-[-5px] top-2 size-[11px] rounded-full bg-accent ring-4 ring-ink"
                  />
                  <p className="font-mono text-sm text-accent">{localize(item.period, locale)}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                    {localize(item.role, locale)} <span className="text-muted">· {localize(item.company, locale)}</span>
                  </h3>
                  <p className="mt-3 max-w-xl text-muted">{localize(item.description, locale)}</p>
                  {item.highlights && (
                    <ul className="mt-4 max-w-2xl space-y-2">
                      {item.highlights.map((point) => (
                        <li key={localize(point, locale)} className="relative pl-5 text-sm leading-relaxed text-muted">
                          <span
                            aria-hidden
                            className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-accent/70"
                          />
                          {localize(point, locale)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
