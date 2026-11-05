import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Configurator } from "@/components/configurator/Configurator";
import { ProductTabs } from "@/components/configurator/ProductTabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { categoryName, getProduct, products } from "@/data/catalogue";
import { routes } from "@/config/site";
import { artworkRules } from "@/data/help";
import styles from "./page.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name} from ${product.fromPrice} excl. GST. ${product.summary}`,
    openGraph: { images: [{ url: product.image }] },
  };
}

/** SF-PDP-01…07 · Product configurator page (one template for every product). */
export default async function ProductPage({ params }: Params) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = categoryName(product.category);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category, href: routes.category(product.category) },
          { label: product.name },
        ]}
      />
      <div className={`container ${styles.layout}`}>
        <div className={styles.media}>
          <div className={styles.photo}>
            <Image
              src={product.image}
              alt={`${product.name} printed by Order My Print`}
              fill
              priority
              sizes="(max-width: 1199px) 100vw, 600px"
            />
          </div>
          <div className={styles.specs}>
            <h2 className="t-h5">Key specs</h2>
            <dl>
              {product.specs.map(([label, value]) => (
                <div key={label} className={styles.specRow}>
                  <dt className="t-body-m">{label}</dt>
                  <dd className="t-label-m">{value}</dd>
                </div>
              ))}
            </dl>
            <p className={`t-label-s ${styles.pill}`}>Printed in-house · delivered India-wide</p>
          </div>
        </div>

        <div className={styles.main}>
          <header className={styles.head}>
            <p className={`t-overline ${styles.overline}`}>{category}</p>
            <h1 className={`t-h1 ${styles.title}`}>{product.name}</h1>
            <p className="t-body-l">{product.lead}</p>
            <div className={styles.chips}>
              <span className={`t-body-xs ${styles.chip}`}>
                <Clock size={16} aria-hidden="true" /> Ready to ship in {product.turnaround} working days
              </span>
              <Link href={routes.quote} className={`t-label-s ${styles.chipBrand}`}>
                Bulk quotes available
              </Link>
            </div>
          </header>
          <Configurator product={product} />
        </div>
      </div>

      <section className={styles.info} aria-label="Product information">
        <div className="container">
          <ProductTabs
            tabs={[
              { id: "description", label: "Description", content: <p className="t-body-l">{product.description}</p> },
              {
                id: "specifications",
                label: "Specifications",
                content: (
                  <dl className={styles.specTable}>
                    {product.specs.map(([label, value]) => (
                      <div key={label}>
                        <dt className="t-label-m">{label}</dt>
                        <dd className="t-body-m">{value}</dd>
                      </div>
                    ))}
                    <div>
                      <dt className="t-label-m">GST</dt>
                      <dd className="t-body-m">{Math.round(product.gstRate * 100)}% (shown separately)</dd>
                    </div>
                    <div>
                      <dt className="t-label-m">Ready to ship</dt>
                      <dd className="t-body-m">{product.turnaround} working days after artwork approval</dd>
                    </div>
                  </dl>
                ),
              },
              {
                id: "artwork",
                label: "Artwork guide",
                content: (
                  <div className={styles.guide}>
                    <p className="t-body-m">Print area: {product.artwork.printArea}.</p>
                    <ul className="t-body-m">
                      {artworkRules.map((rule) => (
                        <li key={rule.title}>
                          <strong>{rule.title}:</strong> {rule.detail}
                        </li>
                      ))}
                    </ul>
                    <p className="t-body-m">
                      Full details: <Link href={routes.artworkGuidelines}>artwork guidelines</Link>.
                    </p>
                  </div>
                ),
              },
              {
                id: "faq",
                label: "FAQ",
                content: (
                  <div className={styles.guide}>
                    <p className="t-label-l">When does printing start?</p>
                    <p className="t-body-m">
                      After your payment is confirmed and our pre-press team approves your artwork.
                    </p>
                    <p className="t-label-l">Is the price on this page final?</p>
                    <p className="t-body-m">
                      It is an estimate that includes your options and GST. Our server confirms the final price, with
                      delivery, at checkout.
                    </p>
                    <p className="t-body-m">
                      More answers in our <Link href={routes.help}>help centre</Link>.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
