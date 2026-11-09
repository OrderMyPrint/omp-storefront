import type { Metadata } from "next";
import { ProductCard } from "@/components/catalogue/ProductCard/ProductCard";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import { routes } from "@/config/site";
import { getProducts } from "@/lib/catalogue";
import type { ListedProduct } from "@/lib/catalogue-map";
import listing from "../listing.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string }> };

/**
 * Search runs in the API (name, summary and description). The whole phrase is
 * tried first; when it finds nothing, each word is searched and products that
 * match more words rank higher. Products whose name matches come first.
 */
async function search(query: string): Promise<ListedProduct[]> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  let hits = (await getProducts(undefined, query)).map((product) => ({ product, words: terms.length }));
  if (!hits.length && terms.length > 1) {
    const perTerm = await Promise.all(terms.slice(0, 4).map((term) => getProducts(undefined, term.replace(/s$/, ""))));
    const bySlug = new Map<string, { product: ListedProduct; words: number }>();
    for (const product of perTerm.flat()) {
      const hit = bySlug.get(product.slug) ?? { product, words: 0 };
      hit.words += 1;
      bySlug.set(product.slug, hit);
    }
    hits = [...bySlug.values()];
  }
  const nameScore = (product: ListedProduct) =>
    terms.filter((term) => product.name.toLowerCase().includes(term.replace(/s$/, ""))).length;
  return hits
    .map((hit, index) => ({ ...hit, index, score: hit.words + 3 * nameScore(hit.product) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((hit) => hit.product);
}

/** SF-SRCH-01 · Search results. */
export default async function SearchPage({ searchParams }: Props) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 100);
  const results = await search(query);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className={`container ${listing.page}`}>
        <PageIntro
          title={query ? `Results for “${query}”` : "Search products"}
          lead={
            query
              ? `${results.length} ${results.length === 1 ? "product" : "products"} found`
              : "Use the search box above to find a product."
          }
        />
        {results.length ? (
          <ul className={styles.grid}>
            {results.map((product) => (
              <li key={product.slug} className={styles.cell}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : query ? (
          <div className={styles.empty}>
            <p className="t-h4">No products match “{query}”</p>
            <p className="t-body-m">
              Check the spelling, try a shorter word, or browse all products. For something custom, ask us for a
              quotation.
            </p>
            <div className={styles.actions}>
              <Button href={routes.products}>Browse all products</Button>
              <Button href={routes.quote} variant="secondary">
                Request a quote
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
