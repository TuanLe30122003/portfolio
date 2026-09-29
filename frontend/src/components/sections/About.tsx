import { about, skills, stats } from "@/content/portfolio";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

/** Vertical leg #2 — statement + animated counters. */
export async function About() {
  const locale = await getLocale();
  const t = (await getDictionary()).about;

  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
      <Reveal className="grid gap-10 md:grid-cols-12">
        <Eyebrow data-reveal-item className="md:col-span-3 md:pt-4">
          {t.eyebrow}
        </Eyebrow>
        <div className="md:col-span-9">
          <h2
            data-reveal-item
            className="font-display text-[clamp(1.75rem,4.2vw,3.6rem)] font-bold leading-[1.15] text-balance"
          >
            {localize(about.lead, locale)} <span className="text-accent">{localize(about.highlight, locale)}</span>{" "}
            {localize(about.rest, locale)}
          </h2>
          <p data-reveal-item className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            {localize(about.body, locale)}
          </p>

          <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-line pt-10 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.value} data-reveal-item className="flex flex-col-reverse gap-2">
                <dt className="text-sm text-muted">{localize(stat.label, locale)}</dt>
                <dd className="font-display text-4xl font-black md:text-6xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {skills.map((skill) => (
              <div key={localize(skill.group, locale)} data-reveal-item>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {localize(skill.group, locale)}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <li
                      key={localize(item, locale)}
                      className="rounded-full border border-line bg-ink-2 px-3 py-1 text-sm"
                    >
                      {localize(item, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
