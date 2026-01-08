// mocks
// (none required; src/test/__mocks__/obsidian.ts is automatically loaded)

// imports
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AbstractObsidianPluginWithSettings } from "../lib/AbstractObsidianPluginWithSettings";
import type { App, PluginManifest } from "obsidian";

/**
 * These tests verify the `loadSettings` method:
 * - Existing in-memory settings object is purged but reference is preserved
 * - Default settings are applied
 * - Persisted data from loadData overrides defaults
 * - Returns a Promise<void>
 * - Test fallback to empty object when loadData() returns null or non-object.
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
    describe("Testing AbstractObsidianPluginWithSettings::loadSettings", () => {

      const defaultSettings = { a: 1, b: 2 };

      class TestPlugin extends AbstractObsidianPluginWithSettings<typeof defaultSettings> {
        protected getDefaultSettings() {
          return { ...defaultSettings };
        }

        // override loadData to simulate persisted settings
        async loadData(): Promise<unknown> {
          return { b: 20, c: 30 }; // c is new, b overrides default
        }
      }

      test("loadSettings should merge defaults with persisted data and preserve reference", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const settingsRefBefore = instance.settings;

        await instance.loadSettings();

        const settingsRefAfter = instance.settings;

        // reference is preserved
        expect(settingsRefAfter).toBe(settingsRefBefore);

        // defaults merged and persisted values overlaid
        expect(settingsRefAfter).toEqual({ a: 1, b: 20, c: 30 });

        // type check: should be object
        expect(typeof settingsRefAfter).toBe("object");
      });

      test("loadSettings returns a Promise<void>", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        const promise = instance.loadSettings();
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBeUndefined();
      });
    });
    describe("Testing AbstractObsidianPluginWithSettings::loadSettings fallback", () => {

      class TestPlugin extends AbstractObsidianPluginWithSettings<{ foo: string, bar: number }> {
        protected getDefaultSettings() {
          return { foo: "default", bar: 42 };
        }

        // mock loadData to return null
        async loadData(): Promise<unknown> {
          return null; // triggers fallback to {}
        }
      }

      test("loadSettings falls back to empty object and applies defaults", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);

        await instance.loadSettings();

        // settings should equal defaults
        expect(instance.settings).toEqual({ foo: "default", bar: 42 });
      });

      test("loadSettings preserves reference even when fallback to {}", async () => {
        const mockApp = {} as App;
        const mockManifest = { id: "test-plugin", name: "Test", version: "1.0.0" } as PluginManifest;

        const instance = new TestPlugin(mockApp, mockManifest);
        const refBefore = instance.settings;

        await instance.loadSettings();

        const refAfter = instance.settings;

        // reference should be preserved
        expect(refAfter).toBe(refBefore);
      });
    });    
  }
);
