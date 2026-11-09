"use client";

import { createContext, useContext, type ReactNode } from "react";
import { categories, products } from "@/data/catalogue";
import { listedFromProduct, toEstimatorProduct, type CatalogueSnapshot } from "@/lib/catalogue-map";

/** Built-in catalogue, used when no snapshot from the API was provided. */
const builtIn: CatalogueSnapshot = {
  categories,
  products: products.map(listedFromProduct),
  estimator: products.map(toEstimatorProduct),
};

const CatalogueContext = createContext<CatalogueSnapshot>(builtIn);

/**
 * Makes the live catalogue (loaded on the server in the root layout) available
 * to homepage sections, which also render inside the visual editor's client canvas.
 */
export function CatalogueProvider({ value, children }: { value: CatalogueSnapshot; children: ReactNode }) {
  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue(): CatalogueSnapshot {
  return useContext(CatalogueContext);
}
