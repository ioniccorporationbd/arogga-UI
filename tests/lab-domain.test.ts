import { describe, expect, it } from "vitest";

import { labTestSchema, queryLabTests, createLabBookingLine, calculateLabCartSummary } from "../src/features/lab/domain";
import labTests from "../public/data/lab-tests.json";
import centers from "../public/data/diagnostic-centers.json";

describe("independent lab ecosystem", () => {
  it("ships at least 200 valid lab tests and 10 diagnostic centers", () => {
    expect(labTests.length).toBeGreaterThanOrEqual(200);
    expect(centers.length).toBeGreaterThanOrEqual(10);
    expect(() => labTestSchema.parse(labTests[0])).not.toThrow();
  });

  it("filters, searches, sorts and paginates lab tests", () => {
    const result = queryLabTests(labTests, { q: "cbc", priceMax: 1000, sort: "price-asc", page: 1, limit: 5 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(5);
    expect(result.items[0].salePrice).toBeLessThanOrEqual(result.items.at(-1)!.salePrice);
    expect(result.items.some((item) => item.name.toLowerCase().includes("cbc") || item.searchKeywords.some((key) => key.includes("cbc")))).toBe(true);
  });

  it("creates lab booking lines and calculates local totals", () => {
    const test = labTests[0];
    const line = createLabBookingLine(test, centers[0], 2);
    const summary = calculateLabCartSummary([line]);
    expect(line.cartKey).toBe(`${test.id}:${centers[0].id}`);
    expect(summary.itemCount).toBe(2);
    expect(summary.grandTotal).toBeGreaterThan(summary.subtotal);
  });
});
