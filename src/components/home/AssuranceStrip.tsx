import { Eye, Receipt, Tag, Truck, type LucideIcon } from "lucide-react";
import styles from "./AssuranceStrip.module.css";

const points: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Tag, title: "Transparent pricing", detail: "Breakdown & GST shown before checkout" },
  { icon: Eye, title: "Pre-press review", detail: "Every file checked by a person" },
  { icon: Truck, title: "Track every stage", detail: "From artwork approval to delivery" },
  { icon: Receipt, title: "GST invoices", detail: "Add your GSTIN at checkout" },
];

/** Figma SF-HOME-01 · Assurance strip. */
export function AssuranceStrip() {
  return (
    <section className={styles.strip} aria-label="Why order with us">
      <ul className={`container ${styles.list}`}>
        {points.map(({ icon: Icon, title, detail }) => (
          <li key={title} className={styles.item}>
            <span className={styles.icon}>
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className={styles.text}>
              <span className="t-label-m">{title}</span>
              <span className="t-body-xs">{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
