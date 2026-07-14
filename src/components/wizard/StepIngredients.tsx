import { useMemo, useState } from "react";
import QuickAddIngredientModal from "../QuickAddIngredientModal";
import { SearchIcon, TrashIcon } from "../icons";
import * as ingredientsRepository from "../../repositories/ingredientsRepository";
import { getIngredientUnitPrice } from "../../utils/pricing";
import {
  formatBRLCurrency,
  formatQuantityBR,
  parseDecimalInput,
  sanitizeDecimalInput,
} from "../../utils/format";
import { getBaseUnitAbbreviation, getUnitAbbreviation } from "../../utils/units";
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
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    ingredientsRepository.getAll(),
  );
  const [query, setQuery] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [quantityInput, setQuantityInput] = useState("");
  const [quantityTouched, setQuantityTouched] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const ingredientById = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ingredient) => map.set(ingredient.id, ingredient));
    return map;
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return ingredients
      .filter((ingredient) =>
        ingredient.name.toLowerCase().includes(normalized),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [ingredients, query]);

  function selectIngredient(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
    setQuantityInput("");
    setQuantityTouched(false);
  }

  function clearSelection() {
    setSelectedIngredient(null);
    setQuantityInput("");
    setQuantityTouched(false);
  }

  function handleIngredientCreated(ingredient: Ingredient) {
    setIngredients(ingredientsRepository.getAll());
    setShowQuickAdd(false);
    selectIngredient(ingredient);
  }

  const quantity = parseDecimalInput(quantityInput);
  const quantityError =
    !quantityInput || !Number.isFinite(quantity) || quantity <= 0
      ? "Digite uma quantidade maior que zero."
      : undefined;

  const canAddItem = Boolean(selectedIngredient) && !quantityError;

  function handleAddItem() {
    setQuantityTouched(true);
    if (!selectedIngredient || quantityError) return;
    onItemsChange([
      ...items,
      { ingredientId: selectedIngredient.id, quantityUsed: quantity },
    ]);
    setQuery("");
    clearSelection();
  }

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

      {selectedIngredient === null ? (
        <>
          <h2 className="font-display text-xl font-semibold text-sageDark">
            Qual ingrediente você usou?
          </h2>

          <div className="relative mt-4">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sageDark/40" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar ingrediente..."
              className="w-full rounded-2xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>

          <div className="mt-3 flex max-h-56 flex-col gap-2 overflow-y-auto">
            {filteredIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                type="button"
                onClick={() => selectIngredient(ingredient)}
                className="flex items-center justify-between rounded-2xl border border-sand bg-white px-4 py-3 text-left active:scale-[0.98]"
              >
                <span className="font-semibold text-sageDark">
                  {ingredient.name}
                </span>
                <span className="text-sm text-clay">
                  {formatBRLCurrency(getIngredientUnitPrice(ingredient))}/
                  {getBaseUnitAbbreviation(ingredient.unit)}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowQuickAdd(true)}
            className="mt-3 rounded-2xl border border-dashed border-clay px-4 py-3 text-center text-sm font-semibold text-clay active:scale-[0.98]"
          >
            Não encontrei — cadastrar novo ingrediente
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-sand/40 px-4 py-3">
            <span className="font-semibold text-sageDark">
              {selectedIngredient.name}
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-sm font-semibold text-clay underline"
            >
              Trocar
            </button>
          </div>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-sm font-medium text-sageDark">
              Quantos {getUnitAbbreviation(selectedIngredient.unit)} de{" "}
              {selectedIngredient.name} você usou?
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoFocus
              value={quantityInput}
              onChange={(event) =>
                setQuantityInput(sanitizeDecimalInput(event.target.value))
              }
              onBlur={() => setQuantityTouched(true)}
              placeholder="Ex: 100"
              className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
            />
            {quantityTouched && quantityError && (
              <span className="text-sm text-red-600">{quantityError}</span>
            )}
          </label>
        </>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={handleAddItem}
          disabled={!canAddItem}
          className="w-full rounded-2xl bg-clay py-4 text-base font-semibold text-white disabled:opacity-40 active:scale-[0.98]"
        >
          Adicionar outro ingrediente
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={items.length === 0}
          className="w-full rounded-2xl bg-sand/60 py-4 text-base font-semibold text-sageDark disabled:opacity-40 active:scale-[0.98]"
        >
          Terminar
        </button>
      </div>

      {showQuickAdd && (
        <QuickAddIngredientModal
          onCreated={handleIngredientCreated}
          onCancel={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
