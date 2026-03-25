"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Loader2, ListChecks, CheckCircle2 } from "lucide-react";
import { useDailyTasks, useTaskStreak, useSubmitTask } from "@/hooks/use-tasks";
import { StreakCounter } from "@/components/tasks/streak-counter";
import { TaskCard } from "@/components/tasks/task-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  const t = useTranslations("tasks");
  const locale = useLocale();
  const today = new Date().toISOString().split("T")[0];

  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);

  const { data: tasks = [], isLoading: tasksLoading } = useDailyTasks(today, locale);
  const { data: streak } = useTaskStreak();
  const submitTask = useSubmitTask();

  const completedCount = tasks.filter((task: { status: string }) => task.status === "completed").length;
  const allCompleted = tasks.length > 0 && completedCount === tasks.length;

  const handleSubmit = async (taskId: string, response: string) => {
    setSubmittingTaskId(taskId);
    try {
      await submitTask.mutateAsync({ taskId, response, locale });
    } finally {
      setSubmittingTaskId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          {tasks.length > 0 && (
            <Badge variant={allCompleted ? "default" : "secondary"} className="text-sm">
              {allCompleted ? (
                <><CheckCircle2 className="h-4 w-4 mr-1" />{t("allCompleted")}</>
              ) : (
                t("completedCount", { completed: completedCount, total: tasks.length })
              )}
            </Badge>
          )}
        </div>
      </div>

      {/* Streak */}
      {streak && (
        <StreakCounter
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          totalCompleted={streak.totalCompleted}
        />
      )}

      {/* Tasks */}
      {tasksLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t("generating")}</span>
        </div>
      ) : tasks.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">{t("todaysTasks")}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tasks.map((task: { id: string; type: string; title: string; description: string; difficulty: string; status: string; response?: string | null; aiScore?: string | null; aiFeedback?: { score: number; strengths: string[]; improvements: string[]; keyTakeaway: string } | null }) => (
              <TaskCard
                key={task.id}
                task={task}
                onSubmit={handleSubmit}
                submitting={submitTask.isPending}
                submittingTaskId={submittingTaskId}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={ListChecks}
          title={t("noTasks")}
          description={t("noTasksDescription")}
        />
      )}
    </div>
  );
}
