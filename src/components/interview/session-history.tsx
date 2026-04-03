"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock, CheckCircle2, Trash2, Briefcase, Coins,
  MousePointerClick, BookOpen, Users, BarChart3, Radio,
} from "lucide-react";
import type { InterviewTopic } from "@/lib/ai/prompts/interview";

const TOPIC_ICONS: Record<string, React.ElementType> = {
  general_pm: Briefcase,
  monetization: Coins,
  ftue: MousePointerClick,
  case_study: BookOpen,
  behavioral: Users,
  metrics_kpi: BarChart3,
  live_ops: Radio,
};

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
  onDelete: (sessionId: string) => void;
  deleting?: boolean;
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

export function SessionHistory({ sessions, onSelect, onDelete, deleting }: SessionHistoryProps) {
  const t = useTranslations("interview");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  if (sessions.length === 0) return null;

  const topics = Array.from(new Set(sessions.map(s => s.topic)));

  const filtered = sessions.filter(s => {
    if (filterTopic !== "all" && s.topic !== filterTopic) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground">{t("sessionHistory")}</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} / {sessions.length}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterTopic("all")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border transition-all",
            filterTopic === "all"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          {t("allTopics")}
        </button>
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => setFilterTopic(filterTopic === topic ? "all" : topic)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border transition-all",
              filterTopic === topic
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border/60 text-muted-foreground hover:border-border"
            )}
          >
            {t(`topics.${topic as InterviewTopic}`)}
          </button>
        ))}
        <div className="w-px bg-border/60 mx-1" />
        <button
          onClick={() => setFilterStatus("all")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border transition-all",
            filterStatus === "all"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          {t("allStatuses")}
        </button>
        <button
          onClick={() => setFilterStatus(filterStatus === "completed" ? "all" : "completed")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1",
            filterStatus === "completed"
              ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          {t("completed")}
        </button>
        <button
          onClick={() => setFilterStatus(filterStatus === "active" ? "all" : "active")}
          className={cn(
            "text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1",
            filterStatus === "active"
              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          <Clock className="h-3 w-3" />
          {t("active")}
        </button>
      </div>

      {/* Session Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((session) => {
          const TopicIcon = TOPIC_ICONS[session.topic] || Briefcase;
          const scoreNum = session.avgScore ? Number(session.avgScore) : null;

          return (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group rounded-xl border-border/60"
              onClick={() => onSelect(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <TopicIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">
                        {t(`topics.${session.topic as InterviewTopic}`)}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(session.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      disabled={deleting}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {t(`difficulty.${session.difficulty}`)}
                  </Badge>
                  {scoreNum !== null && (
                    <Badge className={cn(
                      "text-xs border-0",
                      scoreNum >= 7 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                      scoreNum >= 5 ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                      "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                      {scoreNum.toFixed(1)}/10
                    </Badge>
                  )}
                  <div className="ml-auto">
                    {session.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
