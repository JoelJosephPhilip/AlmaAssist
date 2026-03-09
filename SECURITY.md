# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability in AlmaAssist, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email the maintainer directly or use GitHub's private vulnerability reporting
3. Include a description of the vulnerability and steps to reproduce
4. Allow reasonable time for a fix before public disclosure

## Security Measures

### Authentication & Authorization

- All API routes verify Firebase ID tokens via the Admin SDK (`verifyAuthToken()`)
- Firestore Security Rules enforce user isolation — users can only access their own data
- Protected routes redirect unauthenticated users to login

### Input Validation

- PDF file size limit: **10MB** maximum
- Questionnaire text length limit: **500KB** maximum
- Question count cap: **20 questions** per questionnaire
- Reference document cap: **8 documents** per questionnaire

### Secrets Management

- All API keys stored in environment variables (`.env.local`)
- `.env.local` is excluded from Git via `.gitignore`
- Only `NEXT_PUBLIC_` prefixed variables are exposed to the client
- Firebase Admin credentials and OpenRouter API key are server-side only

### Data Isolation

| Firestore Collection | Access Rule |
|---------------------|-------------|
| `users/{userId}` | Only the authenticated user can read/write their own document |
| `questionnaires/{id}` | Only the owner can read/write; any authenticated user can create |
| `questions/{id}` | Any authenticated user can read/create/update |
| `documents/{id}` | Only the owner can read/write; any authenticated user can create |

### Best Practices for Deployment

1. Never commit `.env.local` to version control
2. Regenerate API keys immediately if exposed
3. Use separate Firebase projects for development and production
4. Enable Firebase App Check in production
5. Review and tighten Firestore Security Rules before production deployment
6. Monitor OpenRouter API usage for unexpected spikes
