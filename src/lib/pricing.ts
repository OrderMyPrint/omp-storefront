import type { Choice, ChoiceStep, MultiStep, PriceTier, Product } from "@/data/catalogue";
import { formatQuantity } from "@/lib/format";

/**
 * Client-side price *estimate* for display only. The server recalculates and
 * confirms every price at checkout (ADR-0002 in the docs repo).
 * Amounts are rounded to paise at each step to match how invoices are shown.
 */

export const roundToPaise = (value: number) => Math.round(value * 100) / 100;

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

/** Homepage quick estimate: tier price plus one per-unit option. */
export function estimatePrice(
  product: Pick<Product, "tiers" | "gstRate">,
  quantity: number,
  option?: Choice,
): Estimate {
  const tier = tierFor(product.tiers, quantity);
  const unitPrice = roundToPaise(tier.unitPrice + (option?.perUnit ?? 0));
  const subtotal = roundToPaise(unitPrice * quantity);
  const gst = roundToPaise(subtotal * product.gstRate);
  return { quantity, unitPrice, subtotal, gst, total: roundToPaise(subtotal + gst) };
}

/* ------------------------------------------------------------------ */
/* Configurator                                                        */
/* ------------------------------------------------------------------ */

export type Configuration = {
  /** Selected choice id per choice step, or ids per multi step. */
  selections: Record<string, string | string[]>;
  /** Number of print colours per selected multi-step choice (screen printing). */
  colours: Record<string, number>;
  /** Quantity for tier products. */
  quantity: number;
  /** Quantity per size for size-breakdown products. */
  sizes: Record<string, number>;
};

export type PriceLine = { label: string; amount: number };

export type ConfiguredPrice = {
  quantity: number;
  baseUnitPrice: number;
  lines: PriceLine[];
  subtotal: number;
  gst: number;
  total: number;
};

export function defaultConfiguration(product: Product): Configuration {
  const selections: Record<string, string | string[]> = {};
  const colours: Record<string, number> = {};
  for (const step of product.steps) {
    if (step.kind === "multi") {
      selections[step.id] = [...step.defaultIds];
      step.defaultIds.forEach((id) => (colours[id] = 1));
    } else {
      selections[step.id] = step.defaultId;
    }
  }
  const tiers = [...product.tiers].sort((a, b) => a.quantity - b.quantity);
  const sizes: Record<string, number> = {};
  if (product.quantity.kind === "sizes") {
    const { defaults } = product.quantity;
    product.quantity.sizes.forEach((size) => (sizes[size] = defaults[size] ?? 0));
  }
  return { selections, colours, quantity: tiers[Math.min(2, tiers.length - 1)].quantity, sizes };
}

export function totalQuantity(product: Product, config: Configuration): number {
  if (product.quantity.kind === "sizes") {
    return Object.values(config.sizes).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
  }
  return config.quantity;
}

export function selectedChoice(step: ChoiceStep, config: Configuration): Choice {
  const id = config.selections[step.id];
  return step.choices.find((choice) => choice.id === id) ?? step.choices[0];
}

export function selectedChoices(step: MultiStep, config: Configuration): Choice[] {
  const ids = config.selections[step.id];
  const list = Array.isArray(ids) ? ids : [];
  return step.choices.filter((choice) => list.includes(choice.id));
}

/** Whether the per-location colour counts apply (e.g. only for screen printing). */
export function coloursApply(step: MultiStep, config: Configuration): boolean {
  const rule = step.coloursPerChoice;
  return Boolean(rule && config.selections[rule.whenStep] === rule.equals);
}

export function priceConfiguration(product: Product, config: Configuration): ConfiguredPrice {
  const quantity = totalQuantity(product, config);
  const noun = quantity === 1 ? product.unitNoun.one : product.unitNoun.many;
  const tier = tierFor(product.tiers, Math.max(quantity, 1));

  let baseUnitPrice = tier.unitPrice;
  const lines: PriceLine[] = [];
  const optionLines: PriceLine[] = [];

  for (const step of product.steps) {
    if (step.kind === "multi") {
      for (const choice of selectedChoices(step, config)) {
        if (choice.perUnit) {
          optionLines.push({
            label: `${step.short ?? step.title}: ${choice.label}`,
            amount: roundToPaise(choice.perUnit * quantity),
          });
        }
      }
      if (step.coloursPerChoice && coloursApply(step, config)) {
        const screens = selectedChoices(step, config).reduce(
          (sum, choice) => sum + (config.colours[choice.id] ?? 1),
          0,
        );
        if (screens > 0) {
          optionLines.push({
            label: `${step.coloursPerChoice.label}: ${screens} × ₹${step.coloursPerChoice.perColour}`,
            amount: screens * step.coloursPerChoice.perColour,
          });
        }
      }
      continue;
    }
    const choice = selectedChoice(step, config);
    if (choice.unitPrice !== undefined) baseUnitPrice = choice.unitPrice;
    if (choice.perUnit) {
      optionLines.push({
        label: `${step.short ?? step.title}: ${choice.label}`,
        amount: roundToPaise(choice.perUnit * quantity),
      });
    }
    if (choice.perOrder)
      optionLines.push({ label: `${step.short ?? step.title}: ${choice.label}`, amount: choice.perOrder });
  }

  if (product.quantity.kind === "sizes") {
    const mode = product.quantity;
    const surchargeUnits = mode.surchargeSizes.reduce((sum, size) => sum + (config.sizes[size] ?? 0), 0);
    if (surchargeUnits > 0) {
      optionLines.push({
        label: `${mode.surchargeSizes[0]} and above: ${surchargeUnits} × ₹${mode.surcharge}`,
        amount: surchargeUnits * mode.surcharge,
      });
    }
  }

  lines.push({
    label: `${formatQuantity(quantity)} ${noun} × ₹${trimPaise(baseUnitPrice)}`,
    amount: roundToPaise(baseUnitPrice * quantity),
  });
  lines.push(...optionLines);

  const subtotal = roundToPaise(lines.reduce((sum, line) => sum + line.amount, 0));
  const gst = roundToPaise(subtotal * product.gstRate);
  return { quantity, baseUnitPrice, lines, subtotal, gst, total: roundToPaise(subtotal + gst) };
}

/** Human-readable summary of the chosen options, for the cart. */
export function describeConfiguration(product: Product, config: Configuration): string[] {
  const parts: string[] = [];
  for (const step of product.steps) {
    if (step.kind === "multi") {
      const chosen = selectedChoices(step, config);
      const withColours = coloursApply(step, config);
      parts.push(
        `${step.short ?? step.title}: ${chosen
          .map((choice) => (withColours ? `${choice.label} (${config.colours[choice.id] ?? 1} col.)` : choice.label))
          .join(", ")}`,
      );
    } else {
      parts.push(`${step.short ?? step.title}: ${selectedChoice(step, config).label}`);
    }
  }
  if (product.quantity.kind === "sizes") {
    const sizes = Object.entries(config.sizes)
      .filter(([, count]) => count > 0)
      .map(([size, count]) => `${size} ${count}`)
      .join(" · ");
    if (sizes) parts.push(`Sizes: ${sizes}`);
  }
  return parts;
}

function trimPaise(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
