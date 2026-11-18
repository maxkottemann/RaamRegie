import { sortAndFilteritemsCounts } from "@/lib/categories";
import { LocationItemCount } from "@/services/locationService";
import { describe, it, expect } from "vitest";

describe("sortAndFilteritemsCounts", () => {
  const items: LocationItemCount = [
    {
      total_quantity: 24,
      category: "curtain",
      item_count: 1,
    },
    {
      total_quantity: 9,
      category: "chair",
      item_count: 3,
    },
    {
      total_quantity: 1,
      category: "floors",
      item_count: 1,
    },
  ];
  const result = sortAndFilteritemsCounts(items);
  it("Given an array of ItemCounts returns sorted array", () => {
    expect(result).toEqual([
      { total_quantity: 24, item_count: 1, category: "curtain", total: 24 },
      { total_quantity: 9, item_count: 3, category: "chair", total: 9 },
      { total_quantity: 1, item_count: 1, category: "floors", total: 1 },
    ]);
  });

  it("Given an array of ItemCounts returns correct values", () => {
    expect(result).toHaveLength(3);

    expect(result[0].total).toBe(24);
    expect(result[2].total).toBe(1);
  });
});
