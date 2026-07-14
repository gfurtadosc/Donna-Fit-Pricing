import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast";
import * as recipesRepository from "../../repositories/recipesRepository";
import * as ingredientsRepository from "../../repositories/ingredientsRepository";
import { calculateFinalPricing, calculateRecipeCost } from "../../utils/pricing";
import { formatBRLCurrency } from "../../utils/format";
import type { RecipeItem } from "../../types";

interface StepResultProps {
  productName: string;
  items: RecipeItem[];
  yieldCount: number;
  marginPercent: number;
  onRestart: () => void;
}

export default function StepResult({
  productName,
  items,
  yieldCount,
  marginPercent,
  onRestart,
}: StepResultProps) {
  const navigate = useNavigate();
  const ingredients = useMemo(() => ingredientsRepository.getAll(), []);

  const totalCost = useMemo(
    () => calculateRecipeCost(items, ingredients),
    [items, ingredients],
  );
  const pricing = useMemo(
    () => calculateFinalPricing(totalCost, yieldCount, marginPercent),
    [totalCost, yieldCount, marginPercent],
  );

  const [displayName, setDisplayName] = useState(productName);
  const [nameInput, setNameInput] = useState(productName);
  const [askingName, setAskingName] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function persistRecipe(name: string) {
    recipesRepository.create({
      name,
      items,
      yieldCount,
      profitMarginPercent: marginPercent,
    });
    setDisplayName(name);
    setSaved(true);
    setAskingName(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  function handleSaveClick() {
    if (saved) return;
    const trimmed = productName.trim();
    if (!trimmed) {
      setAskingName(true);
      return;
    }
    persistRecipe(trimmed);
  }

  function handleConfirmName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    persistRecipe(trimmed);
  }

  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <p className="text-sm font-medium text-sageDark/70">
        {displayName || "Sua precificação"}
      </p>

      <div className="mt-6 w-full rounded-2xl bg-white p-5 shadow-sm">
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
        <p className="text-sm opacity-90">Preço sugerido por unidade</p>
        <p className="font-display text-4xl font-bold">
          {formatBRLCurrency(pricing.unitPrice)}
        </p>
      </div>

      <div className="mt-6 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={saved}
          className="w-full rounded-2xl bg-sageDark py-4 text-base font-semibold text-white disabled:opacity-50 active:scale-[0.98]"
        >
          {saved ? "Receita salva" : "Salvar como receita"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-2xl bg-sand/60 py-4 text-base font-semibold text-sageDark active:scale-[0.98]"
        >
          Nova Precificação
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2 text-sm font-semibold text-sageDark/70"
        >
          Voltar para o Início
        </button>
      </div>

      {askingName && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-sageDark/40 px-4 pb-4 sm:items-center"
        >
          <form
            onSubmit={handleConfirmName}
            className="w-full max-w-[380px] rounded-2xl bg-cream p-5 shadow-lg"
          >
            <h3 className="font-display text-lg font-semibold text-sageDark">
              Como se chama esse produto?
            </h3>
            <input
              type="text"
              autoFocus
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Ex: Brownie de amêndoas"
              className="mt-3 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setAskingName(false)}
                className="flex-1 rounded-2xl bg-sand/60 py-3 text-sm font-semibold text-sageDark active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="flex-1 rounded-2xl bg-clay py-3 text-sm font-semibold text-white disabled:opacity-40 active:scale-[0.98]"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {showToast && <Toast message="Receita salva" />}
    </div>
  );
}
