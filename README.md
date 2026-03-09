# AlmaAssist

**AI-powered vendor assessment questionnaire automation** — Upload questionnaires and reference documents, and let AI generate citation-grounded answers in real time.

---

## What I Built

AlmaAssist is a full-stack web application that automates responding to vendor assessment questionnaires using RAG (Retrieval-Augmented Generation). In B2B SaaS, companies regularly receive lengthy compliance/security questionnaires from prospective customers during procurement. Filling these out manually is slow and repetitive — AlmaAssist solves this by letting users upload a questionnaire PDF alongside reference documents, then using AI to generate grounded, citation-backed answers.

**Industry & Company Context**: EduVault — a fictional B2B EdTech SaaS company that provides a secure student data platform to universities. Universities send vendor assessment questionnaires covering security, compliance, and operational practices. EduVault's GTM team currently fills these out manually; AlmaAssist automates this.

### Core Workflow
1. **Upload** a questionnaire PDF and up to 8 reference document PDFs
2. **AI extracts** individual questions from the questionnaire automatically
3. **RAG generates** answers grounded in the reference documents, with confidence scores and evidence snippets
4. **Review, edit, and export** the completed questionnaire as a PDF

### Key Features
- PDF upload & text extraction (questionnaire + reference docs)
- AI-powered question extraction (Gemini 2.0 Flash Lite via OpenRouter)
- Full-context RAG answer generation with confidence scores (High/Medium/Low)
- Evidence snippets showing the exact reference passage supporting each answer
- Partial regeneration — select specific questions to re-generate without redoing the entire questionnaire
- Inline answer editing before export
- Coverage summary with at-a-glance stats
- PDF export of the completed questionnaire (jsPDF)
- Dashboard with questionnaire management (rename, delete)
- Firebase Authentication (email/password) with protected routes
- Animated landing page with 3D interactive mockup

---

## Assumptions

1. **Questionnaires are text-based PDFs** — The app uses `pdf-parse` for text extraction, so image-based/scanned PDFs won't work without OCR (not implemented).
2. **Reference documents contain the answers** — RAG can only generate answers from the content it's given. If the uploaded reference docs don't cover a question, the AI will flag low confidence.
3. **Full-context RAG is sufficient** — All reference document text is passed to the AI model in a single prompt (no vector DB / chunking). This works well for typical questionnaire reference docs but won't scale to hundreds of pages.
4. **20 questions per questionnaire** — Capped to keep AI calls manageable and response times reasonable.
5. **8 reference documents max** — Enough for typical use while staying within model context limits.
6. **Users have Firebase/OpenRouter accounts** — The app requires Firebase for auth/storage and an OpenRouter API key for AI.

---

## Trade-offs

| Decision | Benefit | Cost |
|----------|---------|------|
| **Full-context RAG (no vector DB)** | Simpler architecture, no embedding pipeline, no vector store costs | Won't scale beyond ~100 pages of reference text; higher per-request token usage |
| **OpenRouter instead of direct Gemini API** | Works globally (Gemini direct API is blocked in India); easy model switching | Adds a proxy hop; slight latency increase |
| **Firebase Auth + Firestore** | Fast to set up, free tier generous, real-time listeners | Vendor lock-in; Firestore's document model requires denormalization |
| **Server-side PDF parsing** | Simple `pdf-parse` integration, no client-side complexity | Can't handle scanned/image PDFs; large PDFs block the API route |
| **CSS-only landing page animations** | Zero JS bundle cost, no animation library dependency | Limited to CSS transforms/keyframes; less interactive than Framer Motion |
| **jsPDF for export** | Client-side generation, no server round-trip | Limited formatting control compared to server-side PDF generation (Puppeteer, etc.) |
| **No rate limiting** | Simpler implementation | Vulnerable to abuse if deployed publicly without additional infrastructure |

---

## What I Would Improve with More Time

