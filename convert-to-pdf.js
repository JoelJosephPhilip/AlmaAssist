// Script to convert markdown reference docs to PDF using jsPDF
const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "docs", "eduvault-refs");
const outputDir = path.join(__dirname, "test-pdfs");

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const md = fs.readFileSync(path.join(inputDir, file), "utf-8");
  const pdfName = file.replace(".md", ".pdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const lines = md.split("\n");

  for (const line of lines) {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    if (line.startsWith("# ")) {
      // H1
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const text = line.replace(/^# /, "");
      doc.text(text, margin, y);
      y += 10;
    } else if (line.startsWith("## ")) {
      // H2
      y += 3;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const text = line.replace(/^## /, "");
      doc.text(text, margin, y);
      y += 8;
    } else if (line.startsWith("### ")) {
      // H3
      y += 2;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const text = line.replace(/^### /, "");
      doc.text(text, margin, y);
      y += 7;
    } else if (line.startsWith("#### ")) {
      // H4
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const text = line.replace(/^#### /, "");
      doc.text(text, margin, y);
      y += 6;
    } else if (line.startsWith("---")) {
      // Horizontal rule
      y += 2;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
    } else if (line.startsWith("| ") && line.includes("|")) {
      // Table row
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const clean = line.replace(/\*\*/g, "").trim();
      if (clean.match(/^[\|\s\-:]+$/)) continue; // skip separator rows
      doc.text(clean, margin, y);
      y += 5;
    } else if (line.startsWith("- ")) {
      // Bullet
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const text = line.replace(/^- /, "").replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize("• " + text, maxWidth - 5);
      for (const wl of wrapped) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(wl, margin + 3, y);
        y += 5;
      }
    } else if (line.match(/^\d+\. /)) {
      // Numbered list
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const text = line.replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize(text, maxWidth - 5);
      for (const wl of wrapped) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(wl, margin + 3, y);
        y += 5;
      }
    } else if (line.trim() === "") {
      y += 3;
    } else {
      // Regular paragraph
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const text = line.replace(/\*\*/g, "");
      const wrapped = doc.splitTextToSize(text, maxWidth);
      for (const wl of wrapped) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(wl, margin, y);
        y += 5;
      }
    }
  }

  const outPath = path.join(outputDir, pdfName);
  fs.writeFileSync(outPath, Buffer.from(doc.output("arraybuffer")));
  console.log(`Created: ${pdfName}`);
}

console.log(`\nAll PDFs saved to: ${outputDir}`);
