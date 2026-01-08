// mocks
// (none required)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";

/**
 * These tests only verify that the
 * `AbstractObsidianPluginWithSettings` class
 * is correctly exported and importable. No functionality is tested.
 */
describe(
  `Running ${
    (fileURLToPath(import.meta.url)
      .split(path.sep)
      .join("/")
      .split("/test/")[1] ||
      fileURLToPath(import.meta.url))
  }`,
  () => {
    describe("Testing AbstractObsidianPluginWithSettings", () => {
      test("Class should be defined and importable", () => {
        expect(AbstractObsidianPluginWithSettings).toBeDefined();
        expect(typeof AbstractObsidianPluginWithSettings).toBe("function");
      });
    });
  }
);
