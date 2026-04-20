"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiFetch } from "@/lib/auth/premium-error";

async function fetchComparisons() {
  const res = await fetch("/api/comparisons");
  if (!res.ok) throw new Error("Failed to fetch comparisons");
  return res.json();
}

async function fetchComparison(id: string) {
  const res = await fetch(`/api/comparisons/${id}`);
  if (!res.ok) throw new Error("Failed to fetch comparison");
  return res.json();
}

export function useComparisons() {
  return useQuery({
    queryKey: ["comparisons"],
    queryFn: fetchComparisons,
  });
}

export function useComparison(id: string) {
  return useQuery({
    queryKey: ["comparison", id],
    queryFn: () => fetchComparison(id),
    enabled: !!id,
  });
}

export function useCreateComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { game1Id: string; game2Id: string }) => {
      const res = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create comparison");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });
}

export function useDeleteComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comparisons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete comparison");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });
}

export function useAiCompare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { comparisonId?: string; game1Id?: string; game2Id?: string; locale: string }) => {
      const res = await aiFetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "AI comparison failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comparisons"] });
    },
  });
}
