/**
 * Recursively removes all non-object properties from an object in-place.
 *
 * This function traverses the input object `obj` and deletes all properties
 * that are not plain objects (i.e., primitives, arrays, functions, etc.).
 * If a property is an object, it is recursively purged in the same manner.
 *
 * @template T - The type of the object being purged. The function preserves
 *               the shape of the object, returning the same type.
 * @param {T} obj - The object to purge. Will be mutated in-place.
 * @returns {T} The same object instance, with all non-object properties removed.
 *
 * @example
 * const settings = {
 *   foo: 1,
 *   bar: { nested: 'value', number: 42 },
 *   baz: 'string',
 *   arr: [1, 2, 3]
 * };
 *
 * deepPurge(settings);
 * console.log(settings);
 * // Output: { bar: { } }
 */
export function deepPurge<T extends object>(obj: T): T {
  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      deepPurge(value as object);
    } else {
      delete obj[key];
    }
  }
  return obj;
}