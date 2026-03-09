/* TypeScript interfaces for AlmaAssist data models */

/** User profile stored in Firestore */
export interface User {
  email: string;
  createdAt: Date;
}

/** Questionnaire metadata */
export interface Questionnaire {
  id?: string;
  userId: string;
  title: string;
  status: "processing" | "ready" | "completed";
  createdAt: Date;
}

/** Individual question extracted from a questionnaire */
export interface Question {
  id?: string;
  questionnaireId: string;
  text: string;
  answer: string;
  citation: string;
  confidence: "high" | "medium" | "low" | "";
  evidenceSnippet: string;
  edited: boolean;
}

/** Reference document stored in Firestore */
export interface ReferenceDocument {
  id?: string;
  userId: string;
  questionnaireId: string;
  title: string;
  content: string;
  createdAt: Date;
}

/** Gemini API response shape for a single answer */
export interface GeneratedAnswer {
  answer: string;
  citation: string;
  confidence: "high" | "medium" | "low";
  evidenceSnippet: string;
}

/** Coverage summary stats */
export interface CoverageSummary {
  total: number;
  answered: number;
  notFound: number;
}
