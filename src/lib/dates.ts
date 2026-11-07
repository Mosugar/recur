import type { BillingCycle } from "@/db/schema";

/**
 * Add `n` months to a date, clamping to the last day of the target month.
 * e.g. Jan 31 + 1 month → Feb 28/29.
 */
export function addMonths(date: Date, n: number): Date {
  const result = new Date(date);
  const targetMonth = result.getMonth() + n;
  result.setDate(1); // avoid overshooting while setting month
  result.setMonth(targetMonth);
  // Clamp to last day of target month
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

/**
 * Compute the next payment date on or after `today` given the first payment
 * date and billing cycle. Never stores it — always derived.
 */
export function nextPaymentDate(
  firstPaymentDate: string,
  cycle: BillingCycle,
  today: Date = new Date(),
): Date {
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);

  let current = parseDate(firstPaymentDate);

  // Advance until we reach or pass today
  while (current < todayMidnight) {
    current = advanceOneCycle(current, cycle);
  }
  return current;
}

function advanceOneCycle(date: Date, cycle: BillingCycle): Date {
  switch (cycle) {
    case "weekly":
      return new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "monthly":
      return addMonths(date, 1);
    case "quarterly":
      return addMonths(date, 3);
    case "yearly":
      return addMonths(date, 12);
  }
}

/** Parse an ISO date string (YYYY-MM-DD) as local midnight. */
export function parseDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Format a Date as YYYY-MM-DD. */
export function formatIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Days from today (local midnight) until `target` (can be negative). */
export function daysUntil(target: Date, today: Date = new Date()): number {
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  const n = new Date(today);
  n.setHours(0, 0, 0, 0);
  return Math.round((t.getTime() - n.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Human-readable label for payments due within the next 7 days.
 * Returns null if outside that window.
 */
export function dueSoonLabel(
  days: number,
  t: (key: string, options?: Record<string, unknown>) => string,
): string | null {
  if (days < 0 || days > 7) return null;
  if (days === 0) return t("due.today");
  if (days === 1) return t("due.tomorrow");
  return t("due.inDays", { count: days });
}
