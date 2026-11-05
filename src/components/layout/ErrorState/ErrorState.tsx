import type { ReactNode } from "react";
import styles from "./ErrorState.module.css";

/** Figma SF-ERR-01 — 404 / 500 layout with the misprinted CMYK mark. */
export function ErrorState({
  code,
  title,
  lead,
  children,
}: {
  code: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="error-title">
      <div className={styles.mark} aria-hidden="true">
        <span className={styles.c} />
        <span className={styles.m} />
        <span className={styles.y} />
      </div>
      <p className={`t-display-xl ${styles.code}`}>{code}</p>
      <h1 id="error-title" className={`t-h2 ${styles.title}`}>
        {title}
      </h1>
      <p className={`t-body-l ${styles.lead}`}>{lead}</p>
      <div className={styles.actions}>{children}</div>
    </section>
  );
}
