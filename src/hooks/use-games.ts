"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GameFilters {
  genre?: string;
  status?: string;
  platform?: string;
  search?: string;
  sort?: string;
  order?: string;
}

interface CreateGameInput {
  title: string;
  studio?: string;
  genre?: string[];
  platform?: string;
  status?: string;
  notes?: string;
}

async function fetchGames(filters: GameFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const res = await fetch(`/api/games?${params}`);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
}

async function fetchGame(id: string) {
  const res = await fetch(`/api/games/${id}`);
  if (!res.ok) throw new Error("Failed to fetch game");
  return res.json();
}

export function useGames(filters: GameFilters = {}) {
  return useQuery({
    queryKey: ["games", filters],
    queryFn: () => fetchGames(filters),
  });
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id),
    enabled: !!id,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateGameInput) => {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create game");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateGameInput>) => {
      const res = await fetch(`/api/games/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update game");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", variables.id] });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete game");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}
