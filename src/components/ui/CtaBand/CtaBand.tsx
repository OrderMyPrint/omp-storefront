import { Button } from "@/components/ui/Button/Button";
import styles from "./CtaBand.module.css";

/** Navy call-to-action panel used on category, FAQ and help pages. */
export function CtaBand({ title, detail, cta, href }: { title: string; detail: string; cta: string; href: string }) {
  return (
    <div className={styles.band}>
      <div className={styles.text}>
        <p className="t-h4">{title}</p>
        <p className="t-body-m">{detail}</p>
      </div>
      <Button href={href} variant="accent">
        {cta}
      </Button>
    </div>
  );
}
