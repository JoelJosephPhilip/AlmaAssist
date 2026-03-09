# AlmaAssist

**AI-Powered Vendor Questionnaire Automation for EduVault SaaS**

Answer vendor assessment questionnaires in minutes, not hours. AlmaAssist uses Gemini AI to read your reference documents and generate accurate, citation-backed answers automatically.

---

## Table of Contents

- [About](#about)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
  - [Firebase Setup Guide](#firebase-setup-guide)
  - [OpenRouter API Setup](#openrouter-api-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Assumptions](#assumptions)
- [Trade-offs](#trade-offs)
- [Future Improvements](#future-improvements)
- [Deployment](#deployment)
- [Security](#security)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## About

### What AlmaAssist Does

AlmaAssist automates the tedious process of answering vendor assessment questionnaires sent by university procurement teams. Instead of spending hours manually searching through security policies, compliance documents, and technical specifications, users can:

1. **Upload** a questionnaire PDF and reference documents
2. **Let AI** analyze the documents and generate grounded answers
3. **Review, edit, and export** a professional PDF

### Company Context

**EduVault SaaS** is a fictional cloud-based student data management platform for universities. The app helps EduVault's GTM team automatically answer vendor assessment questionnaires sent by universities using their internal reference documents.

This is a real problem that university vendors face — procurement teams send long security, compliance, and operational questionnaires that take hours to answer manually. AlmaAssist automates this entire workflow using RAG (Retrieval-Augmented Generation).

---

## Live Demo

**Production URL**: [https://alma-assist-new.vercel.app/](https://alma-assist-new.vercel.app/)

### Demo Account

A pre-loaded demo account is available for reviewers:

| Field | Value |
|-------|-------|
| **Email** | demo@gmail.com |
| **Password** | Hello@1234 |

The account is pre-loaded with:
- EduVault vendor assessment questionnaire (15 questions)
- 2 reference documents (Security Policy + Technical Specs & SLA)
- AI-generated answers with confidence scores and citations

**Recommended flow:**
1. Log in with demo credentials above
2. Open the pre-loaded questionnaire
3. View AI-generated answers with evidence snippets
4. Try editing an answer inline
5. Export the completed questionnaire as PDF

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Frontend | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Authentication | Firebase Auth | 10.x |
| Database | Cloud Firestore | - |
| AI | Gemini 2.0 Flash Lite (via OpenRouter) | - |
| PDF Parsing | pdf-parse | 1.x |
| PDF Export | jsPDF | 2.x |

### Free Tier Services

All services used offer free tiers with no credit card required:

| Service | Cost | Limits |
|---------|------|--------|
| Firebase Spark | Free | 50K reads/day, 20K writes/day, 1GB storage |
| OpenRouter (Gemini Flash Lite) | Free | Pay-per-token, very low cost |
| Vercel Hosting | Free | 100GB bandwidth, unlimited deployments |

---

## Features

### Core Features

- ✅ **User Authentication** — Email/password signup and login via Firebase Auth
- ✅ **PDF Upload & Parsing** — Upload questionnaire PDF + up to 8 reference document PDFs
- ✅ **AI Question Extraction** — Gemini automatically identifies individual questions from the questionnaire
- ✅ **RAG Answer Generation** — Full-context RAG generates answers grounded in your reference documents
- ✅ **Confidence Scores** — Visual indicator of answer reliability (High / Medium / Low, color-coded)
- ✅ **Evidence Snippets** — See the exact passage from reference docs that supports each answer
- ✅ **Inline Editing** — Review and edit any answer before export
- ✅ **Coverage Summary** — At-a-glance stats on how many questions were answered
- ✅ **PDF Export** — Download the completed questionnaire as a formatted PDF
- ✅ **Questionnaire Management** — Rename and delete questionnaires from the dashboard
- ✅ **Animated Landing Page** — 3D interactive mockup with CSS-only animations

### Nice-to-Have Features

- ✅ **Partial Regeneration** — Select specific questions to re-generate without redoing the entire questionnaire
- ✅ **Server-side Auth on All Routes** — All API endpoints verify Firebase ID tokens
- ✅ **Input Validation** — 10MB file size limit, 500KB text limit, 20 question cap

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Check | Link |
|------------|---------|-------|------|
| Node.js | 18.x or higher | `node --version` | [nodejs.org](https://nodejs.org/) |
| npm | 9.x or higher | `npm --version` | Comes with Node.js |
| Git | 2.x or higher | `git --version` | [git-scm.com](https://git-scm.com/) |
| Firebase Account | - | - | [firebase.google.com](https://firebase.google.com/) |
| OpenRouter API Key | - | - | [openrouter.ai](https://openrouter.ai/) |

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/JoelJosephPhilip/AlmaAssist.git

# Navigate to project directory
cd AlmaAssist
```

#### 2. Install Dependencies

```bash
# Install all dependencies
npm install
```

This will install:
- Next.js and React
- Firebase SDK (Client + Admin)
- pdf-parse for PDF extraction
- jsPDF for PDF generation
- Tailwind CSS and its dependencies

#### 3. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local
```

#### 4. Configure Environment Variables

Open `.env.local` in your text editor and add your values:

```env
# ===========================================
# FIREBASE CLIENT SDK (PUBLIC)
# ===========================================
# These are safe to expose to the client (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ===========================================
# FIREBASE ADMIN SDK (PRIVATE - SERVER ONLY)
# ===========================================
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ===========================================
# OPENROUTER API (PRIVATE - SERVER ONLY)
# ===========================================
# This is NOT exposed to the client - keep it secret
OPENROUTER_API_KEY=your-openrouter-api-key
```

**Important:**
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Replace placeholder values with your actual keys
- The `NEXT_PUBLIC_` prefix makes variables accessible in the browser
- Variables without the prefix are server-side only

#### 5. Run Development Server

```bash
# Start the development server
npm run dev
```

#### 6. Open in Browser

Navigate to: [http://localhost:3000](http://localhost:3000)

You should see the AlmaAssist landing page.

---

### Firebase Setup Guide

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `alma-assist` (or any name you prefer)
4. Disable Google Analytics (not needed for this project)
5. Click "Create project"
6. Wait ~30 seconds for project creation
7. Click "Continue"

#### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get Started"
3. Click "Email/Password" under Sign-in providers
4. Toggle "Enable" to ON
5. Click "Save"

#### Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Select region: Choose closest to your location
5. Click "Enable"
6. Wait for database creation (~10 seconds)

#### Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon (`</>`)
5. Enter app nickname: `alma-assist-web`
6. Click "Register app"
7. Copy the config values from the displayed code:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",        // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "...",          // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "...",           // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "...",       // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",   // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."                // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

#### Step 5: Get Firebase Admin Credentials

1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the values into `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

#### Step 6: Set Firestore Security Rules

1. Go to Firestore Database → Rules tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /questionnaires/{questionnaireId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /documents/{documentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

---

### OpenRouter API Setup

#### Step 1: Create Account

1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in

#### Step 2: Create API Key

1. Go to [API Keys](https://openrouter.ai/keys)
2. Click "Create Key"
3. Copy the generated API key

#### Step 3: Add to Environment File

Add your OpenRouter API key to `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-...your-actual-key-here
```

The app uses the `google/gemini-2.0-flash-lite-001` model via OpenRouter, which works globally (unlike the direct Gemini API which is blocked in some regions).

---

## Usage

### User Workflow

1. **Sign Up**
   - Click "Get Started" on landing page
   - Enter email and password (min 6 characters)
   - Click "Create account"

2. **Upload Questionnaire**
   - On dashboard, click "New Questionnaire"
   - Upload a questionnaire PDF (max 10MB)
   - Only PDF format supported

3. **Upload Reference Documents**
   - Upload 1–8 reference PDFs
   - These are your company's internal documents:
     - Security policies
     - Compliance documentation
     - Technical specifications
     - Support SLAs

4. **Generate Answers**
   - Questions are automatically extracted from the questionnaire
   - Click "Generate Answers"
   - Wait for AI processing (~10–30 seconds)

5. **Review & Edit**
   - See all generated answers with confidence scores
   - View evidence snippets for each answer
   - Edit any answer inline if needed
   - Select specific questions for partial regeneration

6. **Export PDF**
   - Click "Export PDF"
   - Professional document with all Q&As
   - Ready for submission

7. **Manage**
   - Rename or delete questionnaires from the dashboard

### Demo Data

The `Sample Questionnaire/` folder contains ready-to-use PDF files for testing:

#### LARGE-PDFS (Full Set — 10 files)

| File | Description | Use As |
|------|-------------|--------|
| `questionnaire.pdf` | Vendor assessment questionnaire | Questionnaire |
| `questionnaire-completed.pdf` | Example of a completed questionnaire | Reference |
| `security-policy.pdf` | EduVault security documentation | Reference |
| `privacy-compliance.pdf` | FERPA/GDPR compliance policies | Reference |
| `technical-specs.pdf` | Technical specifications | Reference |
| `support-sla.pdf` | Support SLA documentation | Reference |
| `api-documentation.pdf` | API documentation | Reference |
| `backup-procedures.pdf` | Backup & recovery procedures | Reference |
| `mfa-policy.pdf` | Multi-factor authentication policy | Reference |
| `accessibility-compliance.pdf` | Accessibility compliance docs | Reference |

#### SMALL-PDFS (Quick Test — 5 files)

| File | Description | Use As |
|------|-------------|--------|
| `questionnaire.pdf` | Vendor assessment questionnaire | Questionnaire |
| `security-policy.pdf` | Security documentation | Reference |
| `privacy-compliance.pdf` | Compliance policies | Reference |
| `technical-specs.pdf` | Technical specifications | Reference |
| `support-sla.pdf` | Support SLA documentation | Reference |

**To test the app:**
1. Upload `questionnaire.pdf` from either folder as the questionnaire
2. Upload the remaining PDFs as reference documents
3. Click "Generate Answers" and review the AI-generated responses

---

## Project Structure

```
alma-assist/
├── Sample Questionnaire/             # Demo PDF files for testing
│   ├── LARGE-PDFS/                   # Full set (10 PDFs)
│   └── SMALL-PDFS/                   # Quick test set (5 PDFs)
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── documents/parse/      # PDF text extraction (auth + 10MB limit)
│   │   │   ├── generate/             # RAG answer generation (auth + ownership)
│   │   │   └── questionnaire/process/ # Question extraction (auth + 500KB limit)
│   │   ├── dashboard/
│   │   │   ├── new/                  # Upload page
│   │   │   └── questionnaire/[id]/   # Review/edit page
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   ├── page.tsx                  # Landing page (animated 3D mockup)
│   │   └── globals.css               # Global styles + CSS animations
│   │
│   ├── components/                   # React components
│   │   ├── Header.tsx                # Navigation header
│   │   └── ProtectedRoute.tsx        # Auth guard wrapper
│   │
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx            # Firebase auth state
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── firebase.ts               # Firebase client SDK (lazy init)
│   │   ├── firebase-admin.ts         # Firebase Admin SDK (lazy init)
│   │   ├── auth-helpers.ts           # Token verification helper
│   │   ├── gemini.ts                 # OpenRouter AI client
│   │   └── pdf-export.ts             # jsPDF export utility
│   │
│   └── types/                        # TypeScript types
│       └── index.ts                  # All type definitions
│
├── .env.example                      # Environment template
├── .env.local                        # Your local config (not committed)
├── .gitignore                        # Git ignore rules
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript config
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

---

## Troubleshooting

### Common Issues & Solutions

#### "Module not found" Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "Firebase: Error (auth/invalid-api-key)"

- Verify `.env.local` exists and has correct values
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly
- Restart development server after creating `.env.local`

#### "Failed to parse PDF"

- Ensure file is a valid PDF
- Check file size is under 10MB
- Verify PDF is not password-protected
- Some scanned PDFs may not have extractable text

#### "Failed to generate answers"

- Verify `OPENROUTER_API_KEY` in `.env.local`
- Check API key is valid on [OpenRouter](https://openrouter.ai/keys)
- Ensure you haven't exceeded rate limits
- Try again after a few seconds

#### "Port 3000 already in use"

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

#### 401 Unauthorized on API Routes

- Ensure you're logged in before making API calls
- Check that Firebase Auth is properly configured
- Clear browser cookies and log in again

---

## Assumptions

1. **Users have PDF questionnaires** from universities or procurement teams
2. **Reference documents contain relevant information** for answering questions
3. **Questions follow standard vendor assessment format** (numbered questions)
4. **Users can verify and edit AI-generated answers** before submission
5. **PDFs contain extractable text** (not scanned images without OCR)
6. **Full-context RAG is sufficient** — all reference doc text passed in a single prompt (no vector DB / chunking)
7. **20 questions per questionnaire** — capped to keep AI calls manageable
8. **8 reference documents max** — sufficient for typical use while staying within model context limits
9. **Users have stable internet connection** for AI processing

---

## Trade-offs

| Decision | Benefit | Trade-off |
|----------|---------|-----------|
| **Full-context RAG (no vector DB)** | Simpler architecture, no embedding pipeline, no vector store costs | Won't scale beyond ~100 pages of reference text; higher per-request token usage |
| **OpenRouter instead of direct Gemini API** | Works globally (direct API blocked in India); easy model switching | Adds a proxy hop; slight latency increase |
| **Firebase Auth + Firestore** | Fast to set up, free tier generous, real-time capable | Vendor lock-in; Firestore's document model requires denormalization |
| **Server-side PDF parsing** | Simple `pdf-parse` integration, no client-side complexity | Can't handle scanned/image PDFs; large PDFs block the API route |
| **CSS-only landing page animations** | Zero JS bundle cost, no animation library dependency | Limited to CSS transforms/keyframes; less interactive than Framer Motion |
| **Client-side PDF Export (jsPDF)** | No server round-trip, instant download | Limited formatting control compared to server-side generation (Puppeteer, etc.) |
| **Email-only Auth** | Faster to implement, sufficient for B2B | No social login (Google, GitHub) |

---

## Future Improvements

### What I Would Improve with More Time

1. **Vector-based RAG with chunking** — Replace full-context RAG with a proper embedding pipeline (e.g., OpenAI embeddings + Pinecone/ChromaDB) to handle large document sets and improve retrieval precision
2. **OCR support** — Add Tesseract.js or a cloud OCR API to support scanned PDF questionnaires
3. **Rate limiting & abuse prevention** — Add per-user rate limits on API routes (e.g., using Upstash Redis) to prevent AI endpoint abuse
4. **Streaming responses** — Stream AI responses token-by-token instead of waiting for the full response, improving perceived latency
5. **Batch processing** — Handle multiple questionnaires in parallel with a job queue

### Long-term Roadmap

6. **Answer history & versioning** — Track edits over time so users can revert or compare answer versions
7. **Team collaboration** — Share questionnaires across team members with role-based access (viewer, editor, admin)
8. **Template system** — Save and reuse answers for frequently asked questions across different questionnaires
9. **Better PDF export** — Use server-side rendering (Puppeteer or React-PDF) for richer formatting, tables, and branding
10. **E2E tests** — Add Playwright or Cypress tests covering the full upload → generate → review → export workflow
11. **More formats** — Support Word, Excel questionnaires
12. **API integrations** — Direct submission to procurement portals
13. **Analytics dashboard** — Track time saved, answer accuracy

---

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest deployment option for Next.js:

1. **Push to GitHub** (already done)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Import `AlmaAssist` repository

3. **Configure Environment Variables**

   In Vercel dashboard, add these environment variables:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your-project-id |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | your-sender-id |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | your-app-id |
   | `FIREBASE_ADMIN_PROJECT_ID` | your-project-id |
   | `FIREBASE_ADMIN_CLIENT_EMAIL` | your-admin-client-email |
   | `FIREBASE_ADMIN_PRIVATE_KEY` | your-admin-private-key |
   | `OPENROUTER_API_KEY` | Your OpenRouter API key |

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Get live URL

---

## Security

### Implemented Security Measures

- ✅ All API keys stored in environment variables (never committed to Git)
- ✅ Firebase Security Rules enforce user isolation (users can only access own data)
- ✅ Server-side authentication on ALL API routes (Firebase ID token verification)
- ✅ No secrets in client-side code (`NEXT_PUBLIC_` prefix only for safe values)
- ✅ Input validation on all API routes (file size, text length limits)
- ✅ PDF file size validation (10MB max)
- ✅ Questionnaire text length validation (500KB max)
- ✅ Question count cap (20 per questionnaire)
- ✅ `.env.local` excluded from Git via `.gitignore`
- ✅ Ownership verification on answer generation (users can only generate for their own questionnaires)

### Security Rules Summary

| Collection | Rule |
|-----------|------|
| `users/{userId}` | User can only read/write own data |
| `questionnaires/{id}` | User can only access own questionnaires |
| `questions/{id}` | Authenticated users can read/create/update |
| `documents/{id}` | User can only access own documents |

### Best Practices

1. Never commit `.env.local` to Git
2. Regenerate API keys if exposed
3. Use environment-specific Firebase projects for production
4. Enable Firebase App Check in production
5. Review Firestore rules before production deployment

---

## Scripts

```bash
# Development
npm run dev          # Start development server (port 3000)

# Build
npm run build        # Create production build
npm run start        # Start production server

# Quality
npm run lint         # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

This project is for demonstration purposes.

---

## Credits

Built with:

- [Next.js](https://nextjs.org/) — The React Framework
- [Firebase](https://firebase.google.com/) — App development platform
- [Gemini AI](https://ai.google.dev/) — Google's generative AI (via OpenRouter)
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation library
- [pdf-parse](https://github.com/ibash/pdf-parse) — PDF text extraction

---

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on [GitHub](https://github.com/JoelJosephPhilip/AlmaAssist/issues)

---

**AlmaAssist** — Answer vendor questionnaires in minutes, not hours.
