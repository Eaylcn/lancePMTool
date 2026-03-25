"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2 } from "lucide-react";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

interface Session {
  id: string;
  topic: string;
  difficulty: string;
  status: string;
  avgScore?: string | null;
  createdAt: string;
}

interface SessionHistoryProps {
  sessions: Session[];
  onSelect: (sessionId: string) => void;
}

export function SessionHistory({ sessions, onSelect }: SessionHistoryProps) {
  const t = useTranslations("interview");

  if (sessions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground">{t("sessionHistory")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/30"
            onClick={() => onSelect(session.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">
                  {t(`topics.${session.topic as InterviewTopic}`)}
                </h4>
                {session.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {t(`difficulty.${session.difficulty}`)}
                </Badge>
                {session.avgScore && (
                  <Badge className={cn(
                    "text-xs",
                    Number(session.avgScore) >= 7 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                    Number(session.avgScore) >= 5 ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                    "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}>
                    {t("score")}: {Number(session.avgScore).toFixed(1)}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
