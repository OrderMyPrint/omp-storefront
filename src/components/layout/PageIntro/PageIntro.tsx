import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./PageIntro.module.css";

/** Page heading block: overline, H1 and lead, used by listing and help pages. */
export function PageIntro({
  overline,
  title,
  lead,
  children,
  className,
}: {
  overline?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(styles.intro, className)}>
      {overline ? <p className={`t-overline ${styles.overline}`}>{overline}</p> : null}
      <h1 className={`t-h1 ${styles.title}`}>{title}</h1>
      {lead ? <p className={`t-body-l ${styles.lead}`}>{lead}</p> : null}
      {children}
    </div>
  );
}
