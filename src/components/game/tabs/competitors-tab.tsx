"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords } from "lucide-react";

interface CompetitorsTabProps {
  competitors: Array<{
    id: string;
    competitorName: string;
    relationship: string | null;
    notes: string | null;
  }>;
}

const relationshipColors: Record<string, string> = {
  direct: "bg-red-500/10 text-red-500",
  indirect: "bg-yellow-500/10 text-yellow-500",
  substitute: "bg-blue-500/10 text-blue-500",
};

export function CompetitorsTab({ competitors }: CompetitorsTabProps) {
  const t = useTranslations("game");

  if (!competitors || competitors.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{t("noCompetitors")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {competitors.map((comp) => (
        <Card key={comp.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{comp.competitorName}</h3>
            </div>
            {comp.relationship && (
              <Badge variant="outline" className={relationshipColors[comp.relationship] || ""}>
                {t(`relationship.${comp.relationship}`)}
              </Badge>
            )}
            {comp.notes && (
              <p className="text-sm text-muted-foreground">{comp.notes}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
