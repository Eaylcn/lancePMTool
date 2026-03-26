import { jsPDF } from "jspdf";

interface PdfSection {
  title: string;
  rows: { label: string; value: string }[];
}

export async function exportPdf(
  title: string,
  subtitle: string,
  sections: PdfSection[],
  filename: string
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  y += 8;

  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(subtitle, margin, y);
  doc.setTextColor(0);
  y += 10;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  for (const section of sections) {
    // Check if we need a new page
    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    // Section title
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, y);
    y += 7;

    doc.setFontSize(9);
    for (const row of section.rows) {
      if (y > 275) {
        doc.addPage();
        y = margin;
      }

      // Label
      doc.setFont("helvetica", "bold");
      doc.text(row.label + ":", margin, y);

      // Value — wrap text
      doc.setFont("helvetica", "normal");
      const labelWidth = doc.getTextWidth(row.label + ": ");
      const valueX = margin + Math.min(labelWidth, 50);
      const maxWidth = contentWidth - (valueX - margin);
      const lines = doc.splitTextToSize(row.value || "-", maxWidth);
      doc.text(lines, valueX, y);
      y += lines.length * 4 + 2;
    }

    y += 4;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `GameLens — ${new Date().toLocaleDateString()}`,
      margin,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      `${i}/${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    );
  }

  doc.save(`${filename}.pdf`);
}
