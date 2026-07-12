interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-sageDark/40 px-6 pb-8"
    >
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-5 shadow-lg">
        <h3 className="font-display text-lg font-semibold text-sageDark">
          {title}
        </h3>
        <p className="mt-2 text-sm text-sageDark/80">{description}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-sand/60 py-3 text-sm font-semibold text-sageDark active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-clay py-3 text-sm font-semibold text-white active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
