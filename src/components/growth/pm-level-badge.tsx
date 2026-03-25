"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  beginner_pm: { bg: "bg-slate-500/10", text: "text-slate-500", border: "border-slate-500/20" },
  junior_pm: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  mid_pm: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
  senior_pm: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
  lead_pm: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
};

interface PmLevelBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
  className?: string;
}

export function PmLevelBadge({ level, size = "md", showDescription = false, className }: PmLevelBadgeProps) {
  const t = useTranslations("growth");
  const styles = LEVEL_STYLES[level] || LEVEL_STYLES.beginner_pm;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5 font-semibold",
  };

  return (
    <div className={cn("inline-flex flex-col items-start gap-0.5", className)}>
      <Badge
        variant="outline"
        className={cn(
          styles.bg, styles.text, styles.border,
          sizeClasses[size],
        )}
      >
        {t(`levels.${level}`)}
      </Badge>
      {showDescription && (
        <span className="text-xs text-muted-foreground">
          {t(`levelDescriptions.${level}`)}
        </span>
      )}
    </div>
  );
}
