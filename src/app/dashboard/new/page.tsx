"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initFirebase } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

/** Upload page — handles questionnaire + reference document uploads, parsing, and storage */
export default function NewQuestionnairePage() {
  return (
    <ProtectedRoute>
      <UploadContent />
    </ProtectedRoute>
  );
}

function UploadContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [questionnaireFile, setQuestionnaireFile] = useState<File | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  /** Parse a single PDF file via the API route */
  async function parsePdf(file: File): Promise<{ text: string; filename: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/documents/parse", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed to parse ${file.name}`);
    }

    return response.json();
  }

  /** Extract questions from questionnaire text via Gemini API */
  async function extractQuestions(text: string): Promise<string[]> {
    const response = await fetch("/api/questionnaire/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to extract questions");
    }

    const data = await response.json();
    return data.questions;
  }

  /** Handle the full upload, parse, and store workflow */
  async function handleProcess() {
    if (!user || !questionnaireFile || referenceFiles.length === 0) return;

    setLoading(true);
    setError("");

    try {
      // Step 1: Parse questionnaire PDF
      setStatus("Parsing questionnaire...");
      const questionnaireParsed = await parsePdf(questionnaireFile);

      // Step 2: Extract individual questions using Gemini
      setStatus("Extracting questions...");
      const questions = await extractQuestions(questionnaireParsed.text);

      // Step 3: Parse reference documents
      setStatus("Parsing reference documents...");
      const parsedDocs = await Promise.all(
        referenceFiles.map((file) => parsePdf(file))
      );

      // Step 4: Create questionnaire document in Firestore
      setStatus("Saving to database...");
      const { db } = initFirebase();
      const questionnaireRef = await addDoc(collection(db, "questionnaires"), {
        userId: user.uid,
        title: questionnaireFile.name.replace(".pdf", ""),
        status: "ready",
        createdAt: serverTimestamp(),
      });

      // Step 5: Store each extracted question in Firestore
      const questionPromises = questions.map((questionText) =>
        addDoc(collection(db, "questions"), {
          questionnaireId: questionnaireRef.id,
          text: questionText,
          answer: "",
          citation: "",
          confidence: "",
          evidenceSnippet: "",
          edited: false,
        })
      );
      await Promise.all(questionPromises);

      // Step 6: Store each reference document's text in Firestore
      const docPromises = parsedDocs.map((doc) =>
        addDoc(collection(db, "documents"), {
          userId: user.uid,
          questionnaireId: questionnaireRef.id,
          title: doc.filename.replace(".pdf", ""),
          content: doc.text,
          createdAt: serverTimestamp(),
        })
      );
      await Promise.all(docPromises);

      // Navigate to the questionnaire review page
      setStatus("Done! Redirecting...");
      router.push(`/dashboard/questionnaire/${questionnaireRef.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
      setStatus("");
    }
  }

  /** Handle reference file selection (max 8 files) */
  function handleReferenceFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 8) {
      setError("Maximum 8 reference documents allowed.");
      return;
    }
    setReferenceFiles(files);
    setError("");
  }

  const isReady = questionnaireFile && referenceFiles.length > 0 && !loading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          New Questionnaire
        </h1>
        <p className="text-gray-600 mb-8">
          Upload your questionnaire and reference documents to get started.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Section 1: Questionnaire Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            1. Upload Questionnaire
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload the vendor assessment questionnaire PDF.
          </p>

          <label className="block cursor-pointer">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                questionnaireFile
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {questionnaireFile ? (
                <div>
                  <div className="text-2xl mb-2">📄</div>
                  <p className="text-sm font-medium text-gray-900">
                    {questionnaireFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(questionnaireFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm text-gray-600">
                    Click to upload questionnaire PDF
                  </p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  setQuestionnaireFile(e.target.files?.[0] || null);
                  setError("");
                }}
                disabled={loading}
              />
            </div>
          </label>
        </div>

        {/* Section 2: Reference Documents Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            2. Upload Reference Documents
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload 1–8 internal documents (security policy, compliance docs, etc.).
          </p>

          <label className="block cursor-pointer">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                referenceFiles.length > 0
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {referenceFiles.length > 0 ? (
                <div>
                  <div className="text-2xl mb-2">📎</div>
                  <p className="text-sm font-medium text-gray-900">
                    {referenceFiles.length} document{referenceFiles.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="mt-2 space-y-1">
                    {referenceFiles.map((file, i) => (
                      <p key={i} className="text-xs text-gray-500">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-2">📎</div>
                  <p className="text-sm text-gray-600">
                    Click to upload reference documents (PDF)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Max 8 files</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleReferenceFiles}
                disabled={loading}
              />
            </div>
          </label>
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={!isReady}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {status}
            </>
          ) : (
            "Process Documents"
          )}
        </button>
      </main>
    </div>
  );
}
