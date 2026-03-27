"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Swords, Target, Shuffle } from "lucide-react";

interface CompetitorsTabProps {
  competitors: Array<{
    id: string;
    competitorName: string;
    relationship: string | null;
    notes: string | null;
  }>;
}

const relationshipConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType }> = {
  direct: { color: "text-red-500", bgColor: "bg-red-500/10 border-red-500/20", icon: Swords },
  indirect: { color: "text-yellow-500", bgColor: "bg-yellow-500/10 border-yellow-500/20", icon: Target },
  substitute: { color: "text-blue-500", bgColor: "bg-blue-500/10 border-blue-500/20", icon: Shuffle },
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

  const grouped = {
    direct: competitors.filter((c) => c.relationship === "direct"),
    indirect: competitors.filter((c) => c.relationship === "indirect"),
    substitute: competitors.filter((c) => c.relationship === "substitute"),
    other: competitors.filter((c) => !c.relationship || !["direct", "indirect", "substitute"].includes(c.relationship)),
  };

  const groups = [
    { key: "direct", items: grouped.direct },
    { key: "indirect", items: grouped.indirect },
    { key: "substitute", items: grouped.substitute },
    { key: "other", items: grouped.other },
  ].filter((g) => g.items.length > 0);

  // If no clear grouping possible, show flat list
  const showGrouped = groups.length > 1 || (groups.length === 1 && groups[0].key !== "other");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex gap-3 flex-wrap">
        {grouped.direct.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
            <Swords className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-medium">{grouped.direct.length} {t("relationship.direct")}</span>
          </div>
        )}
        {grouped.indirect.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
            <Target className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-medium">{grouped.indirect.length} {t("relationship.indirect")}</span>
          </div>
        )}
        {grouped.substitute.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2">
            <Shuffle className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium">{grouped.substitute.length} {t("relationship.substitute")}</span>
          </div>
        )}
      </div>

      {/* Competitor cards */}
      {showGrouped ? (
        groups.map(({ key, items }) => {
          const config = relationshipConfig[key];
          return (
            <div key={key} className="space-y-3">
              {config && (
                <div className="flex items-center gap-2">
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                  <h3 className={`text-sm font-semibold ${config.color}`}>
                    {t(`relationship.${key}`)}
                  </h3>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((comp) => (
                  <CompetitorCard key={comp.id} comp={comp} t={t} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((comp) => (
            <CompetitorCard key={comp.id} comp={comp} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function CompetitorCard({
  comp,
  t,
}: {
  comp: { id: string; competitorName: string; relationship: string | null; notes: string | null };
  t: ReturnType<typeof useTranslations>;
}) {
  const config = comp.relationship ? relationshipConfig[comp.relationship] : null;
  const Icon = config?.icon || Swords;

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${config ? config.bgColor : "border-border"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config ? config.bgColor : "bg-muted"}`}>
          <Icon className={`h-4 w-4 ${config ? config.color : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{comp.competitorName}</h3>
          {comp.relationship && (
            <Badge variant="outline" className={`text-[10px] mt-0.5 ${config ? config.color : ""}`}>
              {t(`relationship.${comp.relationship}`)}
            </Badge>
          )}
        </div>
      </div>
      {comp.notes && (
        <p className="text-xs leading-relaxed text-muted-foreground">{comp.notes}</p>
      )}
    </div>
  );
}
