const STORAGE_PREFIX = "donnafit_";
const SCHEMA_VERSION_KEY = "schema_version";
export const CURRENT_SCHEMA_VERSION = 1;

function buildKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read "${key}" from storage`, error);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write "${key}" to storage`, error);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(buildKey(key));
  } catch (error) {
    console.error(`Failed to remove "${key}" from storage`, error);
  }
}

/**
 * Ensures a schema version marker exists in storage so future data-shape
 * migrations have something to check against before touching saved records.
 */
export function ensureSchemaVersion(): void {
  const current = getItem<number>(SCHEMA_VERSION_KEY);
  if (current === null) {
    setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
  }
}

ensureSchemaVersion();
