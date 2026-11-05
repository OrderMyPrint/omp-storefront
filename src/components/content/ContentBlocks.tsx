import Image from "next/image";
import { FileText, Grid2x2, ImageIcon, Layers, PenLine, Printer, type LucideIcon } from "lucide-react";
import { BulkQuoteBand } from "@/components/home/BulkQuoteBand";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Inspiration } from "@/components/home/Inspiration";
import { PopularProducts } from "@/components/home/PopularProducts";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import type { ContentBlock } from "@/lib/content";
import styles from "./ContentBlocks.module.css";

/** Stable anchor for a rich-text heading (used by the policy page's "On this page" list). */
export const headingId = (blockId: string, index: number) => `${blockId}-${index}`;

const cardIcons: Record<string, LucideIcon> = {
  file: FileText,
  layers: Layers,
  image: ImageIcon,
  grid: Grid2x2,
  printer: Printer,
  pen: PenLine,
};

/**
 * Renders page sections published in the admin (Website content › Pages).
 * Every value is plain text from the API and is rendered as text — never as HTML.
 */
export function ContentBlocks({ blocks, inline = false }: { blocks: ContentBlock[]; inline?: boolean }) {
  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} block={block} inline={inline} />
      ))}
    </>
  );
}

function Block({ block, inline }: { block: ContentBlock; inline: boolean }) {
  switch (block.type) {
    case "richText":
      return (
        <div className={styles.prose}>
          {block.nodes.map((node, i) =>
            node.type === "heading" ? (
              <h2 key={i} id={headingId(block.id, i)} className="t-h4">
                {node.text}
              </h2>
            ) : node.type === "paragraph" ? (
              <p key={i} className="t-body-l">
                {node.text}
              </p>
            ) : (
              <ul key={i} className={`t-body-l ${styles.list}`}>
                {node.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </div>
      );
    case "notice":
      return (
        <Alert tone={block.tone} title={block.title}>
          {block.body}
        </Alert>
      );
    case "cards":
      return (
        <section className={styles.cardsWrap}>
          {block.heading ? <h2 className="t-h3">{block.heading}</h2> : null}
          <ul className={styles.cards}>
            {block.cards.map((card) => {
              const Icon = card.icon ? cardIcons[card.icon] : undefined;
              return (
                <li key={card.title} className={styles.card}>
                  {Icon ? (
                    <span className={styles.iconCircle}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                  ) : null}
                  <h3 className="t-h5">{card.title}</h3>
                  <p className="t-body-s">{card.body}</p>
                </li>
              );
            })}
          </ul>
        </section>
      );
    case "imageText":
      return (
        <section className={styles.imageText} data-side={block.imageSide}>
          <div className={styles.imageTextCopy}>
            <h2 className="t-h3">{block.heading}</h2>
            <p className="t-body-l">{block.body}</p>
            {block.cta ? <Button href={block.cta.href}>{block.cta.label}</Button> : null}
          </div>
          {block.image ? (
            <div className={styles.imageTextPhoto}>
              <Image src={block.image.url} alt={block.image.alt} fill sizes="(max-width: 1199px) 100vw, 600px" />
            </div>
          ) : null}
        </section>
      );
    case "ctaBand":
      // Inside a page column use the compact navy band; as a page section use the full band with image.
      if (inline || !block.image)
        return block.primary ? (
          <CtaBand
            title={block.heading}
            detail={block.body ?? ""}
            cta={block.primary.label}
            href={block.primary.href}
          />
        ) : null;
      return <BulkQuoteBand block={block} />;
    case "hero":
      return <Hero block={block} />;
    case "steps":
      return <HowItWorks block={block} />;
    case "imageGallery":
      return <Inspiration block={block} />;
    case "faqList":
      return <FaqTeaser block={block} />;
    case "categoryTiles":
      return <CategoryGrid block={block} />;
    case "productCarousel":
      return <PopularProducts block={block} />;
    default:
      return null;
  }
}
