/**
 * Client for the Order My Print API (OrderMyPrint/omp-api).
 * NEXT_PUBLIC_API_URL is the API origin, e.g. https://api.example.com — when it
 * is not set, the storefront falls back to its local price estimates.
 */

export const API_URL: string | null = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "") || null;

export type PricePreviewRequest = {
  productSlug: string;
  selections: Record<string, string | string[]>;
  quantity?: number;
  sizes?: Record<string, number>;
  colours?: Record<string, number>;
};

export type ServerPrice = {
  productSlug: string;
  pricingVersionId: string;
  valid: boolean;
  requiresQuote: boolean;
  errors: { code: string; field: string; message: string }[];
  quantity: number;
  lines: { code: string; label: string; amount: string }[];
  subtotal: string | null;
  gstRate: string;
  gst: string | null;
  total: string | null;
};

function isServerPrice(value: unknown): value is ServerPrice {
  const v = value as ServerPrice;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.valid === "boolean" &&
    typeof v.requiresQuote === "boolean" &&
    Array.isArray(v.lines) &&
    Array.isArray(v.errors) &&
    typeof v.gstRate === "string" &&
    typeof v.pricingVersionId === "string"
  );
}

export async function fetchPricePreview(body: PricePreviewRequest, signal?: AbortSignal): Promise<ServerPrice> {
  if (!API_URL) throw new Error("API not configured");
  const response = await fetch(`${API_URL}/api/v1/pricing/preview`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Price preview failed (${response.status})`);
  const data: unknown = await response.json();
  if (!isServerPrice(data)) throw new Error("Unexpected price preview response");
  return data;
}
