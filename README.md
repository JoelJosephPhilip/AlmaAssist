# AlmaAssist

**AI-powered vendor assessment questionnaire automation** — Upload questionnaires and reference documents, and let AI generate citation-grounded answers in real time.

## Industry & Company

- **Industry**: EdTech (Education Technology)
- **Company**: **EduVault** — a fictional B2B EdTech SaaS company that provides a secure student data platform to universities. During procurement, universities send vendor assessment questionnaires covering security, compliance, and operational practices. EduVault's GTM (Go-To-Market) team currently fills these out manually — a time-consuming, repetitive process that AlmaAssist automates using RAG-based AI.

## Features

- **PDF Upload & Parsing** — Upload any questionnaire PDF + up to 8 reference document PDFs
- **AI Question Extraction** — Gemini 2.0 Flash Lite (via OpenRouter) automatically identifies individual questions from the questionnaire
- **RAG Answer Generation** — Full-context RAG generates answers grounded in your reference documents
- **Confidence Scores** — Each answer shows High / Medium / Low confidence
- **Evidence Snippets** — View the exact passage from reference docs that supports each answer
- **Inline Editing** — Edit any generated answer before exporting
- **Coverage Summary** — See at-a-glance stats on how many questions were answered
- **PDF Export** — Export the completed questionnaire as a formatted PDF
- **Questionnaire Management** — Rename and delete questionnaires from the dashboard

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
