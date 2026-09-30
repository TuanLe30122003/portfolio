import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectArt } from "@/components/projects/ProjectArt";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { projects } from "@/content/portfolio";
import { localize, localizePath } from "@/i18n/config";
import { getAlternates, getDictionary, getLocale } from "@/i18n/server";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

async function loadProject(params: PageProps<"/[lang]/projects/[slug]">["params"]) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  return index === -1 ? null : { project: projects[index], index };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const found = await loadProject(params);
  if (!found) return { title: (await getDictionary()).project.notFoundTitle };

  const { project } = found;
  const locale = await getLocale();
  const description = localize(project.summary, locale);
  return {
    title: project.title,
    description,
    alternates: await getAlternates(`/projects/${project.slug}`),
    openGraph: {
      title: project.title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const found = await loadProject(params);
  if (!found) notFound();

  const { project, index } = found;
  const locale = await getLocale();
  const t = (await getDictionary()).project;
  const { details } = project;
  // Previous/next wrap around so every page links to two other projects.
  const neighbours = [-1, 1].map((step) => projects[(index + step + projects.length) % projects.length]);

  return (
    <article className="mx-auto max-w-6xl px-5 pb-32 pt-32 md:px-8 md:pt-40">
      <Link
        href={localizePath("/#work", locale)}
        className="font-mono text-xs uppercase tracking-[0.3em] text-muted hover:text-accent"
      >
        {t.back}
      </Link>

      <header className="mt-8 max-w-4xl">
        <Eyebrow>{localize(project.context, locale)}</Eyebrow>
        <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] text-balance md:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">{localize(project.summary, locale)}</p>
      </header>

      <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-ink-3">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover"
          />
        ) : (
          <ProjectArt hue={project.hue} />
        )}
      </div>

      <div className="mt-16 grid gap-14 md:grid-cols-[minmax(0,1fr)_320px] md:gap-20">
        <Reveal className="space-y-14">
          <section data-reveal-item>
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.overview}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {details.overview.map((paragraph) => (
                <p key={localize(paragraph, "vi")}>{localize(paragraph, locale)}</p>
              ))}
            </div>
          </section>

          {details.contributions.length > 0 && (
            <section data-reveal-item>
              <h2 className="font-display text-2xl font-bold md:text-3xl">{t.contributions}</h2>
              <ul className="mt-5 space-y-4">
                {details.contributions.map((item) => (
                  <li key={localize(item, "vi")} className="relative pl-6 text-lg leading-relaxed text-muted">
                    <span aria-hidden className="absolute left-0 top-[0.65em] size-2 rounded-full bg-accent" />
                    {localize(item, locale)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Reveal>

        <aside className="h-fit space-y-8 rounded-3xl border border-line bg-ink-2 p-6 md:sticky md:top-24 md:p-8">
          <dl className="space-y-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.role}</dt>
              <dd className="mt-2">{localize(details.role, locale)}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.year}</dt>
              <dd className="mt-2">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.stack}</dt>
              <dd className="mt-3 space-y-4">
                {details.stack.map((group) => (
                  <div key={localize(group.layer, "vi")}>
                    <p className="text-sm text-accent">{localize(group.layer, locale)}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
            >
              {t.website}
            </a>
          )}
        </aside>
      </div>

      <nav aria-label={t.more} className="mt-24 border-t border-line pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{t.more}</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {neighbours.map((other) => (
            <li key={other.slug}>
              <Link
                href={localizePath(`/projects/${other.slug}`, locale)}
                className="group block rounded-2xl border border-line p-6 transition-colors hover:border-accent"
              >
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {localize(other.context, locale)}
                </span>
                <span className="mt-2 block font-display text-2xl font-bold transition-colors group-hover:text-accent">
                  {other.title} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
