import { Suspense } from "react";
import { getPosts } from "@/lib/api/blog";
import { PostCard, PostCardSkeleton } from "@/components/blog/PostCard";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HashLink } from "@/components/ui/HashLink";
import { getDictionary } from "@/i18n/server";

/** Vertical leg #4 — newest Notion posts, streamed in behind a skeleton. */
export async function LatestPosts() {
  const t = (await getDictionary()).latestPosts;

  return (
    <section id="blog" className="mx-auto max-w-7xl px-5 py-32 md:px-8 md:py-44">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow data-reveal-item>{t.eyebrow}</Eyebrow>
          <h2 data-reveal-item className="mt-6 font-display text-5xl font-black leading-[0.95] md:text-6xl">
            {t.title}
          </h2>
        </div>
        <div data-reveal-item>
          <HashLink href="/blog" variant="ghost">
            {t.viewAll}
          </HashLink>
        </div>
      </Reveal>

      <Suspense
        fallback={
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <LatestPostList />
      </Suspense>
    </section>
  );
}

async function LatestPostList() {
  const [{ items, unavailable }, { latestPosts: t }] = await Promise.all([getPosts({ limit: 3 }), getDictionary()]);

  if (items.length === 0) {
    return <p className="mt-14 text-muted">{unavailable ? t.unavailable : t.empty}</p>;
  }

  return (
    <Reveal className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3" y={60} stagger={0.12}>
      {items.map((post) => (
        <div key={post.id} data-reveal-item>
          <PostCard post={post} />
        </div>
      ))}
    </Reveal>
  );
}
