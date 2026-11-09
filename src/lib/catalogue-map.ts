import {
  categories as builtInCategories,
  products as builtInProducts,
  type Category,
  type Choice,
  type ConfigStep,
  type OptionRule,
  type Product,
} from "@/data/catalogue";

/**
 * Maps the API's public catalogue (omp-api /api/v1/catalogue/*) onto the
 * storefront's catalogue types, so the approved components render it unchanged.
 * Pure functions — no fetching — so they can be unit tested.
 */

// ------------------------------------------------------------- API shapes

export type ApiCategory = {
  slug: string;
  name: string;
  summary: string | null;
  lead: string | null;
  about: string | null;
  imageUrl: string | null;
  productCount: number;
};

type Money = string;

export type ApiProductSummary = {
  slug: string;
  name: string;
  category: { slug: string; name: string };
  summary: string | null;
  imageUrl: string | null;
  unit: { one: string; many: string };
  turnaroundDays: { min: number; max: number };
  gstRate: Money;
  uses: string[];
  materials: string[];
  minimumQuantity: number;
  startingPrice: Money;
  startingUnitPrice: Money;
};

type ApiOption = {
  key: string;
  label: string;
  detail: string | null;
  swatch: string | null;
  available: boolean;
  unavailableReason: string | null;
  price: { perUnit?: Money; unitPrice?: Money; perOrder?: Money } | null;
};

export type ApiOptionGroup = {
  key: string;
  label: string;
  shortLabel: string | null;
  hint: string | null;
  note: string | null;
  kind: "SELECT" | "SWATCH" | "MULTISELECT";
  required: boolean;
  defaults: string[];
  options: ApiOption[];
};

export type ApiProduct = ApiProductSummary & {
  lead: string | null;
  description: string | null;
  specs: { label: string; value: string }[] | null;
  quantity:
    | { mode: "tiers"; minimum: number; quoteFrom: number | null }
    | {
        mode: "sizes";
        sizes: string[];
        defaults: Record<string, number> | null;
        minimum: number;
        quoteFrom: number | null;
      };
  optionGroups: ApiOptionGroup[];
  setupCharges: {
    kind: "perColourPerSelection";
    label: string;
    group: string;
    appliesWhen: { group: string; option: string };
    amount: Money;
    maxColours: number;
  }[];
  sizeSurcharge: { sizes: string[]; perUnit: Money; label: string } | null;
  artworkSlots: { key: string; label: string; printArea: string | null }[];
  tiers: { minQty: number; unitPrice: Money; total: Money; savingPercent: number }[];
  rules: OptionRule[];
  pricingVersionId: string;
};

// ------------------------------------------------------------- helpers

const num = (value: Money | null | undefined) => (value == null ? undefined : Number(value));

