# AlmaAssist — Integrations

## External Services

### 1. Firebase Authentication
- **Purpose**: User signup/login with email and password
- **SDK**: `firebase` (client), `firebase-admin` (server)
- **Tier**: Free (Spark plan) — up to 10K monthly active users
- **Configuration**: Client config via `NEXT_PUBLIC_FIREBASE_*` env vars

### 2. Cloud Firestore
- **Purpose**: Primary database for all application data
- **SDK**: `firebase` (client reads), `firebase-admin` (server writes)
- **Tier**: Free (Spark plan) — 1 GiB storage, 50K reads/day, 20K writes/day
- **Collections**: users, questionnaires, questions, documents

### 3. OpenRouter API (Gemini 2.0 Flash Lite)
- **Purpose**: AI-powered question extraction and answer generation
- **Protocol**: OpenAI-compatible chat completions (`https://openrouter.ai/api/v1/chat/completions`)
- **Tier**: Free / low-cost
- **API Key**: Server-side only (`OPENROUTER_API_KEY`)
- **Model**: `google/gemini-2.0-flash-lite-001`
- **Usage**:
  - Extract individual questions from raw questionnaire text
  - Generate answers grounded in reference documents (RAG)
  - Return structured JSON: answer, citation, confidence, evidence snippet
- **Note**: Replaced direct Google Generative AI SDK because the Gemini API free tier has zero quota in certain regions (e.g. India). OpenRouter provides global access to the same model.

### 4. Firebase Hosting
- **Purpose**: Deploy the Next.js application
- **Tier**: Free (Spark plan) — 10 GiB storage, 360 MB/day transfer
- **Configuration**: `firebase.json` with Next.js SSR support

## NPM Libraries

### pdf-parse
- **Purpose**: Extract text content from uploaded PDF files
- **Usage**: Server-side only (Next.js API routes)
- **Input**: PDF file buffer
- **Output**: Plain text string

### jsPDF
- **Purpose**: Generate PDF exports of completed questionnaires
- **Usage**: Client-side only (runs in browser)
- **Input**: Question/answer data
- **Output**: Downloadable PDF file

## Integration Flow

```
PDF Upload → pdf-parse → extracted text
                           ↓
                    Gemini via OpenRouter (question extraction)
                           ↓
                    Firestore (store questions)
                           ↓
Reference Docs → pdf-parse → Firestore (store text)
                           ↓
                    Gemini via OpenRouter (RAG answer generation)
                           ↓
                    Firestore (store answers)
                           ↓
                    jsPDF (export)
                           ↓
                    Downloaded PDF
```

## Rate Limits & Quotas

| Service | Limit | Impact |
|---------|-------|--------|
| OpenRouter | Model-dependent rate limits | Sequential answer generation (~10-15s for 10 questions) |
| Firestore Free | 50K reads/day | Sufficient for internal team use |
| Firestore Free | 20K writes/day | Sufficient for internal team use |
| Firebase Auth | 10K MAU | More than enough for internal tool |
