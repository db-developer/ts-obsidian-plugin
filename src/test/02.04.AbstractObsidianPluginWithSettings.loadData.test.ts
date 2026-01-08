// mocks
// (none required; src/test/__mocks__/obsidian.ts wird automatisch geladen)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest           } from "obsidian";

/**
 * These tests verify the `loadData` method:
 * - It acts as a wrapper around `Plugin.loadData`
 * - The return value is correctly forwarded
 * - The method returns a Promise
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
    describe("Testing AbstractObsidianPluginWithSettings::loadData", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }
      }

      test("loadData should return the value from super.loadData", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        // super.loadData in mock gibt standardmäßig null zurück
        const result = await instance.loadData();

        expect(result).toBeNull();
        expect(result).not.toBeUndefined();
      });

      test("loadData returns a Promise", () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const promise = instance.loadData();
        expect(promise).toBeInstanceOf(Promise);
      });
    });
  }
);
