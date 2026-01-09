[BOTTOM](#100---2026-01-08) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md) [README](README.md)

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- No additions yet

### Changed

- No changes yet

### Fixed

- No fixes yet

## [1.1.0] - 2026-01-08

### Changed

- Changed settings type from T extends Record<string, unknown> to T extends object for broader compatibility

## [1.0.0] - 2026-01-08

- Initial version

### Features

- Abstract base class for Obsidian plugins with stable, in-memory settings reference
- Full settings lifecycle implementation (`loadSettings`, `saveSettings`, `onExternalSettingsChange`)
- Support for default settings and merging with persisted data
- Low-level persistence via `loadData` and `saveData`
- Designed for TypeScript and bundling with Rollup in Obsidian plugins


[TOP](#changelog) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md) [README](README.md)