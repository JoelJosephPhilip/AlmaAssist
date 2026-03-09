# AlmaAssist — Security Documentation

## Authentication

- **Provider**: Firebase Authentication (Email/Password)
- **Session Management**: Firebase Auth SDK manages tokens client-side
- **Token Verification**: All API routes verify Firebase ID tokens server-side using Firebase Admin SDK
- **Password Policy**: Delegated to Firebase defaults (min 6 characters)

## API Security

### Server-Side API Keys
- `OPENROUTER_API_KEY` is stored as a server-only environment variable (no `NEXT_PUBLIC_` prefix)
- All AI API calls are made from Next.js API routes, never from the client
- Firebase Admin credentials are server-only

### API Route Protection
- Every API route verifies the Firebase ID token from the `Authorization: Bearer <token>` header
- Unauthorized requests receive 401 response
- Token verification uses Firebase Admin SDK `verifyIdToken()`

## Data Security

### Firestore Security Rules
- Users can only read/write documents where `userId` matches their Firebase Auth UID
- Questions are protected at the application level (ownership verified via questionnaire lookup)
- No public read/write access

### Data at Rest
- Firestore data is encrypted at rest by Google Cloud (AES-256)
- No additional application-level encryption needed for this internal tool

### Data in Transit
- All communication over HTTPS (enforced by Firebase Hosting and Next.js)
- Firebase SDK uses secure WebSocket connections

## Input Validation

### File Uploads
- Accept only PDF files (MIME type + extension check)
- File size limit enforced client-side and server-side
- pdf-parse handles malformed PDFs gracefully with error handling

### User Input
- Email validated by Firebase Auth
- Firestore document writes validated for required fields
- No raw SQL — Firestore uses document-based queries (no injection risk)

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Client | Firebase client SDK configuration |
| `FIREBASE_ADMIN_*` | Server only | Firebase Admin SDK credentials |
| `OPENROUTER_API_KEY` | Server only | OpenRouter AI API authentication |

## Secrets Management

- All secrets stored in `.env.local` (not committed to git)
- `.env.example` provides template without actual values
- `.gitignore` includes `.env.local`

## OWASP Top 10 Considerations

1. **Broken Access Control**: Firestore rules + server-side token verification
2. **Cryptographic Failures**: HTTPS everywhere, Google-managed encryption at rest
3. **Injection**: No SQL, Firestore document-based, PDF content sanitized
4. **Insecure Design**: Minimal attack surface, internal tool
5. **Security Misconfiguration**: Environment variables, no hardcoded secrets
6. **Vulnerable Components**: Regular npm audit, minimal dependencies
7. **Auth Failures**: Firebase Auth handles password hashing, session management
8. **Integrity Failures**: npm lock file, no CDN for critical scripts
9. **Logging Failures**: Console logging for errors (production would add structured logging)
10. **SSRF**: No user-controlled URLs passed to server-side requests
