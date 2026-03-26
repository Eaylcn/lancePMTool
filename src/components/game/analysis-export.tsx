"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table, Loader2 } from "lucide-react";
import { useExportPdf, useExportCsv } from "@/hooks/use-export";

interface AnalysisExportProps {
  game: { title: string; studio: string | null };
  analysis: Record<string, unknown> | null;
}

const ANALYSIS_FIELDS = [
  { key: "ftueFirstImpression", label: "FTUE First Impression" },
  { key: "ftueRating", label: "FTUE Rating" },
  { key: "coreLoopDefinition", label: "Core Loop" },
  { key: "coreLoopRating", label: "Core Loop Rating" },
  { key: "monetizationModel", label: "Monetization Model" },
  { key: "monetizationRating", label: "Monetization Rating" },
  { key: "retentionRating", label: "Retention Rating" },
  { key: "uxRating", label: "UX Rating" },
  { key: "metaRating", label: "Meta Rating" },
  { key: "overallBestFeature", label: "Best Feature" },
  { key: "overallWorstFeature", label: "Worst Feature" },
  { key: "overallTargetAudience", label: "Target Audience" },
  { key: "overallLearnings", label: "Key Learnings" },
];

export function AnalysisExport({ game, analysis }: AnalysisExportProps) {
  const t = useTranslations("export");
  const { exportPdf, isExporting: pdfExporting } = useExportPdf();
  const { exportCsv, isExporting: csvExporting } = useExportCsv();
  const [open, setOpen] = useState(false);

  if (!analysis) return null;

  const handlePdf = async () => {
    setOpen(false);
    const sections = [
      {
        title: "Game Analysis",
        rows: ANALYSIS_FIELDS.map((f) => ({
          label: f.label,
          value: String(analysis[f.key] || "-"),
        })),
      },
    ];
    await exportPdf(
      game.title,
      game.studio || "",
      sections,
      `${game.title.replace(/\s+/g, "_")}_analysis`
    );
  };

  const handleCsv = async () => {
    setOpen(false);
    const row: Record<string, unknown> = { title: game.title, studio: game.studio };
    ANALYSIS_FIELDS.forEach((f) => {
      row[f.label] = analysis[f.key] || "";
    });
    await exportCsv([row], `${game.title.replace(/\s+/g, "_")}_analysis`);
  };

  const isExporting = pdfExporting || csvExporting;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(!open)}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {t("export")}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-border bg-card shadow-lg py-1">
            <button
              onClick={handlePdf}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              {t("exportPdf")}
            </button>
            <button
              onClick={handleCsv}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <Table className="h-3.5 w-3.5" />
              {t("exportCsv")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
