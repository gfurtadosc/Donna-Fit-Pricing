import { useState } from "react";
import { parseDecimalInput, sanitizeDecimalInput } from "../../utils/format";

interface StepMarginProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function StepMargin({ value, onChange, onNext }: StepMarginProps) {
  const [touched, setTouched] = useState(false);
  const parsed = parseDecimalInput(value);
  const error =
    !value || !Number.isFinite(parsed)
      ? "Digite uma margem de lucro válida."
      : undefined;

  function handleNext() {
    setTouched(true);
    if (error) return;
    onNext();
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="font-display text-xl font-semibold text-sageDark">
        Qual margem de lucro você quer aplicar?
      </h2>
      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-sageDark">
          Margem de lucro (%)
        </span>
        <div className="flex items-center rounded-2xl border border-sand bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-sage">
          <input
            type="text"
            inputMode="decimal"
            autoFocus
            value={value}
            onChange={(event) => onChange(sanitizeDecimalInput(event.target.value))}
            onBlur={() => setTouched(true)}
            placeholder="Ex: 40"
            className="w-full bg-transparent text-sageDark outline-none"
          />
          <span className="ml-1 text-sageDark/60">%</span>
        </div>
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
