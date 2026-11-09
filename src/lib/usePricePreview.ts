"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/catalogue";
import { API_URL, fetchPricePreview, type PricePreviewRequest, type ServerPrice } from "@/lib/api";
import type { Configuration } from "@/lib/pricing";

export type PreviewState =
  | { status: "off" }
  | { status: "loading" }
  | { status: "ok"; price: ServerPrice }
  | { status: "error" };

/** The request the API expects for a storefront configuration. */
export function previewRequest(product: Product, config: Configuration): PricePreviewRequest {
  // Optional groups with nothing chosen are left out (the API rejects empty keys).
  const selections = Object.fromEntries(
    Object.entries(config.selections).filter(([, value]) => (Array.isArray(value) ? value.length : value)),
  );
  const body: PricePreviewRequest = { productSlug: product.slug, selections };
  if (product.quantity.kind === "sizes") body.sizes = config.sizes;
  else body.quantity = config.quantity;
  const colours: Record<string, number> = {};
  for (const step of product.steps) {
    if (step.kind !== "multi" || !step.coloursPerChoice) continue;
    const selected = config.selections[step.id];
    for (const key of Array.isArray(selected) ? selected : []) colours[key] = config.colours[key] ?? 1;
  }
  if (Object.keys(colours).length) body.colours = colours;
  return body;
}

/**
 * Asks the API to price the configuration, 250 ms after the last change.
 * Older requests are cancelled, and a result is only reported for the
 * configuration it was computed for — never for a stale one.
 */
export function usePricePreview(product: Product, config: Configuration): PreviewState {
  const body = useMemo(() => previewRequest(product, config), [product, config]);
  const key = useMemo(() => JSON.stringify(body), [body]);
  const [result, setResult] = useState<{ key: string; state: PreviewState } | null>(null);

  useEffect(() => {
    if (!API_URL) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetchPricePreview(JSON.parse(key) as PricePreviewRequest, controller.signal)
        .then((price) => setResult({ key, state: { status: "ok", price } }))
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          if (process.env.NODE_ENV !== "production") console.warn("Price preview unavailable:", error);
          setResult({ key, state: { status: "error" } });
        });
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [key]);

  if (!API_URL) return { status: "off" };
  return result?.key === key ? result.state : { status: "loading" };
}
