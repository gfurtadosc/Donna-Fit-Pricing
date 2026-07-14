import { useState } from "react";
import { parseDecimalInput, sanitizeDecimalInput } from "../../utils/format";

interface StepYieldProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function StepYield({ value, onChange, onNext }: StepYieldProps) {
  const [touched, setTouched] = useState(false);
  const parsed = parseDecimalInput(value);
  const error =
    !value || !Number.isFinite(parsed) || parsed <= 0
      ? "Digite uma quantidade maior que zero."
      : undefined;

  function handleNext() {
    setTouched(true);
    if (error) return;
    onNext();
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="font-display text-xl font-semibold text-sageDark">
        Quantas unidades ou porções essa receita rende?
      </h2>
      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-sageDark">Rendimento</span>
        <input
          type="text"
          inputMode="decimal"
          autoFocus
          value={value}
          onChange={(event) => onChange(sanitizeDecimalInput(event.target.value))}
          onBlur={() => setTouched(true)}
          placeholder="Ex: 20"
          className="rounded-2xl border border-sand bg-white px-4 py-3 text-sageDark placeholder:text-sageDark/40 focus:outline-none focus:ring-2 focus:ring-sage"
        />
        {touched && error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </label>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-2xl bg-clay py-4 text-base font-semibold text-white active:scale-[0.98]"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
