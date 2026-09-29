import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { clsx } from "clsx";
import { site } from "@/content/site";
import { localizePath, type Locale } from "@/i18n/config";
import { getAlternates, getDictionary, getLocale } from "@/i18n/server";
import { getPosts, getTags } from "@/lib/api/blog";
import { PostCard, PostCardSkeleton } from "@/components/blog/PostCard";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export async function generateMetadata(): Promise<Metadata> {
  const t = (await getDictionary()).blog;
  return {
    title: t.metaTitle,
    description: t.metaDescription(site.name),
    alternates: await getAlternates("/blog"),
  };
}

type SearchParams = PageProps<"/[lang]/blog">["searchParams"];

export default async function BlogPage({ searchParams }: PageProps<"/[lang]/blog">) {
  const t = (await getDictionary()).blog;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-32 pt-36 md:px-8 md:pt-44">
      <header className="max-w-3xl">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h1 className="mt-6 font-display text-6xl font-black leading-[0.95] md:text-8xl">{t.title}</h1>
        <p className="mt-6 text-lg text-muted">{t.intro}</p>
      </header>

      {/* searchParams are request data, so these parts stream in after the static header. */}
      <Suspense fallback={<div className="mt-12 h-10" />}>
        <TagFilter searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<PostGridSkeleton />}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function readParams(searchParams: SearchParams) {
  const { tag, cursor } = await searchParams;
  return {
    tag: typeof tag === "string" ? tag : undefined,
    cursor: typeof cursor === "string" ? cursor : undefined,
  };
}

function blogHref(locale: Locale, params: { tag?: string; cursor?: string }) {
  const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => !!entry[1]));
  const qs = query.toString();
  return localizePath(qs ? `/blog?${qs}` : "/blog", locale);
}

async function TagFilter({ searchParams }: { searchParams: SearchParams }) {
  const [{ tag: activeTag }, tags, locale, t] = await Promise.all([
    readParams(searchParams),
    getTags(),
    getLocale(),
    getDictionary(),
  ]);
  if (tags.length === 0) return null;

  return (
    <nav aria-label={t.blog.filterLabel} className="mt-12">
      <ul className="flex flex-wrap gap-2">
        {[undefined, ...tags].map((tag) => {
          const active = tag === activeTag;
          return (
            <li key={tag ?? "all"}>
              <Link
                href={blogHref(locale, { tag })}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex rounded-full border px-4 py-1.5 text-sm transition-colors",
                  active ? "border-accent bg-accent text-ink" : "border-line text-muted hover:text-paper",
                )}
              >
                {tag ?? t.blog.allTags}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

async function PostList({ searchParams }: { searchParams: SearchParams }) {
  const { tag, cursor } = await readParams(searchParams);
  const [{ items, nextCursor, unavailable }, locale, { blog: t }] = await Promise.all([
    getPosts({ tag, cursor, limit: 12 }),
    getLocale(),
    getDictionary(),
  ]);

  if (items.length === 0) {
    return <p className="mt-16 text-muted">{unavailable ? t.unavailable : t.empty}</p>;
  }

  return (
    <>
      <Reveal key={`${tag}-${cursor}`} className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" y={40}>
        {items.map((post, index) => (
          <div key={post.id} data-reveal-item>
            <PostCard post={post} priority={index < 3} />
          </div>
        ))}
      </Reveal>

      {(cursor || nextCursor) && (
        <nav aria-label={t.paginationLabel} className="mt-20 flex justify-between border-t border-line pt-8 text-sm">
          {cursor ? (
            <Link href={blogHref(locale, { tag })} className="text-muted hover:text-paper">
              {t.newer}
            </Link>
          ) : (
            <span />
          )}
          {nextCursor && (
            <Link href={blogHref(locale, { tag, cursor: nextCursor })} className="text-accent hover:underline">
              {t.older}
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

function PostGridSkeleton() {
  return (
    <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
