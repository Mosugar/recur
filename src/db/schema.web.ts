// expo-sqlite does not support web. This stub keeps the web bundle from
// attempting to load wa-sqlite.wasm. All types are identical to schema.ts.

export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";
export type Currency = "EUR" | "USD" | "GBP" | "MAD";
export type Category =
  "streaming" | "music" | "software" | "gaming" | "fitness" | "cloud" | "news" | "other";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  cycle: BillingCycle;
  firstPaymentDate: string;
  category: Category;
  color: string;
  notes: string;
  reminderEnabled: boolean;
  active: boolean;
  createdAt: string;
}

export async function getDb(): Promise<unknown> {
  return null;
}
