import type { Product } from "@/data/catalogue";
import { cx } from "@/lib/cx";
import { formatINR, formatQuantity } from "@/lib/format";
import { tierFor } from "@/lib/pricing";
import styles from "./Configurator.module.css";

function money(value: number): string {
  return formatINR(value, { decimals: Number.isInteger(value) ? 0 : 2 });
}

/** Figma SF-PRICE-01 · tier table with the active tier highlighted. */
export function TierTable({ product, quantity, quoteFrom }: { product: Product; quantity: number; quoteFrom: number }) {
  const tiers = [...product.tiers].sort((a, b) => a.quantity - b.quantity);
  const active = quantity >= tiers[0].quantity && quantity < quoteFrom ? tierFor(tiers, quantity) : undefined;
  const base = tiers[0].unitPrice;
  const per = product.unitNoun.one;

  return (
    <div className={styles.tierWrap}>
      <table className={styles.tierTable}>
        <caption className="visually-hidden">Price per {per} by quantity, excluding GST</caption>
        <thead>
          <tr className="t-label-s">
            <th scope="col">Quantity</th>
            <th scope="col">Per {per}</th>
            <th scope="col">Total</th>
            <th scope="col">You save</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => {
            const saving = Math.round((1 - tier.unitPrice / base) * 100);
            const isActive = active?.quantity === tier.quantity;
            return (
              <tr
                key={tier.quantity}
                className={cx("t-body-s", isActive && styles.tierActive)}
                aria-current={isActive ? "true" : undefined}
              >
                <th scope="row">{formatQuantity(tier.quantity)}</th>
                <td>{money(tier.unitPrice)}</td>
                <td>{money(Math.round(tier.unitPrice * tier.quantity * 100) / 100)}</td>
                <td className={saving > 0 ? styles.save : undefined}>{saving > 0 ? `${saving}%` : "—"}</td>
              </tr>
            );
          })}
          {Number.isFinite(quoteFrom) ? (
            <tr className={cx("t-body-s", quantity >= quoteFrom && styles.tierActive)}>
              <th scope="row">{formatQuantity(quoteFrom)}+</th>
              <td>Quote</td>
              <td>On request</td>
              <td>—</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <p className="t-body-xs">Unit prices exclude GST and options · bigger quantities cost less per {per}</p>
    </div>
  );
}
