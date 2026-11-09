import { AssuranceStrip } from "@/components/home/AssuranceStrip";
import { BulkQuoteBand } from "@/components/home/BulkQuoteBand";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Inspiration } from "@/components/home/Inspiration";
import { PopularProducts } from "@/components/home/PopularProducts";
import { PriceEstimator } from "@/components/home/PriceEstimator";
import type { ContentBlock } from "@/lib/content";
import { ContentSection } from "./ContentBlocks";
import { Section } from "./Section";

/** A homepage section as a full-width band (SF-HOME-01). Other types use the content renderer. */
export function HomeSection({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "assuranceStrip":
      return <AssuranceStrip items={block.items} />;
    case "categoryTiles":
      return <CategoryGrid block={block} />;
    case "productCarousel":
      return <PopularProducts block={block} />;
    case "priceEstimator":
      return <PriceEstimator block={block} />;
    case "steps":
      return <HowItWorks block={block} />;
    case "ctaBand":
      return <BulkQuoteBand block={block} />;
    case "imageGallery":
      return <Inspiration block={block} />;
    case "faqList":
      return <FaqTeaser block={block} />;
    default:
      return <ContentSection block={block} />;
  }
}

/** Homepage sections in the order, visibility and presets set in the editor. */
export function HomeSections({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <Section key={block.id} block={block}>
          <HomeSection block={block} />
        </Section>
      ))}
    </>
  );
}
