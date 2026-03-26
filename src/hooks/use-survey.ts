"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "gamelens_survey_session";

function getStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function setStoredSessionId(sessionId: string) {
  localStorage.setItem(STORAGE_KEY, sessionId);
}

export function clearSurveySession() {
  localStorage.removeItem(STORAGE_KEY);
}

// Fetch existing session
export function useSurveySession() {
  const sessionId = getStoredSessionId();

  return useQuery({
    queryKey: ["survey", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const res = await fetch(`/api/survey?sessionId=${sessionId}`);
      if (!res.ok) {
        if (res.status === 404) {
          clearSurveySession();
          return null;
        }
        throw new Error("Failed to fetch survey session");
      }
      return res.json();
    },
    enabled: !!sessionId,
  });
}

// Create new session
export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/survey", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create survey session");
      const data = await res.json();
      setStoredSessionId(data.sessionId);
      return data.sessionId as string;
    },
    onSuccess: (sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["survey", sessionId] });
    },
  });
}

// Update responses
export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responses: Record<string, unknown>) => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No survey session");
      const res = await fetch("/api/survey", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, responses }),
      });
      if (!res.ok) throw new Error("Failed to update survey");
      return res.json();
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      queryClient.invalidateQueries({ queryKey: ["survey", sessionId] });
    },
  });
}

// Submit (mark complete)
export function useSubmitSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No survey session");
      const res = await fetch("/api/survey", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error("Failed to submit survey");
      return res.json();
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      queryClient.invalidateQueries({ queryKey: ["survey", sessionId] });
    },
  });
}
