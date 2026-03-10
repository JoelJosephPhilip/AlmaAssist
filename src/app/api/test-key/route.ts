/* API route to test an OpenRouter API key and optionally save it to user settings */

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth-helpers";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  OPENROUTER_API_URL,
  OPENROUTER_MODEL,
  OPENROUTER_KEY_PREFIX,
  OPENROUTER_TEST_MAX_TOKENS,
} from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apiKey, save } = await request.json();

    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith(OPENROUTER_KEY_PREFIX)) {
      return NextResponse.json(
        { error: `Invalid API key format. OpenRouter keys start with ${OPENROUTER_KEY_PREFIX}` },
        { status: 400 }
      );
    }

    // Test the key with a minimal request
    const res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: OPENROUTER_TEST_MAX_TOKENS,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      const status = res.status;
      const msg =
        status === 401
          ? "Invalid API key."
          : status === 402
            ? "API key has insufficient credits."
            : `API key test failed (${status}).`;
      return NextResponse.json({ valid: false, error: msg, details: body }, { status: 200 });
    }

    // Key works — optionally save it
    if (save) {
      const adminDb = getAdminDb();
      await adminDb
        .collection("userSettings")
        .doc(decodedToken.uid)
        .set({ openrouterApiKey: apiKey }, { merge: true });
    }

    return NextResponse.json({ valid: true, message: "API key is valid and working!" });
  } catch (error) {
    console.error("Test key error:", error);
    return NextResponse.json(
      { error: "Failed to test API key." },
      { status: 500 }
    );
  }
}

/** DELETE — remove saved API key */
export async function DELETE(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    await adminDb
      .collection("userSettings")
      .doc(decodedToken.uid)
      .set({ openrouterApiKey: "" }, { merge: true });

    return NextResponse.json({ message: "API key removed." });
  } catch (error) {
    console.error("Delete key error:", error);
    return NextResponse.json(
      { error: "Failed to remove API key." },
      { status: 500 }
    );
  }
}

/** GET — check if user has a saved API key */
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuthToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const doc = await adminDb
      .collection("userSettings")
      .doc(decodedToken.uid)
      .get();

    const hasKey = !!(doc.exists && doc.data()?.openrouterApiKey);
    return NextResponse.json({ hasKey });
  } catch (error) {
    console.error("Get key error:", error);
    return NextResponse.json(
      { error: "Failed to check API key." },
      { status: 500 }
    );
  }
}
