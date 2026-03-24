"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Trend {
  trendType: string;
  title: string;
  impact: string;
  description: string;
}

interface TrendTableProps {
  trends: Trend[];
  onChange: (trends: Trend[]) => void;
}

export function TrendTable({ trends, onChange }: TrendTableProps) {
  const t = useTranslations("analyze");

  const addRow = () => {
    onChange([...trends, { trendType: "market", title: "", impact: "neutral", description: "" }]);
  };

  const removeRow = (index: number) => {
    onChange(trends.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof Trend, value: string) => {
    const updated = [...trends];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t("trends.title")}</h3>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          {t("trends.add")}
        </Button>
      </div>

      {trends.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("trends.empty")}</p>
      ) : (
        <div className="space-y-2">
          {trends.map((trend, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Select value={trend.trendType} onValueChange={(v) => updateRow(i, "trendType", v)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">{t("trends.market")}</SelectItem>
                        <SelectItem value="technology">{t("trends.technology")}</SelectItem>
                        <SelectItem value="player_behavior">{t("trends.playerBehavior")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={t("trends.titlePlaceholder")}
                      value={trend.title}
                      onChange={(e) => updateRow(i, "title", e.target.value)}
                      className="flex-1"
                    />
                    <Select value={trend.impact} onValueChange={(v) => updateRow(i, "impact", v)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">{t("trends.positive")}</SelectItem>
                        <SelectItem value="negative">{t("trends.negative")}</SelectItem>
                        <SelectItem value="neutral">{t("trends.neutral")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder={t("trends.descriptionPlaceholder")}
                    value={trend.description}
                    onChange={(e) => updateRow(i, "description", e.target.value)}
                    rows={2}
                  />
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
