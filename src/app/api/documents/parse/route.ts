/* API route to parse PDF files and extract text using pdf-parse */

import { NextResponse } from "next/server";
import { MAX_FILE_SIZE } from "@/lib/config";
import { withAuth } from "@/lib/api-middleware";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer and parse with pdf-parse v1
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(buffer);

    if (!result.text || result.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file may be empty or scanned." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: result.text,
      filename: file.name,
      pages: result.numpages,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. The file may be corrupted." },
      { status: 500 }
    );
  }
});
