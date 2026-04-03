"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePastTasks } from "@/hooks/use-tasks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, Calendar, BookOpen, BarChart3, Wrench, Eye, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

const TYPE_ICONS: Record<string, React.ElementType> = {
  analysis: BarChart3,
  learning: BookOpen,
  practice: Wrench,
  reflection: Eye,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

interface Task {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  difficulty: string;
  status: string;
  aiScore?: string | null;
}

export function TaskHistory() {
  const t = useTranslations("tasks");
  const locale = useLocale();
  const [range, setRange] = useState<"week" | "month">("week");
  const { data: tasks = [], isLoading } = usePastTasks(range, locale);

  // Group tasks by date
  const grouped = (tasks as Task[]).reduce<Record<string, Task[]>>((acc, task) => {
    const date = task.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Stats
  const totalTasks = (tasks as Task[]).length;
  const completedTasks = (tasks as Task[]).filter(t => t.status === "completed").length;
  const expiredTasks = (tasks as Task[]).filter(t => t.status === "expired").length;
  const avgScore = (tasks as Task[])
    .filter(t => t.aiScore)
    .reduce((sum, t, _, arr) => sum + Number(t.aiScore) / arr.length, 0);

  return (
    <div className="space-y-5">
      {/* Range Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setRange("week")}
          className={cn(
            "text-sm px-3 py-1.5 rounded-lg border transition-all",
            range === "week"
              ? "bg-primary/10 border-primary/30 text-primary font-medium"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          7 {t("streak.days")}
        </button>
        <button
          onClick={() => setRange("month")}
          className={cn(
            "text-sm px-3 py-1.5 rounded-lg border transition-all",
            range === "month"
              ? "bg-primary/10 border-primary/30 text-primary font-medium"
              : "border-border/60 text-muted-foreground hover:border-border"
          )}
        >
          30 {t("streak.days")}
        </button>
      </div>

      {/* Stats Summary */}
      {totalTasks > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="rounded-xl border-border/60">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{totalTasks}</p>
              <p className="text-xs text-muted-foreground">{t("streak.tasks")}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-border/60">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">{t("status.completed")}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-border/60">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{expiredTasks}</p>
              <p className="text-xs text-muted-foreground">{t("status.expired")}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-border/60">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{avgScore > 0 ? avgScore.toFixed(1) : "-"}</p>
              <p className="text-xs text-muted-foreground">{t("score")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task List by Date */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sortedDates.length > 0 ? (
        <div className="space-y-5">
          {sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(date + "T00:00:00").toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <Badge variant="outline" className="text-xs ml-auto">
                  {grouped[date].filter(t => t.status === "completed").length}/{grouped[date].length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grouped[date].map(task => {
                  const Icon = TYPE_ICONS[task.type] || BookOpen;
                  const isExpired = task.status === "expired";
                  const isCompleted = task.status === "completed";
                  return (
                    <Card
                      key={task.id}
                      className={cn(
                        "rounded-xl border-border/60",
                        isExpired && "opacity-60"
                      )}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2.5">
                          <div className={cn(
                            "rounded-lg p-1.5 mt-0.5",
                            isExpired ? "bg-red-500/10" : "bg-primary/10"
                          )}>
                            {isExpired ? (
                              <Clock className="h-3.5 w-3.5 text-red-500" />
                            ) : (
                              <Icon className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{task.title}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {t(`types.${task.type}`)}
                              </Badge>
                              <Badge className={cn("text-[10px] px-1.5 py-0 border-0", DIFFICULTY_COLORS[task.difficulty])}>
                                {t(`difficulty.${task.difficulty}`)}
                              </Badge>
                              {isExpired && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                  {t("status.expired")}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {isCompleted && task.aiScore && (
                            <Badge className={cn(
                              "text-xs border-0 shrink-0",
                              Number(task.aiScore) >= 7 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                              Number(task.aiScore) >= 5 ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                              "bg-red-500/10 text-red-600 dark:text-red-400"
                            )}>
                              {Number(task.aiScore).toFixed(0)}/10
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={t("history.noHistory")}
          description={t("history.noHistoryDescription")}
        />
      )}
    </div>
  );
}
