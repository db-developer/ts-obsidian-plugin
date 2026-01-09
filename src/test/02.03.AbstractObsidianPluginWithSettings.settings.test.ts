// mocks
// (none required)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest           } from "obsidian";

/**
 * These tests verify the `settings` getter of the
 * `AbstractObsidianPluginWithSettings` class:
 * - The getter exists and returns an object
 * - The reference remains stable
 * - Read-only access (cannot be replaced)
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
    describe("Testing AbstractObsidianPluginWithSettings::settings", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }
      }

      test("Getter should return a defined settings object", () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const settings1 = instance.settings;
        const settings2 = instance.settings;

        // settings exist
        expect(settings1).toBeDefined();
        expect(typeof settings1).toBe("object");

        // reference is stable
        expect(settings1).toBe(settings2);

        // cannot replace the settings object (readonly check, semi-formal)
        expect(() => {
          (instance as any).settings = { foo: "baz" };
        }).toThrow();
      });

      test("Properties of settings can be modified", () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        // Initialize settings manually for the test
        (instance as any)._settings = instance.getDefaultSettings();

        // Initial value
        expect(instance.settings.foo).toBe("bar");

        // Modify property
        instance.settings.foo = "baz";

        // Check that change is reflected
        expect(instance.settings.foo).toBe("baz");
      });
    });
  }
);
