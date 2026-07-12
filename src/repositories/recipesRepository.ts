import { getItem, setItem } from "../lib/storage";
import type { Recipe } from "../types";

const STORAGE_KEY = "recipes";

export type RecipeInput = Omit<Recipe, "id" | "createdAt" | "updatedAt">;

function readAll(): Recipe[] {
  return getItem<Recipe[]>(STORAGE_KEY) ?? [];
}

function writeAll(recipes: Recipe[]): void {
  setItem(STORAGE_KEY, recipes);
}

export function getAll(): Recipe[] {
  return readAll();
}

export function getById(id: string): Recipe | null {
  return readAll().find((recipe) => recipe.id === id) ?? null;
}

export function create(data: RecipeInput): Recipe {
  const now = new Date().toISOString();
  const recipe: Recipe = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...readAll(), recipe]);
  return recipe;
}

export function update(id: string, data: Partial<RecipeInput>): Recipe | null {
  const all = readAll();
  const index = all.findIndex((recipe) => recipe.id === id);
  if (index === -1) return null;

  const updated: Recipe = {
    ...all[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function remove(id: string): void {
  writeAll(readAll().filter((recipe) => recipe.id !== id));
}
