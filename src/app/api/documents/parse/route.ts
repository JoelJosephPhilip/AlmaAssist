/* API route to parse PDF files and extract text using pdf-parse */

import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(request: NextRequest) {
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

    // Convert file to buffer and parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    if (!result.text || result.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file may be empty or scanned." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: result.text,
      filename: file.name,
      pages: result.total,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF. The file may be corrupted." },
      { status: 500 }
    );
  }
}
