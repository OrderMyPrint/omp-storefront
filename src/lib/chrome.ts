import "server-only";
import { footerNav, routes, site, utilityNav } from "@/config/site";
import { getCategories } from "@/lib/catalogue";
import { getNavigation, getSiteSettings } from "@/lib/content";

/** Everything the header, mobile menu and footer show — from the API, or the built-in defaults. */
export type ChromeLink = { label: string; href: string; external?: boolean; newTab?: boolean; mobile?: boolean };
export type SiteChrome = {
  utility: ChromeLink[];
  categories: ChromeLink[];
  quote: ChromeLink | null;
  footer: { title: string; links: ChromeLink[] }[];
  contact: { phone: string; phoneHref: string; hours: string };
  tagline: string;
  announcement: { message: string; href: string | null; external: boolean } | null;
  source: "api" | "built-in";
};

const fallback: Omit<SiteChrome, "categories"> = {
  utility: utilityNav,
  quote: { label: "Get a bulk quote", href: routes.quote },
  footer: footerNav,
  contact: { phone: site.phone.display, phoneHref: site.phone.href, hours: site.hours },
  tagline: "Premium & professional printing for individuals, businesses and corporate teams across India.",
  announcement: null,
  source: "built-in",
};

export async function getSiteChrome(): Promise<SiteChrome> {
  const [nav, settings, categories] = await Promise.all([getNavigation(), getSiteSettings(), getCategories()]);
  const link = (l: {
    label: string;
    href: string;
    external: boolean;
    newTab: boolean;
    mobile: boolean;
  }): ChromeLink => ({
    label: l.label,
    href: l.href,
    external: l.external,
    newTab: l.newTab,
    mobile: l.mobile,
  });
  return {
    utility: nav ? nav.utility.map(link) : fallback.utility,
    categories: nav
      ? nav.categoryBar.categories.map((c) => ({ label: c.name, href: c.href }))
      : categories.map((c) => ({ label: c.name, href: routes.category(c.slug) })),
    quote: nav ? (nav.categoryBar.quote ? link(nav.categoryBar.quote) : null) : fallback.quote,
    footer: nav ? nav.footer.map((c) => ({ title: c.title, links: c.links.map(link) })) : fallback.footer,
    contact: settings
      ? { phone: settings.contact.phone, phoneHref: settings.contact.phoneHref, hours: settings.contact.hours }
      : fallback.contact,
    tagline: fallback.tagline,
    announcement: settings?.announcement
      ? {
          message: settings.announcement.message,
          href: settings.announcement.link?.href ?? null,
          external: settings.announcement.link?.external ?? false,
        }
      : null,
    source: nav && settings ? "api" : "built-in",
  };
}