1. **Vector-based RAG with chunking** — Replace full-context RAG with a proper embedding pipeline (e.g., OpenAI embeddings + Pinecone/ChromaDB) to handle large document sets and improve retrieval precision.
2. **OCR support** — Add Tesseract.js or a cloud OCR API to support scanned PDF questionnaires.
3. **Rate limiting & abuse prevention** — Add per-user rate limits on API routes (e.g., using Upstash Redis) to prevent AI endpoint abuse.
4. **Streaming responses** — Stream AI responses token-by-token instead of waiting for the full response, improving perceived latency.
5. **Batch processing** — Allow processing multiple questionnaires in parallel with a job queue.
6. **Answer history & versioning** — Track edits over time so users can revert or compare answer versions.
7. **Team collaboration** — Share questionnaires across team members with role-based access (viewer, editor, admin).
8. **Template system** — Save and reuse answers for frequently asked questions across different questionnaires.
9. **Better PDF export** — Use a server-side rendering approach (Puppeteer or React-PDF) for richer formatting, tables, and branding.
10. **E2E tests** — Add Playwright or Cypress tests covering the full upload → generate → review → export workflow.

---

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router, TypeScript) |
| Styling     | Tailwind CSS                        |
| Auth        | Firebase Authentication (email/password) |
| Database    | Cloud Firestore                     |
| AI          | Gemini 2.0 Flash Lite via OpenRouter API      |
| PDF Parse   | `pdf-parse`                         |
| PDF Export  | `jsPDF`                             |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (free Spark plan)
- An OpenRouter API key (free tier)

### 1. Clone and install

```bash
git clone <repo-url>
cd alma-assist
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create a new project
2. Enable **Authentication** → Sign-in method → Email/Password
3. Enable **Cloud Firestore** → Create database (start in test mode for development)
4. Go to Project Settings → General → Your apps → Add a **Web app** → Copy the config values
5. Go to Project Settings → Service accounts → Generate new private key (download the JSON)

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Firebase Client SDK (from web app config)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (from service account key JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OpenRouter API
OPENROUTER_API_KEY=your-openrouter-api-key
```

Get your OpenRouter API key from [OpenRouter](https://openrouter.ai/keys). The app uses the `google/gemini-2.0-flash-lite-001` model.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Firestore Security Rules

In the Firebase Console → Firestore → Rules, deploy these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own questionnaires
    match /questionnaires/{questionnaireId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Questions access scoped through the API (admin SDK bypasses rules)
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }

    // Documents access scoped through user ownership
    match /documents/{documentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

## Usage

1. **Sign up** for an account at `/signup`
2. **Upload** a questionnaire PDF and 1–8 reference document PDFs at `/dashboard/new`
3. **Generate answers** — Click "Generate Answers" on the review page
4. **Review & edit** — Check confidence scores, view evidence snippets, edit answers inline
5. **Export** — Download the completed questionnaire as a PDF
6. **Manage** — Rename or delete questionnaires from the dashboard

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── documents/parse/    # PDF text extraction
│   │   ├── generate/           # RAG answer generation
│   │   └── questionnaire/process/ # Question extraction
│   ├── dashboard/
│   │   ├── new/                # Upload page
│   │   └── questionnaire/[id]/ # Review/edit page
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── page.tsx                # Landing page
├── components/
│   ├── Header.tsx              # Navigation header
│   └── ProtectedRoute.tsx      # Auth guard
├── contexts/
│   └── AuthContext.tsx          # Firebase auth state
├── lib/
│   ├── firebase.ts             # Firebase client SDK
│   ├── firebase-admin.ts       # Firebase Admin SDK
│   ├── auth-helpers.ts         # Token verification
│   ├── gemini.ts               # OpenRouter AI client (Gemini 2.0 Flash Lite)
│   └── pdf-export.ts           # jsPDF export utility
└── types/
    └── index.ts                # TypeScript interfaces
```

## Architecture

- **Full-Context RAG**: All reference document text is passed to the AI model per question. No vector database needed.
- **Server-side auth**: API routes verify Firebase ID tokens via the Admin SDK before processing.
- **Client-side interactions**: Auth state, Firestore reads, and UI all run client-side for fast interactivity.
- **Lazy Firebase initialization**: SDK initialization is deferred to avoid build-time errors during Next.js static generation.

## License

Private — EduVault internal use.
