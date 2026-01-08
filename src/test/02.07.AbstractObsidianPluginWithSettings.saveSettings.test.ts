// mocks
// (none required; src/test/__mocks__/obsidian.ts is automatically loaded)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest           } from "obsidian";

/**
 * These tests verify the `saveSettings` method:
 * - Persists the current in-memory settings object via saveData
 * - Returns a Promise<void>
 * - Method is callable
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
    describe("Testing AbstractObsidianPluginWithSettings::saveSettings", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }
      }

      test("saveSettings calls saveData with the current settings", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        // Spy on saveData
        let capturedData: unknown = null;
        instance.saveData = async (data: unknown) => {
          capturedData = data;
        };

        await instance.saveSettings();

        expect(capturedData).toBe(instance.settings);
      });

      test("saveSettings returns a Promise<void>", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const promise = instance.saveSettings();
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBeUndefined();
      });
    });
  }
);
