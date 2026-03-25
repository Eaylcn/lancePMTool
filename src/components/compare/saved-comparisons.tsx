"use client";

import { useTranslations } from "next-intl";
import { Clock, Trash2, ArrowRight, GitCompareArrows } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SavedComparison {
  id: string;
  game1Id: string;
  game2Id: string;
  game1Title: string;
  game2Title: string;
  aiResult: unknown;
  createdAt: string;
}

interface SavedComparisonsProps {
  comparisons: SavedComparison[];
  onLoad: (comparison: SavedComparison) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SavedComparisons({ comparisons, onLoad, onDelete, isDeleting }: SavedComparisonsProps) {
  const t = useTranslations("compare");

  if (comparisons.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
          {t("savedComparisons")}
          <Badge variant="secondary" className="ml-auto">{comparisons.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {comparisons.map(comp => (
            <div
              key={comp.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/30 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="truncate">{comp.game1Title}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{comp.game2Title}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(comp.createdAt).toLocaleDateString()}
                  </span>
                  {comp.aiResult ? (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">AI</Badge>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => onLoad(comp)}
                >
                  {t("loadComparison")}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(comp.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
