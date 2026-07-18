import { Link } from "react-router-dom";
import { calculateFinalPricing, calculateRecipeCost } from "../utils/pricing";
import { formatBRLCurrency } from "../utils/format";
import type { Ingredient, Recipe } from "../types";

interface RecipeCardProps {
  recipe: Recipe;
  ingredients: Ingredient[];
}

export default function RecipeCard({ recipe, ingredients }: RecipeCardProps) {
  const totalCost = calculateRecipeCost(recipe.items, ingredients);
  const pricing = calculateFinalPricing(
    totalCost,
    recipe.yieldCount,
    recipe.profitMarginPercent ?? 0,
  );
  const ingredientCount = recipe.items.length;

  return (
    <Link
      to={`/receitas/${recipe.id}`}
      className="block rounded-2xl border border-sand bg-white p-4 shadow-sm active:scale-[0.98]"
    >
      <p className="truncate font-sans text-base font-semibold text-sageDark">
        {recipe.name}
      </p>
      <p className="mt-1 text-sm text-sageDark/70">
        {ingredientCount}{" "}
        {ingredientCount === 1 ? "ingrediente" : "ingredientes"}
      </p>
      <p className="mt-1 text-sm font-semibold text-clay">
        ≈ {formatBRLCurrency(pricing.unitPrice)} / unidade
      </p>
    </Link>
  );
}
