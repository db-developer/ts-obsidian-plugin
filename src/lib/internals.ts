/**
 * Recursively removes all properties from an object while preserving its reference.
 * Nested objects are also cleared, whereas arrays and primitive values are deleted.
 */
export function deepPurge(obj: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      deepPurge(value as Record<string, unknown>);
    } else {
      delete obj[key];
    }
  }
  return obj;
}