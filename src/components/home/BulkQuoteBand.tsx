import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import styles from "./BulkQuoteBand.module.css";

const points = [
  "Multi-item quotations with artwork",
  "Accept, decline or ask questions online",
  "Credit terms for approved companies",
];

/** Figma SF-HOME-01 · Bulk & corporate. */
export function BulkQuoteBand() {
  return (
    <section className={styles.band} aria-labelledby="bulk-title">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.photo}>
            <Image
              src="/images/bulk-kit.png"
              alt="A branded corporate welcome kit with T-shirts, visiting cards, letterheads and stickers"
              fill
              sizes="(max-width: 1199px) 100vw, 480px"
            />
          </div>
          <div className={styles.copy}>
            <SectionHeading
              id="bulk-title"
              overline="Bulk & corporate"
              title="Ordering for your whole team?"
              lead="Send one request for several products. Our sales team prices it, revises it with you, and turns your accepted quote into an order — no re-keying."
            />
            <CheckList items={points} />
            <div className={styles.ctas}>
              <Button href={routes.quote} variant="primary">
                Request a quote
              </Button>
              <Button href={`${routes.help}#quotes`} variant="ghost">
                How quotes work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
