/* Firebase Admin SDK initialization — server-side only, used in API routes.
   Lazy initialization to avoid build-time errors when env vars aren't set. */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _app: App | null = null;

/** Initialize Firebase Admin on first use (not at import time) */
function getApp(): App {
  if (_app) return _app;

  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Env var stores key with escaped newlines — replace them
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  return _app;
}

/** Firebase Admin Auth — for verifying ID tokens in API routes */
export function getAdminAuth(): Auth {
  getApp();
  return getAuth();
}

/** Firebase Admin Firestore — for server-side database operations */
export function getAdminDb(): Firestore {
  getApp();
  return getFirestore();
}
