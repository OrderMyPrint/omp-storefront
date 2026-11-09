"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/catalogue/ProductCard/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { useCatalogue } from "@/components/catalogue/CatalogueProvider";
import { popularProductSlugs } from "@/data/catalogue";
import type { ListedProduct } from "@/lib/catalogue-map";
import type { ProductCarouselBlock } from "@/lib/content";
import styles from "./PopularProducts.module.css";

const bySlugs = (products: ListedProduct[], slugs: string[]) =>
  slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ListedProduct => Boolean(product));

/** Figma SF-HOME-01 · Popular products — horizontal carousel with arrow controls. */
export function PopularProducts({ block }: { block?: ProductCarouselBlock }) {
  const { products } = useCatalogue();
  const chosen = bySlugs(products, block?.productSlugs ?? popularProductSlugs);
  // Without an editor choice, a catalogue with none of the launch products still shows its products.
  const popular = block || chosen.length ? chosen : products;
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: true });

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll({
      back: track.scrollLeft > 4,
      forward: track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, [updateButtons]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section className={styles.band} aria-labelledby="popular-title">
      <div className={`container ${styles.section}`}>
        <div className={styles.head}>
          <SectionHeading
            id="popular-title"
            overline={block?.overline ?? "Popular now"}
            title={block?.heading ?? "Our most-ordered print products"}
            lead={
              block
                ? block.lead
                : "The business essentials our customers reorder most — configure any of them in minutes."
            }
          />
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(-1)}
              disabled={!canScroll.back}
              aria-label="Previous products"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrimary}`}
              onClick={() => scrollByCard(1)}
              disabled={!canScroll.forward}
              aria-label="Next products"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul ref={trackRef} className={styles.track} onScroll={updateButtons}>
          {popular.map((product) => (
            <li key={product.slug} className={styles.slide}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
