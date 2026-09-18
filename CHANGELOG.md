# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
