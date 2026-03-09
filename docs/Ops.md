# AlmaAssist — Operations

## Development

### Local Setup
```bash
git clone <repo-url>
cd alma-assist
npm install
cp .env.example .env.local
# Fill in .env.local with your Firebase + Gemini credentials
npm run dev
```

### Development Server
- URL: http://localhost:3000
- Hot reload enabled
- API routes available at /api/*

## Environment Variables

See `.env.example` for the full list. Required:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Yes | Firebase Admin project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Yes | Firebase Admin service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Yes | Firebase Admin private key (with newlines) |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key (uses Gemini 2.0 Flash Lite) |

## Build & Deploy

### Build
```bash
npm run build
```

### Firebase Hosting Deployment
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Monitoring

### Error Tracking
- Console.error for server-side errors
- Client-side error boundaries for React errors
- Firebase Console for auth and Firestore metrics

### Performance
- Next.js built-in analytics
- Firestore Console for read/write usage
- Gemini API Console for usage and rate limits

## Maintenance

### Dependency Updates
```bash
npm audit
npm update
```

### Firestore Backup
- Manual export via Firebase Console
- Recommended before major changes

## Known Limitations (MVP)

- No automated CI/CD pipeline (deploy manually)
- No structured logging (console only)
- No uptime monitoring
- No automated database backups
- Single region deployment
