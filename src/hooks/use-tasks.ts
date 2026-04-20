"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiFetch } from "@/lib/auth/premium-error";

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

export function usePastTasks(range: "week" | "month", locale: string) {
  return useQuery({
    queryKey: ["past-tasks", range],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?range=${range}&locale=${locale}`);
      if (!res.ok) throw new Error("Failed to fetch past tasks");
      return res.json();
    },
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

export function useGenerateTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { date: string; locale: string }) => {
      const res = await aiFetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: input.date, locale: input.locale }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate tasks");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
    },
  });
}

export function useSubmitTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { taskId: string; response: string; locale: string }) => {
      const res = await aiFetch(`/api/tasks/${input.taskId}`, {
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
