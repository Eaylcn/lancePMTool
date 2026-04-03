"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Loader2, ListChecks, CheckCircle2 } from "lucide-react";
import { useDailyTasks, useTaskStreak, useSubmitTask, useGenerateTasks } from "@/hooks/use-tasks";
import { StreakCounter } from "@/components/tasks/streak-counter";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskHistory } from "@/components/tasks/task-history";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TasksPage() {
  const t = useTranslations("tasks");
  const locale = useLocale();
  const today = new Date().toISOString().split("T")[0];

  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");

  const { data: tasks = [], isLoading: tasksLoading } = useDailyTasks(today, locale);
  const { data: streak } = useTaskStreak();
  const submitTask = useSubmitTask();
  const generateTasks = useGenerateTasks();

  const completedCount = tasks.filter((task: { status: string }) => task.status === "completed").length;
  const allCompleted = tasks.length > 0 && completedCount === tasks.length;

  // Apply filters
  const filteredTasks = tasks.filter((task: { type: string; difficulty: string }) => {
    if (filterType !== "all" && task.type !== filterType) return false;
    if (filterDifficulty !== "all" && task.difficulty !== filterDifficulty) return false;
    return true;
  });

  const handleSubmit = async (taskId: string, response: string) => {
    setSubmittingTaskId(taskId);
    try {
      await submitTask.mutateAsync({ taskId, response, locale });
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const handleGenerate = () => {
    generateTasks.mutate({ date: today, locale });
  };

  const types = ["analysis", "learning", "practice", "reflection"];
  const difficulties = ["beginner", "intermediate", "advanced"];

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

      {/* Tabs */}
      <Tabs defaultValue="daily">
        <TabsList variant="line" className="flex-wrap gap-1">
          <TabsTrigger value="daily" className="px-3.5 py-2">
            {t("tabs.daily")}
          </TabsTrigger>
          <TabsTrigger value="history" className="px-3.5 py-2">
            {t("tabs.history")}
          </TabsTrigger>
        </TabsList>

        {/* Daily Tab */}
        <TabsContent value="daily" className="space-y-5 mt-4">
          {/* Streak */}
          {streak && (
            <StreakCounter
              currentStreak={streak.currentStreak}
              longestStreak={streak.longestStreak}
              totalCompleted={streak.totalCompleted}
            />
          )}

          {/* Filters */}
          {tasks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  filterType === "all"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                {t("filter.allTypes")}
              </button>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? "all" : type)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    filterType === type
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  {t(`types.${type}`)}
                </button>
              ))}
              <div className="w-px bg-border/60 mx-1" />
              <button
                onClick={() => setFilterDifficulty("all")}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  filterDifficulty === "all"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                {t("filter.allDifficulties")}
              </button>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(filterDifficulty === diff ? "all" : diff)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    filterDifficulty === diff
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  }`}
                >
                  {t(`difficulty.${diff}`)}
                </button>
              ))}
            </div>
          )}

          {/* Tasks */}
          {tasksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTasks.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("todaysTasks")}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTasks.map((task: { id: string; type: string; title: string; description: string; difficulty: string; status: string; response?: string | null; aiScore?: string | null; aiFeedback?: { score: number; strengths: string[]; improvements: string[]; keyTakeaway: string } | null }) => (
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
          ) : tasks.length > 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t("filter.allTypes")} — 0
            </div>
          ) : (
            <div className="space-y-4">
              {generateTasks.isPending ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">{t("generating")}</p>
                </div>
              ) : (
                <EmptyState
                  icon={ListChecks}
                  title={t("noTasks")}
                  description={t("noTasksDescription")}
                  action={{
                    label: t("generateTasks"),
                    onClick: handleGenerate,
                  }}
                />
              )}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <TaskHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
