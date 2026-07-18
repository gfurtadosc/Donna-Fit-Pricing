import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import IngredientPickerModal from "../components/IngredientPickerModal";
import { BackIcon, TrashIcon } from "../components/icons";
import * as recipesRepository from "../repositories/recipesRepository";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import {
  calculateFinalPricing,
  calculateRecipeCost,
  getIngredientUnitPrice,
} from "../utils/pricing";
import {
  formatBRLCurrency,
  formatQuantityBR,
  parseDecimalInput,
  sanitizeDecimalInput,
} from "../utils/format";
import { getUnitAbbreviation } from "../utils/units";
import type { Ingredient, Recipe, RecipeItem } from "../types";

type PickerState = { mode: "add" } | { mode: "replace"; index: number } | null;

export default function ReceitaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<RecipeItem[]>([]);
  const [yieldInput, setYieldInput] = useState("");
  const [marginInput, setMarginInput] = useState("");
  const [pickerState, setPickerState] = useState<PickerState>(null);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = recipesRepository.getById(id);
    setRecipe(existing);
    if (existing) {
      setItems(existing.items);
      setYieldInput(String(existing.yieldCount).replace(".", ","));
      setMarginInput(
        String(existing.profitMarginPercent ?? 0).replace(".", ","),
      );
    }
    setIngredients(ingredientsRepository.getAll());
  }, [id]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const ingredientById = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ingredient) => map.set(ingredient.id, ingredient));
    return map;
  }, [ingredients]);

  const yieldCount = parseDecimalInput(yieldInput);
  const marginPercent = parseDecimalInput(marginInput);
  const safeYieldCount = Number.isFinite(yieldCount) ? yieldCount : 0;
  const safeMarginPercent = Number.isFinite(marginPercent) ? marginPercent : 0;

  const totalCost = useMemo(
    () => calculateRecipeCost(items, ingredients),
    [items, ingredients],
  );
  const pricing = useMemo(
    () => calculateFinalPricing(totalCost, safeYieldCount, safeMarginPercent),
    [totalCost, safeYieldCount, safeMarginPercent],
  );

  function handleRemoveItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function handlePickerAdd(item: RecipeItem) {
    if (pickerState?.mode === "replace") {
      const replaceIndex = pickerState.index;
      setItems((current) =>
        current.map((existing, i) => (i === replaceIndex ? item : existing)),
      );
    } else {
      setItems((current) => [...current, item]);
    }
    setIngredients(ingredientsRepository.getAll());
  }

  function handleSave() {
    if (!id) return;
    recipesRepository.update(id, {
      items,
      yieldCount: safeYieldCount,
      profitMarginPercent: safeMarginPercent,
    });
    setToastMessage("Receita atualizada");
  }

  function handleConfirmDelete() {
    if (!id) return;
    recipesRepository.remove(id);
    navigate("/receitas", { state: { toast: "Receita excluída" } });
  }

  function handleDuplicate() {
    if (!recipe) return;
    navigate("/precificar", {
      state: {
        initialProductName: `${recipe.name} (cópia)`,
        initialItems: items,
        initialYieldCount: safeYieldCount,
        initialMarginPercent: safeMarginPercent,
      },
    });
  }

  if (recipe === undefined) {
    return <Layout>{null}</Layout>;
  }

  if (recipe === null) {
    return (
      <Layout>
        <p className="text-sageDark">Receita não encontrada.</p>
        <Link
          to="/receitas"
          className="mt-4 inline-block font-semibold text-clay underline"
        >
          Voltar para a lista
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/receitas"
          aria-label="Voltar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
        >
          <BackIcon className="h-5 w-5" />
        </Link>
        <h2 className="truncate font-display text-xl font-semibold text-sageDark">
          {recipe.name}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => {
          const ingredient = ingredientById.get(item.ingredientId);

          if (!ingredient) {
            return (
              <div
                key={`${item.ingredientId}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-clay bg-white px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => setPickerState({ mode: "replace", index })}
                  className="min-w-0 flex-1 text-left text-sm font-semibold text-clay"
                >
                  Ingrediente removido — toque para substituir
                </button>
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
          }

          const itemCost = getIngredientUnitPrice(ingredient) * item.quantityUsed;

          return (
            <div
              key={`${item.ingredientId}-${index}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-sand bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-sageDark">
                  {ingredient.name}
                </p>
                <p className="text-xs text-sageDark/60">
                  {formatQuantityBR(item.quantityUsed)}{" "}
                  {getUnitAbbreviation(ingredient.unit)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-semibold text-sageDark">
                  {formatBRLCurrency(itemCost)}
                </span>
                <button
                  type="button"
                  aria-label="Remover item"
                  onClick={() => handleRemoveItem(index)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-sand/60 text-clay active:scale-95"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setPickerState({ mode: "add" })}
        className="mt-3 rounded-2xl border border-dashed border-clay px-4 py-3 text-center text-sm font-semibold text-clay active:scale-[0.98]"
      >
        + Adicionar ingrediente
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-sageDark">
            Rendimento
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={yieldInput}
            onChange={(event) =>
              setYieldInput(sanitizeDecimalInput(event.target.value))
            }
            className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark focus:outline-none focus:ring-2 focus:ring-sage"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-sageDark">
            Margem (%)
          </span>
          <div className="flex items-center rounded-2xl border border-sand bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-sage">
            <input
              type="text"
              inputMode="decimal"
              value={marginInput}
              onChange={(event) =>
                setMarginInput(sanitizeDecimalInput(event.target.value))
              }
              className="w-full bg-transparent text-sageDark outline-none"
            />
            <span className="ml-1 text-sageDark/60">%</span>
          </div>
        </label>
      </div>

      <div className="mt-5 w-full rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex justify-between text-sm text-sageDark/70">
          <span>Custo total dos ingredientes</span>
          <span className="font-semibold text-sageDark">
            {formatBRLCurrency(pricing.totalCost)}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-sageDark/70">
          <span>Lucro</span>
          <span className="font-semibold text-sageDark">
            {formatBRLCurrency(pricing.profitAmount)}
          </span>
        </div>
        <div className="mt-3 border-t border-sand pt-3">
          <p className="text-sm text-sageDark/70">Preço total do lote</p>
          <p className="font-display text-2xl font-semibold text-sageDark">
            {formatBRLCurrency(pricing.totalPrice)}
          </p>
        </div>
      </div>

      <div className="mt-4 w-full rounded-2xl bg-clay px-5 py-6 text-white shadow-sm">
        <p className="text-sm opacity-90">Preço por unidade</p>
        <p className="font-display text-4xl font-bold">
          {formatBRLCurrency(pricing.unitPrice)}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-2xl bg-sageDark py-4 text-base font-semibold text-white active:scale-[0.98]"
        >
          Salvar alterações
        </button>
        <button
          type="button"
          onClick={handleDuplicate}
          className="w-full rounded-2xl bg-sand/60 py-4 text-base font-semibold text-sageDark active:scale-[0.98]"
        >
          Duplicar como nova precificação
        </button>
        <button
          type="button"
          onClick={() => setPendingDelete(true)}
          className="w-full py-2 text-sm font-semibold text-clay"
        >
          Excluir receita
        </button>
      </div>

      {pickerState && (
        <IngredientPickerModal
          title={
            pickerState.mode === "replace"
              ? "Substituir ingrediente"
              : "Adicionar ingrediente"
          }
          addButtonLabel={
            pickerState.mode === "replace" ? "Substituir" : "Adicionar ingrediente"
          }
          onAdd={handlePickerAdd}
          onClose={() => setPickerState(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Excluir ${recipe.name}?`}
          description="Essa ação não pode ser desfeita."
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(false)}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </Layout>
  );
}
