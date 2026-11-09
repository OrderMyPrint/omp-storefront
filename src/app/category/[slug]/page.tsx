import type { Metadata } from "next";
import { Clock, Receipt, Tag } from "lucide-react";
import { CatalogueImage } from "@/components/catalogue/CatalogueImage";
import { ProductBrowser } from "@/components/catalogue/ProductBrowser/ProductBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import { routes } from "@/config/site";
import { getCategories, getCategory, getProducts, redirectOrNotFound } from "@/lib/catalogue";
import styles from "../../listing.module.css";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category ? { title: category.name, description: category.lead } : {};
}

/** Lowest and highest turnaround across a set of "a–b" ranges. */
function turnaroundRange(ranges: string[]): string {
  const numbers = ranges.flatMap((range) => range.split("–").map(Number));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return min === max ? `${min}` : `${min}–${max}`;
}

/** SF-CAT-01 · Category page (one template for all four categories). */
export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return redirectOrNotFound(`/category/${slug}`);

  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);
  const items = allProducts.filter((product) => product.category === category.slug);
  const cheapest = items.length
    ? items.reduce((low, product) => (product.startingPrice < low.startingPrice ? product : low))
    : null;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "All products", href: routes.products },
          { label: category.name },
        ]}
      />
      <div className={`container ${styles.page}`}>
        <section className={styles.hero}>
          <PageIntro overline="Category" title={category.name} lead={category.lead}>
            <ul className={styles.facts}>
              {cheapest ? (
                <>
                  <li className={`t-label-m ${styles.fact}`}>
                    <Tag size={20} aria-hidden="true" />
                    From {cheapest.fromPrice}
                  </li>
                  <li className={`t-label-m ${styles.fact}`}>
                    <Clock size={20} aria-hidden="true" />
                    Ready to ship in {turnaroundRange(items.map((product) => product.turnaround))} working days
                  </li>
                </>
              ) : null}
              <li className={`t-label-m ${styles.fact}`}>
                <Receipt size={20} aria-hidden="true" />
                GST invoice included
              </li>
            </ul>
          </PageIntro>
          <div className={styles.heroImage}>
            <CatalogueImage src={category.image} alt="" fill priority sizes="(max-width: 1199px) 100vw, 640px" />
          </div>
        </section>

        <ProductBrowser products={allProducts} categories={categories} initialCategory={category.slug} />

        <CtaBand
          title={category.bulkPrompt.title}
          detail={category.bulkPrompt.detail}
          cta="Request a bulk quote"
          href={routes.quote}
        />

        <section className={styles.about} aria-labelledby="about-category">
          <h2 id="about-category" className="t-h4">
            About our {category.name.toLowerCase()}
          </h2>
          <p className="t-body-m">{category.about}</p>
        </section>
      </div>
    </>
  );
}
