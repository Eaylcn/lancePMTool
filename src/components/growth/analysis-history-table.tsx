"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnalysisHistoryTableProps {
  data: {
    gameId: string;
    gameTitle: string;
    genre: unknown;
    platform: string | null;
    overallRating: string | null;
    hasAnalysis: boolean;
    hasAiAnalysis: boolean;
    observationLevel: string | null;
    createdAt: string;
  }[];
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-slate-500/10 text-slate-500",
  intermediate: "bg-blue-500/10 text-blue-500",
  advanced: "bg-purple-500/10 text-purple-500",
  professional: "bg-amber-500/10 text-amber-500",
};

export function AnalysisHistoryTable({ data }: AnalysisHistoryTableProps) {
  const t = useTranslations("growth");
  const router = useRouter();
  const locale = useLocale();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("analysisHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {t("noAnalyses")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">{t("gameTitle")}</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground hidden sm:table-cell">{t("genre")}</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">{t("aiStatus")}</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground hidden sm:table-cell">{t("observationLevel")}</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">{t("date")}</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => {
                  const genres = Array.isArray(item.genre) ? (item.genre as string[]) : [];
                  return (
                    <tr key={item.gameId} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-2">
                        <span className="font-medium">{item.gameTitle}</span>
                      </td>
                      <td className="py-2.5 px-2 hidden sm:table-cell">
                        <span className="text-muted-foreground text-xs">
                          {genres.slice(0, 2).join(", ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {item.hasAiAnalysis ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/40 inline" />
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center hidden sm:table-cell">
                        {item.observationLevel ? (
                          <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[item.observationLevel] || ""}`}>
                            {t(`observationLevels.${item.observationLevel}`)}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-2.5 px-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => router.push(`/${locale}/game/${item.gameId}`)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
