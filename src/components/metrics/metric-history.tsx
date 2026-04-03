"use client";

import { useTranslations } from "next-intl";
import { History, Heart, Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MetricAiAnalysis } from "@/lib/metrics/types";

interface MetricHistoryItem {
  id: string;
  gameId: string;
  gameTitle: string | null;
  rawMetrics: unknown;
  derivedMetrics: unknown;
  aiAnalysis: MetricAiAnalysis | null;
  createdAt: string;
}

interface MetricHistoryProps {
  analyses: MetricHistoryItem[];
  onSelect: (item: MetricHistoryItem) => void;
}

export function MetricHistory({ analyses, onSelect }: MetricHistoryProps) {
  const t = useTranslations("metrics.history");

  if (analyses.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Card className="p-8 text-center">
          <History className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadge = (score: number) => {
    if (score >= 70) return { label: t("statusGood"), variant: "default" as const, className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" };
    if (score >= 40) return { label: t("statusWarning"), variant: "default" as const, className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" };
    return { label: t("statusCritical"), variant: "default" as const, className: "bg-red-500/15 text-red-500 border-red-500/30" };
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">
                  {t("colDate")}
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-xs">
                  {t("colGame")}
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs hidden sm:table-cell">
                  {t("colScore")}
                </th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground text-xs hidden sm:table-cell">
                  {t("colStatus")}
                </th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((item) => {
                const score = item.aiAnalysis?.healthScore ?? 0;
                const status = getStatusBadge(score);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm truncate max-w-[200px]">
                          {item.gameTitle || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                        {score}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </td>
                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                      <Badge variant={status.variant} className={status.className}>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
