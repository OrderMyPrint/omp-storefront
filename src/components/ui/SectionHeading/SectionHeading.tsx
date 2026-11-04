import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./SectionHeading.module.css";

type Props = {
  overline: string;
  title: string;
  lead?: ReactNode;
  /** "inverse" for dark brand bands. */
  tone?: "default" | "inverse";
  id?: string;
  className?: string;
};

/** Figma "Section head": overline + H2 + optional lead paragraph. */
export function SectionHeading({ overline, title, lead, tone = "default", id, className }: Props) {
  return (
    <div className={cx(styles.head, tone === "inverse" && styles.inverse, className)}>
      <p className={cx("t-overline", styles.overline)}>{overline}</p>
      <h2 id={id} className={cx("t-h2", styles.title)}>
        {title}
      </h2>
      {lead ? <p className={cx("t-body-l", styles.lead)}>{lead}</p> : null}
    </div>
  );
}
