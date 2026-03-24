"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Competitor {
  competitorName: string;
  relationship: string;
  notes: string;
}

interface CompetitorTableProps {
  competitors: Competitor[];
  onChange: (competitors: Competitor[]) => void;
}

export function CompetitorTable({ competitors, onChange }: CompetitorTableProps) {
  const t = useTranslations("analyze");

  const addRow = () => {
    onChange([...competitors, { competitorName: "", relationship: "direct", notes: "" }]);
  };

  const removeRow = (index: number) => {
    onChange(competitors.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t("competitors.title")}</h3>
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          {t("competitors.add")}
        </Button>
      </div>

      {competitors.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("competitors.empty")}</p>
      ) : (
        <div className="space-y-2">
          {competitors.map((comp, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder={t("competitors.namePlaceholder")}
                  value={comp.competitorName}
                  onChange={(e) => updateRow(i, "competitorName", e.target.value)}
                />
                <div className="flex gap-2">
                  <Select value={comp.relationship} onValueChange={(v) => updateRow(i, "relationship", v ?? "direct")}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">{t("competitors.direct")}</SelectItem>
                      <SelectItem value="indirect">{t("competitors.indirect")}</SelectItem>
                      <SelectItem value="substitute">{t("competitors.substitute")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={t("competitors.notesPlaceholder")}
                    value={comp.notes}
                    onChange={(e) => updateRow(i, "notes", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
