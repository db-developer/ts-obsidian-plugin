// mocks
// (none required; src/test/__mocks__/obsidian.ts wird automatisch geladen)

// imports
import   path                                 from "node:path";
import { fileURLToPath                      } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest           } from "obsidian";

/**
 * These tests verify the `saveData` method:
 * - It acts as a wrapper around `Plugin.saveData`
 * - The method is callable
 * - The Promise is correctly returned
 * - Data is forwarded
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
    describe("Testing AbstractObsidianPluginWithSettings::saveData", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }
      }

      test("saveData should be callable and return a Promise", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const testData = { hello: "world" };

        const promise = instance.saveData(testData);

        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBeUndefined();
      });
    });
  }
);
