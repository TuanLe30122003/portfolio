import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

/** Vertical leg #5 — closing call to action. */
export async function Contact() {
  const locale = await getLocale();
  const t = (await getDictionary()).contact;
  const details = [
    { label: t.email, value: site.email, href: `mailto:${site.email}` },
    { label: t.location, value: localize(site.location, locale) },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-5 py-32 md:px-8 md:py-48">
      <div
        aria-hidden
        className="absolute -bottom-[40vw] -right-[20vw] size-[80vw] rounded-full bg-[radial-gradient(circle_at_30%_25%,#c9f6ff,#38bdf8_38%,#1e3a8a_72%)] opacity-40 blur-[2px]"
      />
      <Reveal className="relative mx-auto max-w-7xl">
        <Eyebrow data-reveal-item>{t.eyebrow}</Eyebrow>
        <h2
          data-reveal-item
          className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.95] text-balance"
        >
          {t.title.before}
          <span className="whitespace-nowrap text-accent">{t.title.highlight}</span>
          {t.title.after}
        </h2>
        <p data-reveal-item className="mt-8 max-w-2xl text-lg text-muted">
          {t.body}
        </p>
        <a
          data-reveal-item
          href={`mailto:${site.email}`}
          className="mt-12 inline-block font-display text-[clamp(1rem,5vw,3rem)] underline decoration-accent decoration-2 underline-offset-8 transition-colors [overflow-wrap:anywhere] hover:text-accent"
        >
          {site.email}
        </a>
        <dl
          data-reveal-item
          aria-label={t.detailsLabel}
          className="mt-12 grid max-w-3xl gap-6 border-t border-line pt-8 sm:grid-cols-2"
        >
          {details.map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{item.label}</dt>
              <dd className="mt-2 text-lg [overflow-wrap:anywhere]">
                {item.href ? (
                  <a href={item.href} className="transition-colors hover:text-accent">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <ul data-reveal-item className="mt-10 flex flex-wrap gap-3">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-line px-5 py-2 text-sm transition-colors hover:bg-paper hover:text-ink"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
