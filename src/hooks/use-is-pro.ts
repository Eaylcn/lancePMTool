"use client";

import { useProfile } from "@/hooks/use-profile";

export function useIsPro(): {
  isPro: boolean;
  role: "free" | "premium" | "admin" | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useProfile();
  const role = data?.profile?.role as "free" | "premium" | "admin" | undefined;
  const isPro = role === "premium" || role === "admin";
  return { isPro, role, isLoading };
}
