import { describe, expect, it } from "vitest";
import type { Ingredient, RecipeItem } from "../types";
import {
  calculateFinalPricing,
  calculateRecipeCost,
  convertToBaseUnit,
  getIngredientUnitPrice,
} from "./pricing";

function makeIngredient(overrides: Partial<Ingredient>): Ingredient {
  return {
    id: "ingredient-1",
    name: "Farinha de amendoa",
    packagePrice: 25,
    packageQuantity: 500,
    unit: "g",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("convertToBaseUnit", () => {
  it("converts kg to g", () => {
    expect(convertToBaseUnit(2, "kg")).toBe(2000);
  });

  it("converts l to ml", () => {
    expect(convertToBaseUnit(1.5, "l")).toBe(1500);
  });

  it("keeps g, ml and unidade unchanged", () => {
    expect(convertToBaseUnit(300, "g")).toBe(300);
    expect(convertToBaseUnit(250, "ml")).toBe(250);
    expect(convertToBaseUnit(4, "unidade")).toBe(4);
  });
});

describe("getIngredientUnitPrice", () => {
  it("calculates price per gram for a 500g / R$25 package", () => {
    const ingredient = makeIngredient({ packagePrice: 25, packageQuantity: 500, unit: "g" });
    expect(getIngredientUnitPrice(ingredient)).toBeCloseTo(0.05);
  });

  it("converts kg packages to a per-gram price", () => {
    const ingredient = makeIngredient({ packagePrice: 20, packageQuantity: 1, unit: "kg" });
    expect(getIngredientUnitPrice(ingredient)).toBeCloseTo(0.02);
  });

  it("returns 0 when packageQuantity is 0 instead of dividing by zero", () => {
    const ingredient = makeIngredient({ packagePrice: 25, packageQuantity: 0, unit: "g" });
    expect(getIngredientUnitPrice(ingredient)).toBe(0);
  });
});

describe("calculateRecipeCost", () => {
  it("sums the proportional cost of every item in the recipe", () => {
    const ingredients: Ingredient[] = [
      makeIngredient({ id: "flour", packagePrice: 25, packageQuantity: 500, unit: "g" }), // R$0,05/g
      makeIngredient({ id: "sweetener", packagePrice: 12, packageQuantity: 200, unit: "g" }), // R$0,06/g
      makeIngredient({ id: "egg", packagePrice: 15, packageQuantity: 30, unit: "unidade" }), // R$0,50/unidade
    ];
    const items: RecipeItem[] = [
      { ingredientId: "flour", quantityUsed: 200 }, // 200 * 0.05 = 10
      { ingredientId: "sweetener", quantityUsed: 50 }, // 50 * 0.06 = 3
      { ingredientId: "egg", quantityUsed: 2 }, // 2 * 0.50 = 1
    ];

    expect(calculateRecipeCost(items, ingredients)).toBeCloseTo(14);
  });

  it("ignores items referencing an unknown ingredient", () => {
    const ingredients: Ingredient[] = [
      makeIngredient({ id: "flour", packagePrice: 25, packageQuantity: 500, unit: "g" }),
    ];
    const items: RecipeItem[] = [
      { ingredientId: "flour", quantityUsed: 100 }, // 100 * 0.05 = 5
      { ingredientId: "missing", quantityUsed: 999 },
    ];

    expect(calculateRecipeCost(items, ingredients)).toBeCloseTo(5);
  });
});

describe("calculateFinalPricing", () => {
  it("applies the profit margin and divides evenly by the yield", () => {
    const result = calculateFinalPricing(14, 7, 40);

    expect(result.totalCost).toBe(14);
    expect(result.profitAmount).toBeCloseTo(5.6);
    expect(result.totalPrice).toBeCloseTo(19.6);
    expect(result.unitPrice).toBeCloseTo(2.8);
    expect(result.unitPrice * 7).toBeCloseTo(result.totalPrice);
  });

  it("returns unitPrice 0 when yieldCount is 0, avoiding division by zero", () => {
    const result = calculateFinalPricing(14, 0, 40);
    expect(result.unitPrice).toBe(0);
    expect(result.totalPrice).toBeCloseTo(19.6);
  });

  it("handles a negative profit margin without throwing", () => {
    const result = calculateFinalPricing(14, 2, -10);
    expect(result.profitAmount).toBeCloseTo(-1.4);
    expect(result.totalPrice).toBeCloseTo(12.6);
    expect(result.unitPrice).toBeCloseTo(6.3);
  });
});
