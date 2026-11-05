import { describe, expect, it } from "vitest";
import { getProduct, products } from "@/data/catalogue";
import { formatINR, formatQuantity } from "@/lib/format";
import { defaultConfiguration, describeConfiguration, estimatePrice, priceConfiguration, tierFor } from "@/lib/pricing";

const product = (slug: string) => {
  const found = getProduct(slug);
  if (!found) throw new Error(`missing product ${slug}`);
  return found;
};

describe("formatINR", () => {
  it("uses Indian digit grouping", () => {
    expect(formatINR(1652)).toBe("₹1,652.00");
    expect(formatINR(184500)).toBe("₹1,84,500.00");
    expect(formatINR(12345678.9)).toBe("₹1,23,45,678.90");
    expect(formatINR(399, { decimals: 0 })).toBe("₹399");
    expect(formatQuantity(100000)).toBe("1,00,000");
  });
});

describe("tierFor", () => {
  const tiers = product("visiting-cards").tiers;
  it("picks the highest tier at or below the quantity", () => {
    expect(tierFor(tiers, 100).unitPrice).toBe(3.99);
    expect(tierFor(tiers, 499).unitPrice).toBe(2.6);
    expect(tierFor(tiers, 500).unitPrice).toBe(1.8);
    expect(tierFor(tiers, 10000).unitPrice).toBe(1.3);
  });
});

describe("configurator pricing", () => {
  it("matches the Figma reference for visiting cards (₹1,652.00)", () => {
    const vc = product("visiting-cards");
    const price = priceConfiguration(vc, defaultConfiguration(vc));
    expect(price.quantity).toBe(500);
    expect(price.subtotal).toBe(1400);
    expect(price.gst).toBe(252);
    expect(price.total).toBe(1652);
  });

  it("matches the homepage estimate for the same options", () => {
    const vc = product("visiting-cards");
    const double = vc.estimatorOption.choices.find((choice) => choice.id === "double");
    expect(estimatePrice(vc, 500, double).subtotal).toBe(1080);
  });

  it("uses size breakdown, 2XL surcharge, screens and 5% GST for T-shirts", () => {
    const tee = product("corporate-t-shirts");
    const config = defaultConfiguration(tee);
    const price = priceConfiguration(tee, config);
    expect(price.quantity).toBe(80);
    expect(price.lines.map((line) => line.amount)).toEqual([23920, 300, 150]);
    expect(price.gst).toBe(1218.5);
    expect(price.total).toBe(25588.5);
  });

  it("adds a back print and counts one screen per colour per location", () => {
    const tee = product("corporate-t-shirts");
    const config = defaultConfiguration(tee);
    config.selections.locations = ["front", "back"];
    config.colours = { front: 2, back: 1 };
    const price = priceConfiguration(tee, config);
    expect(price.lines.find((line) => line.label.startsWith("Screens"))?.amount).toBe(900);
    expect(price.lines.find((line) => line.label.includes("Back"))?.amount).toBe(3200);
  });

  it("drops the screen fee for DTF printing", () => {
    const tee = product("corporate-t-shirts");
    const config = defaultConfiguration(tee);
    config.selections.method = "dtf";
    expect(priceConfiguration(tee, config).lines.some((line) => line.label.startsWith("Screens"))).toBe(false);
  });

  it("lets a sheet size replace the tier price for DTF", () => {
    const dtf = product("dtf-stickers");
    const config = defaultConfiguration(dtf);
    config.selections.sheet = "22x24";
    config.quantity = 2;
    expect(priceConfiguration(dtf, config).subtotal).toBe(498);
  });

  it("gives every product a valid default configuration", () => {
    for (const item of products) {
      const price = priceConfiguration(item, defaultConfiguration(item));
      expect(price.total, item.slug).toBeGreaterThan(0);
      expect(describeConfiguration(item, defaultConfiguration(item)).length, item.slug).toBeGreaterThan(0);
      for (const step of item.steps) {
        const ids = step.kind === "multi" ? step.defaultIds : [step.defaultId];
        for (const id of ids) {
          const choice = step.choices.find((entry) => entry.id === id);
          expect(choice, `${item.slug}.${step.id}`).toBeDefined();
          expect(choice?.unavailable, `${item.slug}.${step.id} default must be available`).toBeUndefined();
        }
      }
    }
  });
});
