/* Shared API middleware — eliminates duplicate auth checks in route handlers */

import { NextRequest, NextResponse } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { verifyAuthToken } from "@/lib/auth-helpers";

/** Route handler that receives the already-verified token */
type AuthHandler = (
  request: NextRequest,
  token: DecodedIdToken,
) => Promise<NextResponse>;

/**
 * Wrap a Next.js route handler with Firebase auth verification.
 * Returns 401 automatically when the token is missing or invalid;
 * otherwise calls the inner handler with the decoded token.
 */
export function withAuth(
  handler: AuthHandler,
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const decodedToken = await verifyAuthToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, decodedToken);
  };
}
