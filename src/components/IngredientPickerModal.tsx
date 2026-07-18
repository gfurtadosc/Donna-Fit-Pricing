import IngredientPicker from "./IngredientPicker";
import { CloseIcon } from "./icons";
import type { RecipeItem } from "../types";

interface IngredientPickerModalProps {
  title: string;
  addButtonLabel?: string;
  onAdd: (item: RecipeItem) => void;
  onClose: () => void;
}

/** Bottom-sheet wrapper around IngredientPicker, reused to add or replace a recipe item. */
export default function IngredientPickerModal({
  title,
  addButtonLabel,
  onAdd,
  onClose,
}: IngredientPickerModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-sageDark/40 px-4 pb-4 sm:items-center"
    >
      <div className="max-h-[90vh] w-full max-w-[400px] overflow-y-auto rounded-2xl bg-cream p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-sageDark">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full bg-sand/60 text-sageDark active:scale-95"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <IngredientPicker
          onAdd={(item) => {
            onAdd(item);
            onClose();
          }}
          addButtonLabel={addButtonLabel}
          title=""
        />
      </div>
    </div>
  );
}
