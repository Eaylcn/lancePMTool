"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ============================================
// Types for API responses
// ============================================
export interface SurveyListItem {
  id: string;
  userId: string;
  gameId: string | null;
  gameTitle: string | null;
  title: string;
  description: string | null;
  templateType: string | null;
  questionCount: number;
  settings: Record<string, unknown>;
  shareToken: string;
  status: "draft" | "active" | "expired" | "closed";
  expiresAt: string | null;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyDetail {
  id: string;
  userId: string;
  gameId: string | null;
  title: string;
  description: string | null;
  templateType: string | null;
  questions: unknown[];
  settings: Record<string, unknown>;
  shareToken: string;
  status: "draft" | "active" | "expired" | "closed";
  expiresAt: string | null;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string | null;
  responses: Record<string, unknown>;
  metadata: Record<string, unknown>;
  completedAt: string | null;
  createdAt: string;
}

export interface SurveyAnalysis {
  id: string;
  surveyId: string;
  userId: string;
  analysisType: "normal" | "cross_question" | "cross_survey" | "trend";
  compareSurveyIds: string[] | null;
  results: Record<string, unknown>;
  createdAt: string;
}

// ============================================
// Survey CRUD Hooks
// ============================================

export function useSurveys(filters?: { status?: string; gameId?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.gameId) params.set("gameId", filters.gameId);
  const qs = params.toString();

  return useQuery<SurveyListItem[]>({
    queryKey: ["surveys", filters],
    queryFn: async () => {
      const res = await fetch(`/api/surveys${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch surveys");
      return res.json();
    },
  });
}

export function useSurvey(id: string | null) {
  return useQuery<SurveyDetail>({
    queryKey: ["survey", id],
    queryFn: async () => {
      const res = await fetch(`/api/surveys/${id}`);
      if (!res.ok) throw new Error("Failed to fetch survey");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      gameId?: string | null;
      templateType?: string | null;
      questions: unknown[];
      settings?: Record<string, unknown>;
      expiresAt?: string | null;
    }) => {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create survey");
      }
      return res.json() as Promise<SurveyDetail>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update survey");
      }
      return res.json() as Promise<SurveyDetail>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      queryClient.invalidateQueries({ queryKey: ["survey", data.id] });
    },
  });
}

export function useUpdateSurveyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update survey status");
      return res.json() as Promise<SurveyDetail>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/surveys/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete survey");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },
  });
}

// ============================================
// Survey Responses Hook
// ============================================

export function useSurveyResponses(surveyId: string | null) {
  return useQuery<SurveyResponse[]>({
    queryKey: ["surveyResponses", surveyId],
    queryFn: async () => {
      const res = await fetch(`/api/surveys/${surveyId}/responses`);
      if (!res.ok) throw new Error("Failed to fetch responses");
      return res.json();
    },
    enabled: !!surveyId,
  });
}

// ============================================
// AI Analysis Hook
// ============================================

export function useRunSurveyAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      surveyId: string;
      analysisType: "normal" | "cross_question" | "cross_survey" | "trend";
      compareSurveyIds?: string[];
      locale?: string;
    }) => {
      const res = await fetch("/api/ai/survey-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }
      return res.json() as Promise<SurveyAnalysis>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["surveyAnalyses", data.surveyId] });
    },
  });
}
