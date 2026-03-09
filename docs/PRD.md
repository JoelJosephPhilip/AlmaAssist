# AlmaAssist — Product Requirements Document

## Overview

AlmaAssist is an internal web application built for EduVault's GTM (Go-To-Market) team. It automates the process of answering vendor assessment questionnaires sent by universities during procurement reviews.

## Problem Statement

Universities send security, compliance, and operational questionnaires to vendors like EduVault during procurement. Currently, the GTM team answers these manually — a time-consuming, repetitive process that pulls resources from higher-value work.

## Solution

AlmaAssist uses Retrieval Augmented Generation (RAG) to:

1. Parse uploaded questionnaire PDFs into individual questions
2. Retrieve relevant internal documentation
3. Generate grounded answers with citations using Gemini 2.0 Flash Lite (via OpenRouter)
4. Allow users to review and edit answers
5. Export completed questionnaires as PDF

## Target Users

- EduVault GTM team members (sales engineers, compliance analysts)
- Internal use only — not customer-facing

## Core User Workflow

1. User signs up / logs in (email/password)
2. User uploads a questionnaire PDF
3. User uploads 1–8 reference documents (internal docs)
4. System parses questionnaire into individual questions
5. User clicks "Generate Answers"
6. Gemini (via OpenRouter) generates answers grounded in reference docs with citations
7. User reviews, edits if needed
8. User exports completed questionnaire as PDF

## Key Requirements

### Functional
- Email/password authentication (Firebase Auth)
- PDF upload and text extraction (pdf-parse)
- AI-powered question extraction from questionnaire text (Gemini via OpenRouter)
- RAG-based answer generation with citations (Gemini 2.0 Flash Lite via OpenRouter)
- Inline answer editing with persistence
- PDF export of completed questionnaire (jsPDF)
- Confidence score per answer (high/medium/low)
- Evidence snippets showing exact source text
- Coverage summary (total/answered/not found)
- Questionnaire rename and delete from dashboard

### Non-Functional
- Mobile responsive UI
- Loading states for all async operations
- Error handling for all API calls
- Free tier services only
- No hardcoded secrets

## Out of Scope (MVP)
- Collaborative editing
- Version history
- Batch processing multiple questionnaires
- Team management / roles
- File storage (original PDFs are not persisted)
- Vector database / embeddings

## Success Metrics
- Time to complete a questionnaire: < 15 minutes (vs hours manually)
- Answer accuracy: > 80% of answers require no editing
- System reliability: all core flows work end-to-end
