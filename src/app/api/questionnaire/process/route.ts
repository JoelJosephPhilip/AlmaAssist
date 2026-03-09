/* API route to extract individual questions from raw questionnaire text via OpenRouter */

import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-lite-001";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "No questionnaire text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    /** Prompt: extract individual questions from raw questionnaire text */
    const prompt = `You are a document parser. Extract all individual questions from the following questionnaire text. Extract up to 20 questions.

Rules:
- Return ONLY a JSON array of strings, where each string is one question.
- Extract up to 20 questions maximum. If there are more than 20, pick the 20 most important ones.
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
      console.error("OpenRouter error:", res.status, body);
      return NextResponse.json(
        { error: res.status === 429 ? "AI rate limit reached. Please wait and try again." : "Failed to extract questions." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to extract questions from the document" },
        { status: 500 }
      );
    }

    // Sanitize control characters that break JSON.parse (tabs, newlines inside strings, etc.)
    const sanitized = jsonMatch[0].replace(/[\x00-\x1F\x7F]/g, (ch: string) => {
      if (ch === "\n" || ch === "\r" || ch === "\t") return " ";
      return "";
    });

    const questions: string[] = JSON.parse(sanitized);

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found in the document" },
        { status: 400 }
      );
    }

    // Cap at 20 questions
    const capped = questions.slice(0, 20);

    return NextResponse.json({ questions: capped });
  } catch (error) {
    console.error("Question extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract questions. Please try again." },
      { status: 500 }
    );
  }
}
