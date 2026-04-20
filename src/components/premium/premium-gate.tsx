"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Lock, Sparkles, Crown } from "lucide-react";
import { useIsPro } from "@/hooks/use-is-pro";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumGateProps {
  children: ReactNode;
  className?: string;
}

export function PremiumGate({ children, className }: PremiumGateProps) {
  const { isPro, isLoading } = useIsPro();
  const [open, setOpen] = useState(false);
  const t = useTranslations("premium");

  if (isLoading || isPro) {
    return <>{children}</>;
  }

  const handleCapture = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <div
        className={`relative inline-block ${className ?? ""}`}
        onClickCapture={handleCapture}
      >
        <div className="pointer-events-none opacity-60">{children}</div>
        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow ring-2 ring-background">
          <Lock className="h-2.5 w-2.5" />
        </div>
      </div>
      <UpgradeDialog open={open} onOpenChange={setOpen} t={t} />
    </>
  );
}

export function UpgradeDialog({
  open,
  onOpenChange,
  t,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("subtitle")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
          <ul className="space-y-2 text-sm">
            {["feature1", "feature2", "feature3", "feature4"].map((key) => (
              <li key={key} className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("maybeLater")}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
          >
            <Crown className="mr-1.5 h-4 w-4" />
            {t("upgradeCta")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
