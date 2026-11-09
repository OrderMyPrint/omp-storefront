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
import { HomeSections } from "@/components/content/PageSections";
import { getPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");
  if (!page) return {};
  return {
    title: page.seo.title ? { absolute: page.seo.title } : undefined,
    description: page.seo.description,
    robots: page.seo.noindex ? { index: false } : undefined,
  };
}

/** SF-HOME-01 · Homepage. Content from the API when available; built-in content otherwise. */
export default async function HomePage() {
  const page = await getPage("/");
  if (page) return <HomeSections blocks={page.blocks} />;
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
