import { useMemo, useState, type FormEvent } from "react";
import CurrencyInput from "./CurrencyInput";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import { getIngredientUnitPrice } from "../utils/pricing";
import {
  formatBRLCurrency,
  parseDecimalInput,
  sanitizeDecimalInput,
} from "../utils/format";
import { UNIT_OPTIONS, getBaseUnitAbbreviation } from "../utils/units";
import type { Ingredient, Unit } from "../types";

interface TouchedFields {
  name?: boolean;
  price?: boolean;
  quantity?: boolean;
}

interface IngredientFieldsProps {
  /** When provided, the form edits this ingredient instead of creating a new one. */
  ingredient?: Ingredient;
  onSaved: (ingredient: Ingredient) => void;
  submitLabel?: string;
}

/**
 * Shared create/edit form for an Ingredient. Used both as the full
 * /ingredientes/novo|:id/editar page and inside the quick-add modal opened
 * from the pricing wizard, so the cadastro logic only lives in one place.
 */
export default function IngredientFields({
  ingredient,
  onSaved,
  submitLabel = "Salvar",
}: IngredientFieldsProps) {
  const [name, setName] = useState(ingredient?.name ?? "");
  const [price, setPrice] = useState(ingredient?.packagePrice ?? 0);
  const [quantityInput, setQuantityInput] = useState(
    ingredient ? String(ingredient.packageQuantity).replace(".", ",") : "",
  );
  const [unit, setUnit] = useState<Unit>(ingredient?.unit ?? "g");
  const [touched, setTouched] = useState<TouchedFields>({});

  const quantity = parseDecimalInput(quantityInput);

  const errors = {
    name: !name.trim() ? "Digite o nome do ingrediente." : undefined,
    price: price <= 0 ? "Digite um preço maior que zero." : undefined,
    quantity:
      !quantityInput || !Number.isFinite(quantity) || quantity <= 0
        ? "Digite uma quantidade maior que zero."
        : undefined,
  };

  const isValid = !errors.name && !errors.price && !errors.quantity;

  const previewUnitPrice = useMemo(() => {
    if (price <= 0 || !Number.isFinite(quantity) || quantity <= 0) return null;
    return getIngredientUnitPrice({
      id: "preview",
      name: "",
      packagePrice: price,
      packageQuantity: quantity,
      unit,
      createdAt: "",
      updatedAt: "",
    });
  }, [price, quantity, unit]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, price: true, quantity: true });
    if (!isValid) return;

    const data = {
      name: name.trim(),
      packagePrice: price,
      packageQuantity: quantity,
      unit,
    };

    const saved = ingredient
      ? ingredientsRepository.update(ingredient.id, data)
      : ingredientsRepository.create(data);

    if (saved) onSaved(saved);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-sageDark">
          Nome do ingrediente
        </span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Ex: Farinha de amêndoas"
          className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
        />
        {touched.name && errors.name && (
          <span className="text-sm text-red-600">{errors.name}</span>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-sageDark">
          Preço pago pela embalagem
        </span>
        <CurrencyInput
          value={price}
          onChange={setPrice}
          onBlur={() => setTouched((t) => ({ ...t, price: true }))}
          className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark focus:outline-none focus:ring-2 focus:ring-sage"
        />
        {touched.price && errors.price && (
          <span className="text-sm text-red-600">{errors.price}</span>
        )}
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-sageDark">
            Quantidade da embalagem
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={quantityInput}
            onChange={(event) =>
              setQuantityInput(sanitizeDecimalInput(event.target.value))
            }
            onBlur={() => setTouched((t) => ({ ...t, quantity: true }))}
            placeholder="Ex: 500"
            className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
          />
          {touched.quantity && errors.quantity && (
            <span className="text-sm text-red-600">{errors.quantity}</span>
          )}
        </label>

        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-sageDark">Unidade</span>
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as Unit)}
            className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark focus:outline-none focus:ring-2 focus:ring-sage"
          >
            {UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-sand/40 px-4 py-3 text-sm text-sageDark">
        {previewUnitPrice !== null
          ? `Isso equivale a ${formatBRLCurrency(previewUnitPrice)} por ${getBaseUnitAbbreviation(unit)}`
          : "Preencha o preço e a quantidade para ver o valor por unidade."}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 rounded-2xl bg-clay py-4 text-base font-semibold text-white transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
      >
        {submitLabel}
      </button>
    </form>
  );
}
