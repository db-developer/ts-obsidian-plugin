// mocks
// (none required)

// imports
import   path            from "node:path";
import { fileURLToPath } from "node:url";
import { deepPurge     } from "../lib/internals";

describe(
  `Running ${
    (fileURLToPath(import.meta.url)
      .split(path.sep)
      .join("/")
      .split("/test/")[1] ||
      fileURLToPath(import.meta.url))
  }`,
  () => {
    describe("Testing deepPurge (spec)", () => {
      test("SPEC: plain object properties are preserved while their contents are cleared", () => {
        const obj = {
          primitive: 1,
          nested: {
            a: 1,
            b: 2,
          },
        };

        const nestedRef = obj.nested;

        deepPurge(obj);

        // primitive values are removed entirely
        expect("primitive" in obj).toBe(false);

        // plain object property itself is preserved
        expect("nested" in obj).toBe(true);

        // reference to nested object is preserved
        expect(obj.nested).toBe(nestedRef);

        // nested object contents are fully cleared
        expect(Object.keys(obj.nested)).toHaveLength(0);
      });
    });

    describe("Testing deepPurge", () => {
      test("removes all properties while preserving the original object reference", () => {
        const obj = {
          a: 1,
          b: "test",
          c: true,
        };

        const ref = obj;
        const result = deepPurge(obj);

        // reference stability
        expect(result).toBe(ref);

        // all properties removed
        expect(Object.keys(result)).toHaveLength(0);
      });

      test("recursively purges nested objects while preserving nested object references", () => {
        const nested = {
          x: 1,
          y: {
            z: 2,
          },
        };

        const innerRef = nested.y;
        deepPurge(nested);

        // primitive properties removed
        expect("x" in nested).toBe(false);

        // nested object property preserved
        expect("y" in nested).toBe(true);

        // nested object reference preserved
        expect(nested.y).toBe(innerRef);

        // nested object cleared
        expect(Object.keys(innerRef)).toHaveLength(0);
      });

      test("removes arrays entirely instead of recursing into them", () => {
        const obj = {
          arr: [1, 2, 3],
        };

        deepPurge(obj);

        expect("arr" in obj).toBe(false);
      });

      test("handles empty objects without modification", () => {
        const obj: Record<string, unknown> = {};
        const ref = obj;

        deepPurge(obj);

        expect(obj).toBe(ref);
        expect(Object.keys(obj)).toHaveLength(0);
      });

      test("handles deeply nested mixed structures", () => {
        const obj = {
          a: {
            b: {
              c: 1,
            },
          },
          d: [1, 2],
          e: "value",
        };

        const aRef = obj.a;
        const bRef = obj.a.b;

        deepPurge(obj);

        // primitive and array properties removed
        expect("d" in obj).toBe(false);
        expect("e" in obj).toBe(false);

        // plain object property preserved
        expect("a" in obj).toBe(true);

        // references preserved
        expect(obj.a).toBe(aRef);
        expect(obj.a.b).toBe(bRef);

        // nested contents cleared
        expect(Object.keys(aRef)).toHaveLength(1); // contains only "b"
        expect(Object.keys(bRef)).toHaveLength(0);
      });
    });
  }
);
