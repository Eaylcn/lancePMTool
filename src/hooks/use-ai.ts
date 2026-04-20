"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DraftFillResponse } from "@/lib/ai/types";
import { aiFetch } from "@/lib/auth/premium-error";

interface DraftFillInput {
  notes: string;
  genre?: string[];
  gameTitle?: string;
  locale: string;
}

interface AiAnalyzeInput {
  gameId: string;
  locale: string;
}

export function useDraftFill() {
  return useMutation({
    mutationFn: async (input: DraftFillInput): Promise<DraftFillResponse> => {
      const res = await aiFetch("/api/ai/draft-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Draft fill failed");
      }
      return res.json();
    },
  });
}

export function useAiAnalyze() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AiAnalyzeInput) => {
      const res = await aiFetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "AI analysis failed");
      }
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["analysis", variables.gameId] });
    },
  });
}
