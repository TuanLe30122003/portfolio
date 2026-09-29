import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = (await getDictionary()).notFound;

  return (
    <section className="starfield relative grid min-h-svh place-items-center px-5 text-center">
      <div>
        <p className="font-display text-[clamp(6rem,22vw,16rem)] font-black leading-none text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold md:text-4xl">{t.title}</h1>
        <p className="mt-4 text-muted">{t.body}</p>
        <div className="mt-10 flex justify-center gap-3">
          <Link
            href={localizePath("/", locale)}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink"
          >
            {t.home}
          </Link>
          <Link href={localizePath("/blog", locale)} className="rounded-full border border-line px-6 py-3 text-sm">
            {t.blog}
          </Link>
        </div>
      </div>
    </section>
  );
}
