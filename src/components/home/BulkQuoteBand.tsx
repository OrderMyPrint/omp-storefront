import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import type { CtaBandBlock } from "@/lib/content";
import styles from "./BulkQuoteBand.module.css";

const fallback: CtaBandBlock = {
  id: "bulk",
  type: "ctaBand",
  overline: "Bulk & corporate",
  heading: "Ordering for your whole team?",
  body: "Send one request for several products. Our sales team prices it, revises it with you, and turns your accepted quote into an order — no re-keying.",
  points: [
    "Multi-item quotations with artwork",
    "Accept, decline or ask questions online",
    "Credit terms for approved companies",
  ],
  primary: { label: "Request a quote", href: routes.quote, external: false },
  secondary: { label: "How quotes work", href: routes.help, external: false },
  image: {
    url: "/images/bulk-kit.png",
    alt: "A branded corporate welcome kit with T-shirts, visiting cards, letterheads and stickers",
    width: 1264,
    height: 848,
  },
};

/** Figma SF-HOME-01 · Bulk & corporate (a CTA band with an image). */
export function BulkQuoteBand({ block = fallback }: { block?: CtaBandBlock }) {
  return (
    <section className={styles.band} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <div className={styles.panel}>
          {block.image ? (
            <div className={styles.photo}>
              <Image src={block.image.url} alt={block.image.alt} fill sizes="(max-width: 1199px) 100vw, 480px" />
            </div>
          ) : null}
          <div className={styles.copy}>
            <SectionHeading
              id={`${block.id}-title`}
              overline={block.overline ?? ""}
              title={block.heading}
              lead={block.body}
            />
            {block.points.length ? <CheckList items={block.points} /> : null}
            <div className={styles.ctas}>
              {block.primary ? (
                <Button href={block.primary.href} variant="primary">
                  {block.primary.label}
                </Button>
              ) : null}
              {block.secondary ? (
                <Button href={block.secondary.href} variant="ghost">
                  {block.secondary.label}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
