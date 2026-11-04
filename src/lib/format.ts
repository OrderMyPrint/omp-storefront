/**
 * Indian Rupee formatting with Indian digit grouping (₹1,84,500.00).
 * Implemented by hand so the output is identical on the server and in every
 * browser, regardless of the runtime's Intl locale data.
 */
export function formatINR(amount: number, { decimals = 2 }: { decimals?: number } = {}): string {
  const negative = amount < 0;
  const [whole, fraction] = Math.abs(amount).toFixed(decimals).split(".");
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = rest ? `${rest},${lastThree}` : lastThree;
  return `${negative ? "− " : ""}₹${grouped}${fraction ? `.${fraction}` : ""}`;
}

/** Whole-number quantities with Indian grouping (1,000 · 2,500 · 1,00,000). */
export function formatQuantity(value: number): string {
  return formatINR(value, { decimals: 0 }).replace("₹", "");
}
