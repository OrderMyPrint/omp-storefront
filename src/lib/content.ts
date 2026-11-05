import "server-only";
import { API_URL } from "@/lib/api";

/**
 * Website content from the API (OrderMyPrint/omp-api, /api/v1/content/*).
 * Fetched on the server and cached for 60 s (ISR). Every function returns
 * `null` when the API is not configured, slow or failing, and callers fall
 * back to the content built into the storefront — so the site never breaks.
 */

const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 3000;

async function get<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/v1/content${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["content"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------- types

export type ResolvedLink = { href: string; external: boolean };
export type ResolvedCta = ResolvedLink & { label: string };
export type ResolvedImage = { url: string; alt: string; width: number | null; height: number | null };

type Base = { id: string; visible?: boolean };
export type HeroBlock = Base & {
  type: "hero";
  overline?: string;
  heading: string;
  body?: string;
  points: string[];
  primary: ResolvedCta | null;
  secondary: ResolvedCta | null;
  image: ResolvedImage | null;
  note?: string;
};
export type AssuranceBlock = Base & {
  type: "assuranceStrip";
  items: { icon: string; title: string; detail: string }[];
};
export type CategoryTilesBlock = Base & {
  type: "categoryTiles";
  overline?: string;
  heading: string;
  categorySlugs: string[];
};
export type ProductCarouselBlock = Base & {
  type: "productCarousel";
  overline?: string;
  heading: string;
  lead?: string;
  productSlugs: string[];
};
export type PriceEstimatorBlock = Base & {
  type: "priceEstimator";
  overline?: string;
  heading: string;
  lead?: string;
  points: string[];
};
export type StepsBlock = Base & {
  type: "steps";
  overline?: string;
  heading: string;
  steps: { title: string; detail: string }[];
  cta: ResolvedCta | null;
  image: ResolvedImage | null;
};
export type CtaBandBlock = Base & {
  type: "ctaBand";
  overline?: string;
  heading: string;
  body?: string;
  points: string[];
  primary: ResolvedCta | null;
  secondary: ResolvedCta | null;
  image: ResolvedImage | null;
};
export type GalleryBlock = Base & {
  type: "imageGallery";
  overline?: string;
  heading: string;
  lead?: string;
  images: { caption: string | null; image: ResolvedImage }[];
};
export type FaqListBlock = Base & {
  type: "faqList";
  overline?: string;
  heading: string;
  items: { id: string; question: string; answer: string }[];
  cta: ResolvedCta | null;
};
export type RichTextBlock = Base & {
  type: "richText";
  nodes: (
    | { type: "heading"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
  )[];
};
export type ImageTextBlock = Base & {
  type: "imageText";
  heading: string;
  body: string;
  image: ResolvedImage | null;
  imageSide: "left" | "right";
  cta: ResolvedCta | null;
};
export type CardsBlock = Base & {
  type: "cards";
  heading?: string;
  cards: { icon?: string; title: string; body: string }[];
};
export type NoticeBlock = Base & {
  type: "notice";
  tone: "info" | "success" | "warning" | "error";
  title: string;
  body?: string;
};

export type ContentBlock =
  | HeroBlock
  | AssuranceBlock
  | CategoryTilesBlock
  | ProductCarouselBlock
  | PriceEstimatorBlock
  | StepsBlock
  | CtaBandBlock
  | GalleryBlock
  | FaqListBlock
  | RichTextBlock
  | ImageTextBlock
  | CardsBlock
  | NoticeBlock;

export type ContentPage = {
  key: string;
  path: string;
  type: string;
  title: string;
  overline: string | null;
  lead: string | null;
  seo: { title?: string; description?: string; noindex: boolean; socialImage: ResolvedImage | null };
  blocks: ContentBlock[];
};

export type NavLinkOut = ResolvedLink & { label: string; newTab: boolean; mobile: boolean };
export type Navigation = {
  utility: NavLinkOut[];
  categoryBar: { categories: { slug: string; name: string; href: string }[]; quote: NavLinkOut | null };
  footer: { title: string; links: NavLinkOut[] }[];
};

export type SiteSettings = {
  brand: { name: string; tagline: string };
  contact: { phone: string; phoneHref: string; hours: string; supportEmail: string | null };
  announcement: { message: string; link: ResolvedLink | null } | null;
  seo: { titleTemplate: string; description: string };
  redirects: { fromPath: string; toPath: string; permanent: boolean }[];
};

export type FaqTopic = { key: string; title: string; items: { id: string; question: string; answer: string }[] };

// ------------------------------------------------------------- fetchers

export const getPage = (path: string) => get<ContentPage>(`/pages?path=${encodeURIComponent(path)}`);
export const getNavigation = () => get<Navigation>("/navigation");
export const getSiteSettings = () => get<SiteSettings>("/site-settings");
export const getFaq = () => get<FaqTopic[]>("/faq");

/** A block by type from a page, for pages whose layout is fixed but text is editable. */
export function blockOf<T extends ContentBlock["type"]>(page: ContentPage | null, type: T) {
  return page?.blocks.find((b): b is Extract<ContentBlock, { type: T }> => b.type === type) ?? null;
}
