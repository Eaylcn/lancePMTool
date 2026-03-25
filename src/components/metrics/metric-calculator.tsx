"use client";

import { useTranslations } from "next-intl";
import { Calculator, Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RawMetrics, DerivedMetrics } from "@/lib/metrics/types";
import { getAvailableGenres } from "@/lib/metrics/calculator";

const RAW_FIELDS = [
  "dau", "mau", "revenue", "downloads", "cpi",
  "d1Retention", "d7Retention", "d30Retention",
  "sessionLength", "sessionsPerDay",
] as const;

const DERIVED_FIELDS = [
  { key: "arpdau", unit: "$" },
  { key: "arpu", unit: "$" },
  { key: "ltv", unit: "$" },
  { key: "stickiness", unit: "%" },
  { key: "dailyPlayTime", unit: " min" },
] as const;

interface MetricCalculatorProps {
  rawMetrics: RawMetrics;
  derivedMetrics: DerivedMetrics;
  genre: string;
  gameId: string;
  games: { id: string; title: string }[];
  onRawChange: (field: string, value: number | undefined) => void;
  onGenreChange: (genre: string | null) => void;
  onGameChange: (gameId: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function MetricCalculator({
  rawMetrics,
  derivedMetrics,
  genre,
  gameId,
  games,
  onRawChange,
  onGenreChange,
  onGameChange,
  onAnalyze,
  isAnalyzing,
}: MetricCalculatorProps) {
  const t = useTranslations("metrics.calculator");
  const genres = getAvailableGenres();

  const hasDerivedValues = Object.values(derivedMetrics).some(v => v != null);
  const hasRawValues = Object.values(rawMetrics).some(v => v != null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Game & Genre Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("selectGame")}</Label>
          <Select value={gameId} onValueChange={onGameChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectGame")} />
            </SelectTrigger>
            <SelectContent>
              {games.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("selectGenre")}</Label>
          <Select value={genre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectGenre")} />
            </SelectTrigger>
            <SelectContent>
              {genres.map((g) => (
                <SelectItem key={g.key} value={g.key}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Raw Metrics Input */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-sm">{t("rawMetrics")}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {RAW_FIELDS.map((field) => (
            <div key={field} className="space-y-1">
              <Label className="text-xs">{t(`fields.${field}`)}</Label>
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="0"
                value={rawMetrics[field] ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  onRawChange(field, val === "" ? undefined : Number(val));
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Derived Metrics Display */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-sm">{t("derivedMetrics")}</h3>
        {hasDerivedValues ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DERIVED_FIELDS.map(({ key, unit }) => {
              const value = derivedMetrics[key as keyof DerivedMetrics];
              return (
                <div
                  key={key}
                  className="bg-muted/50 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {t(`derived.${key}`)}
                  </p>
                  <p className="text-lg font-bold">
                    {value != null
                      ? `${unit === "$" ? "$" : ""}${value}${unit !== "$" ? unit : ""}`
                      : "—"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("enterMetrics")}
          </p>
        )}
      </Card>

      {/* Analyze Button */}
      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || !hasRawValues || !genre || !gameId}
        className="w-full"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("analyzing")}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            {t("analyzeWithAi")}
          </>
        )}
      </Button>
    </div>
  );
}
