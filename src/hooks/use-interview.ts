"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useInterviewSessions() {
  return useQuery({
    queryKey: ["interview-sessions"],
    queryFn: async () => {
      const res = await fetch("/api/interview/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
  });
}

export function useInterviewSession(id: string) {
  return useQuery({
    queryKey: ["interview-session", id],
    queryFn: async () => {
      const res = await fetch(`/api/interview/sessions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch session");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useStartInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { topic: string; difficulty?: string; locale: string }) => {
      const res = await fetch("/api/interview/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to start interview");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-sessions"] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { sessionId: string; content: string; locale: string }) => {
      const res = await fetch(`/api/interview/sessions/${input.sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.content, locale: input.locale }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["interview-session", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["interview-sessions"] });
    },
  });
}
