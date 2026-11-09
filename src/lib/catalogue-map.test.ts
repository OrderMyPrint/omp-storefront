import { describe, expect, it } from "vitest";
import { getProduct } from "@/data/catalogue";
import { toCategory, toListedProduct, toProduct, turnaroundText, type ApiProduct } from "@/lib/catalogue-map";
import { defaultConfiguration } from "@/lib/pricing";

const option = (key: string, label: string, extra: Partial<ApiProduct["optionGroups"][0]["options"][0]> = {}) => ({
  key,
  label,
  detail: null,
  swatch: null,
  available: true,
  unavailableReason: null,
  price: null,
  ...extra,
});

/** Shaped like GET /api/v1/catalogue/products/corporate-t-shirts (trimmed). */
const tshirts: ApiProduct = {
  slug: "corporate-t-shirts",
  name: "Corporate T-Shirts",
  category: { slug: "corporate-merchandise", name: "Corporate Merchandise" },
  summary: "Size-wise quantities, multiple print locations.",
  imageUrl: null,
  unit: { one: "T-shirt", many: "T-shirts" },
  turnaroundDays: { min: 5, max: 7 },
  gstRate: "5.00",
  uses: ["Team & uniforms"],
  materials: ["Fabric"],
  minimumQuantity: 25,
  startingPrice: "8725.00",
  startingUnitPrice: "349.00",
  lead: null,
  description: "Round-neck T-shirts.",
  specs: [{ label: "Sizes", value: "XS – 3XL" }],
  quantity: { mode: "sizes", sizes: ["S", "M", "2XL"], defaults: { M: 25 }, minimum: 25, quoteFrom: 300 },
  optionGroups: [
    {
      key: "garment",
      label: "Garment type",
      shortLabel: null,
      hint: "Style of T-shirt",
      note: null,
      kind: "SELECT",
      required: true,
      defaults: [],
      options: [
        option("polo", "Polo", { available: false, unavailableReason: "Priced on quotation" }),
        option("round-neck", "Round neck"),
      ],
    },
    {
      key: "colour",
      label: "Colour",
      shortLabel: null,
      hint: null,
      note: null,
      kind: "SWATCH",
      required: true,
      defaults: ["navy"],
      options: [option("navy", "Navy", { swatch: "#102848" })],
    },
    {
      key: "method",
      label: "Printing method",
      shortLabel: null,
      hint: null,
      note: null,
      kind: "SELECT",
      required: true,
      defaults: ["screen"],
      options: [option("screen", "Screen print"), option("dtf", "DTF print")],
    },
    {
      key: "locations",
      label: "Print locations",
      shortLabel: null,
      hint: null,
      note: null,
      kind: "MULTISELECT",
      required: true,
      defaults: ["front"],
      options: [option("front", "Front"), option("back", "Back", { price: { perUnit: "40" } })],
    },
  ],
  setupCharges: [
    {
      kind: "perColourPerSelection",
      label: "Screens",
      group: "locations",
      appliesWhen: { group: "method", option: "screen" },
      amount: "300",
      maxColours: 6,
    },
  ],
  sizeSurcharge: { sizes: ["2XL"], perUnit: "30", label: "2XL and above" },
  artworkSlots: [],
  tiers: [
    { minQty: 25, unitPrice: "349.00", total: "8725.00", savingPercent: 0 },
    { minQty: 50, unitPrice: "319.00", total: "15950.00", savingPercent: 9 },
  ],
  rules: [],
  pricingVersionId: "v1",
};

describe("toProduct", () => {
  const product = toProduct(tshirts);

  it("maps prices, GST and turnaround into the storefront's types", () => {
    expect(product.fromPrice).toBe("₹349/pc");
    expect(product.startingPrice).toBe(349);
    expect(product.gstRate).toBe(0.05);
    expect(product.turnaround).toBe("5–7");
    expect(product.tiers).toEqual([
      { quantity: 25, unitPrice: 349 },
      { quantity: 50, unitPrice: 319 },
    ]);
    expect(product.specs).toEqual([["Sizes", "XS – 3XL"]]);
    expect(product.image).toBe("");
  });

  it("maps option groups to steps with defaults, prices and availability", () => {
    const [garment, colour, , locations] = product.steps;
    expect(garment).toMatchObject({ kind: "choice", defaultId: "round-neck" });
    expect(garment.choices[0]).toMatchObject({ id: "polo", unavailable: "Priced on quotation" });
    expect(colour).toMatchObject({ kind: "swatch", defaultId: "navy" });
    expect(colour.choices[0].swatch).toBe("#102848");
    expect(locations).toMatchObject({
      kind: "multi",
      defaultIds: ["front"],
      coloursPerChoice: { whenStep: "method", equals: "screen", perColour: 300, label: "Screens" },
    });
    expect(locations.choices[1].perUnit).toBe(40);
  });

  it("maps size quantities with surcharge and quote threshold, keeping the designed hint", () => {
    expect(product.quantity).toMatchObject({
      kind: "sizes",
      sizes: ["S", "M", "2XL"],
      surchargeSizes: ["2XL"],
      surcharge: 30,
      quoteFrom: 300,
      hint: getProduct("corporate-t-shirts")?.quantity.hint,
    });
    expect(defaultConfiguration(product).sizes).toEqual({ S: 0, M: 25, "2XL": 0 });
  });

  it("gives a product without artwork slots one generic slot", () => {
    expect(product.artwork).toEqual({ slots: ["Artwork"], printArea: "" });
  });
});

describe("listing and categories", () => {
  it("prices tier products by the cheapest order", () => {
    const listed = toListedProduct({
      ...tshirts,
      slug: "new-flyers",
      startingPrice: "450.00",
      startingUnitPrice: "4.50",
      turnaroundDays: { min: 3, max: 3 },
    });
    expect(listed).toMatchObject({ fromPrice: "₹450", startingPrice: 450, turnaround: "3", minimumQuantity: 25 });
    expect(listed.categoryName).toBe("Corporate Merchandise");
  });

  it("keeps the designed bulk prompt for launch categories and a generic one for new ones", () => {
    const base = { name: "X", summary: null, lead: null, about: null, imageUrl: null, productCount: 0 };
    expect(toCategory({ ...base, slug: "marketing-print" }).bulkPrompt.title).toBe("Planning a launch or an event?");
    expect(toCategory({ ...base, slug: "signage" }).bulkPrompt.title).toBe("Ordering in bulk?");
  });

  it("formats turnaround ranges", () => {
    expect(turnaroundText({ min: 2, max: 3 })).toBe("2–3");
  });
});
