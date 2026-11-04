import type { PriceTier, Product, ProductOption } from "@/data/catalogue";

/**
 * Client-side price *estimate* for display only. The server recalculates and
 * confirms every price at checkout (ADR-0002 in the docs repo).
 * Amounts are rounded to paise at each step to match how invoices are shown.
 */

const roundToPaise = (value: number) => Math.round(value * 100) / 100;

export type Estimate = {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  gst: number;
  total: number;
};

/** The tier that applies to a quantity: the highest tier at or below it. */
export function tierFor(tiers: PriceTier[], quantity: number): PriceTier {
  const sorted = [...tiers].sort((a, b) => a.quantity - b.quantity);
  return sorted.reduce((match, tier) => (quantity >= tier.quantity ? tier : match), sorted[0]);
}

export function estimatePrice(
  product: Product,
  quantity: number,
  option?: ProductOption,
): Estimate {
  const tier = tierFor(product.tiers, quantity);
  const unitPrice = roundToPaise(tier.unitPrice + (option?.perUnit ?? 0));
  const subtotal = roundToPaise(unitPrice * quantity);
  const gst = roundToPaise(subtotal * product.gstRate);
  return { quantity, unitPrice, subtotal, gst, total: roundToPaise(subtotal + gst) };
}
