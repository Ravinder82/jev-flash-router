# jev-flash-router


[![npm version](https://www.npmjs.com/package/jev-flash-router)](https://www.npmjs.com/package/jev-flash-router)
[![License: MIT](https://opensource.org/licenses/MIT)](https://github.com/Ravinder82/jev-flash-router/blob/main/LICENSE)
[![Node.js](https://nodejs.org/)](https://nodejs.org/)
[![MCP](https://modelcontextprotocol.io/)](https://modelcontextprotocol.io/)
[![OpenRouter](https://openrouter.ai/)](https://openrouter.ai/)

Zero-token-output decision router MCP server powered by TypeSafe Jev.

AI coding agents waste hundreds of reasoning tokens just deciding which file to edit, which route to pick, or whether a diff breaks tests. **jev-flash-router** evaluates context, code diffs, logs, or planning options and returns calibrated probabilities in ~150ms — with **$0.00 output token cost**.

---

## Features

- **~150ms decisions** — Lightning-fast evaluation via OpenRouter Decisions API
- **Zero output token cost** — `output_tokens: 0` on every call
- **TypeSafe Jev** — Powered by the cutting-edge `typesafe/jev-latest` model
- **MCP-native** — Works seamlessly with Cursor, Windsurf, Claude Desktop, and Claude Code
- **Zero-config** — Run via `npx` or build locally from source
- **Three decision formats** — `noul` (binary), `choice` (categorical), `score` (rubric)

---

## Quick Start

### 1. Get an OpenRouter API Key
Obtain an API key from [OpenRouter](https://openrouter.ai/) with access to the Jev model.

### 2. Client Setup

#### Option A: Run directly via npx (Recommended)
```json
{
  "mcpServers": {
    "jev": {
      "command": "npx",
      "args": ["-y", "jev-flash-router"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}

```

#### Option B: Run from Local Source (Cloned Repository)

```json
{
  "mcpServers": {
    "jev": {
      "command": "node",
      "args": ["/path/to/jev-flash-router/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}

```

### 3. Install AI Agent Skill (Recommended)
To automatically configure your AI agent (Antigravity IDE, Cursor, Claude Code) with the Master Jev Skill so it proactively uses zero-token decisions:

```bash
npx -y jev-flash-router install-skill
```

#### Option C: GUI Client Setup (Manual Field Entry)

* **Server name:** `jev`
* **Executable command:** `node` (or `npx`)
* **Arguments:** `/path/to/jev-flash-router/dist/index.js` (or `-y\njev-flash-router`)
* **Environment:** `OPENROUTER_API_KEY=sk-or-v1-YOUR-ACTUAL-API-KEY`

---

## MCP Client Configuration

### Cursor

Go to **Settings** → **Features** → **MCP Servers** → **Add New MCP Server**:

```json
{
  "mcpServers": {
    "jev": {
      "command": "node",
      "args": ["/path/to/jev-flash-router/dist/index.js"],
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
      "args": ["/path/to/jev-flash-router/dist/index.js"],
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
      "args": ["/path/to/jev-flash-router/dist/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "sk-or-v1-YOUR-ACTUAL-API-KEY"
      }
    }
  }
}

```

---

## Installation for Developers

### Clone and Run Locally

```bash
git clone [https://github.com/Ravinder82/jev-flash-router.git](https://github.com/Ravinder82/jev-flash-router.git)
cd jev-flash-router
npm install
npx tsc --types node && chmod +x dist/index.js

```

---

## API Reference

### Tool: `evaluate_decision`

Evaluates context and returns calibrated probabilities.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `state` | string | Yes | Context, code diff, error log, or task description |
| `question` | string | Yes | Targeted question (e.g., "Will this change cause a breaking API error?") |
| `type` | string | Yes | Decision format: `"noul"`, `"choice"`, or `"score"` |
| `criteria` | object | Yes | Criteria map matching the chosen type |

### Criteria Examples

**noul (binary yes/no):**

```json
{
  "true": "breaks existing callers",
  "false": "backward compatible"
}

```

**choice (categorical):**

```json
{
  "option1": "use caching",
  "option2": "recompute",
  "option3": "defer"
}

```

**score (ordered rubric):**

```json
[
  "critical",
  "warning",
  "info"
]

```

---

## Cost and Performance

| Metric | Value |
| --- | --- |
| **Latency** | ~150ms |
| **Output tokens** | 0 |
| **Output cost** | $0.00 |
| **Input cost** | ~$0.042 / 1M tokens |
| **Model** | `typesafe/jev-latest` |

---

## License

MIT

