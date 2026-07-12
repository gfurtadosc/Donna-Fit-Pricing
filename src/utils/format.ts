export function formatBRLCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatQuantityBR(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

/** Keeps only digits and a single comma, mirroring how pt-BR decimals are typed. */
export function sanitizeDecimalInput(raw: string): string {
  const digitsAndComma = raw.replace(/[^\d,]/g, "");
  const firstComma = digitsAndComma.indexOf(",");
  if (firstComma === -1) return digitsAndComma;

  return (
    digitsAndComma.slice(0, firstComma + 1) +
    digitsAndComma.slice(firstComma + 1).replace(/,/g, "")
  );
}

export function parseDecimalInput(value: string): number {
  if (!value) return NaN;
  return Number(value.replace(",", "."));
}
