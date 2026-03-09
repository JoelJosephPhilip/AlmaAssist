# AlmaAssist — Context Log

This file is updated after every major development step.

---

## Step 1: Project Initialization — Completed

- Created Next.js 14 project with TypeScript, Tailwind CSS, ESLint, App Router
- Installed dependencies: firebase, firebase-admin, pdf-parse, jspdf, @google/generative-ai
- Created /docs folder with: PRD.md, Architecture.md, Schema.md, Context.md, User_Flow.mermaid, UI_Library.md, Security.md, Integrations.md, Testing_Suite.md, Ops.md
- Created /docs/eduvault-refs/ with demo reference documents and sample questionnaire
- Created .env.example with all required environment variables

## Step 2: Landing Page — Completed

- Built responsive landing page at `/` with hero section, 3 feature cards, EduVault footer
- Links to `/login` and `/signup`

## Step 3: Firebase Authentication — Completed

- `src/lib/firebase.ts` — Client SDK with lazy initialization (`initFirebase()`) to avoid SSR/build errors
- `src/lib/firebase-admin.ts` — Admin SDK with lazy getters (`getAdminAuth()`, `getAdminDb()`)
- `src/lib/auth-helpers.ts` — Server-side token verification
- `src/contexts/AuthContext.tsx` — React context providing user, login, signup, logout
- `src/components/ProtectedRoute.tsx` — Auth guard redirecting to `/login`
- Login page (`/login`) and signup page (`/signup`) with form validation and error handling

## Step 4: Dashboard — Completed

- `src/app/dashboard/page.tsx` — Lists user's questionnaires from Firestore, ordered by creation date
- `src/components/Header.tsx` — Navigation header with user email and logout
- Status badges (ready/completed), empty state, link to upload new

## Step 5: Document Upload & Parsing — Completed

- `src/app/api/documents/parse/route.ts` — PDF text extraction using `pdf-parse` v2 (`PDFParse` class)
- `src/app/api/questionnaire/process/route.ts` — Gemini-powered question extraction from raw text
- `src/app/dashboard/new/page.tsx` — Upload UI for questionnaire + 1-8 reference PDFs
- Full workflow: parse PDFs → extract questions → store in Firestore → redirect to review

## Step 6: AI Answer Generation (RAG) — Completed

- `src/lib/gemini.ts` — `generateAnswer()` function with structured JSON output (answer, citation, confidence, evidenceSnippet)
- `src/app/api/generate/route.ts` — Auth-protected endpoint, fetches questions + docs from Firestore, calls Gemini per question
- Full-context RAG: all reference doc text passed within Gemini's 1M token context window

## Step 7: Review & Edit Answers — Completed

- `src/app/dashboard/questionnaire/[id]/page.tsx` — Full review page with QuestionCard components
- Inline editing with save to Firestore
- "Generate Answers" button triggering the RAG pipeline

## Step 8: PDF Export — Completed

- `src/lib/pdf-export.ts` — jsPDF utility generating formatted PDF with Q&A, citations, confidence, coverage summary
- Export button on review page

## Step 9: Nice-to-Have Features — Completed

- Confidence scores: Color-coded badges (green/yellow/red) per answer
- Evidence snippets: Collapsible sections showing source passages
- Coverage summary: Stats bar showing answered/unanswered/high-confidence counts

## Step 10: Final Polish & README — Completed

- README.md with setup instructions, Firebase configuration, Firestore security rules, architecture overview
- All build errors resolved (lazy Firebase initialization for SSR compatibility)
- Production build passes cleanly (`npm run build` — all 12 pages generated successfully)

## Step 11: OpenRouter Migration — Completed

- Replaced `@google/generative-ai` SDK with direct OpenRouter fetch API calls
- Model: `google/gemini-2.0-flash-lite-001` via `https://openrouter.ai/api/v1/chat/completions`
- Reason: Gemini API free tier has 0 quota in India; OpenRouter provides global access
- Updated `src/lib/gemini.ts` — new `chatCompletion()` function using OpenRouter
- Updated `src/app/api/questionnaire/process/route.ts` — inline OpenRouter calls for question extraction
- `.env.local` now uses `OPENROUTER_API_KEY` instead of `GEMINI_API_KEY`
- Added JSON sanitization (control character stripping) in both files to handle AI model output with raw control characters

## Step 12: Dashboard Management Features — Completed

- Increased reference document upload limit from 4 to 8 (validation, UI text, placeholder)
- Added **Delete** button to dashboard — uses Firestore `writeBatch` to atomically delete questionnaire + all associated questions and documents
- Added **Rename** button to dashboard — prompts for new name, updates Firestore document title
- Fixed edit button showing blank text box — added `useEffect` to sync `editValue` with latest `question.answer` when not actively editing

## Step 13: Documentation Update — Completed

- Updated README.md, Architecture.md, Integrations.md, Security.md, PRD.md, Context.md
- All docs now reference OpenRouter instead of direct Gemini API
- All docs reflect 8 reference doc limit and rename/delete features
