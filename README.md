# jev-flash-router

[![npm version](https://img.shields.io/npm/v/jev-flash-router)](https://www.npmjs.com/package/jev-flash-router)
[![License: MIT](https://img.shields.io/npm/l/jev-flash-router)](LICENSE)
[![Node.js](https://img.shields.io/npm/dependency-version/jev-flash-router/peer/nodejs)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-MCP-blue)](https://modelcontextprotocol.io)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Decisions%20API-red)](https://openrouter.ai)

> **Zero-token-output decision router MCP server powered by TypeSafe Jev.**

AI coding agents waste hundreds of reasoning tokens just deciding which file to edit, which route to pick, or whether a diff breaks tests. **jev-flash-router** evaluates context, code diffs, logs, or planning options and returns calibrated probabilities in ~150ms — with **$0.00 output token cost**.

---

## ✨ Features

- ⚡ **~150ms decisions** — Lightning-fast evaluation via OpenRouter Decisions API
- 💸 **Zero output token cost** — `output_tokens: 0` on every call
- 🧠 **TypeSafe Jev** — Powered by the cutting-edge `~typesafe/jev-latest` model
- 🔌 **MCP-native** — Works seamlessly with Cursor, Windsurf, Claude Desktop & Claude Code
- 📦 **Zero-config** — Install via `npx` and go
- 🎯 **Three decision formats**: `noul` (binary), `choice` (categorical), `score` (rubric)

---

## 🚀 Quick Start

### 1. Install as an MCP server

No local clone needed — anyone can run it instantly:

```bash
npx -y jev-flash-router
```

Or install globally via npm:

```bash
npm install -g jev-flash-router
```

### 2. Set your OpenRouter API key

Set the `OPENROUTER_API_KEY` environment variable with your [OpenRouter](https://openrouter.ai) API key (required).

### 3. Use the tool

In your IDE's agent chat, call:

> **evaluate_decision**
> - `state`: The context, code diff, error log, or task description
> - `question`: The targeted question to evaluate
> - `type`: `"noul"`, `"choice"`, or `"score"`
> - `criteria`: Criteria map matching the chosen type

**Example prompt:**

> "Use the evaluate_decision tool to check state 'User deleted their account', question 'Is this high churn risk?', type 'noul', criteria: { true: 'Churn', false: 'Retained' }."

**Expected response:**

```json
{
  "result": { "true": 0.82, "false": 0.18 },
  "telemetry": {
    "latency_ms": 142,
    "output_tokens": 0,
    "cost": "$0.00 output"
  }
}
```

---

## 🛠️ MCP Client Configuration

### Cursor

**Settings** → **Features** → **MCP Servers** → **Add New MCP Server**

```json
{
  "mcpServers": {
    "jev": {
      "command": "node",
      "args": ["/absolute/path/to/jev-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}
```

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jev": {
      "command": "node",
      "args": ["/absolute/path/to/jev-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}
```

### Windsurf

Add to your Windsurf MCP configuration:

```json
{
  "mcpServers": {
    "jev": {
      "command": "node",
      "args": ["/absolute/path/to/jev-mcp/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}
```

### Claude Code / Other MCP Clients

Any MCP-compatible client can use this server with the same configuration pattern above.

---

## 📦 Installation for Developers

### Clone & Run Locally

```bash
git clone https://github.com/Ravinder82/jev-flash-router.git
cd jev-flash-router
npm install
npm run build
npm start
```

### From npm (no clone)

```bash
npx -y jev-flash-router
```

---

## 🔧 Development

### Project Structure

```
jev-flash-router/
├── src/
│   └── index.ts          # Main server entry (TypeScript)
├── dist/
│   └── index.js          # Compiled executable (output)
├── package.json
├── tsconfig.json
└── README.md
```

### Build

```bash
npm run build
```

Compiles TypeScript to executable JavaScript in `./dist/index.js`.

### Start

```bash
npm start
```

Runs the compiled MCP server over stdio.

---

## 📋 API Reference

### Tool: `evaluate_decision`

Evaluates context and returns calibrated probabilities.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `state` | `string` | ✅ | Context, code diff, error log, or task description |
| `question` | `string` | ✅ | Targeted question (e.g., "Will this change cause a breaking API error?") |
| `type` | `string` | ✅ | Decision format: `"noul"`, `"choice"`, or `"score"` |
| `criteria` | `object` | ✅ | Criteria map matching the type |

#### Criteria Examples

**`noul`** (binary yes/no):
```json
{ "true": "breaks existing callers", "false": "backward compatible" }
```

**`choice`** (categorical):
```json
{ "option1": "use caching", "option2": "recompute", "option3": "defer" }
```

**`score`** (ordered rubric):
```json
["critical", "warning", "info"]
```

---

## 💰 Cost & Performance

| Metric | Value |
|--------|-------|
| Latency | ~150ms |
| Output tokens | 0 |
| Output cost | $0.00 |
| Input cost | ~$0.042 / 1M tokens |
| Model | `~typesafe/jev-latest` |

---

## 🚀 Publish Your Own Copy

### Login to npm

```bash
npm login
```

### Publish

```bash
npm publish --access public
```

Then anyone can run `npx -y jev-flash-router` worldwide.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[MIT](LICENSE)

---

## 🔗 Links

- **GitHub**: https://github.com/Ravinder82/jev-flash-router
- **npm**: https://www.npmjs.com/package/jev-flash-router
- **OpenRouter**: https://openrouter.ai
- **TypeSafe Jev**: https://typesafe.jev
- **Model Context Protocol**: https://modelcontextprotocol.io

---

## 🙏 Acknowledgements

- [TypeSafe Jev](https://typesafe.jev) — Zero-token decision intelligence
- [OpenRouter](https://openrouter.ai) — Decisions API infrastructure
- [Model Context Protocol](https://modelcontextprotocol.io) — Universal MCP standard
