"use client";

import { useTranslations } from "next-intl";
import {
  Trophy, TrendingUp, Lightbulb, Target,
  MessageSquare, CheckCircle2, AlertCircle, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PmLevelBadge } from "./pm-level-badge";

interface GrowthReportProps {
  report: {
    currentLevel: string;
    overallAssessment: string;
    strengths: { category: string; detail: string }[];
    weaknesses: { category: string; detail: string }[];
    trendAnalysis: { period: string; level: string; insight: string }[];
    genreDiversity: { genre: string; count: number; depth: string }[];
    actionPlan: { priority: number; action: string; timeline: string; reason: string }[];
    interviewReadiness: { topic: string; readiness: string; tip: string }[];
    createdAt: string;
  };
  overallScore?: number;
}

const READINESS_COLORS: Record<string, string> = {
  low: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export function GrowthReport({ report, overallScore }: GrowthReportProps) {
  const t = useTranslations("growth");

  return (
    <div className="space-y-4">
      {/* PM Level Hero */}
      <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("pmLevel")}</p>
              <PmLevelBadge level={report.currentLevel} size="lg" showDescription />
            </div>
            {overallScore !== undefined && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t("overallScore")}</p>
                <p className="text-3xl font-bold text-primary">{overallScore}</p>
              </div>
            )}
          </div>
          {report.overallAssessment && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-3 pt-3 border-t border-border/50">
              {report.overallAssessment}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {report.strengths.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t("strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.strengths.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs font-medium text-emerald-500 mb-0.5">{s.category}</p>
                  <p className="text-sm text-muted-foreground">{s.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {report.weaknesses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                {t("weaknesses")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.weaknesses.map((w, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <p className="text-xs font-medium text-orange-500 mb-0.5">{w.category}</p>
                  <p className="text-sm text-muted-foreground">{w.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trend Analysis */}
      {report.trendAnalysis.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              {t("trendAnalysis")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.trendAnalysis.map((tr, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                    {i < report.trendAnalysis.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{tr.period}</span>
                      <Badge variant="outline" className="text-[10px]">{tr.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tr.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      {report.actionPlan.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              {t("actionPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.actionPlan.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {item.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Readiness */}
      {report.interviewReadiness.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              {t("interviewReadiness")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.interviewReadiness.map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{item.topic}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${READINESS_COLORS[item.readiness] || ""}`}
                    >
                      {t(`readiness.${item.readiness}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Genre Diversity */}
      {report.genreDiversity.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {t("genreDiversity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report.genreDiversity.map((item, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.genre}</span>
                    <Badge variant="secondary" className="text-[10px]">{item.count}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.depth}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
