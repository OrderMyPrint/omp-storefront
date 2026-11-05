"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { QuantityStepper } from "@/components/ui/Field/QuantityStepper";
import { Select } from "@/components/ui/Field/Select";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { products } from "@/data/catalogue";
import { routes } from "@/config/site";
import { formatINR } from "@/lib/format";
import { estimatePrice } from "@/lib/pricing";
import type { PriceEstimatorBlock } from "@/lib/content";
import styles from "./PriceEstimator.module.css";

const defaultPoints = [
  "Quantity tiers show where you save",
  "Price breakdown: paper, finish, setup, GST",
  "Final price confirmed by our server at checkout",
];

const defaultProduct = products[0];

/** Figma SF-HOME-01 · Price estimator band — a working quick estimate. */
export function PriceEstimator({ block }: { block?: PriceEstimatorBlock }) {
  const points = block?.points.length ? block.points : defaultPoints;
  const [productSlug, setProductSlug] = useState(defaultProduct.slug);
  const product = products.find((item) => item.slug === productSlug) ?? defaultProduct;
  const quantities = product.tiers.map((tier) => tier.quantity);

  const [quantity, setQuantity] = useState(500);
  const [optionId, setOptionId] = useState("double");

  const activeQuantity = quantities.includes(quantity) ? quantity : quantities[Math.min(2, quantities.length - 1)];
  const option =
    product.estimatorOption.choices.find((choice) => choice.id === optionId) ?? product.estimatorOption.choices[0];

  const estimate = useMemo(() => estimatePrice(product, activeQuantity, option), [product, activeQuantity, option]);

  const changeProduct = (slug: string) => {
    const next = products.find((item) => item.slug === slug) ?? defaultProduct;
    setProductSlug(next.slug);
    setQuantity(next.tiers[Math.min(2, next.tiers.length - 1)].quantity);
    setOptionId(next.estimatorOption.choices[0].id);
  };

  return (
    <section className={styles.band} aria-labelledby="estimator-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <SectionHeading
            id="estimator-title"
            tone="inverse"
            overline={block?.overline ?? "No surprises"}
            title={block?.heading ?? "See your price before you order"}
            lead={
              block
                ? block.lead
                : "Pick a product and quantity — our pricing engine shows the indicative price, quantity tiers and GST instantly."
            }
          />
          <CheckList items={points} tone="inverse" />
        </div>

        <form className={styles.card} onSubmit={(event) => event.preventDefault()} aria-label="Quick price estimate">
          <h3 className="t-h4">Quick price estimate</h3>
          <Select
            label="Product"
            value={product.slug}
            onChange={(event) => changeProduct(event.target.value)}
            options={products.map((item) => ({ value: item.slug, label: item.name }))}
          />
          <div className={styles.row}>
            <QuantityStepper label="Quantity" steps={quantities} value={activeQuantity} onChange={setQuantity} />
            <Select
              label={product.estimatorOption.label}
              value={option.id}
              onChange={(event) => setOptionId(event.target.value)}
              options={product.estimatorOption.choices.map((choice) => ({ value: choice.id, label: choice.label }))}
            />
          </div>
          <div className={styles.total}>
            <div>
              <p className="t-body-s">Estimated total</p>
              <p className={`t-price-l ${styles.amount}`} aria-live="polite">
                {formatINR(estimate.total)}
              </p>
              <p className="t-body-xs">
                {formatINR(estimate.subtotal)} + GST {Math.round(product.gstRate * 100)}% · delivery added at checkout
              </p>
            </div>
            <Button href={routes.product(product.slug)} variant="accent">
              Configure
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
