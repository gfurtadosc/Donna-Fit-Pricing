import type { Ingredient, RecipeItem, Unit } from "../types";

export interface FinalPricing {
  totalCost: number;
  totalPrice: number;
  unitPrice: number;
  profitAmount: number;
}

/**
 * Normalizes a quantity to its base unit: kg -> g, l -> ml.
 * "g", "ml" and "unidade" are already base units and pass through unchanged.
 */
export function convertToBaseUnit(quantity: number, unit: Unit): number {
  switch (unit) {
    case "kg":
      return quantity * 1000;
    case "l":
      return quantity * 1000;
    case "g":
    case "ml":
    case "unidade":
      return quantity;
  }
}

/**
 * Price per base unit (gram, milliliter or "unidade") for a given ingredient,
 * derived from what was paid for the whole package.
 */
export function getIngredientUnitPrice(ingredient: Ingredient): number {
  const baseQuantity = convertToBaseUnit(
    ingredient.packageQuantity,
    ingredient.unit,
  );
  if (baseQuantity <= 0) return 0;
  return ingredient.packagePrice / baseQuantity;
}

/**
 * Sums the proportional cost of every recipe item. `quantityUsed` is expected
 * to already be expressed in the ingredient's base unit (g, ml or unidade).
 * Items referencing an unknown ingredient contribute zero cost.
 */
export function calculateRecipeCost(
  items: RecipeItem[],
  ingredients: Ingredient[],
): number {
  return items.reduce((total, item) => {
    const ingredient = ingredients.find((i) => i.id === item.ingredientId);
    if (!ingredient) return total;
    return total + getIngredientUnitPrice(ingredient) * item.quantityUsed;
  }, 0);
}

/**
 * Applies the profit margin over the total cost and splits the result across
 * the recipe's yield. `yieldCount <= 0` short-circuits `unitPrice` to 0 to
 * avoid division by zero.
 */
export function calculateFinalPricing(
  totalCost: number,
  yieldCount: number,
  profitMarginPercent: number,
): FinalPricing {
  const profitAmount = totalCost * (profitMarginPercent / 100);
  const totalPrice = totalCost + profitAmount;
  const unitPrice = yieldCount > 0 ? totalPrice / yieldCount : 0;

  return { totalCost, totalPrice, unitPrice, profitAmount };
}
