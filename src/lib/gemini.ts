/* AI client — generates RAG-grounded answers via OpenRouter */

import { GeneratedAnswer } from "@/types";
import { COMPACT_CONTEXT_CHARS, FULL_CONTEXT_CHARS } from "@/lib/config";
import { callOpenRouter, parseJsonResponse } from "@/lib/openrouter-client";

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

  const responseText = await callOpenRouter(prompt, { apiKey });

  const fallback: GeneratedAnswer = {
    answer: "Not found in references.",
    citation: "",
    confidence: "low",
    evidenceSnippet: "",
  };

  try {
    const parsed = parseJsonResponse<GeneratedAnswer>(responseText, "object");
    if (!parsed) return fallback;
    return {
      answer: parsed.answer || fallback.answer,
      citation: parsed.citation || "",
      confidence: parsed.confidence || "low",
      evidenceSnippet: parsed.evidenceSnippet || "",
    };
  } catch {
    return fallback;
  }
}
