import type { BillingCycle, Currency } from "@/db/schema";

/**
 * Monthly equivalent in cents.
 * weekly × 52/12 | monthly × 1 | quarterly / 3 | yearly / 12
 */
export function monthlyEquivalentCents(priceCents: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return Math.round((priceCents * 52) / 12);
    case "monthly":
      return priceCents;
    case "quarterly":
      return Math.round(priceCents / 3);
    case "yearly":
      return Math.round(priceCents / 12);
  }
}

/** Yearly equivalent in cents. */
export function yearlyEquivalentCents(priceCents: number, cycle: BillingCycle): number {
  return monthlyEquivalentCents(priceCents, cycle) * 12;
}

/** Format cents as a localised currency string. */
export function formatMoney(cents: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Convert cents to a decimal amount (for display inputs). */
export function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Parse a user-entered decimal string to cents (integer). Returns NaN on invalid input. */
export function decimalToCents(value: string): number {
  const n = parseFloat(value.replace(",", "."));
  if (isNaN(n) || n < 0) return NaN;
  return Math.round(n * 100);
}
