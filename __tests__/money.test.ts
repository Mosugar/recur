import {
  monthlyEquivalentCents,
  yearlyEquivalentCents,
  formatMoney,
  centsToDecimal,
  decimalToCents,
} from "../src/lib/money";

describe("monthlyEquivalentCents", () => {
  it("weekly: 1000 * 52 / 12 ≈ 4333", () => {
    expect(monthlyEquivalentCents(1000, "weekly")).toBe(4333);
  });

  it("monthly: identity", () => {
    expect(monthlyEquivalentCents(999, "monthly")).toBe(999);
  });

  it("quarterly: 3000 / 3 = 1000", () => {
    expect(monthlyEquivalentCents(3000, "quarterly")).toBe(1000);
  });

  it("yearly: 12000 / 12 = 1000", () => {
    expect(monthlyEquivalentCents(12000, "yearly")).toBe(1000);
  });

  it("yearly: rounds correctly (10999 / 12 ≈ 917)", () => {
    expect(monthlyEquivalentCents(10999, "yearly")).toBe(917);
  });
});

describe("yearlyEquivalentCents", () => {
  it("monthly 999 → 999 * 12 = 11988", () => {
    expect(yearlyEquivalentCents(999, "monthly")).toBe(11988);
  });

  it("yearly: round-trips through monthly then * 12", () => {
    // 10999 / 12 = 916.58 → round → 917 * 12 = 11004
    expect(yearlyEquivalentCents(10999, "yearly")).toBe(11004);
  });
});

describe("formatMoney", () => {
  it("formats EUR in fr locale", () => {
    // Amount 9.99 EUR
    const result = formatMoney(999, "EUR", "fr-FR");
    expect(result).toContain("9,99");
    expect(result).toContain("€");
  });

  it("formats USD in en locale", () => {
    const result = formatMoney(1099, "USD", "en-US");
    expect(result).toContain("10.99");
    expect(result).toContain("$");
  });
});

describe("decimalToCents", () => {
  it("converts 9.99 to 999", () => {
    expect(decimalToCents("9.99")).toBe(999);
  });

  it("handles comma decimal separator", () => {
    expect(decimalToCents("9,99")).toBe(999);
  });

  it("rounds sub-cent values (1.999 → 200)", () => {
    expect(decimalToCents("1.999")).toBe(200);
  });

  it("returns NaN for empty string", () => {
    expect(decimalToCents("")).toBeNaN();
  });

  it("returns NaN for negative", () => {
    expect(decimalToCents("-5")).toBeNaN();
  });
});

describe("centsToDecimal", () => {
  it("converts 999 to '9.99'", () => {
    expect(centsToDecimal(999)).toBe("9.99");
  });

  it("converts 100 to '1.00'", () => {
    expect(centsToDecimal(100)).toBe("1.00");
  });
});
