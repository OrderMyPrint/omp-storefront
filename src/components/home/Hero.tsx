import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { routes } from "@/config/site";
import styles from "./Hero.module.css";

const valuePoints = [
  "Instant, server-verified price preview",
  "Upload PDF, PNG, JPEG, SVG or CorelDRAW (CDR)",
  "Bulk & corporate quotations with GST invoices",
];

/** Figma SF-HOME-01 · Hero. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`t-overline ${styles.overline}`}>Premium &amp; professional printing</p>
          <h1 id="hero-title" className={`t-display-xl ${styles.title}`}>
            Print that makes your brand look its best.
          </h1>
          <p className={`t-body-l ${styles.lead}`}>
            Visiting cards, letter pads, envelopes, brochures, stickers, DTF transfers and corporate T-shirts —
            configured online with a transparent price before you order.
          </p>
          <CheckList items={valuePoints} />
          <div className={styles.ctas}>
            <Button href={routes.products} variant="accent" icon={ArrowRight}>
              Shop products
            </Button>
            <Button href={routes.quote} variant="secondary">
              Get a bulk quote
            </Button>
          </div>
          <p className={`t-body-s ${styles.note}`}>Every file is reviewed by our pre-press team before printing.</p>
        </div>

        <div className={styles.visual}>
          <div className={styles.photo}>
            <Image
              src="/images/hero.png"
              alt="Printed visiting cards, letterheads, envelopes and round stickers in a matching navy and magenta design"
              fill
              priority
              sizes="(max-width: 1199px) 100vw, 600px"
            />
          </div>
          <div className={styles.priceCard}>
            <p className="t-label-s">Visiting cards · 500 pcs</p>
            <p className={`t-price-m ${styles.price}`}>₹1,652.00</p>
            <p className="t-body-xs">incl. GST · price preview</p>
          </div>
        </div>
      </div>
    </section>
  );
}
