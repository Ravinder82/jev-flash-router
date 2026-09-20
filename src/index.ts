#!/usr/bin/env node
// Redirect all stdout logs to stderr so MCP handshake doesn't break
console.log = (...args: any[]) => process.stderr.write(args.join(" ") + "\n");
console.info = (...args: any[]) => process.stderr.write(args.join(" ") + "\n");
console.debug = (...args: any[]) => process.stderr.write(args.join(" ") + "\n");

import fs from "fs";
import path from "path";
import os from "os";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

// Check for install-skill CLI command
if (
  process.argv.includes("install-skill") ||
  process.argv.includes("install-skills") ||
  process.argv.includes("--install-skill")
) {
  handleInstallSkill();
}

function handleInstallSkill() {
  const homeDir = os.homedir();
  const sourceSkillPath = new URL("../SKILL.md", import.meta.url);

  if (!fs.existsSync(sourceSkillPath)) {
    process.stderr.write("Error: SKILL.md not found in package.\n");
    process.exit(1);
  }

  const skillContent = fs.readFileSync(sourceSkillPath, "utf-8");

  const targetDirs = [
    path.join(homeDir, ".gemini", "config", "skills", "jev-flash-router"),
    path.join(homeDir, ".agents", "skills", "jev-flash-router"),
  ];

  if (process.argv.includes("--local") || process.argv.includes("-l")) {
    targetDirs.push(path.join(process.cwd(), ".agents", "skills", "jev-flash-router"));
  }

  let installedCount = 0;
  for (const dir of targetDirs) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const targetFile = path.join(dir, "SKILL.md");
      fs.writeFileSync(targetFile, skillContent, "utf-8");
      process.stderr.write(`✓ Installed skill to: ${targetFile}\n`);
      installedCount++;
    } catch (err: any) {
      process.stderr.write(`Warning: Failed to write to ${dir}: ${err?.message || err}\n`);
    }
  }

  if (installedCount > 0) {
    process.stderr.write("\n✓ Skill installation complete! Antigravity IDE and AI agents will now automatically use jev-flash-router.\n");
  } else {
    process.stderr.write("\n✖ Failed to install skill.\n");
    process.exit(1);
  }
  process.exit(0);
}

// Read server version dynamically from package.json
let serverVersion = "1.0.3";
try {
  const pkgUrl = new URL("../package.json", import.meta.url);
  if (fs.existsSync(pkgUrl)) {
    const pkg = JSON.parse(fs.readFileSync(pkgUrl, "utf-8"));
    if (pkg.version) {
      serverVersion = pkg.version;
    }
  }
} catch {
  // Fallback to default version if package.json read fails
}

const server = new Server(
  {
    name: "jev-flash-router",
    version: serverVersion,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register the tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "evaluate_decision",
        description:
          "Zero-token-output decision engine powered by TypeSafe Jev. Evaluates context, code diffs, logs, or planning options and returns calibrated probabilities. Use this BEFORE generating long reasoning plans or multi-file edits to pick optimal paths.",
        inputSchema: {
          type: "object",
          properties: {
            state: {
              type: "string",
              description:
                "The context, code diff, error log, or task description to evaluate.",
            },
            question: {
              type: "string",
              description:
                "The targeted question to evaluate (e.g., 'Will this change cause a breaking API error?').",
            },
            type: {
              type: "string",
              enum: ["noul", "choice", "score"],
              description:
                "Decision format: 'noul' (binary yes/no probability), 'choice' (categorical distribution), or 'score' (ordered rubric).",
            },
            criteria: {
              description:
                "Criteria map: for 'noul' provide { true: '...', false: '...' }, for 'choice' provide { option1: '...', option2: '...' }, for 'score' provide an array of strings in order.",
              oneOf: [
                {
                  type: "object",
                },
                {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              ],
            },
            apiKey: {
              type: "string",
              description:
                "Optional OpenRouter API key. If omitted, the OPENROUTER_API_KEY environment variable will be used.",
            },
          },
          required: ["state", "question", "type", "criteria"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "evaluate_decision") {
    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
      isError: true,
    };
  }

  const args = (request.params.arguments || {}) as Record<string, any>;

  const apiKey =
    args.apiKey ||
    args.api_key ||
    process.env.OPENROUTER_API_KEY;

  if (
    !apiKey ||
    typeof apiKey !== "string" ||
    apiKey.trim() === "" ||
    apiKey === "your_openrouter_api_key_here"
  ) {
    return {
      content: [
        {
          type: "text",
          text: "Missing or invalid OPENROUTER_API_KEY. Please provide a valid OPENROUTER_API_KEY in your MCP client environment configuration or as an apiKey tool argument.",
        },
      ],
      isError: true,
    };
  }

  const { state, question, type, criteria } = args as {
    state?: string;
    question?: string;
    type?: "noul" | "choice" | "score";
    criteria?: any;
  };

  const missingFields: string[] = [];
  if (!state) missingFields.push("state");
  if (!question) missingFields.push("question");
  if (!type) missingFields.push("type");
  if (criteria === undefined || criteria === null) missingFields.push("criteria");

  if (missingFields.length > 0) {
    return {
      content: [
        {
          type: "text",
          text: `Missing required argument(s): ${missingFields.join(", ")}.`,
        },
      ],
      isError: true,
    };
  }

  const startTime = Date.now();

  try {
    const payload = {
      model: "~typesafe/jev-latest",
      state,
      questions: {
        eval: {
          type,
          instructions: question,
          criteria,
        },
      },
    };

    // Strip reasoning flags that certain IDE clients may inject
    // @ts-expect-error — these properties might be injected by clients
    delete payload.enable_thinking;
    // @ts-expect-error
    delete payload.reasoning;
    // @ts-expect-error
    delete payload.thinking;

    const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/Ravinder82/jev-flash-router",
        "X-OpenRouter-Title": "jev-flash-router",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        content: [
          {
            type: "text",
            text: `OpenRouter Decisions API Error (${response.status}): ${errorText}`,
          },
        ],
        isError: true,
      };
    }

    const data = await response.json();
    const latency = Date.now() - startTime;
    const answer = data.answers?.eval ?? data;

    const result = {
      result: answer,
      telemetry: {
        latency_ms: latency,
        output_tokens: 0,
        cost: "$0.00 output",
      },
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to execute decision: ${error.message || String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Process signal & error handlers
process.on("uncaughtException", (error) => {
  process.stderr.write(`[jev-flash-router] Uncaught exception: ${error?.stack || error}\n`);
});

process.on("unhandledRejection", (reason) => {
  process.stderr.write(`[jev-flash-router] Unhandled rejection: ${reason}\n`);
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("SIGTERM", () => {
  process.exit(0);
});

// Start the stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting jev-flash-router:", err);
  process.exit(1);
});
