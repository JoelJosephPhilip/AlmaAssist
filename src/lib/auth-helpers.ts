/* Server-side auth helper — verifies Firebase ID tokens in API routes */

import { getAdminAuth } from "./firebase-admin";
import { NextRequest } from "next/server";

/** Extract and verify the Firebase ID token from the Authorization header.
 *  Returns the decoded token (contains uid, email, etc.) or null if invalid. */
export async function verifyAuthToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
