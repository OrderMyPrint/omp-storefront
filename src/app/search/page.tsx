import type { Metadata } from "next";
import { ProductCard } from "@/components/catalogue/ProductCard/ProductCard";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Button } from "@/components/ui/Button/Button";
import { categoryName, products } from "@/data/catalogue";
import { routes } from "@/config/site";
import listing from "../listing.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

type Props = { searchParams: Promise<{ q?: string }> };

/** Simple ranked match on name, category, summary and options. */
function search(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return products
    .map((product) => {
      const haystack = [
        product.name,
        categoryName(product.category),
        product.summary,
        product.description,
        ...product.steps.flatMap((step) => step.choices.map((choice) => choice.label)),
      ]
        .join(" ")
        .toLowerCase();
      const name = product.name.toLowerCase();
      const score = terms.reduce((sum, term) => {
        const stem = term.replace(/s$/, "");
        if (name.includes(stem)) return sum + 3;
        if (haystack.includes(stem)) return sum + 1;
        return sum;
      }, 0);
      return { product, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.product);
}

/** SF-SRCH-01 · Search results. */
export default async function SearchPage({ searchParams }: Props) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 100);
  const results = search(query);

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
