import type { ChangeEvent, FocusEventHandler } from "react";

interface CurrencyInputProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  className?: string;
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * A masked money input: the user only ever types digits, and the field
 * reformats itself as Brazilian currency on every keystroke (like a cash
 * register), which prevents typos like a stray dot/comma turning R$25,00
 * into R$2.500,00 for a non-technical user.
 */
export default function CurrencyInput({
  id,
  value,
  onChange,
  onBlur,
  className,
}: CurrencyInputProps) {
  const cents = Math.round(value * 100);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    const nextCents = digitsOnly ? parseInt(digitsOnly, 10) : 0;
    onChange(nextCents / 100);
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={formatCents(cents)}
      onChange={handleChange}
      onBlur={onBlur}
      className={className}
    />
  );
}
