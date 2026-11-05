import { describe, expect, it } from "vitest";
import { getProduct } from "@/data/catalogue";
import { defaultConfiguration } from "@/lib/pricing";
import { previewRequest } from "@/lib/usePricePreview";

describe("previewRequest", () => {
  it("sends quantity for tier products", () => {
    const vc = getProduct("visiting-cards")!;
    expect(previewRequest(vc, defaultConfiguration(vc))).toEqual({
      productSlug: "visiting-cards",
      selections: {
        size: "standard",
        paper: "premium-matte-350",
        sides: "double",
        finish: "soft-touch",
        corners: "square",
      },
      quantity: 500,
    });
  });

  it("sends sizes and per-location colours for T-shirts", () => {
    const tee = getProduct("corporate-t-shirts")!;
    const config = defaultConfiguration(tee);
    config.selections.locations = ["front", "back"];
    config.colours = { front: 2 };
    const body = previewRequest(tee, config);
    expect(body.quantity).toBeUndefined();
    expect(body.sizes).toMatchObject({ S: 10, M: 25, L: 25, XL: 15, "2XL": 5 });
    expect(body.colours).toEqual({ front: 2, back: 1 });
  });
});
