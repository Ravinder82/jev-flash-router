# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-09-20

### Fixed
- Fixed binary path declaration in `package.json` and lockfile (`./dist/index.js`) to prevent npm from stripping the executable during publish.
- Added `prepublishOnly` script to ensure fresh build and executable permissions before release.
- Dynamically resolve package version from `package.json` for MCP `ServerInfo`.
- Redirected `console.info` and `console.debug` to `stderr` to protect stdio JSON-RPC handshake.
- Updated `criteria` tool input schema to support both objects (`noul`, `choice`) and arrays (`score`).
- Added support for optional `apiKey` parameter with fallback to `OPENROUTER_API_KEY`.
- Added clear error handling for unconfigured placeholder API keys.
- Added process signal and uncaught exception handlers.

## [1.0.1] - 2026-09-20

### Fixed
- Added missing runtime dependencies (`@modelcontextprotocol/sdk`, `dotenv`) to `package.json`.
- Configured `dotenv` with quiet mode.
- Recompiled clean `dist/index.js` with shebang.

## [1.0.0] - 2025-09-15


### Added
- Initial release of `jev-flash-router`
- **evaluate_decision** MCP tool exposing the OpenRouter Decisions API
- Support for three decision formats:
  - `noul` — binary yes/no probability
  - `choice` — categorical distribution
  - `score` — ordered rubric
- Zero-token-output decision engine powered by TypeSafe Jev
- Stdio transport for MCP client integration (Cursor, Windsurf, Claude Desktop)
- Local telemetry reporting (`latency_ms`, `output_tokens`, `cost`)
- TypeScript source compiled to `dist/index.js`
- MIT License
