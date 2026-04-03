"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2, Lock, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState } from "react";

interface GDDSectionCardProps {
  title: string;
  phase: number;
  currentPhase: number;
  completedPhases: number[];
  data: Record<string, unknown> | undefined;
  isExpanded: boolean;
  onToggle: () => void;
  customFields?: string[];
}

const phaseKeys: Record<number, string[]> = {
  1: ["concept", "tagline", "target_audience", "platform", "monetization", "inspiration", "unique_selling_point", "game_engine", "uses_ai_assistant"],
  2: ["primary_genre", "secondary_genre", "perspective", "controls", "session_length", "difficulty", "similar_games"],
  3: ["primary_loop", "secondary_loop", "progression_type", "resource_system", "win_condition", "lose_condition", "game_flow"],
  4: ["setting", "art_style", "tone", "level_structure", "level_count", "room_types", "narrative", "lore"],
  5: ["protagonist", "enemy_types", "boss_list"],
  6: ["skill_system", "progression_system", "economy", "ui_hud"],
  7: ["core_features", "cut_features", "technical_requirements", "estimated_duration", "team_size", "risks", "milestones"],
};

const fieldLabels: Record<string, string> = {
  concept: "Konsept",
  tagline: "Tagline",
  target_audience: "Hedef Kitle",
  platform: "Platform",
  monetization: "Monetizasyon",
  inspiration: "İlham",
  unique_selling_point: "Benzersiz Özellik",
  game_engine: "Oyun Motoru",
  uses_ai_assistant: "AI Asistan Kullanımı",
  primary_genre: "Ana Tür",
  secondary_genre: "Alt Tür",
  perspective: "Perspektif",
  controls: "Kontroller",
  session_length: "Oturum Süresi",
  difficulty: "Zorluk",
  similar_games: "Benzer Oyunlar",
  primary_loop: "Ana Döngü",
  secondary_loop: "İkincil Döngü",
  progression_type: "İlerleme Tipi",
  resource_system: "Kaynak Sistemi",
  win_condition: "Kazanma Koşulu",
  lose_condition: "Kaybetme Koşulu",
  game_flow: "Oyun Akışı",
  setting: "Ortam",
  art_style: "Görsel Stil",
  tone: "Ton",
  level_structure: "Seviye Yapısı",
  level_count: "Seviye Sayısı",
  room_types: "Oda Tipleri",
  narrative: "Hikaye",
  lore: "Mitoloji",
  protagonist: "Protagonist",
  enemy_types: "Düşman Tipleri",
  boss_list: "Boss Listesi",
  skill_system: "Yetenek Sistemi",
  progression_system: "İlerleme Sistemi",
  economy: "Ekonomi",
  ui_hud: "UI/HUD",
  core_features: "Core Özellikler",
  cut_features: "Ertelenen Özellikler",
  technical_requirements: "Teknik Gereksinimler",
  estimated_duration: "Tahmini Süre",
  team_size: "Takım Büyüklüğü",
  risks: "Riskler",
  milestones: "Milestone'lar",
};

// Renders an array-of-objects as mini cards (e.g. enemy_types, boss_list)
function ObjectArrayCards({ items }: { items: Record<string, unknown>[] }) {
  return (
    <div className="space-y-1.5 mt-1">
      {items.map((item, i) => {
        const name = (item.name || item.title || `#${i + 1}`) as string;
        const desc = (item.description || item.desc || "") as string;
        const level = (item.challenge_level || item.level || item.difficulty || "") as string;
        return (
          <div key={i} className="rounded-lg border border-border/50 bg-background/50 p-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{name}</span>
              {level && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {level}
                </Badge>
              )}
            </div>
            {desc && <p className="text-muted-foreground mt-0.5 line-clamp-2">{desc}</p>}
          </div>
        );
      })}
    </div>
  );
}

function formatValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return <span className="text-foreground">{value}</span>;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    // Array of objects — render as mini cards
    if (typeof value[0] === "object" && value[0] !== null) {
      return <ObjectArrayCards items={value as Record<string, unknown>[]} />;
    }
    // Array of strings — bullet list
    return (
      <ul className="mt-0.5 space-y-0.5">
        {value.map((v, i) => (
          <li key={i} className="text-foreground flex gap-1.5">
            <span className="text-muted-foreground">•</span>
            {String(v)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    // Single object — render as mini card
    return <ObjectArrayCards items={[value as Record<string, unknown>]} />;
  }
  return <span className="text-foreground">{String(value)}</span>;
}

// Convert snake_case to Title Case for unknown fields
function snakeToTitle(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getFieldLabel(field: string): string {
  return fieldLabels[field] || snakeToTitle(field);
}

export function GDDSectionCard({ title, phase, currentPhase, completedPhases, data, isExpanded, onToggle, customFields }: GDDSectionCardProps) {
  const isCompleted = completedPhases.includes(phase);
  const isActive = currentPhase === phase;
  const isLocked = !isCompleted && !isActive && phase > currentPhase;
  const canToggle = isCompleted || isActive;

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Use customFields if provided, then hardcoded phaseKeys, then all data keys
  const fields = customFields || phaseKeys[phase] || (data ? Object.keys(data) : []);
  const filledFields = data ? fields.filter(f => {
    const val = data[f];
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && !val.trim()) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }) : [];

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, data, filledFields.length]);

  return (
    <Card className={cn(
      "transition-all duration-200 rounded-xl border-border/60",
      isCompleted && "border-green-500/30 bg-green-500/5",
      isActive && "border-primary/50 bg-primary/5 ring-1 ring-primary/20",
      isLocked && "opacity-50"
    )}>
      <CardHeader
        className={cn("pb-2", canToggle && "cursor-pointer select-none")}
        onClick={canToggle ? onToggle : undefined}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isCompleted && <Check className="h-4 w-4 text-green-500" />}
            {isActive && !isCompleted && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {(isCompleted || isActive) && (
              <span className="text-xs text-muted-foreground">
                {filledFields.length}/{fields.length}
              </span>
            )}
            {canToggle && (
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isExpanded && "rotate-180"
              )} />
            )}
          </div>
        </div>
      </CardHeader>

      {/* Animated content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded && canToggle ? contentHeight + 16 : 0, opacity: isExpanded && canToggle ? 1 : 0 }}
      >
        <div ref={contentRef}>
          {data && filledFields.length > 0 && (
            <CardContent className="pt-0 max-h-[300px] overflow-y-auto">
              <div className="space-y-2.5 text-xs">
                {filledFields.map(field => {
                  const rendered = formatValue(data[field]);
                  if (!rendered) return null;
                  return (
                    <div key={field}>
                      <span className="font-medium text-muted-foreground">{getFieldLabel(field)}:</span>{" "}
                      {rendered}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </div>
      </div>

      {isLocked && (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Bekliyor...</p>
        </CardContent>
      )}
    </Card>
  );
}
