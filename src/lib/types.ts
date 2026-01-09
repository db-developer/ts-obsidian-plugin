/**
 * Defines a minimal Obsidian-specific persistence capability for plugin data.
 *
 * This interface represents the lowest-level contract required to persist and
 * retrieve plugin state via Obsidian’s plugin data storage mechanism. It is a
 * thin, semantically neutral abstraction over {@link Plugin.loadData} and
 * {@link Plugin.saveData} and intentionally carries no knowledge about the
 * structure, meaning, or lifecycle of the persisted data.
 *
 * Implementations are expected to return the raw, deserialized contents of the
 * plugin’s {@code data.json} file, or {@code null}/{@code undefined} if no data
 * has been persisted yet. No guarantees are made about shape, validity, or
 * completeness of the returned data.
 *
 * Higher-level concerns such as default values, merging, validation, schema
 * migration, and reference stability must be handled by consumers of this
 * interface (for example by a settings management layer).
 *
 * This capability-based abstraction is intentionally minimal to allow usage in
 * mix-ins, abstract base classes, and concrete {@link Plugin} subclasses without
 * imposing unnecessary coupling to Obsidian’s full plugin API surface.
 */
export interface ObsidianDataPersistence {
  /**
   * Loads the raw persisted plugin data from Obsidian’s data storage.
   *
   * The returned value represents the deserialized contents of the plugin’s
   * {@code data.json} file and may be {@code null} or {@code undefined} if no
   * data has been stored yet. Callers must not assume any particular structure
   * or validity of the returned value.
   *
   * @returns A promise that resolves with the raw persisted data, or
   * {@code null}/{@code undefined} if no data exists.
   */
  loadData(): Promise<unknown>;

  /**
   * Persists the provided raw data to Obsidian’s plugin data storage.
   *
   * The given value will be serialized and written to the plugin’s
   * {@code data.json} file. No validation or transformation is performed at this
   * level; callers are responsible for ensuring that the data is suitable for
   * JSON serialization and represents a consistent persisted state.
   *
   * @param data - The raw data object to persist.
   * @returns A promise that resolves once the data has been successfully saved.
   */
  saveData(data: unknown): Promise<void>;
}

/**
 * Defines a contract for Obsidian plugins that manage structured, typed settings
 * on top of a raw persistence capability.
 *
 * This interface describes a higher-level settings lifecycle that is built
 * upon the low-level {@link ObsidianDataPersistence} abstraction. Implementations
 * are responsible for interpreting raw persisted data, applying fully populated
 * default values, merging persisted state, and maintaining a stable in-memory
 * settings object reference.
 *
 * Obsidian does not automatically invoke any of the settings lifecycle methods
 * defined by this interface. Implementations must explicitly coordinate when
 * settings are loaded, reloaded, or persisted, typically during plugin
 * activation or in response to externally detected modifications of the
 * persisted data (for example via file synchronization).
 *
 * Consumers are granted read-only access to the current in-memory settings
 * object. While individual properties may be mutated internally by the plugin
 * as part of loading, merging, validation, or migration, the settings object
 * reference itself is expected to remain stable for the lifetime of the plugin
 * instance.
 *
 * The settings lifecycle is explicitly controlled by the plugin:
 * default values are produced via {@link getDefaultSettings}, raw persisted
 * data is interpreted and merged via {@link loadSettings}, externally detected
 * changes are re-applied via {@link onExternalSettingsChange}, and the current
 * settings state is persisted via {@link saveSettings}.
 *
 * All settings are assumed to be plain, JSON-serializable data structures
 * suitable for storage via the underlying {@link ObsidianDataPersistence}
 * capability.
 *
 * @typeParam TSettings - The concrete, JSON-serializable shape of the plugin’s
 * settings object.
 */
export interface PluginWithSettings<
  TSettings extends object
> extends ObsidianDataPersistence {
  /**
   * Provides read-only access to the plugin’s current in-memory settings object.
   *
   * The returned object represents the live settings state used by the plugin.
   * Consumers may safely inspect individual settings values but must not replace
   * the settings object itself. The object reference is expected to remain stable
   * for the lifetime of the plugin instance, even when settings are reloaded or
   * merged.
   *
   * Internal plugin code may mutate properties of the underlying settings object
   * as part of loading, merging, or updating settings, but such mutations are
   * intentionally hidden from consumers via a read-only view.
   * 
   * Consumers should assume that settings are only fully initialized after 
   * loadSettings has resolved.
   *
   * @returns A read-only view of the current {@link TSettings} instance.
   */
  get settings(): Readonly<TSettings>;  
  /**
   * Returns a fully populated default settings object for the plugin.
   *
   * Subclasses must implement this method to provide all required default values
   * for their specific settings type.
   *
   * @returns A TSettings object containing default values.
   */
  getDefaultSettings(): TSettings;
   /**
   * Loads the plugin's settings from the data.json file and merges them with default values.
   *
   * This method clears the existing in-memory settings, applies the defaults,
   * and then overlays any persisted settings from disk. The reference to the
   * in-memory settings object remains unchanged.
   *
   * Should be called during plugin activation (onload) or whenever settings need to be reloaded.
   * 
   * @returns A promise that resolves once the settings have been reloaded.
   */
  loadSettings(): Promise<void>;
  /**
   * Should be invoked by the plugin when an external modification of the settings
   * file is detected.
   *
   * This method is invoked when the settings file is changed outside of Obsidian,
   * for example by a file sync service or another program. It reloads the in-memory
   * settings to reflect the latest persisted state.
   * 
   * @returns A promise that resolves once the settings have been reloaded.
   */
  onExternalSettingsChange(): Promise<void>;
  /**
   * Persists the current in-memory settings to the data.json file.
   * 
   * @returns A promise that resolves once the settings have been saved.
   */
  saveSettings(): Promise<void>;
}