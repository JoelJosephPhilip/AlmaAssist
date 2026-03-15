/* API route to extract individual questions from raw questionnaire text via OpenRouter */

import { NextResponse } from "next/server";
import { resolveApiKey } from "@/lib/resolve-api-key";
import { withAuth } from "@/lib/api-middleware";
import { MAX_TEXT_LENGTH, MAX_QUESTIONS } from "@/lib/config";
import {
  callOpenRouter,
  OpenRouterError,
  parseJsonResponse,
} from "@/lib/openrouter-client";

export const POST = withAuth(async (request, token) => {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No questionnaire text provided" },
        { status: 400 }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Text too long. Please use a shorter document." },
        { status: 400 }
      );
    }

    let apiKey: string;
    try {
      apiKey = await resolveApiKey(token.uid);
    } catch {
      return NextResponse.json(
        { error: "No API key available. Please add your OpenRouter API key in the dashboard." },
        { status: 400 }
      );
    }

    /** Prompt: extract individual questions from raw questionnaire text */
    const prompt = `You are a document parser. Extract all individual questions from the following questionnaire text. Extract up to ${MAX_QUESTIONS} questions.

Rules:
- Return ONLY a JSON array of strings, where each string is one question.
- Extract up to ${MAX_QUESTIONS} questions maximum. If there are more than ${MAX_QUESTIONS}, pick the ${MAX_QUESTIONS} most important ones.
- Preserve the original wording of each question exactly.
- Do not include section headers, instructions, or non-question text.
- Do not add numbering — just the question text.
- If no questions are found, return an empty array.

Questionnaire text:
---
${text}
---

Return ONLY valid JSON. Example format:
["Question 1 text here?", "Question 2 text here?"]`;

    let response: string;
    try {
      response = await callOpenRouter(prompt, { apiKey });
    } catch (err) {
      if (err instanceof OpenRouterError) {
        console.error("OpenRouter error:", err.status, err.body);
        const errorMsg =
          err.status === 429
            ? "AI rate limit reached. Please wait and try again."
            : err.status === 402
              ? "AI service out of credits. Please top up at openrouter.ai/settings/credits."
              : "Failed to extract questions.";
        return NextResponse.json({ error: errorMsg }, { status: err.status });
      }
      throw err;
    }

    const questions = parseJsonResponse<string[]>(response, "array");

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: questions === null ? "Failed to extract questions from the document" : "No questions found in the document" },
        { status: questions === null ? 500 : 400 }
      );
    }

    // Cap at configured max
    const capped = questions.slice(0, MAX_QUESTIONS);

    return NextResponse.json({ questions: capped });
  } catch (error) {
    console.error("Question extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract questions. Please try again." },
      { status: 500 }
    );
  }
});
