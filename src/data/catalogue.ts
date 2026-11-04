/**
 * Catalogue reference data for the storefront UI.
 *
 * Prices are the researched market reference rates shown in the approved
 * Figma design (docs repo: docs/prd/product-catalogue-and-pricing.md §5).
 * They are display data only — in Phase 3 the API's pricing engine becomes
 * the single source of truth and this file is replaced by API calls.
 */

export type CategorySlug =
  | "business-stationery"
  | "marketing-print"
  | "custom-transfers"
  | "corporate-merchandise";

export type Category = {
  slug: CategorySlug;
  name: string;
  summary: string;
  image: string;
};

/** One quantity tier: unit price and total, excluding GST. */
export type PriceTier = { quantity: number; unitPrice: number };

export type ProductOption = {
  id: string;
  label: string;
  /** Extra cost per unit, excluding GST. */
  perUnit: number;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  image: string;
  /** Display string used on product cards, e.g. "₹399" or "₹349/pc". */
  fromPrice: string;
  turnaround: string;
  unitNoun: { one: string; many: string };
  gstRate: number;
  tiers: PriceTier[];
  /** Main option shown in the quick price estimator. */
  estimatorOption: { label: string; choices: ProductOption[] };
};

export const categories: Category[] = [
  {
    slug: "business-stationery",
    name: "Business Stationery",
    summary: "Visiting cards · Letter pads · Envelopes",
    image: "/images/category-stationery.png",
  },
  {
    slug: "marketing-print",
    name: "Marketing Print",
    summary: "Brochures · Stickers",
    image: "/images/category-marketing.png",
  },
  {
    slug: "custom-transfers",
    name: "Custom Transfers",
    summary: "DTF stickers & gang sheets",
    image: "/images/category-transfers.png",
  },
  {
    slug: "corporate-merchandise",
    name: "Corporate Merchandise",
    summary: "Corporate T-shirt printing",
    image: "/images/category-merchandise.png",
  },
];

