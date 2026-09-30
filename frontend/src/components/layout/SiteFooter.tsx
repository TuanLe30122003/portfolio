import { site } from "@/content/site";
import { localize } from "@/i18n/config";
import { getLocale } from "@/i18n/server";

export async function SiteFooter() {
  const locale = await getLocale();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {site.name} · {localize(site.location, locale)}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-paper">
              {site.email}
            </a>
          </li>
          {site.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
