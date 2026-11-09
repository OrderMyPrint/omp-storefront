import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { TurnaroundChip } from "@/components/ui/TurnaroundChip/TurnaroundChip";
import { CatalogueImage } from "@/components/catalogue/CatalogueImage";
import { productCategoryName, type Product } from "@/data/catalogue";
import { routes } from "@/config/site";
import styles from "./ProductCard.module.css";

export type CardProduct = Pick<
  Product,
  "slug" | "name" | "category" | "categoryName" | "summary" | "image" | "fromPrice" | "turnaround"
>;

/** Figma "Product Card": image, category, name, summary, "From" price, turnaround, CTA. */
export function ProductCard({ product }: { product: CardProduct }) {
  const href = routes.product(product.slug);
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.media} tabIndex={-1} aria-hidden="true">
        <CatalogueImage src={product.image} alt="" fill sizes="(max-width: 767px) 80vw, 300px" />
      </Link>
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.body}>
        <p className={`t-overline ${styles.category}`}>{productCategoryName(product)}</p>
        <h3 className={`t-h5 ${styles.name}`}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className={`t-body-s ${styles.summary}`}>{product.summary}</p>
        <p className={styles.price}>
          <span className="t-body-xs">From</span>
          <span className="t-price-m">{product.fromPrice}</span>
        </p>
        <TurnaroundChip days={product.turnaround} />
        <Button href={href} variant="secondary" fullWidth className={styles.cta}>
          Configure
        </Button>
      </div>
    </article>
  );
}
