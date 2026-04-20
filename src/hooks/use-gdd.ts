"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { aiFetch } from "@/lib/auth/premium-error";

// Types
export interface GDDMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GDDSuggestion {
  id: string;
  label: string;
  value: string;
}

export type GDDQuestionType = "suggestions" | "multiple_choice" | "checkbox";

export interface CustomPhase {
  phase: number;
  key: string;
  title_en: string;
  title_tr: string;
  required_fields: string[];
  description?: string;
}

export interface GDDSession {
  id: string;
  title: string;
  genre: string | null;
  platform: string | null;
  status: "in_progress" | "completed";
  currentPhase: number;
  completedPhases: number[];
  messages: GDDMessage[];
  gddData: Record<string, Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export interface GDDSessionLight {
  id: string;
  title: string;
  genre: string | null;
  platform: string | null;
  status: "in_progress" | "completed";
  currentPhase: number;
  completedPhases: number[];
  createdAt: string;
  updatedAt: string;
}

export interface GDDAIResponse {
  message: string;
  question_type?: GDDQuestionType;
  suggestions: GDDSuggestion[];
  gdd_update: { phase: number; field: string; value: unknown } | null;
  phase_completed: boolean;
  next_phase: number | null;
  current_phase: number;
  completed_phases: number[];
  gdd_data: Record<string, Record<string, unknown>>;
}

// ============================================
// GDD Session List
// ============================================
export function useGDDSessions() {
  return useQuery<GDDSessionLight[]>({
    queryKey: ["gdd-sessions"],
    queryFn: async () => {
      const res = await fetch("/api/gdd/sessions");
      if (!res.ok) throw new Error("Failed to fetch GDD sessions");
      return res.json();
    },
  });
}

// ============================================
// Single GDD Session
// ============================================
export function useGDDSession(id: string) {
  return useQuery<GDDSession>({
    queryKey: ["gdd-session", id],
    queryFn: async () => {
      const res = await fetch(`/api/gdd/sessions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch GDD session");
      return res.json();
    },
    enabled: !!id,
  });
}

// ============================================
// Create GDD Session
// ============================================
export function useCreateGDDSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input?: { title?: string; initialIdea?: string }) => {
      const res = await fetch("/api/gdd/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input || {}),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create session");
      }
      return res.json() as Promise<GDDSession>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gdd-sessions"] });
    },
  });
}

// ============================================
// Delete GDD Session
// ============================================
export function useDeleteGDDSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/gdd/sessions/${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gdd-sessions"] });
    },
  });
}

// ============================================
// Update GDD Session
// ============================================
export function useUpdateGDDSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; data: Partial<GDDSession> }) => {
      const res = await fetch(`/api/gdd/sessions/${input.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input.data),
      });
      if (!res.ok) throw new Error("Failed to update session");
      return res.json() as Promise<GDDSession>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gdd-session", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["gdd-sessions"] });
    },
  });
}

// ============================================
// Send GDD Message (AI)
// ============================================
export function useSendGDDMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      message: string;
      currentPhase: number;
      completedPhases: number[];
      currentGDDData: Record<string, unknown>;
      messageHistory: GDDMessage[];
      locale: string;
    }) => {
      const res = await aiFetch("/api/ai/gdd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message");
      }
      return res.json() as Promise<GDDAIResponse>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gdd-session", variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ["gdd-sessions"] });
    },
  });
}

// ============================================
// Auto-save hook
// ============================================
export function useGDDAutoSave(
  sessionId: string | undefined,
  session: GDDSession | undefined
) {
  const updateMutation = useUpdateGDDSession();
  const lastSavedRef = useRef<string>("");

  const save = useCallback(() => {
    if (!sessionId || !session) return;

    const stateKey = JSON.stringify({
      messages: session.messages,
      gddData: session.gddData,
      currentPhase: session.currentPhase,
      completedPhases: session.completedPhases,
    });

    if (stateKey === lastSavedRef.current) return;
    lastSavedRef.current = stateKey;

    updateMutation.mutate({
      id: sessionId,
      data: {
        messages: session.messages,
        gddData: session.gddData,
        currentPhase: session.currentPhase,
        completedPhases: session.completedPhases,
      },
    });
  }, [sessionId, session, updateMutation]);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => save();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [save]);

  return { save, isSaving: updateMutation.isPending };
}

// ============================================
// Generate GDD Phases (Dynamic Categories)
// ============================================
export interface PhaseSuggestionItem {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

// ============================================
// Generate Phase Suggestions (after phase completion)
// ============================================
export function useGenerateGDDPhaseSuggestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      phaseKey: string;
      phaseTitle: string;
      locale: string;
    }) => {
      const res = await aiFetch("/api/ai/gdd/phase-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate suggestions");
      }
      return res.json() as Promise<{ phaseKey: string; suggestions: PhaseSuggestionItem[] }>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gdd-session", variables.sessionId] });
    },
  });
}

// ============================================
// Generate GDD Phases (Dynamic Categories)
// ============================================
export function useGenerateGDDPhases() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      sessionId: string;
      locale: string;
    }) => {
      const res = await aiFetch("/api/ai/gdd/generate-phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate phases");
      }
      return res.json() as Promise<{ phases: CustomPhase[]; total_phases: number; game_vision: string | null }>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gdd-session", variables.sessionId] });
    },
  });
}
