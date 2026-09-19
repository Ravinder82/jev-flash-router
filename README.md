# jev-flash-router

[![npm version](https://img.shields.io/npm/v/jev-flash-router.svg)](https://www.npmjs.com/package/jev-flash-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-purple.svg)](https://openrouter.ai/)

*Zero-token-output decision router MCP server powered by TypeSafe Jev.*

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


### Option B: Run from Local Source (Cloned Repository)
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

### Installation for DevelopersClone and Run LocallyBash

git clone [https://github.com/Ravinder82/jev-flash-router.git](https://github.com/Ravinder82/jev-flash-router.git)

cd jev-flash-router

npm install

npx tsc --types node && chmod +x dist/index.js

API ReferenceTool: evaluate_decisionEvaluates context and returns calibrated probabilities.

ParameterTypeRequiredDescriptionstatestringYesContext, code diff, error log, or task descriptionquestionstringYesTargeted question (e.g., "Will this change cause a breaking API error?")typestringYesDecision format: "noul", "choice", or "score"criteriaobjectYesCriteria map matching the chosen typeCriteria Examplesnoul (binary yes/no):JSON{ "true": "breaks existing callers", "false": "backward compatible" }

choice (categorical):JSON{ "option1": "use caching", "option2": "recompute", "option3": "defer" }

score (ordered rubric):JSON["critical", "warning", "info"]

Cost and PerformanceMetricValueLatency
~150msOutput tokens0Output cost$0.00Input cost~$0.042 / 1M tokensModeltypesafe/jev-latestLicenseMIT
