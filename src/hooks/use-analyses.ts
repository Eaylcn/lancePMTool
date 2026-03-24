"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateAnalysisInput {
  gameId: string;
  analysis: Record<string, unknown>;
  kpis?: Record<string, unknown>;
  competitors?: Array<{ competitorName: string; relationship: string; notes: string }>;
  trends?: Array<{ trendType: string; title: string; impact: string; description: string }>;
}

export function useGameAnalysis(gameId: string) {
  return useQuery({
    queryKey: ["analysis", gameId],
    queryFn: async () => {
      const res = await fetch(`/api/analyses/game/${gameId}`);
      if (!res.ok) throw new Error("Failed to fetch analysis");
      return res.json();
    },
    enabled: !!gameId,
  });
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateAnalysisInput) => {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create analysis");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["analysis", variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; gameId: string } & Record<string, unknown>) => {
      const res = await fetch(`/api/analyses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update analysis");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["analysis", variables.gameId] });
    },
  });
}
