export type Unit = "g" | "kg" | "ml" | "l" | "unidade";

export interface Ingredient {
  id: string;
  name: string;
  packagePrice: number;
  packageQuantity: number;
  unit: Unit;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantityUsed: number;
}

export interface Recipe {
  id: string;
  name: string;
  items: RecipeItem[];
  yieldCount: number;
  profitMarginPercent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  defaultProfitMarginPercent: number;
}
