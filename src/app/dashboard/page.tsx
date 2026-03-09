"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { initFirebase } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Questionnaire } from "@/types";

/** Dashboard page — lists user's questionnaires with option to create new ones */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  /** Fetch user's questionnaires from Firestore on mount */
  useEffect(() => {
    async function fetchQuestionnaires() {
      if (!user) return;

      try {
        const { db } = initFirebase();
        const q = query(
          collection(db, "questionnaires"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Questionnaire[];
        setQuestionnaires(data);
      } catch (error) {
        console.error("Failed to fetch questionnaires:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestionnaires();
  }, [user]);

  /** Delete a questionnaire and all its associated questions and documents */
  async function handleDelete(questionnaireId: string) {
    if (!confirm("Delete this questionnaire and all its data? This cannot be undone.")) return;

    try {
      const { db } = initFirebase();
      const batch = writeBatch(db);

      // Delete associated questions
      const questionsSnap = await getDocs(
        query(collection(db, "questions"), where("questionnaireId", "==", questionnaireId))
      );
      questionsSnap.docs.forEach((d) => batch.delete(d.ref));

      // Delete associated documents
      const docsSnap = await getDocs(
        query(collection(db, "documents"), where("questionnaireId", "==", questionnaireId))
      );
      docsSnap.docs.forEach((d) => batch.delete(d.ref));

      // Delete the questionnaire itself
      batch.delete(doc(db, "questionnaires", questionnaireId));

      await batch.commit();
      setQuestionnaires((prev) => prev.filter((q) => q.id !== questionnaireId));
    } catch (error) {
      console.error("Failed to delete questionnaire:", error);
      alert("Failed to delete. Please try again.");
    }
  }

  /** Rename a questionnaire */
  async function handleRename(questionnaireId: string, currentTitle: string) {
    const newTitle = prompt("Enter new name:", currentTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === currentTitle) return;

    try {
      const { db } = initFirebase();
      await updateDoc(doc(db, "questionnaires", questionnaireId), {
        title: newTitle.trim(),
      });
      setQuestionnaires((prev) =>
        prev.map((q) => (q.id === questionnaireId ? { ...q, title: newTitle.trim() } : q))
      );
    } catch (error) {
      console.error("Failed to rename questionnaire:", error);
      alert("Failed to rename. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Manage your vendor assessment questionnaires
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            New Questionnaire
          </Link>
        </div>

        {/* Questionnaire list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : questionnaires.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No questionnaires yet
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a vendor questionnaire and reference documents to get started.
            </p>
            <Link
              href="/dashboard/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload Your First Questionnaire
            </Link>
          </div>
        ) : (
          /* Questionnaire cards */
          <div className="grid gap-4">
            {questionnaires.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/questionnaire/${q.id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-semibold text-gray-900 truncate">
                      {q.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created {q.createdAt.toLocaleDateString()}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <StatusBadge status={q.status} />
                    <button
                      onClick={() => handleRename(q.id!, q.title)}
                      className="text-xs text-gray-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Rename"
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={() => handleDelete(q.id!)}
                      className="text-xs text-gray-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/** Displays a colored badge for questionnaire status */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: "bg-yellow-100 text-yellow-800",
    ready: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
