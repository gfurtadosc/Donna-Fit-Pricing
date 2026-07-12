import { getItem, setItem } from "../lib/storage";
import type { Settings } from "../types";

const STORAGE_KEY = "settings";

const DEFAULT_SETTINGS: Settings = {
  defaultProfitMarginPercent: 40,
};

export function get(): Settings {
  const existing = getItem<Settings>(STORAGE_KEY);
  if (existing) return existing;

  setItem(STORAGE_KEY, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

export function update(data: Partial<Settings>): Settings {
  const updated: Settings = { ...get(), ...data };
  setItem(STORAGE_KEY, updated);
  return updated;
}
