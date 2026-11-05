import type { Metadata } from "next";
import { ProductBrowser } from "@/components/catalogue/ProductBrowser/ProductBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "../listing.module.css";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Visiting cards, letter pads, envelopes, brochures, stickers, DTF transfers and corporate T-shirts — every one configurable online.",
};

/** SF-PLP-01 · All products with filters. */
export default function ProductsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All products" }]} />
      <div className={`container ${styles.page}`}>
        <PageIntro
          title="All products"
          lead="Seven product families across four categories — every one configurable online."
        />
        <ProductBrowser />
      </div>
    </>
  );
}
