import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { getProducts } from "@/lib/catalogue";
import styles from "../help/help.module.css";

export const metadata: Metadata = {
  title: "Bulk & corporate quotes",
  description: "Request one quotation for several print products. Accept, decline or ask questions online.",
};

type Props = { searchParams: Promise<{ product?: string }> };

/** SF-QUO-01 · Bulk quote request. */
export default async function QuotePage({ searchParams }: Props) {
  const [{ product }, products] = await Promise.all([searchParams, getProducts()]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bulk & corporate quotes" }]} />
      <div className={`container ${styles.page}`}>
        <div className={styles.split}>
          <div className={styles.prose}>
            <PageIntro
              overline="Bulk & corporate"
              title="Request a quotation"
              lead="Send one request for several products. Our sales team prices it, revises it with you, and turns your accepted quote into an order — no re-keying."
            />
            <CheckList
              items={[
                "Multi-item quotations with artwork",
                "Accept, decline or ask questions online",
                "Credit terms for approved companies",
              ]}
            />
          </div>
          <QuoteForm products={products.map(({ slug, name }) => ({ slug, name }))} initialProduct={product} />
        </div>
      </div>
    </>
  );
}
