import * as SQLite from "expo-sqlite";

export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";
export type Currency = "EUR" | "USD" | "GBP" | "MAD";
export type Category =
  "streaming" | "music" | "software" | "gaming" | "fitness" | "cloud" | "news" | "other";

export interface Subscription {
  id: string;
  name: string;
  /** Stored in cents (integer) to avoid float errors */
  price: number;
  currency: Currency;
  cycle: BillingCycle;
  /** ISO date string YYYY-MM-DD */
  firstPaymentDate: string;
  category: Category;
  /** Hex colour from the predefined palette */
  color: string;
  notes: string;
  reminderEnabled: boolean;
  /** false = paused; excluded from totals and notifications */
  active: boolean;
  createdAt: string;
}

const DB_NAME = "recur.db";
const SCHEMA_VERSION = 2;

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync(DB_NAME);
  await migrate(_db);
  return _db;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  const result = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version;");
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion < 1) {
    // Fresh install — create table with all columns up to current version
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id                 TEXT PRIMARY KEY NOT NULL,
        name               TEXT NOT NULL,
        price              INTEGER NOT NULL,
        currency           TEXT NOT NULL,
        cycle              TEXT NOT NULL,
        first_payment_date TEXT NOT NULL,
        category           TEXT NOT NULL,
        color              TEXT NOT NULL,
        notes              TEXT NOT NULL DEFAULT '',
        reminder_enabled   INTEGER NOT NULL DEFAULT 1,
        active             INTEGER NOT NULL DEFAULT 1,
        created_at         TEXT NOT NULL
      );
    `);
  } else if (currentVersion < 2) {
    // Existing v1 — add active column
    await db.execAsync(`ALTER TABLE subscriptions ADD COLUMN active INTEGER NOT NULL DEFAULT 1;`);
  }

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
}
