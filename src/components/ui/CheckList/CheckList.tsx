import { CheckCircle2 } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./CheckList.module.css";

type Props = { items: string[]; tone?: "default" | "inverse"; className?: string };

/** Value points with the check-circle icon (hero, estimator band, bulk band). */
export function CheckList({ items, tone = "default", className }: Props) {
  return (
    <ul className={cx(styles.list, tone === "inverse" && styles.inverse, className)}>
      {items.map((item) => (
        <li key={item} className={cx("t-label-m", styles.item)}>
          <CheckCircle2 size={20} aria-hidden="true" className={styles.icon} />
          {item}
        </li>
      ))}
    </ul>
  );
}
