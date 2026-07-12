import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import CurrencyInput from "../components/CurrencyInput";
import { BackIcon } from "../components/icons";
import * as ingredientsRepository from "../repositories/ingredientsRepository";
import { getIngredientUnitPrice } from "../utils/pricing";
import {
  formatBRLCurrency,
  parseDecimalInput,
  sanitizeDecimalInput,
} from "../utils/format";
import { UNIT_OPTIONS, getBaseUnitAbbreviation } from "../utils/units";
import type { Unit } from "../types";

interface TouchedFields {
  name?: boolean;
  price?: boolean;
  quantity?: boolean;
}

export default function IngredienteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantityInput, setQuantityInput] = useState("");
  const [unit, setUnit] = useState<Unit>("g");
  const [touched, setTouched] = useState<TouchedFields>({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const existing = ingredientsRepository.getById(id);
    if (!existing) {
      setNotFound(true);
      return;
    }
    setName(existing.name);
    setPrice(existing.packagePrice);
    setQuantityInput(String(existing.packageQuantity).replace(".", ","));
    setUnit(existing.unit);
  }, [id]);

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

    if (id) {
      ingredientsRepository.update(id, data);
    } else {
      ingredientsRepository.create(data);
    }

    navigate("/ingredientes", { state: { toast: "Ingrediente salvo" } });
  }

  if (notFound) {
    return (
      <Layout>
        <p className="text-sageDark">Ingrediente não encontrado.</p>
        <Link
          to="/ingredientes"
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
          to="/ingredientes"
          aria-label="Voltar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
        >
          <BackIcon className="h-5 w-5" />
        </Link>
        <h2 className="font-display text-xl font-semibold text-sageDark">
          {isEditing ? "Editar ingrediente" : "Novo ingrediente"}
        </h2>
      </div>

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
          Salvar
        </button>
      </form>
    </Layout>
  );
}
