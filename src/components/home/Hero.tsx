import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { routes } from "@/config/site";
import type { HeroBlock } from "@/lib/content";
import styles from "./Hero.module.css";

const fallback: HeroBlock = {
  id: "hero",
  type: "hero",
  overline: "Premium & professional printing",
  heading: "Print that makes your brand look its best.",
  body: "Visiting cards, letter pads, envelopes, brochures, stickers, DTF transfers and corporate T-shirts — configured online with a transparent price before you order.",
  points: [
    "Instant, server-verified price preview",
    "Upload PDF, PNG, JPEG, SVG or CorelDRAW (CDR)",
    "Bulk & corporate quotations with GST invoices",
  ],
  primary: { label: "Shop products", href: routes.products, external: false },
  secondary: { label: "Get a bulk quote", href: routes.quote, external: false },
  image: {
    url: "/images/hero.png",
    alt: "Printed visiting cards, letterheads, envelopes and round stickers in a matching navy and magenta design",
    width: 1152,
    height: 928,
  },
  note: "Every file is reviewed by our pre-press team before printing.",
};

/** Figma SF-HOME-01 · Hero. Content: Website content › Home › Hero. */
export function Hero({ block = fallback }: { block?: HeroBlock }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {block.overline ? <p className={`t-overline ${styles.overline}`}>{block.overline}</p> : null}
          <h1 id="hero-title" className={`t-display-xl ${styles.title}`}>
            {block.heading}
          </h1>
          {block.body ? <p className={`t-body-l ${styles.lead}`}>{block.body}</p> : null}
          {block.points.length ? <CheckList items={block.points} /> : null}
          <div className={styles.ctas}>
            {block.primary ? (
              <Button href={block.primary.href} variant="accent" icon={ArrowRight}>
                {block.primary.label}
              </Button>
            ) : null}
            {block.secondary ? (
              <Button href={block.secondary.href} variant="secondary">
                {block.secondary.label}
              </Button>
            ) : null}
          </div>
          {block.note ? <p className={`t-body-s ${styles.note}`}>{block.note}</p> : null}
        </div>

        {block.image ? (
          <div className={styles.visual}>
            <div className={styles.photo}>
              <Image
                src={block.image.url}
                alt={block.image.alt}
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
        ) : null}
      </div>
    </section>
  );
}
