import { getIngredientUnitPrice } from "../utils/pricing";
import { formatBRLCurrency, formatQuantityBR } from "../utils/format";
import { getBaseUnitAbbreviation, getUnitAbbreviation } from "../utils/units";
import { EditIcon, TrashIcon } from "./icons";
import type { Ingredient } from "../types";

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: () => void;
  onDelete: () => void;
}

export default function IngredientCard({
  ingredient,
  onEdit,
  onDelete,
}: IngredientCardProps) {
  const unitPrice = getIngredientUnitPrice(ingredient);

  return (
    <div className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-sans text-base font-semibold text-sageDark">
            {ingredient.name}
          </p>
          <p className="mt-1 text-sm text-sageDark/70">
            {formatBRLCurrency(ingredient.packagePrice)} /{" "}
            {formatQuantityBR(ingredient.packageQuantity)}{" "}
            {getUnitAbbreviation(ingredient.unit)}
          </p>
          <p className="mt-1 text-sm font-semibold text-clay">
            ≈ {formatBRLCurrency(unitPrice)}/
            {getBaseUnitAbbreviation(ingredient.unit)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label={`Editar ${ingredient.name}`}
            onClick={onEdit}
            className="grid h-9 w-9 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Excluir ${ingredient.name}`}
            onClick={onDelete}
            className="grid h-9 w-9 place-items-center rounded-full bg-sand/60 text-clay active:scale-95"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
