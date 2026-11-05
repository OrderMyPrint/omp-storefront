import type { Metadata } from "next";
import { AssuranceStrip } from "@/components/home/AssuranceStrip";
import { BulkQuoteBand } from "@/components/home/BulkQuoteBand";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Inspiration } from "@/components/home/Inspiration";
import { PopularProducts } from "@/components/home/PopularProducts";
import { PriceEstimator } from "@/components/home/PriceEstimator";
import { ContentBlocks } from "@/components/content/ContentBlocks";
import { getPage, type ContentBlock } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");
  if (!page) return {};
  return {
    title: page.seo.title ? { absolute: page.seo.title } : undefined,
    description: page.seo.description,
    robots: page.seo.noindex ? { index: false } : undefined,
  };
}

/** Homepage sections in the order and visibility the editor set (Website content › Home). */
function HomeBlock({ block }: { block: ContentBlock }) {
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
      return <ContentBlocks blocks={[block]} />;
  }
}

/** SF-HOME-01 · Homepage. Content from the API when available; built-in content otherwise. */
export default async function HomePage() {
  const page = await getPage("/");
  if (page)
    return (
      <>
        {page.blocks.map((block) => (
          <HomeBlock key={block.id} block={block} />
        ))}
      </>
    );
  return (
    <>
      <Hero />
      <AssuranceStrip />
      <CategoryGrid />
      <PopularProducts />
      <PriceEstimator />
      <HowItWorks />
      <BulkQuoteBand />
      <Inspiration />
      <FaqTeaser />
    </>
  );
}