const inr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: Number.isInteger(value) ? 0 : 2 })}`;

/** "2–3" (or "5" when the range is a single day), as the design shows it. */
export function turnaroundText({ min, max }: { min: number; max: number }): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

const builtInCategory = (slug: string) => builtInCategories.find((category) => category.slug === slug);
const builtInProduct = (slug: string) => builtInProducts.find((product) => product.slug === slug);

/** Bulk prompt shown on category pages when the category has no copy of its own. */
const genericBulkPrompt = {
  title: "Ordering in bulk?",
  detail: "Ask for a bulk quotation and our sales team will price your order.",
};

// ------------------------------------------------------------- categories

export function toCategory(row: ApiCategory): Category {
  const known = builtInCategory(row.slug);
  return {
    slug: row.slug,
    name: row.name,
    summary: row.summary ?? "",
    image: row.imageUrl ?? "",
    lead: row.lead ?? "",
    about: row.about ?? "",
    bulkPrompt: known?.bulkPrompt ?? genericBulkPrompt,
  };
}

// ------------------------------------------------------------- products

/** Fields a product card and the product browser need. */
export type ListedProduct = Pick<
  Product,
  | "slug"
  | "name"
  | "category"
  | "categoryName"
  | "summary"
  | "image"
  | "fromPrice"
  | "startingPrice"
  | "turnaround"
  | "uses"
  | "materials"
> & { minimumQuantity: number };

/** Card price: the cheapest order, or the price per piece for size-breakdown products. */
function fromPrice(row: ApiProductSummary, perPiece: boolean) {
  return perPiece ? `${inr(Number(row.startingUnitPrice))}/pc` : inr(Number(row.startingPrice));
}

export function toListedProduct(row: ApiProductSummary): ListedProduct {
  // The list endpoint has no quantity mode; the size-breakdown products are priced per piece.
  const perPiece = builtInProduct(row.slug)?.quantity.kind === "sizes";
  return {
    slug: row.slug,
    name: row.name,
    category: row.category.slug,
    categoryName: row.category.name,
    summary: row.summary ?? "",
    image: row.imageUrl ?? "",
    fromPrice: fromPrice(row, perPiece),
    startingPrice: Number(perPiece ? row.startingUnitPrice : row.startingPrice),
    turnaround: turnaroundText(row.turnaroundDays),
    uses: row.uses,
    materials: row.materials,
    minimumQuantity: row.minimumQuantity,
  };
}

export function listedFromProduct(product: Product): ListedProduct {
  return { ...product, minimumQuantity: Math.min(...product.tiers.map((tier) => tier.quantity)) };
}

function toChoice(option: ApiOption): Choice {
  const price = option.price ?? {};
  return {
    id: option.key,
    label: option.label,
    ...(option.detail ? { detail: option.detail } : {}),
    ...(price.perUnit !== undefined ? { perUnit: num(price.perUnit) } : {}),
    ...(price.unitPrice !== undefined ? { unitPrice: num(price.unitPrice) } : {}),
    ...(price.perOrder !== undefined ? { perOrder: num(price.perOrder) } : {}),
    ...(option.available ? {} : { unavailable: option.unavailableReason || "Not available" }),
    ...(option.swatch ? { swatch: option.swatch } : {}),
  };
}

function toStep(group: ApiOptionGroup, setup: ApiProduct["setupCharges"]): ConfigStep {
  const base = {
    id: group.key,
    title: group.label,
    hint: group.hint ?? "",
    ...(group.note ? { note: group.note } : {}),
    ...(group.shortLabel ? { short: group.shortLabel } : {}),
  };
  const choices = group.options.map(toChoice);
  const firstAvailable = group.options.find((option) => option.available)?.key;
  if (group.kind === "MULTISELECT") {
    const charge = setup.find((item) => item.kind === "perColourPerSelection" && item.group === group.key);
    return {
      ...base,
      kind: "multi",
      choices,
      defaultIds: group.defaults.length ? group.defaults : group.required && firstAvailable ? [firstAvailable] : [],
      ...(charge
        ? {
            coloursPerChoice: {
              whenStep: charge.appliesWhen.group,
              equals: charge.appliesWhen.option,
              perColour: Number(charge.amount),
              label: charge.label,
            },
          }
        : {}),
    };
  }
  return {
    ...base,
    kind: group.kind === "SWATCH" ? "swatch" : "choice",
    choices,
    defaultId: group.defaults[0] ?? (group.required ? (firstAvailable ?? "") : ""),
  };
}

/** Homepage estimator option: the first single-choice group with priced options. */
function estimatorOption(steps: ConfigStep[]): Product["estimatorOption"] {
  const step = steps.find(
    (item) => item.kind !== "multi" && item.choices.some((choice) => choice.perUnit) && item.choices.length > 1,
  );
  if (!step) return { label: "", choices: [] };
  return {
    label: step.short ?? step.title,
    choices: step.choices
      .filter((choice) => !choice.unavailable)
      .map((choice) => ({ id: choice.id, label: choice.label, perUnit: choice.perUnit ?? 0 })),
  };
}

export function toProduct(row: ApiProduct): Product {
  const known = builtInProduct(row.slug);
  const steps = row.optionGroups.map((group) => toStep(group, row.setupCharges));
  const perPiece = row.quantity.mode === "sizes";
  const slots = row.artworkSlots.length ? row.artworkSlots : [{ key: "artwork", label: "Artwork", printArea: null }];
  return {
    slug: row.slug,
    name: row.name,
    category: row.category.slug,
    categoryName: row.category.name,
    summary: row.summary ?? "",
    lead: row.lead ?? row.summary ?? "",
    image: row.imageUrl ?? "",
    fromPrice: fromPrice(row, perPiece),
    startingPrice: Number(perPiece ? row.startingUnitPrice : row.startingPrice),
    turnaround: turnaroundText(row.turnaroundDays),
    unitNoun: row.unit,
    gstRate: Number(row.gstRate) / 100,
    tiers: row.tiers.map((tier) => ({ quantity: tier.minQty, unitPrice: Number(tier.unitPrice) })),
    quantity:
      row.quantity.mode === "sizes"
        ? {
            kind: "sizes",
            sizes: row.quantity.sizes,
            surchargeSizes: row.sizeSurcharge?.sizes ?? [],
            surcharge: Number(row.sizeSurcharge?.perUnit ?? 0),
            quoteFrom: row.quantity.quoteFrom ?? Infinity,
            hint: known?.quantity.hint ?? "Enter how many of each size",
            defaults: row.quantity.defaults ?? {},
          }
        : { kind: "tiers", hint: known?.quantity.hint ?? "Quantity tiers lower your unit price" },
    steps,
    specs: (row.specs ?? []).map((spec) => [spec.label, spec.value]),
    artwork: {
      slots: slots.map((slot) => slot.label),
      printArea: slots.find((slot) => slot.printArea)?.printArea ?? "",
    },
    description: row.description ?? "",
    uses: row.uses,
    materials: row.materials,
    estimatorOption: estimatorOption(steps),
    rules: row.rules ?? [],
  };
}
