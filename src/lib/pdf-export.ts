/* PDF export utility — generates a clean questionnaire PDF using jsPDF */

import { jsPDF } from "jspdf";
import { Question, CoverageSummary } from "@/types";

/** Generate and download a PDF of the completed questionnaire */
export function exportQuestionnairePdf(
  title: string,
  questions: Question[],
  coverage: CoverageSummary
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  /** Add a new page if near the bottom */
  function checkNewPage(requiredSpace: number) {
    if (y + requiredSpace > 270) {
      doc.addPage();
      y = 20;
    }
  }

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  y += 8;

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
  y += 6;

  // Coverage summary
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Coverage: ${coverage.answered} answered, ${coverage.notFound} not found, ${coverage.total} total`,
    margin,
    y
  );
  y += 10;

  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Questions and answers
  questions.forEach((q, index) => {
    checkNewPage(50);

    // Question number and text
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    const questionLines = doc.splitTextToSize(
      `Q${index + 1}: ${q.text}`,
      maxWidth
    );
    doc.text(questionLines, margin, y);
    y += questionLines.length * 5 + 4;

    checkNewPage(30);

    // Answer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const answerLines = doc.splitTextToSize(`A: ${q.answer || "No answer generated"}`, maxWidth);
    doc.text(answerLines, margin, y);
    y += answerLines.length * 5 + 3;

    // Citation
    if (q.citation) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 180);
      doc.text(`Source: ${q.citation}`, margin, y);
      y += 5;
    }

    // Confidence
    if (q.confidence) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Confidence: ${q.confidence}`, margin, y);
      y += 5;
    }

    // Separator
    y += 4;
    checkNewPage(5);
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  });

  // Download the PDF
  doc.save(`${title}-completed.pdf`);
}
