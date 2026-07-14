interface StepProductNameProps {
  productName: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

export default function StepProductName({
  productName,
  onChange,
  onNext,
}: StepProductNameProps) {
  return (
    <div className="flex flex-1 flex-col">
      <h2 className="font-display text-xl font-semibold text-sageDark">
        Qual produto você está precificando?
      </h2>
      <input
        type="text"
        value={productName}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ex: Brownie de amêndoas"
        autoFocus
        className="mt-4 rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
      />

      <div className="mt-auto flex gap-3 pt-6">
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-2xl bg-sand/60 py-4 text-base font-semibold text-sageDark active:scale-[0.98]"
        >
          Pular
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-2xl bg-clay py-4 text-base font-semibold text-white active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
