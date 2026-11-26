import {
  addMonths,
  nextPaymentDate,
  daysUntil,
  dueSoonLabel,
  formatIso,
  parseDate,
} from "../src/lib/dates";

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

describe("dueSoonLabel", () => {
  // Echoes the key and its options so each branch is visible in the result
  const t = (key: string, options?: Record<string, unknown>) =>
    options ? `${key}:${JSON.stringify(options)}` : key;

  it("says today for 0 days", () => {
    expect(dueSoonLabel(0, t)).toBe("due.today");
  });

  it("says tomorrow for 1 day", () => {
    expect(dueSoonLabel(1, t)).toBe("due.tomorrow");
  });

  it("passes the count for 2 to 7 days", () => {
    expect(dueSoonLabel(2, t)).toBe('due.inDays:{"count":2}');
    expect(dueSoonLabel(7, t)).toBe('due.inDays:{"count":7}');
  });

  it("returns null outside the 7-day window", () => {
    expect(dueSoonLabel(8, t)).toBeNull();
    expect(dueSoonLabel(-1, t)).toBeNull();
  });
});

// Tests run in Europe/Paris (jest.global-setup.js): clocks go back on 25 Oct 2026
// and forward on 29 Mar 2026, so a week is 169 h or 167 h long around those dates.
describe("weekly cycle across daylight saving time changes", () => {
  it("runs in a time zone that has DST", () => {
    expect(d("2026-10-20").getTimezoneOffset()).not.toBe(d("2026-10-27").getTimezoneOffset());
  });

  it("keeps the same weekday after clocks go back", () => {
    const next = nextPaymentDate("2026-10-20", "weekly", d("2026-10-21"));
    expect(formatIso(next)).toBe("2026-10-27");
    expect(next.getHours()).toBe(0);
  });

  it("keeps the same weekday after clocks go forward", () => {
    const next = nextPaymentDate("2026-03-24", "weekly", d("2026-03-25"));
    expect(formatIso(next)).toBe("2026-03-31");
  });

  it("does not drift over many weeks", () => {
    // 20 Oct 2026 + 10 weeks = 29 Dec 2026, still a Tuesday
    const next = nextPaymentDate("2026-10-20", "weekly", d("2026-12-23"));
    expect(formatIso(next)).toBe("2026-12-29");
    expect(next.getDay()).toBe(2);
  });
});
