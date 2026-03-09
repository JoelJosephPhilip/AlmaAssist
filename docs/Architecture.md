# AlmaAssist — Architecture

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                  Client (Browser)                │
│                                                  │
│  Next.js 14 App Router + React + Tailwind CSS    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Landing   │ │ Auth     │ │ Dashboard        │ │
│  │ Page      │ │ Pages    │ │ Upload / Review  │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│                      │                           │
│              Firebase Auth SDK                   │
│              (client-side auth)                   │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────┐
│              Next.js API Routes                  │
│              (Server-side)                        │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │ /api/documents/parse    — PDF parsing     │    │
│  │ /api/questionnaire/process — Q extraction │    │
│  │ /api/generate           — RAG answers     │    │
│  │ /api/export             — PDF export      │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ┌─────────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Firebase    │  │ pdf-parse  │  │OpenRouter│  │
│  │ Admin SDK   │  │            │  │(Gemini)  │  │
│  └──────┬──────┘  └────────────┘  └──────────┘  │
└─────────┼───────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────┐
│              Cloud Firestore                     │
│                                                  │
│  Collections:                                    │
│  ├── users          (auth metadata)              │
│  ├── questionnaires (uploaded questionnaires)    │
│  ├── questions      (individual Q&A pairs)       │
│  └── documents      (reference doc text)         │
└─────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### 1. Full-Context RAG (No Vector Database)

**Decision**: Pass all reference document text directly to the AI model with each question.

**Rationale**: With up to 8 reference documents (~50-200 pages total), the text fits within the model's context window. This eliminates the need for a vector database, embeddings pipeline, or similarity search — dramatically simplifying the architecture while maintaining answer quality.

**Trade-off**: Won't scale to hundreds of documents. If EduVault's doc library grows significantly, we'd add vector search (Firestore vector search or Pinecone free tier).

### 2. OpenRouter as AI Provider

**Decision**: Use OpenRouter's API to access Gemini 2.0 Flash Lite (`google/gemini-2.0-flash-lite-001`) instead of the direct Google Generative AI SDK.

**Rationale**: The Gemini API free tier has zero quota in certain regions (including India), blocking all API calls. OpenRouter provides reliable access to the same Gemini models via an OpenAI-compatible API, with a free/low-cost tier that works globally.

### 3. Gemini for Question Extraction

**Decision**: Use Gemini to parse questionnaire text into individual questions instead of regex/rule-based parsing.

**Rationale**: Questionnaires come in many formats (numbered lists, tables, paragraphs). Gemini handles all formats reliably. Regex would be brittle and format-specific.

### 4. Server-Side API Keys

**Decision**: All AI API calls go through Next.js API routes. The API key is never exposed to the client.

**Rationale**: Security best practice. Prevents key theft from browser dev tools.

### 5. No File Storage

**Decision**: PDFs are parsed immediately on upload. Only extracted text is stored in Firestore. Original files are discarded.

**Rationale**: Keeps the system simple and free-tier compatible. No need for Firebase Storage or S3. Text in Firestore is sufficient for RAG and re-generation.

### 6. Client-Side PDF Export

**Decision**: Use jsPDF in the browser to generate export PDFs.

**Rationale**: No server resources needed. Instant generation. Works offline once data is loaded.

### 7. Sequential Answer Generation

**Decision**: Generate answers one question at a time, not in parallel.

**Rationale**: API rate limits apply. Sequential processing with progress updates provides a better UX than hitting rate limits and failing.

## Data Flow

### Upload & Parse Flow
```
User uploads PDF
  → Browser reads file as ArrayBuffer
  → POST to /api/documents/parse with FormData
  → Server: pdf-parse extracts text
  → Response: extracted text string
  → (For questionnaire) POST to /api/questionnaire/process
  → Server: Gemini (via OpenRouter) extracts individual questions
  → Response: array of question strings
  → Client: creates Firestore docs (questionnaire, questions, documents)
```

### Answer Generation Flow
```
User clicks "Generate Answers"
  → POST to /api/generate with questionnaireId
  → Server: fetch all questions for questionnaire
  → Server: fetch all reference documents for questionnaire
  → For each question:
    → Call Gemini (via OpenRouter) with question + all doc text
    → Parse structured JSON response
    → Update question doc in Firestore
  → Response: generation complete
  → Client: refresh question list from Firestore
```

### Export Flow
```
User clicks "Export PDF"
  → Client: fetch all questions with answers from Firestore
  → Client: jsPDF generates PDF with Q&A, citations, coverage
  → Client: browser downloads PDF
```

## Security Model

- Firebase Auth tokens required for all API routes
- Server verifies ID token before processing any request
- Firestore security rules: users can only access their own data
- Gemini API key (OpenRouter) server-side only (env var, no NEXT_PUBLIC_ prefix)
- No secrets in client bundle
