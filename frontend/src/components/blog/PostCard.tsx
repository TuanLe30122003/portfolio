import Link from "next/link";
import type { PostSummary } from "@/types/blog";
import { localizePath } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { formatDate } from "@/lib/format";
import { PostCover } from "./PostCover";

export async function PostCard({ post, priority }: { post: PostSummary; priority?: boolean }) {
  const locale = await getLocale();
  const date = formatDate(post.publishedAt, locale);

  return (
    <article className="group relative flex flex-col">
      <PostCover
        src={post.cover}
        title={post.title}
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[16/10] rounded-2xl border border-line"
      />
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
        {date && <time dateTime={post.publishedAt ?? undefined}>{date}</time>}
        {post.tags.map((tag) => (
          <span key={tag} className="text-accent">
            #{tag}
          </span>
        ))}
      </div>
      <h3 className="mt-3 font-display text-xl font-bold leading-snug text-balance transition-colors group-hover:text-accent">
        <Link href={localizePath(`/blog/${post.slug}`, locale)} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      {post.description && <p className="mt-2 line-clamp-2 text-muted">{post.description}</p>}
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="aspect-[16/10] rounded-2xl bg-ink-3" />
      <div className="mt-5 h-3 w-1/3 rounded bg-ink-3" />
      <div className="mt-4 h-5 w-4/5 rounded bg-ink-3" />
      <div className="mt-3 h-4 w-full rounded bg-ink-3" />
    </div>
  );
}
