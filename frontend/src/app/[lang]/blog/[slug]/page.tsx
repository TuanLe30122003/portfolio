import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { localizePath } from "@/i18n/config";
import { getAlternates, getDictionary, getLocale } from "@/i18n/server";
import { getPost, getPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/components/blog/Markdown";
import { PostCover } from "@/components/blog/PostCover";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

/**
 * Cache Components requires at least one param at build time. When the API
 * is unreachable during the build we return this placeholder (it renders the
 * 404 page); real slugs are then rendered on first request and cached.
 */
const BUILD_PLACEHOLDER = "__placeholder__";

export async function generateStaticParams() {
  const { items } = await getPosts({ limit: 100 });
  return items.length > 0 ? items.map((post) => ({ slug: post.slug })) : [{ slug: BUILD_PLACEHOLDER }];
}

async function loadPost(slug: string) {
  return slug === BUILD_PLACEHOLDER ? null : getPost(slug);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const post = await loadPost((await params).slug).catch(() => null);
  if (!post) return { title: (await getDictionary()).post.notFoundTitle };

  return {
    title: post.title,
    description: post.description || undefined,
    alternates: await getAlternates(`/blog/${post.slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      publishedTime: post.publishedAt ?? undefined,
      tags: post.tags,
    },
  };
}

export default function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<"/[lang]/blog/[slug]">, "params">) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();

  const locale = await getLocale();
  const t = (await getDictionary()).post;
  const date = formatDate(post.publishedAt, locale);

  return (
    <article id="post" className="mx-auto max-w-3xl px-5 pb-32 pt-32 md:pt-40">
      <ReadingProgress target="#post" />
      <Link
        href={localizePath("/blog", locale)}
        className="font-mono text-xs uppercase tracking-[0.3em] text-muted hover:text-accent"
      >
        {t.back}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
          {date && <time dateTime={post.publishedAt ?? undefined}>{date}</time>}
          <span>{t.readingTime(post.readingTimeMinutes)}</span>
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={localizePath(`/blog?tag=${encodeURIComponent(tag)}`, locale)}
              className="text-accent hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <h1 className="mt-5 font-display text-4xl font-black leading-[1.1] text-balance md:text-6xl">{post.title}</h1>
        {post.description && <p className="mt-6 text-xl text-muted">{post.description}</p>}
      </header>

      {post.cover && (
        <PostCover
          src={post.cover}
          title={post.title}
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="mt-12 aspect-[16/9] rounded-3xl border border-line"
        />
      )}

      <div className="prose prose-lg prose-invert mt-14 max-w-none prose-headings:font-display prose-headings:scroll-mt-24 prose-a:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:bg-transparent prose-pre:p-0">
        <Markdown content={post.content} />
      </div>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-3xl animate-pulse px-5 pt-32 md:pt-40">
      <div className="h-3 w-16 rounded bg-ink-3" />
      <div className="mt-10 h-3 w-40 rounded bg-ink-3" />
      <div className="mt-6 h-12 w-full rounded bg-ink-3" />
      <div className="mt-3 h-12 w-2/3 rounded bg-ink-3" />
      <div className="mt-14 space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-4 rounded bg-ink-3" />
        ))}
      </div>
    </div>
  );
}
