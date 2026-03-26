"use client";

import { useState, useCallback } from "react";

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(
    async (
      title: string,
      subtitle: string,
      sections: { title: string; rows: { label: string; value: string }[] }[],
      filename: string
    ) => {
      setIsExporting(true);
      try {
        const { exportPdf: doExport } = await import("@/lib/export/pdf");
        await doExport(title, subtitle, sections, filename);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportPdf, isExporting };
}

export function useExportCsv() {
  const [isExporting, setIsExporting] = useState(false);

  const exportCsvFn = useCallback(
    async (data: Record<string, unknown>[], filename: string) => {
      setIsExporting(true);
      try {
        const { exportCsv } = await import("@/lib/export/csv");
        exportCsv(data, filename);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportCsv: exportCsvFn, isExporting };
}
