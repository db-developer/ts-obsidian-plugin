// mocks
// (none required; src/test/__mocks__/obsidian.ts is automatically loaded)

// imports
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest } from "obsidian";

/**
 * These tests verify the `onExternalSettingsChange` method:
 * - Calls loadSettings internally
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
    describe("Testing AbstractObsidianPluginWithSettings::onExternalSettingsChange", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string }> {
        protected getDefaultSettings() {
          return { foo: "bar" };
        }

        // spy variable
        loadSettingsCalled = false;
        async loadSettings(): Promise<void> {
          this.loadSettingsCalled = true;
          return;
        }
      }

      test("onExternalSettingsChange calls loadSettings", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        await instance.onExternalSettingsChange();

        expect(instance.loadSettingsCalled).toBe(true);
      });

      test("onExternalSettingsChange returns a Promise<void>", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const promise = instance.onExternalSettingsChange();
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBeUndefined();
      });
    });
  }
);
