"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/catalogue/ProductCard/ProductCard";
import { Button } from "@/components/ui/Button/Button";
import {
  allMaterials,
  allUses,
  categories,
  minimumQuantity,
  products,
  type CategorySlug,
  type Material,
  type Product,
  type Use,
} from "@/data/catalogue";
import styles from "./ProductBrowser.module.css";

type QuantityBand = "any" | "under-100" | "100-500" | "500+";
type Sort = "recommended" | "price-asc" | "price-desc" | "name";

const quantityBands: { id: QuantityBand; label: string; test: (min: number) => boolean }[] = [
  { id: "any", label: "Any", test: () => true },
  { id: "under-100", label: "Under 100", test: (min) => min < 100 },
  { id: "100-500", label: "100 – 500", test: (min) => min >= 100 && min <= 500 },
  { id: "500+", label: "500+", test: (min) => min > 500 },
];

const sorters: Record<Sort, (a: Product, b: Product) => number> = {
  recommended: () => 0,
  "price-asc": (a, b) => a.startingPrice - b.startingPrice,
  "price-desc": (a, b) => b.startingPrice - a.startingPrice,
  name: (a, b) => a.name.localeCompare(b.name),
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/** Figma SF-PLP-01 / SF-CAT-01 — filter sidebar, sort and product grid. */
export function ProductBrowser({ initialCategory }: { initialCategory?: CategorySlug }) {
  const [cats, setCats] = useState<CategorySlug[]>(initialCategory ? [initialCategory] : []);
  const [uses, setUses] = useState<Use[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [band, setBand] = useState<QuantityBand>("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<Sort>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    const bandTest = quantityBands.find((item) => item.id === band)?.test ?? (() => true);
    return products
      .filter((product) => !cats.length || cats.includes(product.category))
      .filter((product) => !uses.length || product.uses.some((use) => uses.includes(use)))
      .filter((product) => !materials.length || product.materials.some((item) => materials.includes(item)))
      .filter((product) => bandTest(minimumQuantity(product)))
      .filter((product) => product.startingPrice >= min && product.startingPrice <= max)
      .sort(sorters[sort]);
  }, [cats, uses, materials, band, minPrice, maxPrice, sort]);

  const clearAll = () => {
    setCats([]);
    setUses([]);
    setMaterials([]);
    setBand("any");
    setMinPrice("");
    setMaxPrice("");
  };

  const chips = [
    ...cats.map((slug) => ({
      key: slug,
      label: categories.find((category) => category.slug === slug)?.name ?? slug,
      remove: () => setCats(toggle(cats, slug)),
    })),
    ...uses.map((use) => ({ key: use, label: use, remove: () => setUses(toggle(uses, use)) })),
    ...materials.map((item) => ({ key: item, label: item, remove: () => setMaterials(toggle(materials, item)) })),
  ];

  const countIn = (slug: CategorySlug) => products.filter((product) => product.category === slug).length;

  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={`t-label-m ${styles.filterToggle}`}
        aria-expanded={filtersOpen}
        aria-controls="product-filters"
        onClick={() => setFiltersOpen((value) => !value)}
      >
        <SlidersHorizontal size={20} aria-hidden="true" />
        Filters{chips.length ? ` (${chips.length})` : ""}
      </button>

      <aside id="product-filters" className={styles.filters} data-open={filtersOpen} aria-label="Filters">
        <div className={styles.filtersHead}>
          <p className="t-h5">Filters</p>
          <button type="button" className={`t-label-s ${styles.clear}`} onClick={clearAll}>
            Clear all
          </button>
        </div>

        <fieldset className={styles.group}>
          <legend className="t-label-m">Category</legend>
          {categories.map((category) => (
            <label key={category.slug} className={`t-body-s ${styles.option}`}>
              <input
                type="checkbox"
                checked={cats.includes(category.slug)}
                onChange={() => setCats(toggle(cats, category.slug))}
              />
              {category.name} ({countIn(category.slug)})
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className="t-label-m">Use</legend>
          {allUses.map((use) => (
            <label key={use} className={`t-body-s ${styles.option}`}>
              <input type="checkbox" checked={uses.includes(use)} onChange={() => setUses(toggle(uses, use))} />
              {use}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className="t-label-m">Material</legend>
          {allMaterials.map((item) => (
            <label key={item} className={`t-body-s ${styles.option}`}>
              <input
                type="checkbox"
                checked={materials.includes(item)}
                onChange={() => setMaterials(toggle(materials, item))}
              />
              {item}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className="t-label-m">Minimum quantity</legend>
          {quantityBands.map((item) => (
            <label key={item.id} className={`t-body-s ${styles.option}`}>
              <input type="radio" name="min-quantity" checked={band === item.id} onChange={() => setBand(item.id)} />
              {item.label}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.group}>
          <legend className="t-label-m">Starting price</legend>
          <div className={styles.priceRow}>
            <label className={styles.priceField}>
              <span className="t-label-s">Min</span>
              <input
                inputMode="numeric"
                placeholder="₹0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ""))}
                className="t-body-s"
              />
            </label>
            <label className={styles.priceField}>
              <span className="t-label-s">Max</span>
              <input
                inputMode="numeric"
                placeholder="₹5,000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))}
                className="t-body-s"
              />
            </label>
          </div>
        </fieldset>

        <Button variant="primary" fullWidth className={styles.applyMobile} onClick={() => setFiltersOpen(false)}>
          Show {results.length} products
        </Button>
      </aside>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.chips}>
            <p className="t-body-s" aria-live="polite">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className={`t-label-s ${styles.chip}`}
                onClick={chip.remove}
                aria-label={`Remove ${chip.label} filter`}
              >
                {chip.label}
                <X size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
          <label className={styles.sort}>
            <span className="t-label-s">Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className="t-body-m">
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {results.length ? (
          <ul className={styles.grid}>
            {results.map((product) => (
              <li key={product.slug} className={styles.cell}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p className="t-h4">No products match these filters</p>
            <p className="t-body-m">Try removing a filter, or ask us for a quotation for something custom.</p>
            <div className={styles.emptyActions}>
              <Button variant="primary" onClick={clearAll}>
                Clear all filters
              </Button>
              <Button href="/quote" variant="secondary">
                Request a quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
