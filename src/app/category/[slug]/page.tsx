import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Receipt, Tag } from "lucide-react";
import { ProductBrowser } from "@/components/catalogue/ProductBrowser/ProductBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import { categories, getCategory, productsInCategory } from "@/data/catalogue";
import { routes } from "@/config/site";
import styles from "../../listing.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).slug);
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
  const category = getCategory((await params).slug);
  if (!category) notFound();

  const items = productsInCategory(category.slug);
  const cheapest = items.reduce(
    (low, product) => (product.startingPrice < low.startingPrice ? product : low),
    items[0],
  );

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
              <li className={`t-label-m ${styles.fact}`}>
                <Tag size={20} aria-hidden="true" />
                From {cheapest.fromPrice}
              </li>
              <li className={`t-label-m ${styles.fact}`}>
                <Clock size={20} aria-hidden="true" />
                Ready to ship in {turnaroundRange(items.map((product) => product.turnaround))} working days
              </li>
              <li className={`t-label-m ${styles.fact}`}>
                <Receipt size={20} aria-hidden="true" />
                GST invoice included
              </li>
            </ul>
          </PageIntro>
          <div className={styles.heroImage}>
            <Image src={category.image} alt="" fill priority sizes="(max-width: 1199px) 100vw, 640px" />
          </div>
        </section>

        <ProductBrowser initialCategory={category.slug} />

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
