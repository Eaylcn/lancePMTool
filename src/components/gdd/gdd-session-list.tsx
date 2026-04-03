"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Trash2, ArrowRight, Gamepad2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteGDDSession, type GDDSessionLight } from "@/hooks/use-gdd";

interface GDDSessionListProps {
  sessions: GDDSessionLight[];
}

export function GDDSessionList({ sessions }: GDDSessionListProps) {
  const t = useTranslations("gdd");
  const router = useRouter();
  const deleteMutation = useDeleteGDDSession();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gamepad2 className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">{t("emptyTitle")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("emptyDescription")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const progress = ((session.completedPhases as number[]).length / 7) * 100;
          const isCompleted = session.status === "completed";

          return (
            <Card
              key={session.id}
              className="group cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => router.push(`/gdd/${session.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-medium line-clamp-1 min-w-0">
                    {session.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(session.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap overflow-hidden max-h-[52px]">
                  {session.genre && session.genre.split(",").map((g, i) => (
                    <Badge key={`g-${i}`} variant="secondary" className="text-[11px] shrink-0">
                      {g.trim()}
                    </Badge>
                  ))}
                  {session.platform && session.platform.split(",").map((p, i) => (
                    <Badge key={`p-${i}`} variant="outline" className="text-[11px] shrink-0">
                      {p.trim()}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {t("phase")} {session.currentPhase}/7
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <div className="flex items-center justify-between pt-1">
                    <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                      {isCompleted ? t("completed") : t("inProgress")}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                      {isCompleted ? t("view") : t("continue")}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteTitle")}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId);
            setDeleteId(null);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
