import Image from "next/image";
import { projects, type Project } from "@/content/portfolio";
import { site } from "@/content/site";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { localize, type Locale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import type { Dictionary } from "@/i18n/dictionaries";

/** Horizontal leg #1 — pinned track of project cards with a rocket crossing the screen. */
export async function Projects() {
  const locale = await getLocale();
  const t = (await getDictionary()).projects;
  const github = site.socials.find((s) => s.label === "GitHub")?.href;
  const workCount = projects.filter((p) => localize(p.context, locale).startsWith("UpBase")).length;

  return (
    <HorizontalScroll
      id="work"
      aria-label={t.label}
      className="starfield bg-ink-2"
      trackClassName="gap-8 px-5 md:gap-12 md:px-[8vw]"
      overlay={
        <>
          <div
            data-h-fly
            data-h-fly-y="-60"
            data-h-fly-rotate="-6"
            data-h-fly-range="0.05,0.9"
            className="absolute left-0 top-[14%]"
          >
            <Rocket />
          </div>
          <div className="absolute inset-x-5 bottom-8 h-0.5 bg-line md:inset-x-[8vw]">
            <div data-h-progress className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          </div>
        </>
      }
    >
      <header className="flex w-[min(80vw,400px)] shrink-0 flex-col justify-center motion-reduce:snap-start">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-7xl">
          {t.titleLines[0]}
          <br />
          {t.titleLines[1]}
        </h2>
        <p className="mt-6 max-w-xs text-muted">
          {t.intro(workCount, projects.length - workCount)} {t.scrollHint} <span aria-hidden>→</span>
        </p>
      </header>

      {/* One row for all cards: `items-stretch` makes every card as tall as the tallest,
          so images, titles and tags line up even when a card's tags wrap to two lines. */}
      <div className="flex items-stretch gap-8 md:gap-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} locale={locale} t={t} />
        ))}
      </div>

      {github && (
        <div
          data-h-reveal
          className="flex w-[min(70vw,320px)] shrink-0 flex-col justify-center motion-reduce:snap-start"
        >
          <p className="font-display text-3xl font-bold">{t.githubTitle}</p>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="mt-4 text-accent underline-offset-4 hover:underline"
          >
            {t.githubLink}
          </a>
        </div>
      )}
    </HorizontalScroll>
  );
}

function ProjectCard({
  project,
  index,
  locale,
  t,
}: {
  project: Project;
  index: number;
  locale: Locale;
  t: Dictionary["projects"];
}) {
  return (
    <article
      data-h-item
      data-h-reveal
      className="group flex w-[min(78vw,520px)] shrink-0 flex-col motion-reduce:snap-center"
    >
      {/* Capped by viewport height so the whole card fits on short laptop screens. */}
      <div className="relative aspect-[16/10] max-h-[36svh] w-full overflow-hidden rounded-3xl border border-line bg-ink-3">
        {/* Wider than the frame so the inner layer has room to drift (data-h-speed). */}
        <div data-h-speed="0.25" className="absolute inset-y-0 -inset-x-[15%]">
          {project.image ? (
            <Image
              src={project.image}
              alt={t.imageAlt(project.title)}
              fill
              sizes="(min-width: 768px) 680px, 105vw"
              className="object-cover"
            />
          ) : (
            <ProjectArt hue={project.hue} />
          )}
        </div>
        <span className="absolute left-5 top-5 rounded-full bg-ink/60 px-3 py-1 font-mono text-xs backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {/* Narrow cards may wrap the label; reserve two lines so titles still line up. */}
      <p className="mt-6 min-h-[2lh] font-mono text-xs uppercase tracking-[0.18em] text-accent md:min-h-0">
        {localize(project.context, locale)}
      </p>
      <div className="mt-2 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-bold">
            {project.href ? (
              <a href={project.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-2 text-muted">{localize(project.summary, locale)}</p>
        </div>
        <span className="whitespace-nowrap font-mono text-sm text-muted">{project.year}</span>
      </div>
      {/* Pinned to the card's bottom edge so tag rows align across cards. */}
      <ul className="mt-auto flex flex-wrap gap-2 pt-4">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Generated "planet" artwork used until a real screenshot is provided. */
function ProjectArt({ hue }: { hue: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 72% 28%, hsl(${hue} 90% 65% / 0.6), transparent 45%), linear-gradient(135deg, hsl(${hue} 55% 18%), hsl(${(hue + 20) % 360} 50% 7%))`,
      }}
    >
      <div className="starfield absolute inset-0 opacity-60" />
      <div
        className="absolute bottom-[-35%] left-[22%] aspect-square w-[62%] rounded-full shadow-[0_0_80px_-10px_currentColor]"
        style={{
          color: `hsl(${hue} 90% 60%)`,
          background: `radial-gradient(circle at 35% 30%, hsl(${hue} 100% 88%), hsl(${hue} 85% 55%) 45%, hsl(${hue} 70% 18%))`,
        }}
      />
    </div>
  );
}

function Rocket() {
  return (
    <svg
      width="120"
      height="56"
      viewBox="0 0 120 56"
      aria-hidden
      className="drop-shadow-[0_0_24px_rgb(95_227_247/0.5)]"
    >
      <path d="M8 28 L30 20 L30 36 Z" fill="#5fe3f7" opacity="0.9">
        <animate
          attributeName="d"
          dur="0.25s"
          repeatCount="indefinite"
          values="M8 28 L30 20 L30 36 Z;M0 28 L30 21 L30 35 Z;M8 28 L30 20 L30 36 Z"
        />
      </path>
      <path d="M30 18 H86 Q112 28 86 38 H30 Z" fill="#e6eef9" />
      <path d="M40 18 L30 6 H44 L56 18 Z M40 38 L30 50 H44 L56 38 Z" fill="#5b7cfa" />
      <circle cx="80" cy="28" r="6" fill="#060b16" stroke="#5fe3f7" strokeWidth="2.5" />
    </svg>
  );
}
