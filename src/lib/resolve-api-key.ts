/* Resolve the OpenRouter API key: user's custom key (from Firestore) or fallback to env */

import { getAdminDb } from "./firebase-admin";

export async function resolveApiKey(uid: string): Promise<string> {
  // Try user's saved key first
  const adminDb = getAdminDb();
  const doc = await adminDb.collection("userSettings").doc(uid).get();
  const userKey = doc.exists ? doc.data()?.openrouterApiKey : null;

  if (userKey && typeof userKey === "string" && userKey.length > 0) {
    return userKey;
  }

  // Fallback to server env key
  const envKey = process.env.OPENROUTER_API_KEY;
  if (!envKey) {
    throw new Error("No API key available. Please add your own OpenRouter API key in the dashboard.");
  }
  return envKey;
}
