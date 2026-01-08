[BOTTOM](#typeScript-interfaces) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md)

# ts-obsidian-plugin

A **TypeScript base package for Obsidian plugins** that provides stable, persistent settings management.  
The package includes an abstract base class `AbstractObsidianPluginWithSettings`, interfaces for persistent data and plugins with settings, and helper functions like `deepPurge`.

---

## Features

- Abstract base class for Obsidian plugins with a **stable in-memory settings reference**  
- Full **settings lifecycle implementation** (`loadSettings`, `saveSettings`, `onExternalSettingsChange`)  
- Support for **default settings** and merging with persisted data  
- **Low-level persistence** via `loadData` and `saveData`  
- Helper function `deepPurge` to **recursively clear objects** while preserving the reference  
- Designed for **TypeScript** and **Rollup bundling** in Obsidian plugins  

---

## Installation

```bash
npm install ts-obsidian-plugin
# or
pnpm add ts-obsidian-plugin
```

> Note: This package has obsidian as a peer dependency (>= 1.5.0). It must be available in the plugin context.

---

## Usage

### Extending the Base Class

```ts
import { AbstractObsidianPluginWithSettings } from "ts-obsidian-plugin";

interface MyPluginSettings {
  optionA: string;
  optionB: number;
}

export class MyPlugin extends AbstractObsidianPluginWithSettings<MyPluginSettings> {
  public getDefaultSettings(): MyPluginSettings {
    return {
      optionA: "default",
      optionB: 42
    };
  }

  async onload() {
    await this.loadSettings();
    console.log(this.settings.optionA);
  }

  async saveCustomSettings() {
    this._settings.optionB = 100;
    await this.saveSettings();
  }
}
```
### Low-Level Data Access

```ts
const data = await this.loadData();
await this.saveData({ custom: "value" });
```
---

## Build & Test

The package uses **Rollup** for bundling and Vitest for testing.

```bash
# Build
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```
---

## Bundling (Required)

Obsidian does not support loading external npm modules at runtime.
All dependencies must be bundled.

### Rollup Example

```js
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    typescript(),
  ],
  external: ["obsidian"],
};
```
---

## API Reference

### AbstractObsidianPluginWithSettings<TSettings>

An abstract base class for Obsidian plugins with **typed and persistent settings**.

#### Properties

- `settings: Readonly<TSettings>`  
  Returns the current in-memory settings object. The reference is stable, but individual properties may be updated internally during loading or merging. Consumers should **not replace** the object itself.

#### Methods

- `getDefaultSettings(): TSettings` *(abstract)*  
  Returns a fully populated default settings object. Must be implemented by subclasses.

- `loadSettings(): Promise<void>`  
  Loads persisted settings from disk, merges them with default values, and updates the in-memory settings object. Reference to the settings object remains unchanged.

- `saveSettings(): Promise<void>`  
  Persists the current in-memory settings to disk using the underlying `saveData` method.

- `onExternalSettingsChange(): Promise<void>`  
  Reloads settings in response to external modifications of the data file (e.g., file sync or manual changes).

- `loadData(): Promise<unknown>`  
  Low-level method to load raw persisted plugin data from disk. Returns the deserialized `data.json` contents or `null/undefined` if no data exists.

- `saveData(data: unknown): Promise<void>`  
  Low-level method to save raw plugin data to disk. Performs no validation or transformation.

---

## TypeScript Interfaces

**ObsidianDataPersistence**
Defines the low-level contract for plugin data persistence:
- `loadData(): Promise<unknown>` – Load raw persisted plugin data.
- `saveData(data: unknown): Promise<void>` – Save raw plugin data.

**PluginWithSettings<TSettings>**

Extends **ObsidianDataPersistence** and adds a structured settings lifecycle:
- `settings: Readonly<TSettings>` – Read-only access to in-memory settings.
- `getDefaultSettings(): TSettings` – Returns default settings.
- `loadSettings(): Promise<void>` – Load and merge persisted settings.
- `saveSettings(): Promise<void>` – Persist current settings.
- `onExternalSettingsChange(): Promise<void>` – Reload settings when external changes are detected.

[TOP](#obsidian-log-plugin) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md)