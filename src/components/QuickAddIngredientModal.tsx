import IngredientFields from "./IngredientFields";
import { CloseIcon } from "./icons";
import type { Ingredient } from "../types";

interface QuickAddIngredientModalProps {
  onCreated: (ingredient: Ingredient) => void;
  onCancel: () => void;
}

/**
 * Lets the pricing wizard cadastro a new ingredient without leaving the
 * flow, reusing the same IngredientFields form as the /ingredientes pages.
 */
export default function QuickAddIngredientModal({
  onCreated,
  onCancel,
}: QuickAddIngredientModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-sageDark/40 px-4 pb-4 sm:items-center"
    >
      <div className="max-h-[90vh] w-full max-w-[400px] overflow-y-auto rounded-2xl bg-cream p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-sageDark">
            Novo ingrediente
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <IngredientFields onSaved={onCreated} submitLabel="Cadastrar e usar" />
      </div>
    </div>
  );
}
