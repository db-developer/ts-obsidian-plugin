// mocks
// (none required)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";

import type { App, PluginManifest           } from "obsidian";

/**
 * These tests verify that the constructor of
 * `AbstractObsidianPluginWithSettings` works correctly:
 * - Instantiation via a subclass is possible
 * - App and manifest parameters are accepted
 * - The instance reference is correctly created
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
    describe("Testing AbstractObsidianPluginWithSettings::constructor", () => {

      // Hilfsklasse, weil Abstract-Klassen nicht direkt instanziert werden können
      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }
      }

      test("Constructor should create an instance with app and manifest", () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        expect(instance).toBeDefined();
        expect(instance instanceof AbstractObsidianPluginWithSettings).toBe(true);
      });
    });
  }
);
