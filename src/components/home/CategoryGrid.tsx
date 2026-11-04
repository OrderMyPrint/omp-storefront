import { CategoryTile } from "@/components/catalogue/CategoryTile/CategoryTile";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { categories } from "@/data/catalogue";
import styles from "./CategoryGrid.module.css";

/** Figma SF-HOME-01 · Categories. */
export function CategoryGrid() {
  return (
    <section className="container" aria-labelledby="categories-title">
      <div className={styles.section}>
        <SectionHeading id="categories-title" overline="Shop by category" title="Everything your business prints" />
        <ul className={styles.grid}>
          {categories.map((category) => (
            <li key={category.slug}>
              <CategoryTile category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
