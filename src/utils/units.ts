import type { Unit } from "../types";

export const UNIT_OPTIONS: { value: Unit; label: string }[] = [
  { value: "g", label: "Gramas (g)" },
  { value: "kg", label: "Quilos (kg)" },
  { value: "ml", label: "Mililitros (ml)" },
  { value: "l", label: "Litros (l)" },
  { value: "unidade", label: "Unidade" },
];

export function getUnitAbbreviation(unit: Unit): string {
  switch (unit) {
    case "g":
      return "g";
    case "kg":
      return "kg";
    case "ml":
      return "ml";
    case "l":
      return "L";
    case "unidade":
      return "unidade";
  }
}

/** The unit `getIngredientUnitPrice` prices against: g, ml or unidade. */
export function getBaseUnitAbbreviation(unit: Unit): string {
  switch (unit) {
    case "g":
    case "kg":
      return "g";
    case "ml":
    case "l":
      return "ml";
    case "unidade":
      return "unidade";
  }
}
