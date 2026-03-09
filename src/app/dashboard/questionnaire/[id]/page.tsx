"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Question, Questionnaire, CoverageSummary } from "@/types";
import { exportQuestionnairePdf } from "@/lib/pdf-export";

/** Questionnaire review page — view, edit, generate answers, and export */
export default function QuestionnaireReviewPage() {
  return (
    <ProtectedRoute>
      <ReviewContent />
    </ProtectedRoute>
  );
}

function ReviewContent() {
  const params = useParams();
  const questionnaireId = params.id as string;
  const { user } = useAuth();

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState("");
  const [error, setError] = useState("");

  /** Fetch questionnaire and questions from Firestore */
  const fetchData = useCallback(async () => {
    if (!questionnaireId) return;
    const { db } = initFirebase();

    try {
      // Fetch questionnaire metadata
      const qDoc = await getDoc(doc(db, "questionnaires", questionnaireId));
      if (!qDoc.exists()) {
        setError("Questionnaire not found");
        setLoading(false);
        return;
      }
      setQuestionnaire({
        id: qDoc.id,
        ...qDoc.data(),
        createdAt: qDoc.data().createdAt?.toDate() || new Date(),
      } as Questionnaire);

      // Fetch questions for this questionnaire
      const qQuery = query(
        collection(db, "questions"),
        where("questionnaireId", "==", questionnaireId)
      );
      const snapshot = await getDocs(qQuery);
      const questionsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Question[];
      setQuestions(questionsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load questionnaire");
    } finally {
      setLoading(false);
    }
  }, [questionnaireId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Trigger AI answer generation for all questions */
  async function handleGenerate() {
    if (!user) return;

    setGenerating(true);
    setGenProgress("Generating answers...");
    setError("");

    try {
      const { auth } = initFirebase();
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questionnaireId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      setGenProgress(data.message);

      // Refresh questions to show generated answers
      await fetchData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
    } finally {
      setGenerating(false);
    }
  }

  /** Save an edited answer to Firestore */
  async function handleSaveAnswer(questionId: string, newAnswer: string) {
    const { db } = initFirebase();
    try {
      await updateDoc(doc(db, "questions", questionId), {
        answer: newAnswer,
        edited: true,
      });
      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, answer: newAnswer, edited: true } : q
        )
      );
    } catch (err) {
      console.error("Failed to save answer:", err);
    }
  }

  /** Handle PDF export */
  function handleExport() {
    if (!questionnaire) return;
    const coverage = getCoverage(questions);
    exportQuestionnairePdf(questionnaire.title, questions, coverage);
  }

  /** Calculate coverage summary */
  function getCoverage(qs: Question[]): CoverageSummary {
    const total = qs.length;
    const notFound = qs.filter(
      (q) =>
        q.answer === "Not found in references." || q.answer === ""
    ).length;
    return { total, answered: total - notFound, notFound };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error && !questionnaire) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const coverage = getCoverage(questions);
  const hasAnswers = questions.some((q) => q.answer && q.answer !== "");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {questionnaire?.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {questions.length} questions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {genProgress}
                </>
              ) : (
                "Generate Answers"
              )}
            </button>
            {hasAnswers && (
              <button
                onClick={handleExport}
                className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Export PDF
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Coverage Summary */}
        {hasAnswers && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Coverage:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-gray-600">
                  Total: <span className="font-semibold">{coverage.total}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">
                  Answered:{" "}
                  <span className="font-semibold text-green-700">
                    {coverage.answered}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-600">
                  Not Found:{" "}
                  <span className="font-semibold text-red-700">
                    {coverage.notFound}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              onSave={handleSaveAnswer}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/** Individual question card with answer display, editing, confidence, and evidence */
function QuestionCard({
  question,
  index,
  onSave,
}: {
  question: Question;
  index: number;
  onSave: (questionId: string, newAnswer: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(question.answer || "");
  const [showEvidence, setShowEvidence] = useState(false);

  // Keep editValue in sync with the latest answer when not actively editing
  useEffect(() => {
    if (!editing) {
      setEditValue(question.answer || "");
    }
  }, [question.answer, editing]);

  /** Save the edited answer and exit edit mode */
  function handleSave() {
    if (question.id) {
      onSave(question.id, editValue);
    }
    setEditing(false);
  }

  /** Get confidence badge color */
  function getConfidenceColor(confidence: string) {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const hasAnswer = question.answer && question.answer !== "";
  const isNotFound = question.answer === "Not found in references.";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Question text */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-medium text-gray-900">
          <span className="text-gray-400 mr-2">Q{index + 1}.</span>
          {question.text}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Edited badge */}
          {question.edited && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              Edited
            </span>
          )}
          {/* Confidence badge */}
          {question.confidence && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${getConfidenceColor(
                question.confidence
              )}`}
            >
              {question.confidence}
            </span>
          )}
        </div>
      </div>

      {/* Answer */}
      {hasAnswer ? (
        <div>
          {editing ? (
            <div>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditValue(question.answer);
                    setEditing(false);
                  }}
                  className="text-sm text-gray-600 px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p
                className={`text-sm leading-relaxed ${
                  isNotFound ? "text-red-500 italic" : "text-gray-700"
                }`}
              >
                {question.answer}
              </p>
              <div className="flex items-center gap-4 mt-3">
                {/* Citation badge */}
                {question.citation && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    📎 {question.citation}
                  </span>
                )}
                {/* Edit button */}
                <button
                  onClick={() => {
                    setEditValue(question.answer || "");
                    setEditing(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                {/* Evidence toggle */}
                {question.evidenceSnippet && (
                  <button
                    onClick={() => setShowEvidence(!showEvidence)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {showEvidence ? "Hide source" : "Show source"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Evidence snippet */}
          {showEvidence && question.evidenceSnippet && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Evidence from source:
              </p>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                &ldquo;{question.evidenceSnippet}&rdquo;
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">
          No answer generated yet. Click &ldquo;Generate Answers&rdquo; above.
        </p>
      )}
    </div>
  );
}
