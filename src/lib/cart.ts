"use client";

import { useSyncExternalStore } from "react";

/**
 * Browser-only cart until the order API exists (Phase 3). Stored in
 * localStorage per visitor; every price is an estimate that the server will
 * recalculate at checkout.
 */

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitLabel: string;
  options: string[];
  subtotal: number;
  gstRate: number;
  /** Pricing version the server used, when the price came from the API. */
  pricingVersionId?: string;
  artwork: "now" | "later";
  files: string[];
  addedAt: number;
};

const KEY = "omp-cart-v1";
const EVENT = "omp-cart-change";
const EMPTY: CartItem[] = [];

let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.items;
  let items: CartItem[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
  return items;
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage blocked (private mode): the cart lasts for this page view only.
    cache = { raw: null, items };
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToCart(item: Omit<CartItem, "id" | "addedAt">) {
  const id = `${item.slug}-${Date.now().toString(36)}`;
  write([...read(), { ...item, id, addedAt: Date.now() }]);
  return id;
}

export function removeFromCart(id: string) {
  write(read().filter((item) => item.id !== id));
}

export function clearCart() {
  write([]);
}
