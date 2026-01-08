# Roadmap for ts-obsidian-plugin

This roadmap outlines the planned evolution and improvements for the `ts-obsidian-plugin` package.  
It focuses on providing a robust TypeScript base for Obsidian plugins with persistent, typed settings.

---

## Current Version (1.0.0)

- Stable abstract base class `AbstractObsidianPluginWithSettings`
- Full settings lifecycle: `loadSettings`, `saveSettings`, `onExternalSettingsChange`
- Low-level persistence: `loadData`, `saveData`
- TypeScript support and Rollup bundling

---

## Short-Term Goals

- Add more examples for extending the base class with custom plugin logic
- Provide optional utilities for logging and debugging settings
- Improve type safety with stricter TypeScript generics
- Add documentation for testing and bundling workflows with Rollup and Vitest

---

## Mid-Term Goals

- Add automated schema validation for persisted settings
- Provide helper mix-ins for frequently used plugin patterns

---

## Long-Term Goals

- Expand utilities for building fully-featured Obsidian plugin templates
- Optional runtime diagnostics for settings and plugin behavior
