/* Shared OpenRouter API client — single fetch wrapper + JSON sanitisation */

import {
  OPENROUTER_API_URL,
  OPENROUTER_MODEL,
  OPENROUTER_MAX_TOKENS,
} from "@/lib/config";

// ——— Error class with HTTP status for callers that need status-specific handling ———

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

// ——— Core fetch wrapper ———

interface CallOptions {
  apiKey?: string;
  maxTokens?: number;
}

/**
 * Call the OpenRouter chat-completions endpoint and return the assistant
 * message content.  Throws `OpenRouterError` on non-2xx responses so
 * callers can inspect `.status` for fine-grained error handling.
 */
export async function callOpenRouter(
  prompt: string,
  opts: CallOptions = {},
): Promise<string> {
  const key = opts.apiKey || process.env.OPENROUTER_API_KEY;
  if (!key)
    throw new Error(
      "No API key available. Please add your OpenRouter API key in the dashboard.",
    );

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      max_tokens: opts.maxTokens ?? OPENROUTER_MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new OpenRouterError(
      `OpenRouter error ${res.status}: ${body}`,
      res.status,
      body,
    );
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ——— JSON extraction + sanitisation ———

/**
 * Extract the first JSON object (`{…}`) or array (`[…]`) from raw LLM
 * output, strip control characters that break `JSON.parse`, and return
 * the parsed value.  Returns `null` when no match is found.
 */
export function parseJsonResponse<T = unknown>(
  text: string,
  shape: "object" | "array",
): T | null {
  const pattern = shape === "object" ? /\{[\s\S]*\}/ : /\[[\s\S]*\]/;
  const match = text.match(pattern);
  if (!match) return null;

  const sanitized = match[0].replace(
    /[\x00-\x1F\x7F]/g,
    (ch: string) => {
      if (ch === "\n" || ch === "\r" || ch === "\t") return " ";
      return "";
    },
  );

  return JSON.parse(sanitized) as T;
}
