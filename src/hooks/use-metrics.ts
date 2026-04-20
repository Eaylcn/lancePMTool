"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiFetch } from "@/lib/auth/premium-error";

async function fetchMetricAnalyses() {
  const res = await fetch("/api/metrics");
  if (!res.ok) throw new Error("Failed to fetch metric analyses");
  return res.json();
}

export function useMetricAnalyses() {
  return useQuery({
    queryKey: ["metric-analyses"],
    queryFn: fetchMetricAnalyses,
  });
}

export function useRunMetricAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      rawMetrics: Record<string, number | undefined>;
      genre: string;
      gameId: string;
      locale: string;
    }) => {
      const res = await aiFetch("/api/ai/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Metric analysis failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metric-analyses"] });
    },
  });
}
