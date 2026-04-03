"use client";

import { useTranslations } from "next-intl";
import { GDDSessionList } from "@/components/gdd/gdd-session-list";
import { GDDNewDialog } from "@/components/gdd/gdd-new-dialog";
import { useGDDSessions } from "@/hooks/use-gdd";
import { Skeleton } from "@/components/ui/skeleton";

export default function GDDPage() {
  const t = useTranslations("gdd");
  const { data: sessions, isLoading } = useGDDSessions();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <GDDNewDialog />
      </div>

      {/* Session List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      ) : (
        <GDDSessionList sessions={sessions || []} />
      )}
    </div>
  );
}
