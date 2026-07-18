import { useMemo } from "react";
import IngredientPicker from "../IngredientPicker";
import { TrashIcon } from "../icons";
import * as ingredientsRepository from "../../repositories/ingredientsRepository";
import { formatQuantityBR } from "../../utils/format";
import { getUnitAbbreviation } from "../../utils/units";
import type { Ingredient, RecipeItem } from "../../types";

interface StepIngredientsProps {
  items: RecipeItem[];
  onItemsChange: (items: RecipeItem[]) => void;
  onNext: () => void;
}

export default function StepIngredients({
  items,
  onItemsChange,
  onNext,
}: StepIngredientsProps) {
  // Read on every render (cheap sync localStorage access) so an ingredient
  // created via quick-add shows up in the list right after it is used.
  const ingredients: Ingredient[] = ingredientsRepository.getAll();

  const ingredientById = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ingredient) => map.set(ingredient.id, ingredient));
    return map;
  }, [ingredients]);

  function handleRemoveItem(index: number) {
    onItemsChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-1 flex-col">
      {items.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {items.map((item, index) => {
            const ingredient = ingredientById.get(item.ingredientId);
            return (
              <div
                key={`${item.ingredientId}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-sageDark">
                    {ingredient?.name ?? "Ingrediente removido"}
                  </p>
                  <p className="text-xs text-sageDark/60">
                    {formatQuantityBR(item.quantityUsed)}{" "}
                    {ingredient ? getUnitAbbreviation(ingredient.unit) : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remover item"
                  onClick={() => handleRemoveItem(index)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand/60 text-clay active:scale-95"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <IngredientPicker
        onAdd={(item) => onItemsChange([...items, item])}
        addButtonLabel="Adicionar outro ingrediente"
      />

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={items.length === 0}
          className="w-full rounded-2xl bg-sand/60 py-4 text-base font-semibold text-sageDark disabled:opacity-40 active:scale-[0.98]"
        >
          Terminar
        </button>
      </div>
    </div>
  );
}
