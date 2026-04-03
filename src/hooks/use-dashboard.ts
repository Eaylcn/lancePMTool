"use client";

import { useQuery } from "@tanstack/react-query";

interface DashboardData {
  profile: { displayName: string };
  stats: { totalGames: number; totalAnalyses: number; avgScore: number; pmLevel: string };
  gddStats: { totalGdds: number; activeGdds: number; completedGdds: number };
  interviewStats: { completedSessions: number; avgScore: number };
  taskStats: { streak: number; longestStreak: number; totalCompleted: number };
  recentGames: Array<{
    id: string;
    title: string;
    genre: unknown;
    platform: string | null;
    status: string | null;
    hasAnalysis: boolean;
    createdAt: string;
  }>;
  recentActivity: Array<{ type: string; title: string; createdAt: string }>;
  observationLevel: string;
}

async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
}
