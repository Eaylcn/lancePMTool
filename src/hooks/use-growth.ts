"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiFetch } from "@/lib/auth/premium-error";

async function fetchGrowthDashboard() {
  const res = await fetch("/api/growth");
  if (!res.ok) throw new Error("Failed to fetch growth data");
  return res.json();
}

async function fetchGrowthReports() {
  const res = await fetch("/api/growth/reports");
  if (!res.ok) throw new Error("Failed to fetch growth reports");
  return res.json();
}

export function useGrowthDashboard() {
  return useQuery({
    queryKey: ["growth-dashboard"],
    queryFn: fetchGrowthDashboard,
  });
}

export function useGrowthReports() {
  return useQuery({
    queryKey: ["growth-reports"],
    queryFn: fetchGrowthReports,
  });
}

export function useGenerateGrowthReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { locale: string }) => {
      const res = await aiFetch("/api/ai/growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Growth report generation failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growth-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["growth-reports"] });
    },
  });
}
