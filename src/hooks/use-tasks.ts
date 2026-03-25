"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useDailyTasks(date: string, locale: string) {
  return useQuery({
    queryKey: ["daily-tasks", date],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?date=${date}&locale=${locale}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
    enabled: !!date,
  });
}

export function useTaskStreak() {
  return useQuery({
    queryKey: ["task-streak"],
    queryFn: async () => {
      const res = await fetch("/api/tasks/streak");
      if (!res.ok) throw new Error("Failed to fetch streak");
      return res.json();
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { taskId: string; response: string; locale: string }) => {
      const res = await fetch(`/api/tasks/${input.taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: input.response, locale: input.locale }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit task");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-streak"] });
    },
  });
}
