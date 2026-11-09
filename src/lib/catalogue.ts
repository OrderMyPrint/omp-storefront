import "server-only";
import { cache } from "react";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import {
  categories as builtInCategories,
  getProduct as builtInProduct,
  products as builtInProducts,
  type Category,
  type Product,
} from "@/data/catalogue";
import { API_URL } from "@/lib/api";
import {
  listedFromProduct,
  toCategory,
  toListedProduct,
  toProduct,
  type ApiCategory,
  type ApiProduct,
  type ApiProductSummary,
  type ListedProduct,
} from "@/lib/catalogue-map";
import { getSiteSettings } from "@/lib/content";

/**
 * The live catalogue from the API (OrderMyPrint/omp-api, /api/v1/catalogue/*),
 * fetched on the server and cached for 60 s (ISR), like src/lib/content.ts.
 * When the API is not configured or cannot be reached, the built-in catalogue
 * (src/data/catalogue.ts) is used so the site never breaks. A 404 from the API
 * is an answer, not a failure: the product really does not exist.
 */

const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 5000;

type Fetched<T> = { status: "ok"; data: T } | { status: "missing" } | { status: "unavailable" };

async function get<T>(path: string): Promise<Fetched<T>> {
  if (!API_URL) return { status: "unavailable" };
  try {
    const res = await fetch(`${API_URL}/api/v1/catalogue${path}`, {
      headers: { accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS, tags: ["catalogue"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 404) return { status: "missing" };
    if (!res.ok) return { status: "unavailable" };
    return { status: "ok", data: (await res.json()) as T };
  } catch {
    return { status: "unavailable" };
  }
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const result = await get<ApiCategory[]>("/categories");
  return result.status === "ok" ? result.data.map(toCategory) : builtInCategories;
});

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((category) => category.slug === slug);
}

/** Built-in fallback for the listing, with the same matching as the API (name, summary, description). */
function builtInListing(filter: { category?: string; q?: string }): ListedProduct[] {
  const q = filter.q?.trim().toLowerCase();
  return builtInProducts
    .filter((product) => !filter.category || product.category === filter.category)
    .filter((product) => !q || [product.name, product.summary, product.description].join(" ").toLowerCase().includes(q))
    .map(listedFromProduct);
}

export const getProducts = cache(async (category?: string, q?: string): Promise<ListedProduct[]> => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q.slice(0, 100));
  const query = params.toString();
  const result = await get<ApiProductSummary[]>(`/products${query ? `?${query}` : ""}`);
  return result.status === "ok" ? result.data.map(toListedProduct) : builtInListing({ category, q });
});

/** A product with its full option schema, or `undefined` when it does not exist. */
export const getProduct = cache(async (slug: string): Promise<Product | undefined> => {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return undefined;
  const result = await get<ApiProduct>(`/products/${slug}`);
  if (result.status === "ok") return toProduct(result.data);
  if (result.status === "missing") return undefined;
  return builtInProduct(slug);
});

/**
 * Where an old path now lives (slug changes are stored as redirects in the
 * API and published in site settings), or `null`.
 */
export async function redirectFor(path: string): Promise<{ to: string; permanent: boolean } | null> {
  const settings = await getSiteSettings();
  const match = settings?.redirects?.find((item) => item.fromPath === path);
  return match && match.toPath !== path ? { to: match.toPath, permanent: match.permanent } : null;
}

/** For an unknown product or category path: follow a stored redirect, else show the 404 page. */
export async function redirectOrNotFound(path: string): Promise<never> {
  const target = await redirectFor(path);
  if (target) {
    if (target.permanent) permanentRedirect(target.to);
    redirect(target.to);
  }
  notFound();
}
