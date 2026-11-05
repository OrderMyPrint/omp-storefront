import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Alert.module.css";

type Tone = "info" | "success" | "warning" | "error";

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle };

/** Figma "Alert / Inline" — left accent bar, icon, title and body. */
export function Alert({
  tone = "info",
  title,
  children,
  className,
  live,
}: {
  tone?: Tone;
  title: string;
  children?: ReactNode;
  className?: string;
  /** Announce to screen readers when it appears after an action. */
  live?: boolean;
}) {
  const Icon = icons[tone];
  return (
    <div className={cx(styles.alert, styles[tone], className)} role={live ? "status" : undefined}>
      <Icon size={20} aria-hidden="true" className={styles.icon} />
      <div className={styles.body}>
        <p className="t-label-m">{title}</p>
        {children ? <div className="t-body-s">{children}</div> : null}
      </div>
    </div>
  );
}
