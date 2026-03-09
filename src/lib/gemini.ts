/* AI client — generates RAG-grounded answers via OpenRouter (Gemini 2.0 Flash Lite) */

import { GeneratedAnswer } from "@/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-lite-001";

/** Call OpenRouter chat completions API */
async function chatCompletion(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
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

/** Generate an answer for a single question using reference documents.
 *  Returns structured answer with citation, confidence, and evidence snippet.
 *  If the answer is not found in docs, returns "Not found in references." */
export async function generateAnswer(
  question: string,
  referenceDocs: { title: string; content: string }[]
): Promise<GeneratedAnswer> {
  // Build the reference document context
  const docsContext = referenceDocs
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

  const responseText = await chatCompletion(prompt);

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
