import { useMemo, useState } from "react";
import QuickAddIngredientModal from "./QuickAddIngredientModal";
import { SearchIcon } from "./icons";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import { getIngredientUnitPrice } from "../utils/pricing";
import {
  formatBRLCurrency,
  parseDecimalInput,
  sanitizeDecimalInput,
} from "../utils/format";
import { getBaseUnitAbbreviation, getUnitAbbreviation } from "../utils/units";
import type { Ingredient, RecipeItem } from "../types";

interface IngredientPickerProps {
  onAdd: (item: RecipeItem) => void;
  addButtonLabel?: string;
  title?: string;
}

/**
 * Search/select/quantity flow for adding a recipe item, shared by the
 * pricing wizard and by "Minhas Receitas" so both add ingredients the
 * same way.
 */
export default function IngredientPicker({
  onAdd,
  addButtonLabel = "Adicionar ingrediente",
  title = "Qual ingrediente você usou?",
}: IngredientPickerProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() =>
    ingredientsRepository.getAll(),
  );
  const [query, setQuery] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [quantityInput, setQuantityInput] = useState("");
  const [quantityTouched, setQuantityTouched] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

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

  const canAdd = Boolean(selectedIngredient) && !quantityError;

  function handleAdd() {
    setQuantityTouched(true);
    if (!selectedIngredient || quantityError) return;
    onAdd({ ingredientId: selectedIngredient.id, quantityUsed: quantity });
    setQuery("");
    clearSelection();
  }

  return (
    <div className="flex flex-col">
      {selectedIngredient === null ? (
        <>
          {title && (
            <h2 className="font-display text-xl font-semibold text-sageDark">
              {title}
            </h2>
          )}

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

      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className="mt-4 w-full rounded-2xl bg-clay py-4 text-base font-semibold text-white disabled:opacity-40 active:scale-[0.98]"
      >
        {addButtonLabel}
      </button>

      {showQuickAdd && (
        <QuickAddIngredientModal
          onCreated={handleIngredientCreated}
          onCancel={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
