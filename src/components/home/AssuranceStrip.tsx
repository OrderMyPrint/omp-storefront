import { Clock, Eye, Receipt, ShieldCheck, Tag, Truck, type LucideIcon } from "lucide-react";
import type { AssuranceBlock } from "@/lib/content";
import styles from "./AssuranceStrip.module.css";

const icons: Record<string, LucideIcon> = {
  tag: Tag,
  eye: Eye,
  truck: Truck,
  receipt: Receipt,
  shield: ShieldCheck,
  clock: Clock,
};

const fallback: AssuranceBlock["items"] = [
  { icon: "tag", title: "Transparent pricing", detail: "Breakdown & GST shown before checkout" },
  { icon: "eye", title: "Pre-press review", detail: "Every file checked by a person" },
  { icon: "truck", title: "Track every stage", detail: "From artwork approval to delivery" },
  { icon: "receipt", title: "GST invoices", detail: "Add your GSTIN at checkout" },
];

/** Figma SF-HOME-01 · Assurance strip. */
export function AssuranceStrip({ items = fallback }: { items?: AssuranceBlock["items"] }) {
  return (
    <section className={styles.strip} aria-label="Why order with us">
      <ul className={`container ${styles.list}`}>
        {items.map(({ icon, title, detail }) => {
          const Icon = icons[icon] ?? Tag;
          return (
            <li key={title} className={styles.item}>
              <span className={styles.icon}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className={styles.text}>
                <span className="t-label-m">{title}</span>
                <span className="t-body-xs">{detail}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
