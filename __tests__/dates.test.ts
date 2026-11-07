import { addMonths, nextPaymentDate, daysUntil, formatIso, parseDate } from "../src/lib/dates";

// Helper to build Date at local midnight
const d = (iso: string) => parseDate(iso);

describe("addMonths", () => {
  it("adds 1 month normally", () => {
    expect(formatIso(addMonths(d("2024-03-15"), 1))).toBe("2024-04-15");
  });

  it("clamps Jan 31 → Feb 28 (non-leap)", () => {
    expect(formatIso(addMonths(d("2023-01-31"), 1))).toBe("2023-02-28");
  });

  it("clamps Jan 31 → Feb 29 (leap year)", () => {
    expect(formatIso(addMonths(d("2024-01-31"), 1))).toBe("2024-02-29");
  });

  it("clamps Mar 31 + 1 month → Apr 30", () => {
    expect(formatIso(addMonths(d("2024-03-31"), 1))).toBe("2024-04-30");
  });

  it("adds 3 months (quarterly)", () => {
    expect(formatIso(addMonths(d("2024-01-15"), 3))).toBe("2024-04-15");
  });

  it("adds 12 months crosses year", () => {
    expect(formatIso(addMonths(d("2023-11-30"), 12))).toBe("2024-11-30");
  });
});

describe("nextPaymentDate", () => {
  it("returns firstPaymentDate when it is today", () => {
    const today = d("2024-05-01");
    expect(formatIso(nextPaymentDate("2024-05-01", "monthly", today))).toBe("2024-05-01");
  });

  it("returns next monthly cycle when first date is in the past", () => {
    const today = d("2024-06-01");
    // first payment 2024-01-01, monthly → next is 2024-06-01
    expect(formatIso(nextPaymentDate("2024-01-01", "monthly", today))).toBe("2024-06-01");
  });

  it("advances weekly cycle", () => {
    // first: Mon 2024-04-01, today: Wed 2024-04-10 → next Mon 2024-04-15
    const today = d("2024-04-10");
    expect(formatIso(nextPaymentDate("2024-04-01", "weekly", today))).toBe("2024-04-15");
  });

  it("advances quarterly cycle", () => {
    const today = d("2024-07-01");
    expect(formatIso(nextPaymentDate("2024-01-01", "quarterly", today))).toBe("2024-07-01");
  });

  it("advances yearly cycle", () => {
    const today = d("2025-03-01");
    expect(formatIso(nextPaymentDate("2024-03-01", "yearly", today))).toBe("2025-03-01");
  });

  it("handles month-end: Jan 31 monthly → Feb 28 → Mar 28 ...", () => {
    const today = d("2024-03-01");
    // first: 2024-01-31 → next is 2024-02-29 (leap) → 2024-03-29
    expect(formatIso(nextPaymentDate("2024-01-31", "monthly", today))).toBe("2024-03-29");
  });
});

describe("daysUntil", () => {
  it("returns 0 for today", () => {
    const today = d("2024-05-01");
    expect(daysUntil(d("2024-05-01"), today)).toBe(0);
  });

  it("returns positive for future dates", () => {
    const today = d("2024-05-01");
    expect(daysUntil(d("2024-05-08"), today)).toBe(7);
  });

  it("returns negative for past dates", () => {
    const today = d("2024-05-01");
    expect(daysUntil(d("2024-04-24"), today)).toBe(-7);
  });
});
