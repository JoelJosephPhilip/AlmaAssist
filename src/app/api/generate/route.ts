/* API route to generate RAG-grounded answers for all questions in a questionnaire */

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/auth-helpers";
import { generateAnswer } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyAuthToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionnaireId, questionIds } = await request.json();
    if (!questionnaireId) {
      return NextResponse.json(
        { error: "Missing questionnaireId" },
        { status: 400 }
      );
    }

    // questionIds is an optional string[] — if provided, only regenerate those questions
    const isPartial = Array.isArray(questionIds) && questionIds.length > 0;

    // Verify the questionnaire belongs to the user
    const adminDb = getAdminDb();
    const questionnaireDoc = await adminDb
      .collection("questionnaires")
      .doc(questionnaireId)
      .get();

    if (!questionnaireDoc.exists) {
      return NextResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 }
      );
    }

    if (questionnaireDoc.data()?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch all questions for this questionnaire
    const questionsSnapshot = await adminDb
      .collection("questions")
      .where("questionnaireId", "==", questionnaireId)
      .get();

    if (questionsSnapshot.empty) {
      return NextResponse.json(
        { error: "No questions found for this questionnaire" },
        { status: 404 }
      );
    }

    // Filter to selected questions if partial regeneration
    const targetDocs = isPartial
      ? questionsSnapshot.docs.filter((d) => questionIds.includes(d.id))
      : questionsSnapshot.docs;

    if (targetDocs.length === 0) {
      return NextResponse.json(
        { error: "No matching questions found for the given IDs" },
        { status: 404 }
      );
    }

    // Fetch all reference documents for this questionnaire
    const docsSnapshot = await adminDb
      .collection("documents")
      .where("questionnaireId", "==", questionnaireId)
      .get();

    if (docsSnapshot.empty) {
      return NextResponse.json(
        { error: "No reference documents found" },
        { status: 404 }
      );
    }

    const referenceDocs = docsSnapshot.docs.map((doc) => ({
      title: doc.data().title,
      content: doc.data().content,
    }));

    // Generate answers one by one (sequential to respect Gemini rate limits)
    const results: { questionId: string; success: boolean }[] = [];

    for (const questionDoc of targetDocs) {
      try {
        const questionText = questionDoc.data().text;
        const answer = await generateAnswer(questionText, referenceDocs);

        // Update the question document with the generated answer
        await adminDb.collection("questions").doc(questionDoc.id).update({
          answer: answer.answer,
          citation: answer.citation,
          confidence: answer.confidence,
          evidenceSnippet: answer.evidenceSnippet,
        });

        results.push({ questionId: questionDoc.id, success: true });
      } catch (error) {
        console.error(`Failed to generate answer for question ${questionDoc.id}:`, error);
        results.push({ questionId: questionDoc.id, success: false });
      }
    }

    // Update questionnaire status to completed
    await adminDb
      .collection("questionnaires")
      .doc(questionnaireId)
      .update({ status: "completed" });

    const successCount = results.filter((r) => r.success).length;
    return NextResponse.json({
      message: `Generated ${successCount} of ${results.length} answers`,
      results,
    });
  } catch (error) {
    console.error("Answer generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate answers. Please try again." },
      { status: 500 }
    );
  }
}
