import { AssuranceStrip } from "@/components/home/AssuranceStrip";
import { BulkQuoteBand } from "@/components/home/BulkQuoteBand";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Inspiration } from "@/components/home/Inspiration";
import { PopularProducts } from "@/components/home/PopularProducts";
import { PriceEstimator } from "@/components/home/PriceEstimator";

/** SF-HOME-01 · Homepage (desktop, tablet and mobile from one responsive layout). */
export default function HomePage() {
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
