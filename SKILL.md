---
name: jev-flash-router
description: |
  Zero-token-output decision router powered by TypeSafe Jev via OpenRouter.
  Use this skill whenever evaluating architectural plans, choosing between implementation strategies, validating code diffs for breaking changes, triaging errors, or building TypeSafe AI application primitives (noul, choice, score).
license: MIT
metadata:
  version: v1.0.3
  publisher: ravinder
---

# TypeSafe Jev & Flash Router Master Skill

This skill governs the use of **TypeSafe Jev** and the `jev-flash-router` MCP tool (`evaluate_decision`) across all projects.

Jev is TypeSafe's flagship System One decision model. It understands natural language and application state and returns typed answers and calibrated probabilities in ~150ms with **$0.00 output token cost**, rather than generating text or reasoning explanations.

---

## 1. Golden Directive for AI Agents

**Evaluate Before Elaborating**:
Before generating multi-paragraph reasoning chains, picking between competing architectures, or writing code diffs, you MUST call `evaluate_decision` to establish the optimal path.

---

## 2. Core Usage Patterns

### A. Pre-Flight Diff Verification (`noul`)
Use `noul` (binary yes/no) to evaluate a hypothesis with calibrated true/false probabilities before committing code edits or migrations.

```json
{
  "name": "evaluate_decision",
  "arguments": {
    "state": "Proposed change: replacing synchronous fs calls with fs.promises in core handler.",
    "question": "Will this change break backward compatibility for synchronous callers?",
    "type": "noul",
    "criteria": {
      "true": "Breaks callers expecting synchronous return values.",
      "false": "Purely async internal refactor with no public API break."
    }
  }
}
```

### B. Architectural & Strategy Selection (`choice`)
Use `choice` to pick the best path among candidate implementation strategies.

```json
{
  "name": "evaluate_decision",
  "arguments": {
    "state": "Task requirements: store session metadata for high-concurrency API.",
    "question": "Which storage backing strategy is optimal for this latency profile?",
    "type": "choice",
    "criteria": {
      "redis": "Fastest in-memory KV cache for distributed node clusters.",
      "sqlite": "Embedded file database with minimal infrastructure overhead.",
      "postgres": "Relational storage with full ACID transaction guarantees."
    }
  }
}
```

### C. Risk & Urgency Scoring (`score`)
Use `score` with an ordered rubric array to evaluate blast radius, risk, or priority.

```json
{
  "name": "evaluate_decision",
  "arguments": {
    "state": "Proposed DB schema migration adding a NOT NULL column without a default.",
    "question": "What is the operational risk level of this migration?",
    "type": "score",
    "criteria": ["low risk", "moderate risk", "high risk / potential downtime"]
  }
}
```

---

## 3. Designing Judgments with TypeSafe System One

When building features or integrating TypeSafe Jev primitives:

| Primitive | Purpose | Criteria Format |
| :--- | :--- | :--- |
| **Noul** | Binary condition / probability of yes | Object with `true` and `false` keys describing outcomes |
| **Choice** | Select 1 option from a discrete set | Object with option keys mapped to outcome descriptions |
| **Score** | Position along an ordered dimension | Array of strings describing ordered rubric levels |

### Key Principles:
1. **Provide complete state**: Include source text, identities, relationships, and facts in `state`. Prefer named JSON fields when context has multiple components.
2. **Narrow, coherent questions**: Ask one focused judgment per question. Reference nested state with backticked paths (`ticket.messages[0].text`).
3. **Probabilities over text**: Jev outputs calibrated probabilities. Code owns the workflow; Jev supplies programmable common sense.

---

## 4. Documentation References

For building complex TypeSafe AI integrations:
- [TypeSafe Documentation Index](https://docs.typesafe.ai/llms.txt)
- [System One Concepts](https://docs.typesafe.ai/concepts/system-one.md)
- [Building Guide](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md)
- [Primitives Reference](https://docs.typesafe.ai/primitives.md)
