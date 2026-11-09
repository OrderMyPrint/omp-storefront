import type { Metadata } from "next";
import { ProductBrowser } from "@/components/catalogue/ProductBrowser/ProductBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { getCategories, getProducts } from "@/lib/catalogue";
import styles from "../listing.module.css";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Visiting cards, letter pads, envelopes, brochures, stickers, DTF transfers and corporate T-shirts — every one configurable online.",
};

export const revalidate = 60;

const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const count = (n: number) => words[n] ?? String(n);
const plural = (n: number, one: string, many: string) => `${count(n)} ${n === 1 ? one : many}`;

/** SF-PLP-01 · All products with filters. */
export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const usedCategories = new Set(products.map((product) => product.category)).size;
  const families = plural(products.length, "product family", "product families");
  const lead = `${families.charAt(0).toUpperCase()}${families.slice(1)} across ${plural(usedCategories, "category", "categories")} — every one configurable online.`;

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "All products" }]} />
      <div className={`container ${styles.page}`}>
        <PageIntro title="All products" lead={lead} />
        <ProductBrowser products={products} categories={categories} />
      </div>
    </>
  );
}
