/* AI client — generates RAG-grounded answers via OpenRouter (Gemini 2.0 Flash Lite) */

import { GeneratedAnswer } from "@/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-nano-9b-v2:free";

/** Call OpenRouter chat completions API */
async function chatCompletion(prompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("No API key available. Please add your OpenRouter API key in the dashboard.");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

/** Rough token estimate: ~4 characters per token */
const COMPACT_CONTEXT_CHARS = 40_000; // ~10K tokens — works with limited credits
const FULL_CONTEXT_CHARS = 200_000;   // ~50K tokens — needs sufficient credits

/** Generate an answer for a single question using reference documents.
 *  Returns structured answer with citation, confidence, and evidence snippet.
 *  If the answer is not found in docs, returns "Not found in references." */
export async function generateAnswer(
  question: string,
  referenceDocs: { title: string; content: string }[],
  compact: boolean = true,
  apiKey?: string
): Promise<GeneratedAnswer> {
  const maxChars = compact ? COMPACT_CONTEXT_CHARS : FULL_CONTEXT_CHARS;

  // Truncate reference docs to fit within token budget
  let totalChars = 0;
  const truncatedDocs: { title: string; content: string }[] = [];
  for (const doc of referenceDocs) {
    const remaining = maxChars - totalChars;
    if (remaining <= 0) break;
    const content = doc.content.slice(0, remaining);
    truncatedDocs.push({ title: doc.title, content });
    totalChars += content.length;
  }

  // Build the reference document context
  const docsContext = truncatedDocs
    .map((doc) => `--- Document: ${doc.title} ---\n${doc.content}`)
    .join("\n\n");

  const prompt = `You are a vendor assessment assistant. Answer the following question using ONLY the reference documents provided below.

RULES:
1. ONLY use information from the provided reference documents. Do not use any external knowledge.
2. Include a citation referencing the document name(s) used (e.g., "Security Policy", "Privacy Compliance").
3. If the answer cannot be found in the reference documents, set the answer to exactly: "Not found in references."
4. Provide a confidence level: "high" (answer directly stated in docs), "medium" (answer inferred from docs), or "low" (partial information found).
5. Include an evidence snippet — the exact relevant text from the reference document that supports your answer.

REFERENCE DOCUMENTS:
${docsContext}

QUESTION:
${question}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"answer": "your answer here", "citation": "Document Name(s)", "confidence": "high|medium|low", "evidenceSnippet": "exact text from document"}

If the answer is not found, respond with:
{"answer": "Not found in references.", "citation": "", "confidence": "low", "evidenceSnippet": ""}`;

  const responseText = await chatCompletion(prompt, apiKey);

  // Parse the JSON response, handling potential markdown wrapping
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      answer: "Not found in references.",
      citation: "",
      confidence: "low",
      evidenceSnippet: "",
    };
  }

  // Sanitize control characters that break JSON.parse
  const sanitized = jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, (ch: string) => {
    if (ch === "\n" || ch === "\r" || ch === "\t") return " ";
    return "";
  });

  try {
    const parsed = JSON.parse(sanitized) as GeneratedAnswer;
    return {
      answer: parsed.answer || "Not found in references.",
      citation: parsed.citation || "",
      confidence: parsed.confidence || "low",
      evidenceSnippet: parsed.evidenceSnippet || "",
    };
  } catch {
    return {
      answer: "Not found in references.",
      citation: "",
      confidence: "low",
      evidenceSnippet: "",
    };
  }
}
