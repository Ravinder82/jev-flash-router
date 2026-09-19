#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
dotenv.config();
const server = new Server({
    name: "jev-flash-router",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Register the tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "evaluate_decision",
                description: "Zero-token-output decision engine powered by TypeSafe Jev. Evaluates context, code diffs, logs, or planning options and returns calibrated probabilities. Use this BEFORE generating long reasoning plans or multi-file edits to pick optimal paths.",
                inputSchema: {
                    type: "object",
                    properties: {
                        state: {
                            type: "string",
                            description: "The context, code diff, error log, or task description to evaluate.",
                        },
                        question: {
                            type: "string",
                            description: "The targeted question to evaluate (e.g., 'Will this change cause a breaking API error?').",
                        },
                        type: {
                            type: "string",
                            enum: ["noul", "choice", "score"],
                            description: "Decision format: 'noul' (binary yes/no probability), 'choice' (categorical distribution), or 'score' (ordered rubric).",
                        },
                        criteria: {
                            type: "object",
                            description: "Criteria map: for 'noul' provide { true: '...', false: '...' }, for 'choice' provide { option1: '...', option2: '...' }, for 'score' provide an array of strings in order.",
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
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return {
            content: [
                {
                    type: "text",
                    text: "Missing OPENROUTER_API_KEY. Please provide OPENROUTER_API_KEY in your MCP client environment configuration.",
                },
            ],
            isError: true,
        };
    }
    const { state, question, type, criteria } = request.params.arguments;
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
        // Strip reasoning flags that ZCode IDE may inject — these cause HTTP 400
        // on providers (NVIDIA NIM, non-reasoning OpenRouter endpoints) that
        // enforce strict parameter validation.
        // @ts-expect-error — these properties are injected by the client and not part of our schema
        delete payload.enable_thinking;
        // @ts-expect-error
        delete payload.reasoning;
        // @ts-expect-error
        delete payload.thinking;
        const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
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
    }
    catch (error) {
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
// Start the stdio transport
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Fatal error starting jev-mcp:", err);
    process.exit(1);
});
