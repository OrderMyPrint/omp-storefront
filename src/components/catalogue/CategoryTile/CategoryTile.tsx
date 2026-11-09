import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogueImage } from "@/components/catalogue/CatalogueImage";
import { CmykBar } from "@/components/ui/CmykBar/CmykBar";
import type { Category } from "@/data/catalogue";
import { routes } from "@/config/site";
import styles from "./CategoryTile.module.css";

/** Figma "Category Tile" with the CMYK colour-bar motif. */
export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={routes.category(category.slug)} className={styles.tile}>
      <div className={styles.media}>
        <CatalogueImage
          src={category.image}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 300px"
        />
      </div>
      <CmykBar />
      <div className={styles.body}>
        <div className={styles.text}>
          <h3 className={`t-h5 ${styles.name}`}>{category.name}</h3>
          <p className={`t-body-xs ${styles.summary}`}>{category.summary}</p>
        </div>
        <ArrowRight size={20} aria-hidden="true" className={styles.arrow} />
      </div>
    </Link>
  );
}
