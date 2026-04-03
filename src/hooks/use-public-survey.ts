"use client";

import { useQuery, useMutation } from "@tanstack/react-query";

export interface PublicSurveyData {
  expired: boolean;
  survey: {
    id?: string;
    title: string;
    description: string | null;
    questions?: unknown[];
    settings?: Record<string, unknown>;
    status?: string;
    expiresAt?: string | null;
  };
}

export function usePublicSurvey(token: string | null) {
  return useQuery<PublicSurveyData>({
    queryKey: ["publicSurvey", token],
    queryFn: async () => {
      const res = await fetch(`/api/surveys/public/${token}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Survey not found");
        throw new Error("Failed to fetch survey");
      }
      return res.json();
    },
    enabled: !!token,
    retry: false,
  });
}

export function useSubmitPublicSurvey(token: string) {
  return useMutation({
    mutationFn: async (data: {
      responses: Record<string, unknown>;
      metadata?: { userAgent?: string; locale?: string; completionTimeSeconds?: number };
    }) => {
      const res = await fetch(`/api/surveys/public/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit survey");
      }
      return res.json();
    },
  });
}
