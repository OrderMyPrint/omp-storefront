"use client";

import { CategoryTile } from "@/components/catalogue/CategoryTile/CategoryTile";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { useCatalogue } from "@/components/catalogue/CatalogueProvider";
import type { Category } from "@/data/catalogue";
import type { CategoryTilesBlock } from "@/lib/content";
import styles from "./CategoryGrid.module.css";

/** Figma SF-HOME-01 · Categories. The admin chooses which categories and in what order. */
export function CategoryGrid({ block }: { block?: CategoryTilesBlock }) {
  const { categories } = useCatalogue();
  const list = block
    ? block.categorySlugs
        .map((slug) => categories.find((category) => category.slug === slug))
        .filter((c): c is Category => Boolean(c))
    : categories;
  return (
    <section className="container" aria-labelledby="categories-title">
      <div className={styles.section}>
        <SectionHeading
          id="categories-title"
          overline={block?.overline ?? "Shop by category"}
          title={block?.heading ?? "Everything your business prints"}
        />
        <ul className={styles.grid}>
          {list.map((category) => (
            <li key={category.slug}>
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
