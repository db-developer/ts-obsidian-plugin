import { App, Plugin, PluginManifest } from "obsidian";
import { ObsidianDataPersistence,
         PluginWithSettings          } from "./types";
import { deepPurge                   } from "./internals";

/**
 * Abstract base class for Obsidian plugins that manage structured, persistent
 * settings on top of Obsidian's raw plugin data storage.
 *
 * This class provides a complete implementation of the settings lifecycle
 * defined by {@link PluginWithSettings}, using Obsidian's native plugin
 * persistence mechanism as described by {@link ObsidianDataPersistence}.
 *
 * Design goals:
 * - Centralize all settings persistence and lifecycle logic in a single base class
 * - Maintain a *stable in-memory settings object reference* for the lifetime of
 *   the plugin instance
 * - Separate raw persistence concerns from higher-level settings semantics
 *
 * Subclasses are intentionally kept minimal and are only required to provide
 * a fully populated default settings object via {@link getDefaultSettings}.
 *
 * This class does not automatically observe external changes to the persisted
 * data. Instead, consumers are expected to explicitly invoke
 * {@link loadSettings} or {@link onExternalSettingsChange} at appropriate times
 * (for example during plugin activation or after detecting file system changes).
 *
 * @typeParam TSettings - The concrete, JSON-serializable shape of the plugin’s
 * settings object.
 */
export abstract class AbstractObsidianPluginWithSettings<TSettings extends object>
  extends Plugin
  implements PluginWithSettings<TSettings>, ObsidianDataPersistence
{
  /**
   * Holds the plugin’s current in-memory settings state.
   *
   * This object is created exactly once and its reference remains stable for
   * the entire lifetime of the plugin instance.
   *
   * When settings are (re)loaded, the object is *purged and repopulated* rather
   * than replaced. This guarantees reference stability for all consumers that
   * hold a reference to {@link settings}.
   *
   * Direct external mutation is prevented by exposing the settings only through
   * a read-only accessor.
   */
  private readonly _settings: TSettings = {} as TSettings;

  /**
   * Creates a new plugin base instance.
   *
   * This constructor simply forwards the provided application context and
   * plugin manifest to Obsidian’s {@link Plugin} base class. All settings-related
   * initialization is deferred to explicit lifecycle methods such as
   * {@link loadSettings}.
   *
   * @param app - The active Obsidian application instance.
   * @param manifest - The plugin manifest describing id, version, and metadata.
   */
  protected constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  /**
   * Provides access to the current in-memory settings object.
   *
   * The returned object reference itself is immutable, meaning it cannot
   * be replaced from outside the plugin. However, individual properties
   * of the settings object can be modified.
   *
   * Consumers should assume that settings are only fully initialized after
   * {@link loadSettings} has completed.
   *
   * @returns The current settings object. Its properties are mutable,
   *          but the object reference cannot be replaced externally.
   */
  get settings(): TSettings {
    return this._settings;
  }

  /**
   * Returns a fully populated default settings object.
   *
   * Subclasses must implement this method and provide default values for *all*
   * settings properties defined by {@link TSettings}.
   *
   * This method is part of the public contract defined by
   * {@link PluginWithSettings}. Although it is not intended to be called by
   * external consumers, it must be public to satisfy the interface and enable
   * the settings lifecycle implemented by this base class.
   *
   * @returns A {@link TSettings} object containing default values.
   */
  public abstract getDefaultSettings(): TSettings;

  /**
   * Loads raw persisted plugin data from Obsidian’s plugin data storage.
   *
   * This method fulfills the {@link ObsidianDataPersistence} contract and is a
   * thin semantic wrapper around {@link Plugin.loadData}.
   *
   * The returned value represents the deserialized contents of the plugin’s
   * {@code data.json} file and may be {@code null} or {@code undefined} if no
   * data has been stored yet.
   *
   * @returns A promise that resolves with the raw persisted data.
   */
  async loadData(): Promise<unknown> {
    return super.loadData();
  }

  /**
   * Persists raw plugin data to Obsidian’s plugin data storage.
   *
   * This method fulfills the {@link ObsidianDataPersistence} contract and
   * delegates directly to {@link Plugin.saveData}.
   *
   * No validation or transformation is performed at this level; callers are
   * responsible for ensuring that the provided data is suitable for JSON
   * serialization.
   *
   * @param data - The raw data object to persist.
   * @returns A promise that resolves once the data has been saved.
   */
  async saveData(data: unknown): Promise<void> {
    await super.saveData(data);
  }

  /**
   * Loads the plugin’s settings from persistent storage and merges them with
   * default values.
   *
   * This method implements the core settings lifecycle:
   * 1. The existing in-memory settings object is deeply purged while preserving
   *    its reference.
   * 2. A fresh default settings object is applied.
   * 3. Any persisted settings from disk are overlaid on top of the defaults.
   *
   * The reference to the in-memory settings object remains unchanged throughout
   * this process.
   *
   * This method should typically be called during plugin activation
   * (e.g. {@code onload}) or whenever a full settings reload is required.
   *
   * @returns A promise that resolves once the settings have been fully reloaded.
   */
  async loadSettings(): Promise<void> {
    const raw = await this.loadData();

    Object.assign(
      deepPurge(this._settings),
      this.getDefaultSettings(),
      typeof raw === "object" && raw !== null ? raw : {}
    );
  }

  /**
   * Persists the current in-memory settings state to disk.
   *
   * The entire settings object is serialized and written to the plugin’s
   * {@code data.json} file using the underlying raw persistence mechanism.
   *
   * @returns A promise that resolves once the settings have been saved.
   */
  async saveSettings(): Promise<void> {
    await this.saveData(this._settings);
  }

  /**
   * Re-applies persisted settings after an externally detected modification.
   *
   * This method should be invoked when the plugin detects that the underlying
   * settings file has been modified outside of Obsidian (for example by a file
   * synchronization service).
   *
   * The default implementation simply reloads the settings via
   * {@link loadSettings}.
   *
   * @returns A promise that resolves once the settings have been reloaded.
   */
  async onExternalSettingsChange(): Promise<void> {
    await this.loadSettings();
  }
}
