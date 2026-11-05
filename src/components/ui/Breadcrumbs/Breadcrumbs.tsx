import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { label: string; href?: string };

/** Figma "Breadcrumbs" — the last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={`container ${styles.nav}`}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className={`t-body-xs ${styles.item}`}>
              {item.href && !last ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
              {last ? null : <ChevronRight size={14} aria-hidden="true" className={styles.sep} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
