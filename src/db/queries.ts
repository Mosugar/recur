import { getDb, type Subscription } from "./schema";

// ── Row ↔ Domain mapping ────────────────────────────────────────────────────

interface Row {
  id: string;
  name: string;
  price: number;
  currency: string;
  cycle: string;
  first_payment_date: string;
  category: string;
  color: string;
  notes: string;
  reminder_enabled: number;
  active: number;
  created_at: string;
}

function rowToSubscription(row: Row): Subscription {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    currency: row.currency as Subscription["currency"],
    cycle: row.cycle as Subscription["cycle"],
    firstPaymentDate: row.first_payment_date,
    category: row.category as Subscription["category"],
    color: row.color,
    notes: row.notes,
    reminderEnabled: row.reminder_enabled === 1,
    active: row.active === 1,
    createdAt: row.created_at,
  };
}

// ── Queries ─────────────────────────────────────────────────────────────────

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>("SELECT * FROM subscriptions ORDER BY created_at DESC;");
  return rows.map(rowToSubscription);
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Row>("SELECT * FROM subscriptions WHERE id = ?;", [id]);
  return row ? rowToSubscription(row) : null;
}

export async function insertSubscription(sub: Subscription): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO subscriptions
       (id, name, price, currency, cycle, first_payment_date,
        category, color, notes, reminder_enabled, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      sub.id,
      sub.name,
      sub.price,
      sub.currency,
      sub.cycle,
      sub.firstPaymentDate,
      sub.category,
      sub.color,
      sub.notes,
      sub.reminderEnabled ? 1 : 0,
      sub.active ? 1 : 0,
      sub.createdAt,
    ],
  );
}

export async function updateSubscription(sub: Subscription): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE subscriptions SET
       name = ?, price = ?, currency = ?, cycle = ?,
       first_payment_date = ?, category = ?, color = ?,
       notes = ?, reminder_enabled = ?, active = ?
     WHERE id = ?;`,
    [
      sub.name,
      sub.price,
      sub.currency,
      sub.cycle,
      sub.firstPaymentDate,
      sub.category,
      sub.color,
      sub.notes,
      sub.reminderEnabled ? 1 : 0,
      sub.active ? 1 : 0,
      sub.id,
    ],
  );
}

export async function deleteSubscription(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM subscriptions WHERE id = ?;", [id]);
}

export async function deleteAllSubscriptions(): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM subscriptions;");
}
