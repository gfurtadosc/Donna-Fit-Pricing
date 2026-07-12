import { getItem, setItem } from "../lib/storage";
import type { Ingredient } from "../types";

const STORAGE_KEY = "ingredients";

export type IngredientInput = Omit<Ingredient, "id" | "createdAt" | "updatedAt">;

function readAll(): Ingredient[] {
  return getItem<Ingredient[]>(STORAGE_KEY) ?? [];
}

function writeAll(ingredients: Ingredient[]): void {
  setItem(STORAGE_KEY, ingredients);
}

export function getAll(): Ingredient[] {
  return readAll();
}

export function getById(id: string): Ingredient | null {
  return readAll().find((ingredient) => ingredient.id === id) ?? null;
}

export function create(data: IngredientInput): Ingredient {
  const now = new Date().toISOString();
  const ingredient: Ingredient = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...readAll(), ingredient]);
  return ingredient;
}

export function update(
  id: string,
  data: Partial<IngredientInput>,
): Ingredient | null {
  const all = readAll();
  const index = all.findIndex((ingredient) => ingredient.id === id);
  if (index === -1) return null;

  const updated: Ingredient = {
    ...all[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function remove(id: string): void {
  writeAll(readAll().filter((ingredient) => ingredient.id !== id));
}