export const products: Product[] = [
  {
    slug: "visiting-cards",
    name: "Visiting Cards",
    category: "business-stationery",
    summary: "Premium stocks, matte or gloss, single or double-sided.",
    image: "/images/product-visiting-cards.png",
    fromPrice: "₹399",
    turnaround: "2–3",
    unitNoun: { one: "card", many: "cards" },
    gstRate: 0.18,
    tiers: [
      { quantity: 100, unitPrice: 3.99 },
      { quantity: 250, unitPrice: 2.6 },
      { quantity: 500, unitPrice: 1.8 },
      { quantity: 1000, unitPrice: 1.5 },
      { quantity: 2500, unitPrice: 1.3 },
    ],
    estimatorOption: {
      label: "Printing",
      choices: [
        { id: "single", label: "Single-sided", perUnit: 0 },
        { id: "double", label: "Double-sided", perUnit: 0.36 },
      ],
    },
  },
  {
    slug: "letter-pads",
    name: "Letter Pads",
    category: "business-stationery",
    summary: "A4 and A5 pads in 50 or 100 sheets, on bond or premium paper.",
    image: "/images/product-letter-pads.png",
    fromPrice: "₹1,650",
    turnaround: "3–4",
    unitNoun: { one: "pad", many: "pads" },
    gstRate: 0.18,
    tiers: [
      { quantity: 10, unitPrice: 165 },
      { quantity: 15, unitPrice: 150 },
      { quantity: 20, unitPrice: 140 },
      { quantity: 50, unitPrice: 118 },
      { quantity: 100, unitPrice: 99 },
    ],
    estimatorOption: {
      label: "Paper",
      choices: [
        { id: "bond-90", label: "Bond 90 GSM", perUnit: 0 },
        { id: "premium-100", label: "Premium 100 GSM", perUnit: 10 },
        { id: "textured-120", label: "Textured 120 GSM", perUnit: 18 },
      ],
    },
  },
  {
    slug: "envelopes",
    name: "Envelopes",
    category: "business-stationery",
    summary: "DL, C5 and C4 sizes in white or kraft, with an optional window.",
    image: "/images/product-envelopes.png",
    fromPrice: "₹600",
    turnaround: "3–4",
    unitNoun: { one: "envelope", many: "envelopes" },
    gstRate: 0.18,
    tiers: [
      { quantity: 100, unitPrice: 6 },
      { quantity: 250, unitPrice: 4.2 },
      { quantity: 500, unitPrice: 3.1 },
      { quantity: 1000, unitPrice: 2.6 },
      { quantity: 2500, unitPrice: 2.2 },
    ],
    estimatorOption: {
      label: "Paper",
      choices: [
        { id: "white-100", label: "White 100 GSM", perUnit: 0 },
        { id: "white-120", label: "White 120 GSM", perUnit: 0.4 },
        { id: "kraft-120", label: "Kraft 120 GSM", perUnit: 0.6 },
      ],
    },
  },
  {
    slug: "brochures",
    name: "Brochures",
    category: "marketing-print",
    summary: "Bi-fold and tri-fold brochures on coated gloss, matte or silk stocks.",
    image: "/images/product-brochures.png",
    fromPrice: "₹4,500",
    turnaround: "3–5",
    unitNoun: { one: "brochure", many: "brochures" },
    gstRate: 0.18,
    tiers: [
      { quantity: 250, unitPrice: 18 },
      { quantity: 500, unitPrice: 12.5 },
      { quantity: 1000, unitPrice: 8.9 },
      { quantity: 2500, unitPrice: 6.4 },
      { quantity: 5000, unitPrice: 5.2 },
    ],
    estimatorOption: {
      label: "Paper",
      choices: [
        { id: "gloss-130", label: "130 GSM gloss", perUnit: 0 },
        { id: "matte-170", label: "170 GSM matte", perUnit: 0.6 },
        { id: "silk-250", label: "250 GSM silk", perUnit: 1.4 },
      ],
    },
  },
  {
    slug: "stickers",
    name: "Stickers",
    category: "marketing-print",
    summary: "Any size and shape — paper, vinyl or transparent.",
    image: "/images/product-stickers.png",
    fromPrice: "₹450",
    turnaround: "3–4",
    unitNoun: { one: "sticker", many: "stickers" },
    gstRate: 0.18,
    tiers: [
      { quantity: 100, unitPrice: 4.5 },
      { quantity: 250, unitPrice: 2.6 },
      { quantity: 500, unitPrice: 1.9 },
      { quantity: 1000, unitPrice: 1.4 },
      { quantity: 5000, unitPrice: 0.95 },
    ],
    estimatorOption: {
      label: "Material",
      choices: [
        { id: "paper", label: "Paper (matte)", perUnit: 0 },
        { id: "vinyl", label: "Vinyl (waterproof)", perUnit: 0.3 },
        { id: "transparent", label: "Transparent film", perUnit: 0.4 },
      ],
    },
  },
  {
    slug: "dtf-stickers",
    name: "DTF Stickers",
    category: "custom-transfers",
    summary: "Heat-transfer prints by size or by gang sheet.",
    image: "/images/product-dtf-stickers.png",
    fromPrice: "₹249",
    turnaround: "1–2",
    unitNoun: { one: "sheet", many: "sheets" },
    gstRate: 0.18,
    tiers: [
      { quantity: 1, unitPrice: 449 },
      { quantity: 2, unitPrice: 419 },
      { quantity: 3, unitPrice: 399 },
      { quantity: 5, unitPrice: 369 },
      { quantity: 10, unitPrice: 339 },
    ],
    estimatorOption: {
      label: "Film",
      choices: [
        { id: "standard", label: "Standard", perUnit: 0 },
        { id: "glitter", label: "Glitter", perUnit: 60 },
        { id: "glow", label: "Glow in the dark", perUnit: 80 },
      ],
    },
  },
  {
    slug: "corporate-t-shirts",
    name: "Corporate T-Shirts",
    category: "corporate-merchandise",
    summary: "Size-wise quantities, multiple print locations.",
    image: "/images/product-corporate-t-shirts.png",
    fromPrice: "₹349/pc",
    turnaround: "5–7",
    unitNoun: { one: "T-shirt", many: "T-shirts" },
    gstRate: 0.05,
    tiers: [
      { quantity: 25, unitPrice: 349 },
      { quantity: 50, unitPrice: 319 },
      { quantity: 80, unitPrice: 299 },
      { quantity: 150, unitPrice: 279 },
    ],
    estimatorOption: {
      label: "Fabric",
      choices: [
        { id: "cotton-180", label: "Cotton 180 GSM", perUnit: 0 },
        { id: "poly-cotton-200", label: "Poly-cotton 200 GSM", perUnit: 30 },
      ],
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

/** Category name in the overline style used on product cards. */
export function categoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? "";
}

/** Products featured in the homepage "Popular now" carousel, in order. */
export const popularProductSlugs = [
  "visiting-cards",
  "stickers",
  "dtf-stickers",
  "corporate-t-shirts",
  "letter-pads",
  "envelopes",
  "brochures",
];
