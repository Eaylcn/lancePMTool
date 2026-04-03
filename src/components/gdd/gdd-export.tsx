"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhaseInfo {
  phase: number;
  key: string;
  title: string;
}

interface GDDExportProps {
  title: string;
  gddData: Record<string, Record<string, unknown>>;
  isCompleted: boolean;
  phases?: PhaseInfo[];
}

const DEFAULT_PHASE_NAMES: Record<string, string> = {
  pitch: "Temel Fikir & Pitch",
  genre: "Tür & Oynanış",
  core_loop: "Core Loop",
  world: "Dünya & Atmosfer",
  characters: "Karakter & Düşmanlar",
  systems: "Sistemler",
  mvp: "MVP Kapsamı",
};

function generateMarkdown(title: string, data: Record<string, Record<string, unknown>>, phases?: PhaseInfo[]): string {
  const lines: string[] = [];
  lines.push(`# ${title} — Game Design Document`);
  lines.push(`> Oluşturulma tarihi: ${new Date().toLocaleDateString("tr-TR")}`);
  lines.push("");

  // Build phase list: use dynamic phases if available, otherwise defaults
  const phaseEntries: { key: string; name: string }[] = phases
    ? phases.map(p => ({ key: p.key, name: p.title }))
    : Object.entries(DEFAULT_PHASE_NAMES).map(([key, name]) => ({ key, name }));

  for (const { key, name: phaseName } of phaseEntries) {
    const phaseData = data[key];
    if (!phaseData || Object.keys(phaseData).length === 0) continue;

    lines.push(`## ${phaseName}`);
    lines.push("");

    for (const [field, value] of Object.entries(phaseData)) {
      if (value === null || value === undefined) continue;
      const label = field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

      if (typeof value === "string") {
        lines.push(`**${label}:** ${value}`);
      } else if (Array.isArray(value)) {
        lines.push(`**${label}:**`);
        if (value.length > 0 && typeof value[0] === "string") {
          value.forEach(v => lines.push(`- ${v}`));
        } else {
          value.forEach(v => lines.push(`- ${JSON.stringify(v)}`));
        }
      } else if (typeof value === "object") {
        lines.push(`**${label}:**`);
        lines.push("```json");
        lines.push(JSON.stringify(value, null, 2));
        lines.push("```");
      }
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  lines.push("*Bu doküman GameLens GDD Oluşturucu ile üretilmiştir.*");
  return lines.join("\n");
}

export function GDDExport({ title, gddData, isCompleted, phases }: GDDExportProps) {
  const [exporting, setExporting] = useState(false);
  const t = useTranslations("gdd");

  const handleMarkdownDownload = () => {
    const markdown = generateMarkdown(title, gddData, phases);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_GDD.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDFDownload = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const markdown = generateMarkdown(title, gddData, phases);
      const lines = markdown.split("\n");

      let y = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 6;

      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        if (line.startsWith("# ")) {
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text(line.replace(/^# /, ""), margin, y);
          y += lineHeight * 2;
        } else if (line.startsWith("## ")) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(line.replace(/^## /, ""), margin, y);
          y += lineHeight * 1.5;
        } else if (line.startsWith("**")) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          const cleanLine = line.replace(/\*\*/g, "");
          const split = doc.splitTextToSize(cleanLine, 170);
          doc.text(split, margin, y);
          y += lineHeight * split.length;
        } else if (line.startsWith("- ")) {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const split = doc.splitTextToSize("  " + line, 170);
          doc.text(split, margin, y);
          y += lineHeight * split.length;
        } else if (line.startsWith(">")) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          doc.text(line.replace(/^> /, ""), margin, y);
          y += lineHeight;
        } else if (line === "---") {
          y += lineHeight;
        } else if (line.trim() === "" || line === "```json" || line === "```") {
          y += lineHeight * 0.5;
        } else {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const split = doc.splitTextToSize(line, 170);
          doc.text(split, margin, y);
          y += lineHeight * split.length;
        }
      }

      doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}_GDD.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setExporting(false);
    }
  };

  const hasData = Object.keys(gddData).some(key => {
    const phase = gddData[key];
    return phase && Object.keys(phase).length > 0;
  });

  if (!hasData) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleMarkdownDownload}
        disabled={!isCompleted && !hasData}
      >
        <FileText className="h-4 w-4 mr-1" />
        {t("exportMd")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePDFDownload}
        disabled={exporting || (!isCompleted && !hasData)}
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-1" />
        )}
        {t("exportPdf")}
      </Button>
    </div>
  );
}
