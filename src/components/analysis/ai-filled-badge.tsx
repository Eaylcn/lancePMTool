"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function AiFilledBadge() {
  const t = useTranslations("analyze");
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
      <Sparkles className="h-3 w-3" />
      {t("aiFilled")}
    </span>
  );
}
